import { backendJson } from "@/lib/backend";
import type { BackendStatus } from "@/features/setup/types";

import type {
  ClientsResponse,
  ContributionResponse,
  DiverseOwnershipResponse,
  IdealComplementResponse,
  MarketCycleResponse,
  PlaceholderBucketUpdateResponse,
  PortfolioExposuresMenuResponse,
  PortfolioExposuresResponse,
  PortfolioResponse,
  PortfolioStats,
  RiskAnalysisResponse,
  RiskExposuresResponse,
} from "../types";

export async function getPortfolioClients() {
  return backendJson<ClientsResponse>("clients");
}

// Canonical benchmark labels for the add/rename-client dropdown (strict list,
// owned by the backend so the UI can't submit a typo'd benchmark).
export async function getBenchmarkCatalog() {
  return backendJson<{ benchmarks: string[] }>("benchmarks");
}

// ── Client management (requires the Postgres client DB) ─────────────────────
// Each endpoint returns the updated roster so the caller can refresh the UI.
export async function createClient(input: {
  name: string;
  benchmark?: string | null;
}) {
  return backendJson<ClientsResponse & { created: string }>("clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: input.name, benchmark: input.benchmark ?? null }),
  });
}

export async function updateClient(
  currentName: string,
  input: { name?: string; benchmark?: string | null },
) {
  return backendJson<ClientsResponse & { renamed_to: string }>(
    `clients/${encodeURIComponent(currentName)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
}

export async function deleteClient(name: string) {
  return backendJson<ClientsResponse & { deleted: string }>(
    `clients/${encodeURIComponent(name)}`,
    { method: "DELETE" },
  );
}

// Persist a client's full edited portfolio (manager list + current/proposed
// weights + placeholder style buckets). Backs the "Save" button.
export async function savePortfolioDraft(
  client: string,
  managers: Array<{
    weight_file_name: string;
    matched_name: string;
    tab: string;
    current_weight: number;
    proposed_weight: number;
    style_buckets?: Record<string, number> | null;
    is_placeholder?: boolean;
  }>,
) {
  return backendJson<{ ok: true; saved: string }>(
    `clients/${encodeURIComponent(client)}/portfolio`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ managers }),
    },
  );
}

export async function getPortfolioStatus() {
  return backendJson<BackendStatus>("status");
}

export async function getPortfolio(client: string) {
  return backendJson<PortfolioResponse>(`portfolio/${encodeURIComponent(client)}`);
}

export async function getPortfolioStats(portfolio: PortfolioResponse) {
  return backendJson<PortfolioStats>("compute_portfolio_stats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ managers: portfolio.managers }),
  });
}

export async function getPortfolioRiskExposures(
  client: string,
  managers: PortfolioResponse["managers"],
  useSecurityRisk: boolean,
) {
  return backendJson<RiskExposuresResponse>(
    useSecurityRisk ? "compute_security_risk_exposures" : "compute_risk_exposures",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ client_name: client, managers }),
    },
  );
}

export async function getPortfolioRiskAnalysis(
  client: string,
  managers: PortfolioResponse["managers"],
) {
  return backendJson<RiskAnalysisResponse>("risk_analysis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ client_name: client, managers }),
  });
}

export async function getPortfolioContribution(client: string) {
  return backendJson<ContributionResponse>(`portfolio_contribution/${encodeURIComponent(client)}`);
}

export async function getPortfolioContributionPreview(
  managers: PortfolioResponse["managers"],
) {
  return backendJson<ContributionResponse>("portfolio_contribution_preview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ managers }),
  });
}

export async function getPortfolioMarketCycle(
  client: string,
  managers: PortfolioResponse["managers"],
) {
  return backendJson<MarketCycleResponse>("market_cycle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ client_name: client, managers }),
  });
}

export async function getPortfolioExposuresMenu() {
  return backendJson<PortfolioExposuresMenuResponse>("portfolio_exposures", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grouping: null, managers: [] }),
  });
}

export async function getPortfolioExposures(
  client: string,
  managers: PortfolioResponse["managers"],
  grouping: string,
  subGrouping?: string | null,
) {
  return backendJson<PortfolioExposuresResponse>("portfolio_exposures", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_name: client,
      managers,
      grouping,
      sub_grouping: subGrouping ?? null,
    }),
  });
}

export async function findIdealComplement(
  client: string,
  managers: PortfolioResponse["managers"],
) {
  return backendJson<IdealComplementResponse>("ideal_complement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_name: client, managers }),
  });
}

export async function getDiverseOwnership(
  managers: PortfolioResponse["managers"],
  threshold = 50,
) {
  return backendJson<DiverseOwnershipResponse>("diverse_ownership", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ managers, threshold }),
  });
}

export async function updatePlaceholderBuckets(
  name: string,
  buckets: Record<string, number> | null,
) {
  return backendJson<PlaceholderBucketUpdateResponse>("placeholder_buckets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, buckets }),
  });
}