// Shape returned by GET /portfolio_report/<client>. Mirrors the legacy
// REPORT_MOCK structure but computed from real clone_results + weights +
// factor returns. Page-3 "Actual" sections are intentionally absent —
// they require a client-track-record file upload we don't support yet.

export type ReportHolding = {
  name: string;
  tab: string;
  weight: number;
  vg_3factor: number;
  vg_full: number;
  ns_z: number | null;
};

export type ReportPeriods = {
  mrq:  { port: number; bmk: number; clone?: number } | null;
  t1y:  { port: number; bmk: number; clone?: number } | null;
  t3y:  { port: number; bmk: number; clone?: number } | null;
  t5y:  { port: number; bmk: number; clone?: number } | null;
  t10y: { port: number; bmk: number; clone?: number } | null;
  si:   { port: number; bmk: number; clone?: number } | null;
};

export type ReportCalendarRow = {
  year: string;
  port: number;
  bmk: number;
  clone?: number;
};

export type ReportQuarterRow = {
  qtr: string;          // "Q1 2026"
  port: number;
  bmk: number;
  clone?: number;
};

export type ReportPerf = {
  name: string;
  inception_date: string;
  periods: ReportPeriods;
  calendar: ReportCalendarRow[];
  quarterly_excess: ReportQuarterRow[];
};

export type ReportComplementManager = {
  name: string;
  tab: string;
  vg_3factor: number;
  vg_full: number;
  ns_z: number | null;
  hit_rate: number;
  avg_excess: number;
  n_months: number;
} | null;

export type ReportComplementFactor = {
  name: string;
  category: string;
  hit_rate: number;
  avg_excess: number;
  n_months: number;
  n_underperf_months?: number;
} | null;

export type ReportComplements = {
  benchmark_name: string;
  n_underperf_months: number;
  manager: ReportComplementManager;
  aapryl_factor: ReportComplementFactor;
  factset_risk: ReportComplementFactor;
};

export type ReportPayload = {
  client: string;
  benchmark: string;
  benchmark_name: string;
  peer_benchmark: string;
  as_of: string | null;
  inception_date: string;
  n_underperf_months: number;
  managers: ReportHolding[];
  portfolio_vg: { vg_3factor: number; vg_full: number };
  perf_backtested: ReportPerf;
  complements_backtested: ReportComplements;
  error?: string;
};
