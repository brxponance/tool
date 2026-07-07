export type BackendStatus = {
  has_results: boolean;
  has_weights: boolean;
  has_risk: boolean;
  has_security_risk: boolean;
  has_universe: boolean;
  universe_tabs: string[];
  universe_files_staged: string[];
  has_exposures: boolean;
  exposures_benchmark: string;
  exposures_managers: string[];
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