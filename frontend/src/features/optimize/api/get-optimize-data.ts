import { backendJson } from "@/lib/backend";

import type {
  ClientOptimizerRequest,
  OptimizerCandidatesResponse,
  OptimizerRequest,
  OptimizerResponse,
} from "../types";

export async function getOptimizeCandidates(peerGroup: string) {
  return backendJson<OptimizerCandidatesResponse>(
    `optimize_candidates/${encodeURIComponent(peerGroup)}`,
  );
}

export async function runOptimizer(payload: OptimizerRequest) {
  return backendJson<OptimizerResponse>("optimize_portfolio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Reference (client-scoped) optimizer run: sends {client_name, forced_managers}
// only. The backend resolves the peer group and applies fixed constraints.
export async function runClientOptimizer(payload: ClientOptimizerRequest) {
  return backendJson<OptimizerResponse>("optimize_portfolio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
