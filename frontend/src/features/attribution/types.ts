// Performance Attribution feature types. The contribution shapes mirror the
// backend /portfolio_contribution/<client> response
// (app.py _build_portfolio_contribution_rows).

export type ContributionManager = {
  name: string;
  weight: number;
  vg_full: number | null;
  qtd_mgr: number | null;
  qtd_bench: number | null;
  qtd_style: number | null;
  qtd_skill: number | null;
  t1_style: number | null;
  t1_skill: number | null;
  t3_style: number | null;
  t3_skill: number | null;
};

export type ContributionResponse = {
  managers: ContributionManager[];
  unmatched: string[];
  // Returned by the backend but previously undeclared, so it was silently
  // dropped by every consumer.
  benchmark_name?: string;
  error?: string;
};

export type ClientsResponse = {
  clients: string[];
  /** The client's benchmark as the roster spells it ('MSCI EAFE+CANADA'). */
  benchmarks: Record<string, string>;
  /**
   * The same benchmark as the loaded contribution file names its section
   * ('MSCI EAFE + Canada'). Resolved by the backend, and absent for a client
   * whose benchmark has no section in the current pull.
   */
  benchmark_sections?: Record<string, string>;
  editable: boolean;
};

// ── Benchmark theme discovery (P1) ──────────────────────────────────────
// Mirrors backend/attribution_engine.discover_themes.
//
// Units: `w`, `r_g`, `excess`, `e_g`, `share` and `r_b` are DECIMALS
// (0.0219 = 2.19%). `e_g_bps` / `r_b_bps` are the same quantities in basis
// points, pre-multiplied server-side so the UI never rescales.

export type ThemeRowPart = { column: string; value: string };

export type ThemeRow = {
  label: string;          // 'Japan × Vol 252D Q1 (High)'
  detail: string;         // 'Country: Japan · Vol 252D: Q1 (High)'
  parts: ThemeRowPart[];
  cardinality: number;
  members: number;        // securities in the group
  w: number;              // group average weight
  c: number;              // group contribution
  r_g: number | null;     // group return
  excess: number | null;  // R_G − R_b
  e_g: number;            // w_G (R_G − R_b)
  e_g_bps: number;
  share: number | null;   // |E_G| / total active dispersion
  intensity: number | null; // share / w — the robust "outsized" measure
  // Share of the benchmark's return, and that share minus the group's share of
  // weight — the overshoot against "a 20% weight should be 20% of the return".
  // Both null unless R_b is positive AND above the server's floor: excess_share
  // is E_G / R_b, so on a down benchmark it reverses sign and reads as the
  // opposite of what happened. Never sort on them; e_g_bps is the sort key.
  phi: number | null;
  excess_share: number | null;
  nested_in: string | null;
};

export type ThemeReconciliation = {
  sum_weight: number;
  sum_weight_ok: boolean;
  sum_contribution: number;
  reported_total: number | null;
  total_matches_reported: boolean | null;
  partition_sum_e_g: number;
  partition_sum_ok: boolean;
};

export type ThemeDiscoveryResponse = {
  benchmark: string;
  period: string;
  periods: string[];
  available_benchmarks: string[];
  r_b: number;
  r_b_bps: number;
  dispersion: number;
  ratio_available: boolean;
  ratio_floor_bps: number;
  min_weight: number;
  n_securities: number;
  n_candidates: number;
  contributors: ThemeRow[];
  detractors: ThemeRow[];
  most_outsized: ThemeRow[];
  reconciliation: ThemeReconciliation;
  error?: string;
};

// ── One pinned theme, benchmark → client → managers (P2) ────────────────
// Mirrors backend/attribution_engine.client_theme_detail. Three readings in
// two spaces: the active position and the manager split are CLIENT space (the
// split sums to the client's own weight and contribution), while own_weight is
// MANAGER space — the sleeve's bet as a share of itself. They are never
// converted into one another.
export type ThemeManagerRow = {
  name: string;
  /** Weight in the theme as a share of the CLIENT portfolio. */
  weight: number;
  contribution: number;
  contribution_bps: number;
  share_of_client: number | null;
  /** The sleeve's own weight in the theme, as a share of itself. */
  own_weight: number | null;
  own_active_weight: number | null;
  /** Fee / transition / residual plug — in the totals, never a manager. */
  is_residual: boolean;
};

export type ThemeDetailResponse = {
  benchmark: string;
  period: string;
  composite: string;
  client: string | null;
  theme: { label: string; parts: { column: string; value: string }[] };
  benchmark_weight: number;
  benchmark_contribution: number;
  client_weight: number;
  client_contribution: number;
  active_weight: number;
  impact: number;
  impact_bps: number;
  managers: ThemeManagerRow[];
  reconciliation: {
    manager_weight_sum: number;
    manager_contribution_sum: number;
    matches_client: boolean;
  };
  error?: string;
};
