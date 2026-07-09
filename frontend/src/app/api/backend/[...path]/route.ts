import type { NextRequest } from "next/server";

// Where this server-side route forwards /api/backend/* to. Prefer the
// production internal URL, then explicit overrides. Ignore
// NEXT_PUBLIC_BACKEND_BASE_URL when it's the relative "/api/backend" path
// (it's baked at build time for the browser and isn't a valid absolute URL
// for server-side fetch).
function resolveBackendBaseUrls(): string[] {
  const candidates = [
    process.env.BACKEND_INTERNAL_URL,
    process.env.BACKEND_BASE_URL,
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  ].filter((v): v is string => !!v && /^https?:\/\//.test(v));
  if (candidates.length > 0) {
    return [candidates[0]];
  }
  return ["http://127.0.0.1:3001", "http://127.0.0.1:5050"];
}

const backendBaseUrls = resolveBackendBaseUrls();

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function forward(request: NextRequest, context: RouteContext) {
  try {
    const { path } = await context.params;
    const requestBody =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : new Uint8Array(await request.arrayBuffer());
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("connection");

    let lastError: Error | null = null;

    for (let index = 0; index < backendBaseUrls.length; index += 1) {
      const baseUrl = backendBaseUrls[index];
      const targetUrl = new URL(path.join("/"), `${baseUrl.replace(/\/+$/, "")}/`);

      request.nextUrl.searchParams.forEach((value, key) => {
        targetUrl.searchParams.append(key, value);
      });

      try {
        const upstream = await fetch(targetUrl, {
          method: request.method,
          headers,
          body: requestBody,
          cache: "no-store",
        });

        const contentType = upstream.headers.get("content-type")?.toLowerCase() ?? "";
        const shouldTryNextBackend =
          index < backendBaseUrls.length - 1 &&
          (upstream.status === 404 || contentType.includes("text/html"));

        if (shouldTryNextBackend) {
          continue;
        }

        const responseHeaders = new Headers();
        if (contentType) {
          responseHeaders.set("content-type", contentType);
        }
        // Forward the headers a binary download needs. Without these the
        // browser can't read the filename or the skipped-slides list from
        // the /export_portfolio_pptx response.
        for (const passthrough of [
          "content-disposition",
          "content-length",
          "x-skipped-slides",
        ]) {
          const value = upstream.headers.get(passthrough);
          if (value) {
            responseHeaders.set(passthrough, value);
          }
        }

        return new Response(upstream.body, {
          status: upstream.status,
          headers: responseHeaders,
        });
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Backend unavailable");
      }
    }

    throw lastError ?? new Error("Backend unavailable");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Backend unavailable";
    return Response.json({ error: message }, { status: 503 });
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}

// The client-management endpoints use PATCH (rename/benchmark), DELETE
// (remove client), and PUT (save portfolio). Without these handlers Next.js
// returns 405 before the request ever reaches the Flask backend.
export async function PATCH(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}