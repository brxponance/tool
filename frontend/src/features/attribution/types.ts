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
  benchmarks: Record<string, string>;
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
  // phi and ratio are null whenever |R_b| sits below the server's floor, where
  // a share-of-benchmark-return figure is meaningless. Never sort on them.
  phi: number | null;
  ratio: number | null;
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
