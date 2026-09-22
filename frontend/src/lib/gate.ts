// Interim shared-password gate.
//
// TEMPORARY (2026-09-22). The live tool has no authentication at all: the
// ALB is public HTTP and the same open API serves reads, uploads, edits and
// deletes. The real fix is Microsoft sign-in at the load balancer, which is
// blocked on a DNS subdomain and AWS access we don't have. Until then this
// puts one shared password in front of everything, shipped through the
// normal deploy.
//
// DELETE THIS FILE, `src/middleware.ts`, `src/app/login/` and
// `src/app/api/login/` once ALB sign-in is live.
//
// Why the constants below are in the repo rather than an env var: setting an
// env var means editing the ECS task definition, which needs AWS console
// access. The repo is private and a PBKDF2 hash is not the password.
// Accepted as an interim tradeoff.
//
// Runs in BOTH the Edge runtime (middleware) and Node (the login route), so
// everything here uses Web Crypto and base64 helpers available in both.
// Deliberately no bcrypt/scrypt — neither exists on the Edge runtime.

const PASSWORD_SALT_B64 = "6P4djlZg9ww+nZV/tcEyJw==";
const PASSWORD_HASH_B64 = "DbBrP9WH2q/eCjQUeJtjN+tpNIlnCIR08yFoSLDnOX8=";
const PBKDF2_ITERATIONS = 600_000;

// Signing key for the session cookie. Rotating this value logs everyone out.
const COOKIE_SECRET_B64 = "COl9ynZYaJf7ddFc7ciGzy+nxx4fyrmPkFsTxtT8Rcs=";

export const GATE_COOKIE = "pct_gate";
export const SESSION_DAYS = 30;

// The ALB health check calls /api/backend/status every 30s and ECS kills the
// task after ~2.5 min of failures. That one path must answer without a
// cookie or the container restart-loops. Narrowed to the health checker's
// own user agent so a browser still gets the prompt.
export const HEALTH_CHECK_PATH = "/api/backend/status";
export const HEALTH_CHECK_UA_PREFIX = "ELB-HealthChecker";

/** Production only, so `npm run dev` and the `start` skill are unaffected. */
export function gateEnabled(): boolean {
  return process.env.NODE_ENV === "production";
}

// Backed by an explicit ArrayBuffer: Web Crypto's BufferSource won't accept
// the `ArrayBufferLike` that a bare `new Uint8Array(n)` infers under TS 5.7+.
function b64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(b64);
  const out = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

function bytesToB64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Length-independent compare, so a wrong password can't be timed out byte by byte. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function verifyPassword(password: string): Promise<boolean> {
  if (!password) return false;
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: b64ToBytes(PASSWORD_SALT_B64),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    material,
    256,
  );
  return timingSafeEqual(new Uint8Array(derived), b64ToBytes(PASSWORD_HASH_B64));
}

async function signingKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    b64ToBytes(COOKIE_SECRET_B64),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function signExpiry(expiry: string): Promise<string> {
  const sig = await crypto.subtle.sign(
    "HMAC",
    await signingKey(),
    new TextEncoder().encode(expiry),
  );
  return bytesToB64Url(new Uint8Array(sig));
}

/** Cookie value is `<expiry-ms>.<hmac>` so it carries its own expiry and can't be forged. */
export async function createSessionValue(nowMs: number): Promise<string> {
  const expiry = String(nowMs + SESSION_DAYS * 24 * 60 * 60 * 1000);
  return `${expiry}.${await signExpiry(expiry)}`;
}

export async function verifySessionValue(value: string, nowMs: number): Promise<boolean> {
  const dot = value.indexOf(".");
  if (dot < 1) return false;
  const expiry = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  const expiryMs = Number(expiry);
  if (!Number.isFinite(expiryMs) || expiryMs <= nowMs) return false;
  const expected = await signExpiry(expiry);
  const encoder = new TextEncoder();
  return timingSafeEqual(encoder.encode(signature), encoder.encode(expected));
}
