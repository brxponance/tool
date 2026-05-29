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
