// Holdings-overlap matrix feature types. Mirrors the shapes returned by the
// backend /holdings_overlap and /holdings_overlap_detail routes
// (overlap_engine.compute_holdings_overlap / compute_pair_detail).

// The manager list posted to the overlap endpoints. Reuses the portfolio
// manager fields the backend fuzzy-matches on.
export type OverlapManagerInput = {
  matched_name: string;
  weight_file_name?: string;
  current_weight: number; // fraction 0–1
  proposed_weight: number; // fraction 0–1
};

export type WeightState = "current" | "proposed";
export type MatchBasis = "sedol" | "issuer";

// Metrics for one manager pair on one basis (internal or scaled).
export type OverlapPairMetrics = {
  shared_count: number;
  common_weight: number; // Σ min(wA, wB) over shared holdings
  a_in_shared: number; // Σ wA over shared (directional)
  b_in_shared: number; // Σ wB over shared (directional)
  jaccard: number; // |A∩B| / |A∪B|
};

export type OverlapPair = {
  i: number;
  j: number;
  name_i: string;
  name_j: string;
  internal: OverlapPairMetrics; // strategy similarity (within-manager weights)
  scaled: OverlapPairMetrics; // client doubling-up (weights × allocation)
};

export type OverlapAxisManager = {
  name: string;
  display: string;
  count: number; // number of holdings
  alloc: number; // allocation pct (×100)
};

export type HoldingsOverlapResponse = {
  managers?: OverlapAxisManager[];
  pairs?: OverlapPair[];
  unmatched?: string[];
  weight_state?: WeightState;
  benchmark_name?: string | null;
  match_basis?: MatchBasis;
  note?: string;
  error?: string;
};

export type OverlapDetailRow = {
  sedol: string;
  name: string;
  sector: string | null;
  country: string | null;
  wi_internal: number;
  wj_internal: number;
  wi_scaled: number;
  wj_scaled: number;
  n_lines: number;
};

export type HoldingsOverlapDetailResponse = {
  name_i?: string;
  name_j?: string;
  exp_i?: string;
  exp_j?: string;
  alloc_i?: number;
  alloc_j?: number;
  shared_count?: number;
  rows?: OverlapDetailRow[];
  weight_state?: WeightState;
  match_basis?: MatchBasis;
  error?: string;
};
