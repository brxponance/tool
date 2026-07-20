import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

// Pin the Turbopack workspace root to this directory. Without this, Next 16
// infers the root by walking up and lands on the git repo root (c:\dev\pc_tool),
// where there is no node_modules — so `@import "tailwindcss"` in globals.css
// fails to resolve. Anchoring to the frontend dir fixes both dev and build.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://127.0.0.1:3001";

// In production (ECS), the frontend proxies /api/backend/* to the Flask
// container via the internal service URL set in BACKEND_INTERNAL_URL.
// NEXT_PUBLIC_BACKEND_BASE_URL is the public-facing path (always /api/backend
// so the browser never talks directly to Flask).
const internalBackendUrl =
  process.env.BACKEND_INTERNAL_URL ?? backendUrl;

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  // Emit a self-contained server bundle (.next/standalone) so the production
  // Docker image can run `node server.js` without shipping the full
  // node_modules tree — smaller, faster-starting image.
  output: "standalone",
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
