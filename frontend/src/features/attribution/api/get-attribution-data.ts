import { backendJson } from "@/lib/backend";

import type { ClientsResponse, ContributionResponse } from "../types";

export async function getClients() {
  return backendJson<ClientsResponse>("clients");
}

export async function getPortfolioContribution(client: string) {
  return backendJson<ContributionResponse>(
    `portfolio_contribution/${encodeURIComponent(client)}`,
  );
}
