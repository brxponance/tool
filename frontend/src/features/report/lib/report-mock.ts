// Demo data for the printable Report tab. Ported verbatim from the legacy
// monolithic HTML app's REPORT_MOCK constant so the page-3 performance &
// complements tables render with realistic-looking placeholder content
// even when no live track-record / backtest data exists.

export type ReportMockHolding = {
  name: string;
  tab: string;
  weight: number;
  vg_3factor: number;
  vg_full: number;
  ns_z: number;
};

export type ReportMockExposureRow = {
  label: string;
  port: number;
  bmk: number;
  active: number;
};

export type ReportMockExposureGroup = {
  ow: ReportMockExposureRow[];
  uw: ReportMockExposureRow[];
};

export type ReportMockPlacement = {
  name: string;
  x: number;
  bucket: string;
  initial_bucket: string;
  v_vs_g: number;
  q_vs_d: number;
  v_pct: number;
  q_pct: number;
  current_weight: number;
  proposed_weight: number;
  downside_capture: number;
  is_defensive: boolean;
};

export type ReportMockMcrMgr = {
  name: string;
  base_weight: number;
  te_delta_pct: number;
  dd_delta_pct: number;
};

export type ReportMockPeriods = Record<
  "mrq" | "t1y" | "t3y" | "t5y" | "t10y" | "si",
  { port: number; bmk: number; clone?: number } | undefined
>;

export type ReportMockCalendarRow = {
  year: string;
  port: number;
  bmk: number;
  clone?: number;
};

export type ReportMockQtrRow = {
  qtr: string;
  port: number;
  bmk: number;
  clone?: number;
};

export type ReportMockPerf = {
  name: string;
  inception_date: string;
  periods: ReportMockPeriods;
  calendar: ReportMockCalendarRow[];
  quarterly_excess: ReportMockQtrRow[];
};

export type ReportMockComplementManager = {
  name: string;
  tab?: string;
  vg_3factor?: number;
  vg_full?: number;
  ns_z?: number;
  hit_rate: number;
  avg_excess: number;
  n_months: number;
};

export type ReportMockComplementFactor = {
  name: string;
  category: string;
  hit_rate: number;
  avg_excess: number;
  n_months: number;
};

export type ReportMockComplements = {
  benchmark_name: string;
  n_underperf_months: number;
  manager: ReportMockComplementManager;
  aapryl_factor: ReportMockComplementFactor;
  factset_risk: ReportMockComplementFactor;
};

export type ReportMockData = {
  client: string;
  benchmark: string;
  as_of: string;
  managers: ReportMockHolding[];
  portfolio_vg: { vg_3factor: number; vg_full: number };
  factset_risk: {
    factors: string[];
    current: Record<string, number>;
    benchmark: { matched_column: string };
  };
  market_cycle: ReportMockPlacement[];
  mcr: {
    base_te: number;
    base_dd: number;
    managers: ReportMockMcrMgr[];
  };
  exposures: {
    region: ReportMockExposureGroup;
    country: ReportMockExposureGroup;
    sector: ReportMockExposureGroup;
    industry: ReportMockExposureGroup;
  };
  perf_actual: ReportMockPerf;
  perf_backtested: ReportMockPerf;
  complements_actual: ReportMockComplements;
  complements_backtested: ReportMockComplements;
};

export const REPORT_MOCK: ReportMockData = {
  client: "Sample Pension Fund",
  benchmark: "MSCI ACWI",
  as_of: "2026-05-19",
  managers: [
    { name: "Aristotle Atlantic Partners — Core Equity", tab: "US LC", weight: 0.185, vg_3factor: -1.2, vg_full: -0.9, ns_z: 1.4 },
    { name: "Polen Capital — Focus Growth",              tab: "US LC", weight: 0.150, vg_3factor: -2.8, vg_full: -2.5, ns_z: 0.9 },
    { name: "Causeway International Value",              tab: "EAFE",  weight: 0.135, vg_3factor: 1.6,  vg_full: 1.9,  ns_z: 1.1 },
    { name: "WCM Focused International Growth",          tab: "EAFE",  weight: 0.120, vg_3factor: -2.2, vg_full: -2.0, ns_z: 1.6 },
    { name: "Fiera Global Equity",                       tab: "Global",weight: 0.115, vg_3factor: -0.4, vg_full: -0.2, ns_z: 0.4 },
    { name: "Sands Capital Select Growth",               tab: "US LC", weight: 0.100, vg_3factor: -3.1, vg_full: -2.7, ns_z: 0.7 },
    { name: "Pzena Emerging Markets",                    tab: "EM",    weight: 0.105, vg_3factor: 2.4,  vg_full: 2.6,  ns_z: 0.5 },
    { name: "Vontobel Emerging Markets",                 tab: "EM",    weight: 0.090, vg_3factor: -0.8, vg_full: -0.5, ns_z: 1.0 },
  ],
  portfolio_vg: { vg_3factor: -0.85, vg_full: -0.62 },
  factset_risk: {
    factors: [
      "Beta", "Book-to-Price", "Earnings Yield", "Dividend Yield", "Sales-to-Price",
      "Momentum", "Size", "Volatility", "Profitability", "Earnings Growth",
    ],
    current: {
      "Beta": -0.04,
      "Book-to-Price": -0.31,
      "Earnings Yield": -0.22,
      "Dividend Yield": -0.18,
      "Sales-to-Price": -0.15,
      "Momentum": 0.12,
      "Size": 0.08,
      "Volatility": 0.06,
      "Profitability": 0.41,
      "Earnings Growth": 0.36,
    },
    benchmark: { matched_column: "MSCI ACWI" },
  },
  market_cycle: [
    { name: "Causeway International Value",     x: 0.65, bucket: "Cyclical/Low Quality Value",  initial_bucket: "Cyclical/Low Quality Value",  v_vs_g: 1.62,  q_vs_d: -0.40, v_pct: 0.86, q_pct: 0.28, current_weight: 0.135, proposed_weight: 0.135, downside_capture: 102.4, is_defensive: false },
    { name: "Pzena Emerging Markets",           x: 0.95, bucket: "Relative/High Quality Value", initial_bucket: "Relative/High Quality Value", v_vs_g: 2.41,  q_vs_d: 0.15,  v_pct: 0.93, q_pct: 0.55, current_weight: 0.105, proposed_weight: 0.105, downside_capture: 98.1,  is_defensive: false },
    { name: "Aristotle Atlantic Partners",      x: 1.55, bucket: "GARP / Blend",                initial_bucket: "GARP / Blend",                v_vs_g: -0.20, q_vs_d: 0.42,  v_pct: 0.46, q_pct: 0.66, current_weight: 0.185, proposed_weight: 0.185, downside_capture: 91.7,  is_defensive: false },
    { name: "Fiera Global Equity",              x: 2.10, bucket: "High Quality / Stable Growth",initial_bucket: "High Quality / Stable Growth",v_vs_g: -0.42, q_vs_d: 1.10,  v_pct: 0.41, q_pct: 0.86, current_weight: 0.115, proposed_weight: 0.115, downside_capture: 84.2,  is_defensive: false },
    { name: "Vontobel Emerging Markets",        x: 2.30, bucket: "High Quality / Stable Growth",initial_bucket: "High Quality / Stable Growth",v_vs_g: -0.78, q_vs_d: 1.34,  v_pct: 0.34, q_pct: 0.90, current_weight: 0.090, proposed_weight: 0.090, downside_capture: 82.5,  is_defensive: false },
    { name: "WCM Focused International Growth", x: 2.85, bucket: "Cyclical / High Growth",      initial_bucket: "Cyclical / High Growth",      v_vs_g: -2.20, q_vs_d: 0.20,  v_pct: 0.10, q_pct: 0.58, current_weight: 0.120, proposed_weight: 0.120, downside_capture: 93.4,  is_defensive: false },
    { name: "Polen Capital Focus Growth",       x: 3.05, bucket: "Cyclical / High Growth",      initial_bucket: "Cyclical / High Growth",      v_vs_g: -2.55, q_vs_d: 0.08,  v_pct: 0.06, q_pct: 0.54, current_weight: 0.150, proposed_weight: 0.150, downside_capture: 88.6,  is_defensive: false },
    { name: "Sands Capital Select Growth",      x: 3.30, bucket: "Cyclical / High Growth",      initial_bucket: "Cyclical / High Growth",      v_vs_g: -3.10, q_vs_d: -0.05, v_pct: 0.03, q_pct: 0.48, current_weight: 0.100, proposed_weight: 0.100, downside_capture: 96.0,  is_defensive: false },
  ],
  mcr: {
    base_te: 0.0320,
    base_dd: 0.1140,
    managers: [
      { name: "Aristotle Atlantic Partners",  base_weight: 0.185, te_delta_pct: 0.0012,  dd_delta_pct: 0.0028 },
      { name: "Polen Capital Focus Growth",   base_weight: 0.150, te_delta_pct: 0.0024,  dd_delta_pct: 0.0042 },
      { name: "Causeway International Value", base_weight: 0.135, te_delta_pct: -0.0022, dd_delta_pct: -0.0034 },
      { name: "WCM Focused Intl Growth",      base_weight: 0.120, te_delta_pct: 0.0028,  dd_delta_pct: 0.0036 },
      { name: "Fiera Global Equity",          base_weight: 0.115, te_delta_pct: 0.0004,  dd_delta_pct: 0.0008 },
      { name: "Pzena Emerging Markets",       base_weight: 0.105, te_delta_pct: -0.0014, dd_delta_pct: -0.0026 },
      { name: "Sands Capital Select Growth",  base_weight: 0.100, te_delta_pct: 0.0042,  dd_delta_pct: 0.0058 },
      { name: "Vontobel Emerging Markets",    base_weight: 0.090, te_delta_pct: -0.0003, dd_delta_pct: -0.0010 },
    ],
  },
  exposures: {
    region: {
      ow: [
        { label: "North America",     port: 0.612, bmk: 0.560, active: 0.052 },
        { label: "Europe ex-UK",      port: 0.158, bmk: 0.127, active: 0.031 },
        { label: "Emerging Markets",  port: 0.135, bmk: 0.115, active: 0.020 },
      ],
      uw: [
        { label: "United Kingdom",    port: 0.030, bmk: 0.075, active: -0.045 },
        { label: "Japan",             port: 0.045, bmk: 0.075, active: -0.030 },
        { label: "Asia ex-Japan (DM)",port: 0.020, bmk: 0.048, active: -0.028 },
      ],
    },
    country: {
      ow: [
        { label: "United States", port: 0.582, bmk: 0.514, active: 0.068 },
        { label: "France",        port: 0.066, bmk: 0.042, active: 0.024 },
        { label: "India",         port: 0.038, bmk: 0.019, active: 0.019 },
      ],
      uw: [
        { label: "United Kingdom",port: 0.030, bmk: 0.075, active: -0.045 },
        { label: "Japan",         port: 0.045, bmk: 0.075, active: -0.030 },
        { label: "China",         port: 0.014, bmk: 0.040, active: -0.026 },
      ],
    },
    sector: {
      ow: [
        { label: "Information Technology", port: 0.286, bmk: 0.238, active: 0.048 },
        { label: "Health Care",            port: 0.156, bmk: 0.124, active: 0.032 },
        { label: "Consumer Discretionary", port: 0.131, bmk: 0.115, active: 0.016 },
      ],
      uw: [
        { label: "Financials", port: 0.114, bmk: 0.149, active: -0.035 },
        { label: "Energy",     port: 0.014, bmk: 0.042, active: -0.028 },
        { label: "Materials",  port: 0.020, bmk: 0.041, active: -0.021 },
      ],
    },
    industry: {
      ow: [
        { label: "Software",       port: 0.118, bmk: 0.084, active: 0.034 },
        { label: "Biotechnology",  port: 0.061, bmk: 0.039, active: 0.022 },
        { label: "Semiconductors", port: 0.082, bmk: 0.063, active: 0.019 },
      ],
      uw: [
        { label: "Banks",                          port: 0.046, bmk: 0.077, active: -0.031 },
        { label: "Oil & Gas Exploration & Prod.",  port: 0.005, bmk: 0.029, active: -0.024 },
        { label: "Insurance",                      port: 0.018, bmk: 0.033, active: -0.015 },
      ],
    },
  },
  perf_actual: {
    name: "Client Track Record",
    inception_date: "2014-04-01",
    periods: {
      mrq:  { port: 0.0312, bmk: 0.0285 },
      t1y:  { port: 0.1428, bmk: 0.1306 },
      t3y:  { port: 0.0892, bmk: 0.0784 },
      t5y:  { port: 0.1015, bmk: 0.0941 },
      t10y: { port: 0.0876, bmk: 0.0815 },
      si:   { port: 0.0934, bmk: 0.0862 },
    },
    calendar: [
      { year: "2025", port: 0.1842, bmk: 0.1654 },
      { year: "2024", port: 0.2274, bmk: 0.2103 },
      { year: "2023", port: 0.1986, bmk: 0.1837 },
      { year: "2022", port: -0.1684, bmk: -0.1810 },
      { year: "2021", port: 0.1542, bmk: 0.1432 },
    ],
    quarterly_excess: [
      { qtr: "Q1 2026", port: 0.0312, bmk: 0.0285 },
      { qtr: "Q4 2025", port: 0.0648, bmk: 0.0571 },
      { qtr: "Q3 2025", port: 0.0285, bmk: 0.0324 },
      { qtr: "Q2 2025", port: 0.0412, bmk: 0.0398 },
      { qtr: "Q1 2025", port: 0.0398, bmk: 0.0334 },
      { qtr: "Q4 2024", port: 0.0102, bmk: 0.0156 },
      { qtr: "Q3 2024", port: 0.0612, bmk: 0.0528 },
      { qtr: "Q2 2024", port: 0.0531, bmk: 0.0498 },
      { qtr: "Q1 2024", port: 0.0884, bmk: 0.0795 },
      { qtr: "Q4 2023", port: 0.0735, bmk: 0.0682 },
      { qtr: "Q3 2023", port: -0.0234, bmk: -0.0278 },
      { qtr: "Q2 2023", port: 0.0512, bmk: 0.0467 },
      { qtr: "Q1 2023", port: 0.0876, bmk: 0.0823 },
      { qtr: "Q4 2022", port: 0.0987, bmk: 0.0934 },
      { qtr: "Q3 2022", port: -0.0612, bmk: -0.0682 },
      { qtr: "Q2 2022", port: -0.1521, bmk: -0.1543 },
      { qtr: "Q1 2022", port: -0.0512, bmk: -0.0556 },
      { qtr: "Q4 2021", port: 0.0521, bmk: 0.0489 },
      { qtr: "Q3 2021", port: -0.0078, bmk: -0.0112 },
      { qtr: "Q2 2021", port: 0.0612, bmk: 0.0578 },
      { qtr: "Q1 2021", port: 0.0421, bmk: 0.0376 },
    ],
  },
  perf_backtested: {
    name: "Current Portfolio (Backtested)",
    inception_date: "2014-04-01",
    periods: {
      mrq:  { port: 0.0298, bmk: 0.0285, clone: 0.0276 },
      t1y:  { port: 0.1395, bmk: 0.1306, clone: 0.1248 },
      t3y:  { port: 0.0856, bmk: 0.0784, clone: 0.0742 },
      t5y:  { port: 0.0987, bmk: 0.0941, clone: 0.0908 },
      t10y: { port: 0.0843, bmk: 0.0815, clone: 0.0784 },
      si:   { port: 0.0901, bmk: 0.0862, clone: 0.0829 },
    },
    calendar: [
      { year: "2025", port: 0.1798, bmk: 0.1654, clone: 0.1632 },
      { year: "2024", port: 0.2231, bmk: 0.2103, clone: 0.2058 },
      { year: "2023", port: 0.1923, bmk: 0.1837, clone: 0.1782 },
      { year: "2022", port: -0.1721, bmk: -0.1810, clone: -0.1856 },
      { year: "2021", port: 0.1487, bmk: 0.1432, clone: 0.1389 },
    ],
    quarterly_excess: [
      { qtr: "Q1 2026", port: 0.0298, bmk: 0.0285, clone: 0.0276 },
      { qtr: "Q4 2025", port: 0.0623, bmk: 0.0571, clone: 0.0548 },
      { qtr: "Q3 2025", port: 0.0271, bmk: 0.0324, clone: 0.0335 },
      { qtr: "Q2 2025", port: 0.0402, bmk: 0.0398, clone: 0.0386 },
      { qtr: "Q1 2025", port: 0.0385, bmk: 0.0334, clone: 0.0312 },
      { qtr: "Q4 2024", port: 0.0095, bmk: 0.0156, clone: 0.0171 },
      { qtr: "Q3 2024", port: 0.0598, bmk: 0.0528, clone: 0.0512 },
      { qtr: "Q2 2024", port: 0.0518, bmk: 0.0498, clone: 0.0476 },
      { qtr: "Q1 2024", port: 0.0866, bmk: 0.0795, clone: 0.0782 },
      { qtr: "Q4 2023", port: 0.0712, bmk: 0.0682, clone: 0.0654 },
      { qtr: "Q3 2023", port: -0.0256, bmk: -0.0278, clone: -0.0298 },
      { qtr: "Q2 2023", port: 0.0495, bmk: 0.0467, clone: 0.0432 },
      { qtr: "Q1 2023", port: 0.0852, bmk: 0.0823, clone: 0.0789 },
      { qtr: "Q4 2022", port: 0.0964, bmk: 0.0934, clone: 0.0892 },
      { qtr: "Q3 2022", port: -0.0641, bmk: -0.0682, clone: -0.0712 },
      { qtr: "Q2 2022", port: -0.1532, bmk: -0.1543, clone: -0.1578 },
      { qtr: "Q1 2022", port: -0.0524, bmk: -0.0556, clone: -0.0598 },
      { qtr: "Q4 2021", port: 0.0504, bmk: 0.0489, clone: 0.0467 },
      { qtr: "Q3 2021", port: -0.0093, bmk: -0.0112, clone: -0.0128 },
      { qtr: "Q2 2021", port: 0.0597, bmk: 0.0578, clone: 0.0552 },
      { qtr: "Q1 2021", port: 0.0411, bmk: 0.0376, clone: 0.0348 },
    ],
  },
  complements_actual: {
    benchmark_name: "MSCI ACWI",
    n_underperf_months: 24,
    manager: {
      name: "WCM Focused International Growth", tab: "EAFE",
      vg_3factor: -2.2, vg_full: -2.0, ns_z: 1.6,
      hit_rate: 0.708, avg_excess: 0.0086, n_months: 17,
    },
    aapryl_factor: {
      name: "Quality", category: "Aapryl Style Factor",
      hit_rate: 0.667, avg_excess: 0.0073, n_months: 16,
    },
    factset_risk: {
      name: "Profitability", category: "FactSet Global Risk Factor",
      hit_rate: 0.625, avg_excess: 0.0061, n_months: 15,
    },
  },
  complements_backtested: {
    benchmark_name: "MSCI ACWI",
    n_underperf_months: 26,
    manager: {
      name: "Vontobel Emerging Markets", tab: "EM",
      vg_3factor: -0.8, vg_full: -0.5, ns_z: 1.0,
      hit_rate: 0.692, avg_excess: 0.0079, n_months: 18,
    },
    aapryl_factor: {
      name: "Low Volatility", category: "Aapryl Style Factor",
      hit_rate: 0.654, avg_excess: 0.0068, n_months: 17,
    },
    factset_risk: {
      name: "Size", category: "FactSet Global Risk Factor",
      hit_rate: 0.615, avg_excess: 0.0054, n_months: 16,
    },
  },
};
