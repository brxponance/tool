// Liveness endpoint for the ALB target-group health check. Returns a plain
// 200 so the load balancer can confirm the Next.js server is up, independent
// of app routing (the root path `/` redirects to /setup, which is a 307 and
// would otherwise fail a 200-only health check).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  return Response.json({ status: "ok" }, { status: 200 });
}
