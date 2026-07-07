import { backendJson } from "@/lib/backend";

import type {
  HoldingsOverlapDetailResponse,
  HoldingsOverlapResponse,
  MatchBasis,
  OverlapManagerInput,
  WeightState,
} from "../types";

export async function getHoldingsOverlap(
  client: string,
  managers: OverlapManagerInput[],
  weightState: WeightState,
  matchBasis: MatchBasis,
) {
  return backendJson<HoldingsOverlapResponse>("holdings_overlap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: client,
      managers,
      weight_state: weightState,
      match_basis: matchBasis,
    }),
  });
}

export async function getHoldingsOverlapDetail(
  client: string,
  managers: OverlapManagerInput[],
  nameI: string,
  nameJ: string,
  weightState: WeightState,
  matchBasis: MatchBasis,
  topN?: number,
) {
  return backendJson<HoldingsOverlapDetailResponse>("holdings_overlap_detail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: client,
      managers,
      name_i: nameI,
      name_j: nameJ,
      weight_state: weightState,
      match_basis: matchBasis,
      top_n: topN ?? null,
    }),
  });
}
