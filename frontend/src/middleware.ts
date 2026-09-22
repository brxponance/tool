import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  GATE_COOKIE,
  HEALTH_CHECK_PATH,
  HEALTH_CHECK_UA_PREFIX,
  gateEnabled,
  verifySessionValue,
} from "@/lib/gate";

// Interim shared-password gate — see src/lib/gate.ts for why this exists and
// when to delete it.
//
// This sits in the Next.js layer on purpose. Every request reaches Next
// first, whether it arrives through the ALB or straight at the container on
// port 3000, and the Flask backend is only reachable through the proxy at
// /api/backend/*. One check therefore covers both the screens and the data
// API, with no backend change.

export async function middleware(req: NextRequest) {
  if (!gateEnabled()) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // The ALB health check must never be blocked: ECS kills the task after
  // ~2.5 min of failures and the container restart-loops. Only the health
  // checker itself gets the exemption, so a browser still sees the prompt.
  if (pathname === HEALTH_CHECK_PATH) {
    const ua = req.headers.get("user-agent") ?? "";
    if (ua.startsWith(HEALTH_CHECK_UA_PREFIX)) return NextResponse.next();
  }

  const cookie = req.cookies.get(GATE_COOKIE)?.value;
  if (cookie && (await verifySessionValue(cookie, Date.now()))) {
    return NextResponse.next();
  }

  // API callers get a status code they can act on; browsers get the form.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Not signed in. Open the tool in a browser and enter the password." },
      { status: 401 },
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search =
    pathname === "/"
      ? ""
      : `?next=${encodeURIComponent(pathname + req.nextUrl.search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except the login screen itself, its endpoint, and static
  // assets. /api/backend/status is deliberately still matched — the handler
  // above lets only the health checker through.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|api/login).*)"],
};
