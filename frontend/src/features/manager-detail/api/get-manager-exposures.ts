import { backendJson } from "@/lib/backend";

import type {
  ManagerRiskExposuresResponse,
  ManagerPortfolioExposuresMenuResponse,
  ManagerPortfolioExposuresResponse,
} from "../types";

// Compute one manager's active style factor exposures, mirroring the
// /compute_risk_exposures or /compute_security_risk_exposures endpoints
// the Portfolio tab uses — but with a single manager at 100% weight so
// the response represents the manager's own active exposures.
export async function getManagerRiskExposures(
  name: string,
  tab: string,
  benchmarkHint: string | null,
  useSecurityRisk: boolean,
): Promise<ManagerRiskExposuresResponse> {
  const path = useSecurityRisk
    ? "compute_security_risk_exposures"
    : "compute_risk_exposures";

  const payload: Record<string, unknown> = {
    managers: [
      { matched_name: name, tab, current_weight: 1.0, proposed_weight: 1.0 },
    ],
  };
  if (benchmarkHint) {
    // Different endpoints expect different field names — match the legacy
    // contract so the existing backend resolvers find the right benchmark.
    if (useSecurityRisk) {
      payload.bench = benchmarkHint;
    } else {
      payload.benchmark_name = benchmarkHint;
    }
  }

  return backendJson<ManagerRiskExposuresResponse>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Fetch the exposures menu (categorical + continuous groupings) — same
// endpoint the Portfolio tab uses with an empty managers list.
export async function getManagerPortfolioExposuresMenu() {
  return backendJson<ManagerPortfolioExposuresMenuResponse>(
    "portfolio_exposures",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grouping: null, managers: [] }),
    },
  );
}

export async function getManagerPortfolioExposures(
  name: string,
  tab: string,
  grouping: string,
  subGrouping: string | null,
  benchmarkHint: string | null,
) {
  return backendJson<ManagerPortfolioExposuresResponse>(
    "portfolio_exposures",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        managers: [
          { matched_name: name, tab, current_weight: 1.0, proposed_weight: 1.0 },
        ],
        grouping,
        sub_grouping: subGrouping ?? null,
        benchmark_name: benchmarkHint ?? undefined,
      }),
    },
  );
}
