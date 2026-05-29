export type ManagerDirectoryItem = {
  name: string;
  tab: string;
  r2_full: number | null;
  vg_full: number;
  ns_z: number | null;
};

export type ManagerDirectoryResponse = {
  managers: ManagerDirectoryItem[];
};

export type ManagerRecommendation = {
  name: string;
  tab: string;
  score: number;
  footprint_similarity: number;
  risk_similarity: number;
  vg_full: number;
  vg_gap: number;
  r2_full: number | null;
  r2_delta: number | null;
  ns_z: number | null;
  ns_z_delta: number | null;
  vol_36m: number | null;
  vol_delta: number | null;
  downside_dev_36m: number | null;
  downside_delta: number | null;
  reasons: string[];
};

export type ManagerRecommendationsResponse = {
  reference: {
    name: string;
    tab: string;
    ns_z: number | null;
    vol_36m: number | null;
    downside_dev_36m: number | null;
  };
  closest_matches: ManagerRecommendation[];
  skill_upgrades: ManagerRecommendation[];
  lower_risk_matches: ManagerRecommendation[];
  scope: string;
};

export type ManagerRawDetail = {
  r2_full: number | null;
  ns_z: number | null;
  ns_skill?: number | null;
  style_buckets: Record<string, number>;
  betas_full: Record<string, number>;
};

export type PeriodReturnKey = "qtd" | "ytd" | "t1" | "t3" | "t5" | "si";
export type PeriodReturnSeriesKey = "mgr" | "clone" | "bench";
export type PeriodReturnSeries = Record<PeriodReturnKey, number | null>;

export type ManagerSkillSummary = {
  name: string;
  tab: string;
  benchmark_name: string;
  skill_periods: Record<string, number | null>;
  cumulative_skill: Array<number | null>;
  dates: string[];
  period_returns: Record<PeriodReturnSeriesKey, PeriodReturnSeries>;
  betas_full: Record<string, number>;
  style_buckets: Record<string, number>;
  r2_full: number | null;
};

export type ManagerDetailScreenData = {
  raw: ManagerRawDetail;
  summary: ManagerSkillSummary;
  recommendations: ManagerRecommendationsResponse;
};

// Active style factor exposures for a single manager. Same response shape
// as the Portfolio tab's risk exposures, but `current` reflects this
// manager's active exposure vs benchmark (no `proposed` distinction).
export type ManagerRiskExposuresResponse = {
  factors: string[];
  current: Record<string, number | null>;
  proposed: Record<string, number | null>;
  delta: Record<string, number | null>;
  benchmark?: {
    requested?: string;
    matched_column?: string;
    available_columns?: string[];
    fallback_absolute?: boolean;
  };
  error?: string;
};

export type ManagerExposureMenuGroup = {
  group: string;
  cols: Array<{ col: string; label: string }>;
};

export type ManagerPortfolioExposuresMenuResponse = {
  menu: ManagerExposureMenuGroup[];
  available_benchmarks: string[];
  default_benchmark: string;
};

export type ManagerExposureRow = {
  label: string;
  benchmark: number;
  current: number;
  proposed: number;
  delta_current: number;
  delta_proposed: number;
  insufficient_data?: boolean;
  range_label?: string;
  children?: ManagerExposureRow[];
};

export type ManagerPortfolioExposuresResponse = {
  grouping: string;
  display_label: string;
  group_category: string;
  is_categorical: boolean;
  is_nested?: boolean;
  rows: ManagerExposureRow[];
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