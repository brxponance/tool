export type BackendStatus = {
  has_results: boolean;
  has_weights: boolean;
  has_security_risk: boolean;
  has_universe: boolean;
  universe_tabs: string[];
  universe_files_staged: string[];
  has_exposures: boolean;
  // The exposures upload returns before parsing finishes — a large pull takes
  // around 95s, far past the proxy's patience. Poll these instead.
  exposures_parsing: boolean;
  exposures_parse_error: string | null;
  exposures_benchmark: string;
  exposures_managers: string[];
  has_attribution: boolean;
  attribution_periods: string[];
  attribution_quarter: string;
  attribution_benchmarks: string[];
  has_qualitative: boolean;
  qualitative_firms: number;
  qualitative_strategies: number;
  files: Record<string, string | Record<string, string>>;
  clone_stale: boolean;
  clone_run_files: Record<string, string>;
};

export type ClientsSnapshot = {
  clients: string[];
  benchmarks: Record<string, string>;
};

export type SetupSnapshot = {
  status: BackendStatus;
  clients: string[];
  benchmarks: Record<string, string>;
};