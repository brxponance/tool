export type PortfolioManager = {
  matched_name: string;
  tab: string;
  current_weight: number;
  proposed_weight: number;
  r2_full: number | null;
  r2_3factor?: number | null;
  ns_z: number | null;
  ns_skill?: number | null;
  vg_full: number;
  vg_3factor?: number;
  pct_small: number;
  pct_em: number;
  style_buckets: Record<string, number>;
  weight_file_name?: string;
  betas_full?: Record<string, number>;
  ns_n_obs?: number | null;
  ns_n_peers?: number | null;
  ns_adj_method?: string | null;
  ns_last_month?: string | null;
  betas_3factor?: Record<string, number>;
  // True when this manager exists in the weights file but has no clone
  // data (newly-funded manager with <3 years of returns). Style buckets
  // are editable via /placeholder_buckets.
  is_placeholder?: boolean;
};

export type PortfolioManagerCatalogItem = {
  name: string;
  tab: string;
  peer_group: string;
  vg_full: number;
  vg_3factor?: number | null;
  r2_full: number | null;
  ns_z: number | null;
};

export type PortfolioManagerCatalogResponse = {
  managers: PortfolioManagerCatalogItem[];
};

export type PortfolioManagerDetailResponse = {
  vg_full?: number | null;
  vg_3factor?: number | null;
  style_buckets: Record<string, number>;
  r2_full: number | null;
  r2_3factor?: number | null;
  betas_full: Record<string, number>;
  betas_3factor?: Record<string, number>;
  pct_small?: number | null;
  pct_em?: number | null;
  ns_z: number | null;
  ns_skill?: number | null;
  ns_n_obs?: number | null;
  ns_n_peers?: number | null;
  ns_adj_method?: string | null;
  ns_last_month?: string | null;
  error?: string;
};

export type PortfolioResponse = {
  client: string;
  client_benchmark?: string;
  managers: PortfolioManager[];
  unmatched: string[];
};

export type PortfolioStats = {
  current: Record<string, number>;
  proposed: Record<string, number>;
  delta: Record<string, number>;
  edge_current: {
    z: number | null;
    covered_weight: number;
    total_weight: number;
  };
  edge_proposed: {
    z: number | null;
    covered_weight: number;
    total_weight: number;
  };
};

export type RiskExposuresResponse = {
  factors: string[];
  current: Record<string, number | null>;
  proposed: Record<string, number | null>;
  delta: Record<string, number | null>;
  unmatched: string[];
  benchmark?: {
    requested?: string;
    matched_column?: string;
    available_columns?: string[];
    fallback_absolute?: boolean;
  };
  error?: string;
};

export type RiskScenarioMetrics = {
  upside_capture: number | null;
  downside_capture: number | null;
  tracking_error: number | null;
  beta: number | null;
};

export type RiskScenarioSide = {
  max_drawdown: number | null;
  core: RiskScenarioMetrics | null;
  value_tilted: RiskScenarioMetrics | null;
  growth_tilted: RiskScenarioMetrics | null;
  infl_sensitive: RiskScenarioMetrics | null;
};

export type MarginalContributionRow = {
  name: string;
  base_weight: number;
  te_new: number | null;
  te_delta_pct: number | null;
  dd_new: number | null;
  dd_delta_pct: number | null;
};

export type MarginalContributionSide = {
  base_te: number | null;
  base_dd: number | null;
  managers: MarginalContributionRow[];
};

export type RegimeBlock = {
  n_months: number;
  current: {
    avg_return: number | null;
    downside_dev: number | null;
  } | null;
  proposed: {
    avg_return: number | null;
    downside_dev: number | null;
  } | null;
};

export type RiskAnalysisResponse = {
  peer_group: string;
  n_months: number;
  n_capture: number;
  start_date: string | null;
  end_date: string | null;
  has_infl: boolean;
  benchmarks: {
    core?: string;
    value_tilted?: string;
    growth_tilted?: string;
    infl_sensitive?: string | null;
  };
  scenario: {
    current: RiskScenarioSide;
    proposed: RiskScenarioSide;
  };
  marginal: {
    current: MarginalContributionSide;
    proposed: MarginalContributionSide;
  };
  regime: {
    value_outperform: RegimeBlock | null;
    growth_outperform: RegimeBlock | null;
  };
  error?: string;
};

export type ContributionManager = {
  name: string;
  weight: number;
  benchmark_name: string;
  vg_full: number;
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
  error?: string;
};

export type MarketCyclePlacement = {
  name: string;
  tab: string;
  bucket: string;
  initial_bucket: string;
  current_weight: number;
  proposed_weight: number;
  v_pct: number;
  q_pct: number;
  v_vs_g?: number;
  q_vs_d?: number;
  x?: number | null;
  downside_capture?: number | null;
  is_defensive?: boolean;
  // Client-side override fields populated by mcApplyOverrides
  is_override?: boolean;
  _original_bucket?: string;
  _original_x?: number | null;
};

export type MarketCycleResponse = {
  current: MarketCyclePlacement[];
  proposed: MarketCyclePlacement[];
  tabs_without_universe: string[];
  n_total: number;
  error?: string;
  missing_universe?: boolean;
};

export type ExposureMenuGroup = {
  group: string;
  cols: Array<{
    col: string;
    label: string;
  }>;
};

export type PortfolioExposureRow = {
  label: string;
  benchmark: number;
  current: number;
  proposed: number;
  delta_current: number;
  delta_proposed: number;
  insufficient_data?: boolean;
  range_label?: string;
  children?: PortfolioExposureRow[];
};

export type PortfolioExposuresMenuResponse = {
  menu: ExposureMenuGroup[];
  available_benchmarks: string[];
  default_benchmark: string;
};

export type PortfolioExposuresResponse = {
  grouping: string;
  display_label: string;
  group_category: string;
  is_categorical: boolean;
  is_nested?: boolean;
  rows: PortfolioExposureRow[];
  matched: string[];
  unmatched: string[];
  coverage_current: number;
  coverage_proposed: number;
  benchmark_coverage: number;
  benchmark_name: string;
  benchmark_requested?: string;
  benchmark_fallback: boolean;
  available_benchmarks: string[];
  sub_grouping?: string;
  sub_label?: string;
  error?: string;
};

export type ClientsResponse = {
  clients: string[];
  benchmarks: Record<string, string>;
};

export type IdealComplementCandidate = {
  name: string;
  matched_name: string;
  tab: string;
  peer_group: string;
  hit_rate: number;
  avg_excess: number;
  n_months: number;
  vg_full: number;
  vg_3factor: number;
  r2_full: number | null;
  r2_3factor: number | null;
  style_buckets: Record<string, number>;
  pct_small: number;
  pct_em: number;
  ns_z: number | null;
  ns_skill: number | null;
  ns_n_obs: number | null;
  ns_n_peers: number | null;
  current_weight: number;
  proposed_weight: number;
};

export type IdealComplementResponse = {
  best?: IdealComplementCandidate;
  n_underperform_months?: number;
  n_candidates_considered?: number;
  eligible_tabs?: string[];
  peer_benchmark?: string;
  benchmark_name?: string;
  error?: string;
};

export type PlaceholderBucketUpdateResponse = {
  status: "ok" | "error";
  buckets?: Record<string, number> | null;
  message?: string;
};