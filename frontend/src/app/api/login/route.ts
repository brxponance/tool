import { NextResponse } from "next/server";

import {
  GATE_COOKIE,
  SESSION_DAYS,
  createSessionValue,
  verifyPassword,
} from "@/lib/gate";

// Interim shared-password gate — see src/lib/gate.ts for why this exists and
// when to delete it. Excluded from the middleware matcher, so this route is
// reachable without a cookie by design.
//
// Node runtime (the default) rather than Edge, so the in-memory attempt
// counter below survives between requests. The service runs a single task,
// so one counter is the whole picture.

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

const attempts = new Map<string, { count: number; first: number }>();

function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function sweep(now: number) {
  for (const [key, entry] of attempts) {
    if (now - entry.first > WINDOW_MS) attempts.delete(key);
  }
}

export async function POST(req: Request) {
  const now = Date.now();
  sweep(now);

  const key = clientKey(req);
  const entry = attempts.get(key);
  if (entry && entry.count >= MAX_ATTEMPTS && now - entry.first <= WINDOW_MS) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    // malformed body is just a failed attempt
  }

  if (!(await verifyPassword(password))) {
    const next = entry && now - entry.first <= WINDOW_MS ? entry : { count: 0, first: now };
    next.count += 1;
    attempts.set(key, next);
    // Slow repeated guesses down; the PBKDF2 work already costs ~0.3s.
    await new Promise((r) => setTimeout(r, Math.min(2000, 250 * next.count)));
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  attempts.delete(key);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(GATE_COOKIE, await createSessionValue(now), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    // MUST stay false while the ALB is HTTP-only: browsers silently discard
    // Secure cookies sent over plain HTTP and nobody would stay signed in.
    // Flip to true the moment HTTPS is in front of this.
    secure: false,
  });
  return res;
}
