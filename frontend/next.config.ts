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
  experimental: {
    // The password gate added on 2026-09-22 introduced middleware, and Next
    // buffers every request body so middleware and the route handler can
    // both read it. That buffer defaults to 10MB and SILENTLY TRUNCATES:
    // the backend then sees a half-finished multipart body and the upload
    // dies with a bare "Internal Server Error". It cost an afternoon to
    // find, because the FactSet exposures workbook had been sitting just
    // under 10MB and only broke when three benchmarks were added to it.
    //
    // Set above Flask's own MAX_CONTENT_LENGTH (200MB, backend/app.py) so
    // the backend stays the single authority on upload size and can return
    // a real error instead of a truncated body.
    // Renamed to proxyClientMaxBodySize in Next 16.3+; this key is what
    // 16.2.4 reads — check the runtime warning text if you upgrade.
    middlewareClientMaxBodySize: "256mb",
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
