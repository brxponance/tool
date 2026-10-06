"""
HTTP client for the PC Tool MCP server.

Deliberately stdlib-only (urllib + http.cookiejar, no `requests`) so the local
install is a single package — `mcp` — and nothing new lands in the deployed
image. This whole package is excluded from the Docker build: the backend
Dockerfile copies `*.py` (a top-level glob) plus `db/` and `migrations/` only,
so `assistant/` is version-controlled but never shipped.

Two targets, and they are NOT symmetric:

  localhost:3001   Flask directly. No authentication exists at this layer at
                   all — the shared-password gate lives in the Next.js
                   middleware and is production-only. Paths are bare: /clients.

  the ALB          Everything goes through Next.js, so the API is reachable
                   only under /api/backend/*, and the gate applies: POST
                   /api/login once, carry the pct_gate cookie.

Remote access is OFF by default. PC_TOOL_URL must point at loopback unless
PC_TOOL_ALLOW_REMOTE=1 is set explicitly, so "local only" is a property of the
code rather than of configuration discipline.
"""

from __future__ import annotations

import http.cookiejar
import json
import os
import urllib.error
import urllib.parse
import urllib.request

DEFAULT_URL = "http://localhost:3001"
TIMEOUT = float(os.environ.get("PC_TOOL_TIMEOUT", "120"))

_LOOPBACK_HOSTS = {"localhost", "127.0.0.1", "::1", "[::1]"}


class PCToolError(RuntimeError):
    """Raised with a message intended for Claude to relay to the user."""


def _is_loopback(url: str) -> bool:
    host = (urllib.parse.urlparse(url).hostname or "").lower()
    return host in _LOOPBACK_HOSTS


class PCToolClient:
    def __init__(self, url: str | None = None, password: str | None = None):
        self.url = (url or os.environ.get("PC_TOOL_URL") or DEFAULT_URL).rstrip("/")
        self.password = password or os.environ.get("PC_TOOL_PASSWORD") or ""
        self.allow_remote = os.environ.get("PC_TOOL_ALLOW_REMOTE") == "1"
        self.local = _is_loopback(self.url)

        if not self.local and not self.allow_remote:
            raise PCToolError(
                f"PC_TOOL_URL points at {self.url!r}, which is not loopback. This "
                "server is configured for local use only. To query the shared "
                "deployment on purpose, set PC_TOOL_ALLOW_REMOTE=1 and supply "
                "PC_TOOL_PASSWORD."
            )

        self._jar = http.cookiejar.CookieJar()
        self._opener = urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(self._jar)
        )
        self._logged_in = False

    # ── internals ────────────────────────────────────────────────────────
    def _api(self, path: str) -> str:
        """Flask is direct on loopback; behind the ALB it sits under the
        Next.js proxy prefix."""
        p = path if path.startswith("/") else f"/{path}"
        return f"{self.url}{p}" if self.local else f"{self.url}/api/backend{p}"

    def _login(self) -> None:
        """One shot. The login route allows 10 attempts per 15 minutes and
        then locks the IP out, so this must never be retried in a loop."""
        if self.local:
            return
        if not self.password:
            raise PCToolError(
                "The deployment requires a password but PC_TOOL_PASSWORD is not "
                "set in the Claude Desktop config."
            )
        body = json.dumps({"password": self.password}).encode()
        req = urllib.request.Request(
            f"{self.url}/api/login", data=body,
            headers={"Content-Type": "application/json"}, method="POST")
        try:
            self._opener.open(req, timeout=TIMEOUT).read()
        except urllib.error.HTTPError as e:
            if e.code == 429:
                raise PCToolError(
                    "Locked out of the tool: too many failed logins (10 per 15 "
                    "minutes). Wait a few minutes and check PC_TOOL_PASSWORD."
                ) from e
            raise PCToolError(f"Login failed ({e.code}). Check PC_TOOL_PASSWORD.") from e
        self._logged_in = True

    def _open(self, req: urllib.request.Request) -> bytes:
        try:
            return self._opener.open(req, timeout=TIMEOUT).read()
        except urllib.error.HTTPError as e:
            # Exactly one re-login, and only when a session could plausibly
            # have expired. Never loop — see the lockout note above.
            if e.code in (401, 403) and not self.local and self._logged_in:
                self._logged_in = False
                self._login()
                return self._opener.open(req, timeout=TIMEOUT).read()
            raise
        except urllib.error.URLError as e:
            raise PCToolError(
                f"Could not reach the PC Tool at {self.url} ({e.reason}). "
                + ("Is the local backend running? Start it with the `start` "
                   "skill, or `cd backend && ./venv/Scripts/python.exe run.py`."
                   if self.local else "Check the URL and your network.")
            ) from e

    def _request(self, path: str, method: str = "GET", payload=None, params=None):
        url = self._api(path)
        if params:
            clean = {k: v for k, v in params.items() if v not in (None, "")}
            if clean:
                url += "?" + urllib.parse.urlencode(clean)
        data = json.dumps(payload).encode() if payload is not None else None
        headers = {"Accept": "application/json"}
        if data:
            headers["Content-Type"] = "application/json"
        req = urllib.request.Request(url, data=data, headers=headers, method=method)

        if not self.local and not self._logged_in:
            self._login()

        try:
            raw = self._open(req)
        except urllib.error.HTTPError as e:
            detail = ""
            try:
                detail = e.read().decode("utf-8", "replace")[:300]
            except Exception:  # noqa: BLE001
                pass
            raise PCToolError(f"{method} {path} failed ({e.code}). {detail}".strip()) from e

        if not raw:
            return {}
        try:
            return json.loads(raw)
        except json.JSONDecodeError as e:
            head = raw[:200].decode("utf-8", "replace")
            raise PCToolError(
                f"{path} did not return JSON. First bytes: {head!r}"
            ) from e

    # ── public ───────────────────────────────────────────────────────────
    def get(self, path: str, **params):
        return self._request(path, "GET", params=params or None)

    def post(self, path: str, payload=None):
        return self._request(path, "POST", payload=payload if payload is not None else {})

    def get_bytes(self, path: str, **params) -> bytes:
        """Fetch a binary body (the .xlsx export endpoints) without JSON
        decoding. Shares the login/retry path so remote mode behaves the same.
        """
        url = self._api(path)
        clean = {k: v for k, v in (params or {}).items() if v not in (None, "")}
        if clean:
            url += "?" + urllib.parse.urlencode(clean)
        req = urllib.request.Request(url, headers={"Accept": "*/*"}, method="GET")
        if not self.local and not self._logged_in:
            self._login()
        try:
            return self._open(req)
        except urllib.error.HTTPError as e:
            detail = ""
            try:
                detail = e.read().decode("utf-8", "replace")[:300]
            except Exception:  # noqa: BLE001
                pass
            raise PCToolError(f"GET {path} failed ({e.code}). {detail}".strip()) from e

    def describe_target(self) -> str:
        return f"{self.url} ({'local' if self.local else 'remote'})"


_client: PCToolClient | None = None


def client() -> PCToolClient:
    """Lazily built so an invalid configuration surfaces as a tool error
    Claude can explain, rather than killing the server at import time."""
    global _client
    if _client is None:
        _client = PCToolClient()
    return _client
