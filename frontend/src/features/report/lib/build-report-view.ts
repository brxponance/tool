import type {
  MarketCycleResponse,
  PortfolioExposuresResponse,
  RiskAnalysisResponse,
  RiskExposuresResponse,
} from "@/features/portfolio/types";

import type { ExposuresPack } from "../hooks/use-report-screen";
import type {
  ReportMockComplements,
  ReportMockData,
  ReportMockExposureGroup,
  ReportMockMcrMgr,
  ReportMockPerf,
  ReportMockPeriods,
  ReportMockPlacement,
} from "./report-mock";
import { REPORT_MOCK } from "./report-mock";
import type {
  ReportComplements as RealComplements,
  ReportPayload,
} from "../types";

// ── FactSet Risk ─────────────────────────────────────────────────────────
function realFactsetRisk(
  re: RiskExposuresResponse | null,
  benchmark: string,
): ReportMockData["factset_risk"] | null {
  if (!re || !re.factors?.length) return null;
  const current: Record<string, number> = {};
  for (const f of re.factors) {
    const v = re.current?.[f];
    if (v != null) current[f] = v;
  }
  return {
    factors: re.factors,
    current,
    benchmark: {
      matched_column: re.benchmark?.matched_column ?? benchmark,
    },
  };
}

// ── Market Cycle ─────────────────────────────────────────────────────────
function realMarketCycle(
  mc: MarketCycleResponse | null,
): ReportMockPlacement[] | null {
  if (!mc?.current?.length) return null;
  return mc.current.map((p) => ({
    name: p.name,
    x: p.x ?? 2.0,
    bucket: p.bucket ?? "",
    initial_bucket: p.initial_bucket ?? p.bucket ?? "",
    v_vs_g: p.v_vs_g ?? 0,
    q_vs_d: p.q_vs_d ?? 0,
    v_pct: p.v_pct ?? 0.5,
    q_pct: p.q_pct ?? 0.5,
    current_weight: p.current_weight ?? 0,
    proposed_weight: p.proposed_weight ?? 0,
    downside_capture: p.downside_capture ?? 100,
    is_defensive: !!p.is_defensive,
  }));
}

// ── MCR ──────────────────────────────────────────────────────────────────
function realMcr(
  ra: RiskAnalysisResponse | null,
): ReportMockData["mcr"] | null {
  if (!ra?.marginal?.current) return null;
  const cur = ra.marginal.current;
  if (!cur.managers?.length) return null;
  const mgrs: ReportMockMcrMgr[] = cur.managers.map((m) => ({
    name: m.name,
    base_weight: m.base_weight ?? 0,
    te_delta_pct: m.te_delta_pct ?? 0,
    dd_delta_pct: m.dd_delta_pct ?? 0,
  }));
  return {
    base_te: cur.base_te ?? 0,
    base_dd: cur.base_dd ?? 0,
    managers: mgrs,
  };
}

// ── Exposures: pick top 3 OW / UW from real data ─────────────────────────
function topOwUw(
  data: PortfolioExposuresResponse | null,
): ReportMockExposureGroup | null {
  if (!data?.rows?.length) return null;
  const usable = data.rows
    .filter(
      (r) =>
        r.label !== "Unclassified" &&
        !r.insufficient_data &&
        (r.benchmark || r.current),
    )
    .map((r) => ({
      label: r.label,
      port: (r.current || 0) / 100,
      bmk: (r.benchmark || 0) / 100,
      active: (r.delta_current || 0) / 100,
    }));
  if (!usable.length) return null;
  const sorted = [...usable].sort((a, b) => b.active - a.active);
  return {
    ow: sorted.slice(0, 3).filter((r) => r.active > 0),
    uw: sorted
      .slice(-3)
      .reverse()
      .filter((r) => r.active < 0),
  };
}

function realExposures(
  exposures: ExposuresPack,
): ReportMockData["exposures"] | null {
  const r = topOwUw(exposures.Region);
  const c = topOwUw(exposures.Country);
  const s = topOwUw(exposures.Sector);
  const i = topOwUw(exposures.Industry);
  if (!r && !c && !s && !i) return null;
  return {
    region:   r ?? REPORT_MOCK.exposures.region,
    country:  c ?? REPORT_MOCK.exposures.country,
    sector:   s ?? REPORT_MOCK.exposures.sector,
    industry: i ?? REPORT_MOCK.exposures.industry,
  };
}

// ── Performance + complements (real → mock-compatible) ───────────────────
function realPerf(payload: ReportPayload): ReportMockPerf | null {
  const p = payload.perf_backtested;
  if (!p) return null;
  // ReportPeriods (real) uses `null` for missing buckets; ReportMockPeriods
  // uses `undefined`. Coerce null→undefined so the type matches.
  const periods: ReportMockPeriods = {
    mrq:  p.periods.mrq  ?? undefined,
    t1y:  p.periods.t1y  ?? undefined,
    t3y:  p.periods.t3y  ?? undefined,
    t5y:  p.periods.t5y  ?? undefined,
    t10y: p.periods.t10y ?? undefined,
    si:   p.periods.si   ?? undefined,
  };
  return {
    name: p.name,
    inception_date: p.inception_date,
    periods,
    calendar: p.calendar,
    quarterly_excess: p.quarterly_excess,
  };
}

function realComplements(c: RealComplements | undefined): ReportMockComplements | null {
  if (!c) return null;
  return {
    benchmark_name: c.benchmark_name,
    n_underperf_months: c.n_underperf_months,
    manager: c.manager
      ? {
          name: c.manager.name,
          tab: c.manager.tab,
          vg_3factor: c.manager.vg_3factor,
          vg_full: c.manager.vg_full,
          ns_z: c.manager.ns_z ?? undefined,
          hit_rate: c.manager.hit_rate,
          avg_excess: c.manager.avg_excess,
          n_months: c.manager.n_months,
        }
      : REPORT_MOCK.complements_backtested.manager,
    aapryl_factor: c.aapryl_factor
      ? {
          name: c.aapryl_factor.name,
          category: c.aapryl_factor.category,
          hit_rate: c.aapryl_factor.hit_rate,
          avg_excess: c.aapryl_factor.avg_excess,
          n_months: c.aapryl_factor.n_months,
        }
      : REPORT_MOCK.complements_backtested.aapryl_factor,
    factset_risk: c.factset_risk
      ? {
          name: c.factset_risk.name,
          category: c.factset_risk.category,
          hit_rate: c.factset_risk.hit_rate,
          avg_excess: c.factset_risk.avg_excess,
          n_months: c.factset_risk.n_months,
        }
      : REPORT_MOCK.complements_backtested.factset_risk,
  };
}

// ── Top-level: merge real data with mock fallbacks ───────────────────────
export type ReportView = {
  data: ReportMockData;
  // True for sections that fell back to mock content because real data
  // wasn't available (e.g. no FactSet exposures file uploaded yet).
  realSections: {
    holdings: boolean;
    portfolio_vg: boolean;
    factset_risk: boolean;
    exposures: boolean;
    market_cycle: boolean;
    mcr: boolean;
    perf_backtested: boolean;
    complements_backtested: boolean;
  };
};

export function buildReportView({
  report,
  riskExposures,
  marketCycle,
  riskAnalysis,
  exposures,
}: {
  report: ReportPayload | null;
  riskExposures: RiskExposuresResponse | null;
  marketCycle: MarketCycleResponse | null;
  riskAnalysis: RiskAnalysisResponse | null;
  exposures: ExposuresPack;
}): ReportView {
  const haveReport = !!(report && !report.error);

  // Holdings + portfolio V-G straight from /portfolio_report
  const holdings = haveReport && report!.managers?.length
    ? report!.managers.map((m) => ({
        name: m.name,
        tab: m.tab,
        weight: m.weight,
        vg_3factor: m.vg_3factor,
        vg_full: m.vg_full,
        ns_z: m.ns_z ?? 0,
      }))
    : REPORT_MOCK.managers;

  const portfolio_vg = haveReport
    ? report!.portfolio_vg
    : REPORT_MOCK.portfolio_vg;

  // FactSet Risk
  const realRisk = realFactsetRisk(
    riskExposures,
    haveReport ? report!.benchmark_name : REPORT_MOCK.benchmark,
  );
  const factset_risk = realRisk ?? REPORT_MOCK.factset_risk;

  // Exposures
  const realExp = realExposures(exposures);
  const expData = realExp ?? REPORT_MOCK.exposures;

  // Market Cycle
  const realMc = realMarketCycle(marketCycle);
  const market_cycle = realMc ?? REPORT_MOCK.market_cycle;

  // MCR
  const realM = realMcr(riskAnalysis);
  const mcr = realM ?? REPORT_MOCK.mcr;

  // Performance + complements
  const realP = haveReport ? realPerf(report!) : null;
  const perf_backtested = realP ?? REPORT_MOCK.perf_backtested;
  const realC = haveReport ? realComplements(report!.complements_backtested) : null;
  const complements_backtested = realC ?? REPORT_MOCK.complements_backtested;

  const data: ReportMockData = {
    client: haveReport ? report!.client : REPORT_MOCK.client,
    benchmark: haveReport
      ? report!.benchmark || report!.benchmark_name
      : REPORT_MOCK.benchmark,
    as_of: haveReport ? (report!.as_of ?? REPORT_MOCK.as_of) : REPORT_MOCK.as_of,
    managers: holdings,
    portfolio_vg,
    factset_risk,
    market_cycle,
    mcr,
    exposures: expData,
    perf_actual: REPORT_MOCK.perf_actual,
    perf_backtested,
    complements_actual: REPORT_MOCK.complements_actual,
    complements_backtested,
  };

  return {
    data,
    realSections: {
      holdings: haveReport && (report!.managers?.length ?? 0) > 0,
      portfolio_vg: haveReport,
      factset_risk: !!realRisk,
      exposures: !!realExp,
      market_cycle: !!realMc,
      mcr: !!realM,
      perf_backtested: !!realP,
      complements_backtested: !!realC,
    },
  };
}
