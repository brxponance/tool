export const DEFAULT_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://127.0.0.1:3001";

export const BACKEND_PROXY_BASE = "/api/backend";

export const APP_NAV_ITEMS = [
  { href: "/setup", label: "Setup", eyebrow: "Connect" },
  { href: "/portfolio", label: "Portfolio", eyebrow: "Weights" },
  { href: "/peer-groups", label: "Peer Groups", eyebrow: "Compare" },
  { href: "/manager-detail", label: "Manager Detail", eyebrow: "Inspect" },
  { href: "/optimize", label: "Optimize", eyebrow: "Solve" },
  { href: "/report", label: "Report", eyebrow: "Print" },
] as const;