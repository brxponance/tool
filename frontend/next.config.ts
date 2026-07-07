import type { NextConfig } from "next";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://127.0.0.1:3001";

// In production (ECS), the frontend proxies /api/backend/* to the Flask
// container via the internal service URL set in BACKEND_INTERNAL_URL.
// NEXT_PUBLIC_BACKEND_BASE_URL is the public-facing path (always /api/backend
// so the browser never talks directly to Flask).
const internalBackendUrl =
  process.env.BACKEND_INTERNAL_URL ?? backendUrl;

const nextConfig: NextConfig = {
  typescript: {
    // Next runs `tsc` in a forked build worker whose module cache is read via
    // node:fs. Under a OneDrive-synced working directory that read
    // intermittently fails with `UNKNOWN: unknown error, read` (errno -4094)
    // and aborts the build even though compilation succeeded. Type safety is
    // still enforced out-of-band by `npx tsc --noEmit` (and `npm run lint`),
    // so we skip Next's own crashing type-check worker here. Remove this once
    // the repo lives outside the OneDrive path.
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${internalBackendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
