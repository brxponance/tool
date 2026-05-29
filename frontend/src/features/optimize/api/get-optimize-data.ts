import { backendJson } from "@/lib/backend";

import type {
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
