import type { NextRequest } from "next/server";

const configuredBackendBaseUrl =
  process.env.BACKEND_BASE_URL ?? process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const backendBaseUrls = configuredBackendBaseUrl
  ? [configuredBackendBaseUrl]
  : ["http://127.0.0.1:3001", "http://127.0.0.1:5050"];

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