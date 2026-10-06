import { backendJson } from "@/lib/backend";

import type {
  ClientsResponse,
  ContributionResponse,
  ThemeDiscoveryResponse,
} from "../types";

export async function getClients() {
  return backendJson<ClientsResponse>("clients");
}

export async function getPortfolioContribution(client: string) {
  return backendJson<ContributionResponse>(
    `portfolio_contribution/${encodeURIComponent(client)}`,
  );
}

export async function getThemes(params: {
  benchmark?: string;
  period?: string;
  minWeight?: number;
  topN?: number;
} = {}) {
  const q = new URLSearchParams();
  if (params.benchmark) q.set("benchmark", params.benchmark);
  if (params.period) q.set("period", params.period);
  if (params.minWeight != null) q.set("min_weight", String(params.minWeight));
  if (params.topN != null) q.set("top_n", String(params.topN));
  const qs = q.toString();
  return backendJson<ThemeDiscoveryResponse>(
    `attribution_themes${qs ? `?${qs}` : ""}`,
  );
}
