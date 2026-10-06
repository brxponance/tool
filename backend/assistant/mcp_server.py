"""
MCP server exposing the PC Tool to Claude Desktop over stdio.

Launched BY Claude Desktop as a subprocess; it listens on no port and accepts
no connections. It is a client of the Flask API, not a new way in. Access is
governed entirely by what the host can already reach — see http_client for the
loopback-only default.

Run directly to smoke-test:
    ./venv/Scripts/python.exe assistant/mcp_server.py --selftest
"""

from __future__ import annotations

import logging
import os
import sys

# Claude Desktop launches this with no useful cwd, so make the package
# importable from its own absolute location before anything else.
_HERE = os.path.dirname(os.path.abspath(__file__))
_BACKEND = os.path.dirname(_HERE)
for p in (_BACKEND, os.path.dirname(_BACKEND)):
    if p not in sys.path:
        sys.path.insert(0, p)

from assistant import tools  # noqa: E402
from mcp.server.mcpserver import MCPServer  # noqa: E402

# stdio transport carries JSON-RPC on stdout, so ANY stray stdout write
# corrupts the stream and kills the session. Official guidance is to keep
# print() out of a stdio server entirely and log to stderr. basicConfig's
# default handler is stderr; `force=True` so an import that already configured
# logging cannot silently redirect us. Claude Desktop captures stderr into
# its mcp.log, which is the only diagnostic surface when a tool misbehaves.
logging.basicConfig(
    level=os.environ.get("PC_TOOL_LOG_LEVEL", "INFO"),
    stream=sys.stderr,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    force=True,
)
log = logging.getLogger("pc-tool")


def _log_calls(fn):
    """Record each invocation to stderr. Tools never raise (they return error
    text), so this logs outcome rather than wrapping in try/except."""
    import functools

    @functools.wraps(fn)
    def wrapper(*a, **kw):
        log.info("tool %s args=%s kwargs=%s", fn.__name__, a, kw)
        out = fn(*a, **kw)
        if isinstance(out, str) and out.startswith("Error:"):
            log.warning("tool %s returned: %s", fn.__name__, out.splitlines()[0][:200])
        return out
    return wrapper

mcp = MCPServer(
    name="pc-tool",
    # Sent ONCE per session, unlike tool descriptions which are re-sent on every
    # message. Shared vocabulary therefore belongs here, not duplicated across
    # eleven docstrings.
    instructions=(
        "Read-only access to the Xponance PC Tool: client portfolios, manager "
        "clone profiles, peer groups, FactSet exposures and benchmark "
        "attribution.\n\n"
        "WORKFLOW. Call find_entity FIRST whenever the user names a manager or "
        "client — the same manager is keyed differently in the returns "
        "workbook, the weights workbook and the FactSet file, and guessing "
        "produces a confident wrong answer. Call list_groupings before "
        "get_exposures: a wrong grouping returns a silently empty table, not "
        "an error.\n\n"
        "VOCABULARY. Figures are percent unless a column says bps. 'Style' is "
        "what a manager's passive style tilts earned (clone minus benchmark); "
        "'skill' is what remains after removing them (manager minus own "
        "clone). 'Active' weight is portfolio minus benchmark. Continuous "
        "metrics are bucketed into quintiles using the BENCHMARK's breaks, so "
        "Q1 means the same thing across managers.\n\n"
        "ATTRIBUTION. Impact = weight x (group return - benchmark return), in "
        "bps. It never divides by the benchmark return, so it holds when the "
        "benchmark is flat or negative; in a down quarter a positive impact "
        "means the group cushioned the decline, not that it rose. Intensity is "
        "share of active dispersion per unit of weight — above 1 is outsized "
        "for its size. Never describe a theme as a share of performance when "
        "the benchmark return is near zero or negative.\n\n"
        "LIMITS. Exposures come from ONE loaded snapshot; there is no history, "
        "so 'as of <date>' can only mean that file, which the output names. "
        "For whole-dataset work (long return histories, custom screens) use "
        "export_workbook and ask the user to attach the file rather than "
        "pulling thousands of rows into the conversation. Tables are capped "
        "and say when truncated — narrow the question rather than assuming "
        "the remainder is empty."
    ),
    version="0.1.0",
)

for fn in tools.TOOLS:
    mcp.tool()(_log_calls(fn))


def _emit(msg: str) -> None:
    """Selftest output goes to stderr like everything else here, so this
    module never writes a byte to stdout under any code path."""
    sys.stderr.write(msg + chr(10))


def _selftest() -> int:
    from assistant.http_client import PCToolError, client
    try:
        c = client()
    except PCToolError as e:
        _emit(f"CONFIG ERROR: {e}")
        return 1
    _emit(f"target: {c.describe_target()}")
    _emit(f"tools : {len(tools.TOOLS)} registered")
    # Sample arguments for the tools that need them, so the selftest actually
    # exercises them instead of reporting "skipped". Anything absent here and
    # requiring arguments is genuinely skipped.
    import inspect
    samples = {
        "get_peer_group": ("EAFE",),
        "find_entity": ("ballina",),
        "get_manager_detail": ("EAFE", "Polen International EAFE + Canada Concentrated"),
        "get_client_portfolio": ("CALSTRS",),
        "get_portfolio_contribution": ("CALSTRS",),
        "get_holdings_overlap": ("CALSTRS",),
    }
    failures = 0
    for fn in tools.TOOLS:
        name = fn.__name__
        try:
            required = [p for p in inspect.signature(fn).parameters.values()
                        if p.default is inspect.Parameter.empty]
            if not required:
                out = fn()
            elif name in samples:
                out = fn(*samples[name])
            else:
                _emit(f"  {name:28} skipped (needs arguments)")
                continue
            first = (out or "").splitlines()[0][:70]
            bad = out.startswith("Error:")
            failures += bad
            _emit(f"  {name:28} {'FAIL' if bad else 'ok'}  {first}")
        except Exception as e:  # noqa: BLE001
            failures += 1
            _emit(f"  {name:28} EXCEPTION {type(e).__name__}: {e}")
    return 1 if failures else 0


if __name__ == "__main__":
    if "--selftest" in sys.argv:
        sys.exit(_selftest())
    mcp.run(transport="stdio")
