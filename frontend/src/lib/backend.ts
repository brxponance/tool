import { BACKEND_PROXY_BASE } from "@/lib/constants";

export class BackendRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "BackendRequestError";
  }
}

function joinPath(path: string) {
  return `${BACKEND_PROXY_BASE}/${path.replace(/^\/+/, "")}`;
}

function looksLikeHtml(value: string) {
  const sample = value.trim().toLowerCase();
  return sample.startsWith("<!doctype html") || sample.startsWith("<html") || sample.includes("<body");
}

function normalizeTextErrorMessage(value: string, fallback: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }
  if (looksLikeHtml(trimmed)) {
    return fallback;
  }

  const collapsed = trimmed.replace(/\s+/g, " ");
  return collapsed.length > 240 ? `${collapsed.slice(0, 237)}...` : collapsed;
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string" && payload.trim()) {
    return normalizeTextErrorMessage(payload, fallback);
  }
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return normalizeTextErrorMessage(payload.error, fallback);
  }
  return fallback;
}

export async function backendJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(joinPath(path), {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as unknown)
    : ((await response.text()) as unknown);

  if (!response.ok) {
    throw new BackendRequestError(
      extractErrorMessage(payload, `Backend request failed with status ${response.status}.`),
      response.status,
    );
  }

  return payload as T;
}