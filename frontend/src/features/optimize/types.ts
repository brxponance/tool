export type PeerGroup = "EAFE" | "ISC" | "ACWI" | "EM" | "US" | "USSC";

export const PEER_GROUPS: PeerGroup[] = ["EAFE", "ISC", "ACWI", "EM", "US", "USSC"];

export type ForcedKind = "pinned" | "required";

// User-side forced manager input (sent in the optimize request body).
export type ForcedManagerInput = {
  name: string;
  tab: string;
  // For pinned managers, weight is the locked fraction (0–1). For required
  // managers, omit or send 0 — the optimizer picks the weight in [min,max].
  weight?: number | null;
};

// Single candidate returned by GET /optimize_candidates/<peer_group>.
export type OptimizerCandidate = {
  name: string;
  tab: string;
  vg_3factor: number | null;
  vg_full: number | null;
  ns_z: number | null;
  r2_full: number | null;
};

export type OptimizerCandidatesResponse = {
  candidates: OptimizerCandidate[];
  peer_group: string;
};

// Manager row in the optimizer result.
export type OptimizedManager = {
  name: string;
  tab: string;
  weight: number;
  vg_3factor: number;
  vg_full: number;
  ns_z: number | null;
  r2_full: number | null;
  is_forced: boolean;
  forced_kind?: ForcedKind;
};

export type OptimizerSummary = {
  portfolio_vg_3factor: number;
  expected_norm_skill: number;
  n_managers: number;
  total_weight: number;
  n_forced: number;
  n_pinned?: number;
  n_required?: number;
  n_selected: number;
  candidates_considered: number;
  candidates_excluded_xus?: number;
  candidates_excluded_forced_firm?: number;
  candidates_excluded_no_skill?: number;
  firm_groups_constrained?: number;
  vg_band: number;
  vg_center: number;
  min_weight: number;
  max_weight: number;
  min_managers: number;
  max_managers: number;
  skill_uncovered_weight: number;
};

export type OptimizerStatus = "ok" | "infeasible" | "error" | "warning";

export type OptimizerResponse = {
  status: OptimizerStatus;
  error?: string;
  optimized_managers?: OptimizedManager[];
  summary?: OptimizerSummary;
  detail?: Record<string, unknown>;
  peer_group?: string;
};

// Constraint values bound to the form inputs (decimals 0–1, not %).
export type OptimizerConstraints = {
  min_weight: number;
  max_weight: number;
  min_managers: number;
  max_managers: number;
  vg_center: number;
  vg_band: number;
};

export const DEFAULT_CONSTRAINTS: OptimizerConstraints = {
  min_weight: 0.05,
  max_weight: 0.20,
  min_managers: 4,
  max_managers: 8,
  vg_center: 0.0,
  vg_band: 0.07,
};

// Request payload for POST /optimize_portfolio.
export type OptimizerRequest = {
  client_name?: string;
  peer_group: PeerGroup | string;
  forced_managers: ForcedManagerInput[];
} & Partial<OptimizerConstraints>;

// Client-scoped request payload for POST /optimize_portfolio (reference UX).
// The backend derives the peer group from the client and applies its fixed
// constraints — no peer group or constraint overrides are sent.
export type ClientOptimizerRequest = {
  client_name: string;
  forced_managers: ForcedManagerInput[];
};
