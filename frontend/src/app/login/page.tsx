"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Interim shared-password gate — see src/lib/gate.ts for why this exists and
// when to delete it. Deliberately outside the (workspace) route group so it
// renders without the nav chrome, and shows nothing about the tool's
// contents before the password is entered.

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error ?? "Incorrect password.");
        setBusy(false);
        return;
      }
      // Full navigation rather than a client push, so middleware re-runs and
      // the freshly set cookie is used for the next request.
      const next = params.get("next");
      window.location.href = next && next.startsWith("/") ? next : "/";
    } catch {
      setError("Could not reach the server. Try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="panel" style={{ width: 380, padding: 24 }}>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: ".02em",
          textTransform: "uppercase",
          color: "var(--text)",
        }}
      >
        Aapryl Clone Tool
      </div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--text3)",
          marginTop: 6,
          lineHeight: 1.5,
        }}
      >
        This tool contains client portfolio data. Enter the shared password to
        continue.
      </div>

      <label
        htmlFor="gate-password"
        style={{
          display: "block",
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: ".06em",
          textTransform: "uppercase",
          color: "var(--text2)",
          margin: "18px 0 5px",
        }}
      >
        Password
      </label>
      <input
        id="gate-password"
        type="password"
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          fontFamily: "var(--mono)",
          fontSize: 13,
          padding: "8px 10px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 3,
          color: "var(--text)",
        }}
      />

      {error && (
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--red)",
            marginTop: 8,
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={busy || !password}
        style={{ width: "100%", marginTop: 16 }}
      >
        {busy ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--surface2, #f6f8fa)",
      }}
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
