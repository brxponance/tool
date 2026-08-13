import { formatNumber, formatPercent } from "@/lib/utils";

import type {
  ExposureMenuGroup,
  ManagerStruggleResponse,
  MarketCycleResponse,
  PortfolioExposuresResponse,
  PortfolioManager,
  PortfolioStats,
  RiskAnalysisResponse,
  RiskExposuresResponse,
} from "../types";
import { OverlapSection } from "@/features/overlap/components/overlap-section";
import type { OverlapManagerInput } from "@/features/overlap/types";

import { ClientRedemptionSection } from "./client-redemption-section";
import { DiverseOwnershipSection } from "./diverse-ownership-section";
import { MarginalContributionChart } from "./marginal-contribution-chart";
import { MarketCycleSection } from "./market-cycle-section";
import { PortfolioExposuresSection } from "./portfolio-exposures-section";

const STYLE_METRICS = [
  { label: "Core", key: "Core" },
  { label: "Value", key: "Value" },
  { label: "Growth", key: "Growth" },
  { label: "Yield", key: "Yield" },
  { label: "Quality", key: "Quality" },
  { label: "Dynamic", key: "Dynamic" },
  { label: "Defensive", key: "Defensive" },
  { label: "Low Vol", key: "Low Vol" },
  { label: "% Small", key: "pct_small" },
  { label: "% EM", key: "pct_em" },
] as const;

function deltaClassName(value: number) {
  if (value > 0.005) {
    return "delta-pos";
  }
  if (value < -0.005) {
    return "delta-neg";
  }
  return "delta-zero";
}

function valueColorClass(value: number) {
  if (value > 0.05) {
    return "val-pos";
  }
  if (value < -0.05) {
    return "val-neg";
  }
  return "val-neu";
}

function metricValue(metrics: Record<string, number> | null | undefined, key: string) {
  return metrics?.[key] ?? 0;
}

function formatSignedDecimal(value: number | null | undefined, digits = 3) {
  if (value == null || Number.isNaN(value)) {
    return "--";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}`;
}

function formatSignedPercent(value: number | null | undefined, digits = 2) {
  if (value == null || Number.isNaN(value)) {
    return "--";
  }
  const scaled = value * 100;
  const sign = scaled > 0 ? "+" : "";
  return `${sign}${scaled.toFixed(digits)}%`;
}

function fieldLabel(groups: ExposureMenuGroup[]) {
  const flat = groups.flatMap((group) => group.cols);
  return (value: string | null) => flat.find((item) => item.col === value)?.label ?? value ?? "Group";
}

const STRUGGLE_COLS = 8;

// SPIVA-style breadth: how the book behaved during sustained stretches when
// active managers as a group lagged the benchmark. Renders a placeholder when
// no universe returns are loaded for the client's peer group (the analysis
// needs the actual peer universe, not just the buy list).
function ManagerStruggleSection({
  struggle,
}: {
  struggle: ManagerStruggleResponse | null;
}) {
  const pctBeat = struggle ? Math.round((1 - struggle.threshold) * 100) : 0;
  const universeCount =
    struggle?.avg_universe_count != null ? Math.round(struggle.avg_universe_count) : null;
  const nPeriods = struggle?.n_periods ?? 0;

  const rows = struggle
    ? ([
        { key: "struggle", label: "In Active-Struggle Periods" },
        { key: "normal", label: "Rest of Period" },
      ] as const)
    : [];

  return (
    <div className="contrib-section mb-16">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Active-Manager-Struggle Scenario</span>
          {struggle ? (
            <span
              style={{
                marginLeft: "auto",
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--text3)",
              }}
            >
              {nPeriods} period{nPeriods === 1 ? "" : "s"} · rolling{" "}
              {struggle.smooth_months}m breadth (bmk beat ≥{pctBeat}%) · ~
              {universeCount ?? "--"} mgrs/mo
            </span>
          ) : null}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table w-full">
            <thead>
              <tr>
                <th rowSpan={2} style={{ textAlign: "left" }}>Environment</th>
                <th rowSpan={2}>Months</th>
                <th colSpan={2} className="period-group sep-col">Avg Monthly Return</th>
                <th colSpan={2} className="period-group sep-col">Excess vs Benchmark</th>
                <th colSpan={2} className="period-group sep-col">Hit Rate</th>
              </tr>
              <tr>
                <th className="sub sep-col">Current</th><th className="sub">Proposed</th>
                <th className="sub sep-col">Current</th><th className="sub">Proposed</th>
                <th className="sub sep-col">Current</th><th className="sub">Proposed</th>
              </tr>
            </thead>
            <tbody>
              {!struggle ? (
                <tr>
                  <td
                    colSpan={STRUGGLE_COLS}
                    style={{ textAlign: "center", color: "var(--text3)", padding: 16 }}
                  >
                    Load universe returns for this peer group to see this scenario.
                  </td>
                </tr>
              ) : (
                <>
                  {rows.map(({ key, label }) => {
                    const block = struggle[key];
                    const current = block?.current;
                    const proposed = block?.proposed;
                    if (!block || !current || current.n_months === 0) {
                      return (
                        <tr key={key}>
                          <td style={{ fontWeight: 500 }}>{label}</td>
                          <td className="mono">{block?.n_months ?? 0}</td>
                          <td
                            colSpan={STRUGGLE_COLS - 2}
                            className="mono"
                            style={{ textAlign: "center", color: "var(--text3)" }}
                          >
                            No qualifying months
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={key}>
                        <td style={{ fontWeight: 500 }}>{label}</td>
                        <td className="mono">{block.n_months}</td>
                        <td className="mono sep-col">{formatPercent(current.avg_return, 2)}</td>
                        <td className="mono">{formatPercent(proposed?.avg_return, 2)}</td>
                        <td className="mono sep-col">{formatSignedPercent(current.avg_excess, 2)}</td>
                        <td className="mono">{formatSignedPercent(proposed?.avg_excess, 2)}</td>
                        <td className="mono sep-col">{formatPercent(current.hit_rate, 0)}</td>
                        <td className="mono">{formatPercent(proposed?.hit_rate, 0)}</td>
                      </tr>
                    );
                  })}
                  {struggle.periods.length ? (
                    <>
                      <tr>
                        <td
                          colSpan={STRUGGLE_COLS}
                          style={{
                            paddingTop: 12,
                            color: "var(--text3)",
                            fontSize: 9,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          Struggle periods (benchmark beat ≥{pctBeat}% of universe, rolling{" "}
                          {struggle.smooth_months}m)
                        </td>
                      </tr>
                      {struggle.periods.map((period) => (
                        <tr key={`${period.start}-${period.end}`}>
                          <td style={{ color: "var(--text2)" }}>
                            {period.start} → {period.end}
                          </td>
                          <td className="mono">{period.n_months}</td>
                          <td className="mono sep-col" style={{ color: "var(--text3)" }}>--</td>
                          <td className="mono" style={{ color: "var(--text3)" }}>--</td>
                          <td className="mono sep-col">{formatSignedPercent(period.cur_excess, 2)}</td>
                          <td className="mono">{formatSignedPercent(period.prop_excess, 2)}</td>
                          <td className="mono sep-col" style={{ color: "var(--text3)" }}>--</td>
                          <td className="mono" style={{ color: "var(--text3)" }}>--</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td
                        colSpan={STRUGGLE_COLS}
                        style={{
                          paddingTop: 10,
                          color: "var(--text3)",
                          fontSize: 10,
                          fontStyle: "italic",
                        }}
                      >
                        No sustained struggle periods at this threshold.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type PortfolioAnalyticsSectionsProps = {
  benchmark: string;
  exposureMenu: ExposureMenuGroup[];
  loadingAncillary: boolean;
  loadingExposures: boolean;
  marketCycle: MarketCycleResponse | null;
  onExposureSelectionChange(
    categorical: string | null,
    continuous: string | null,
  ): void;
  portfolioExposures: PortfolioExposuresResponse | null;
  riskAnalysis: RiskAnalysisResponse | null;
  riskExposures: RiskExposuresResponse | null;
  selectedExposureCategorical: string | null;
  selectedExposureContinuous: string | null;
  stats: PortfolioStats | null;
  // Live portfolio context for the sections that post the manager list
  // themselves (holdings overlap, diverse-ownership rollup).
  client: string | null;
  portfolioManagers: PortfolioManager[];
  hasExposures: boolean;
  // For the client-redemption section, which only renders once a portfolio
  // payload is loaded and needs the client's total AUM for its amount input.
  hasPortfolio: boolean;
  clientAum: number | null;
};

export function PortfolioAnalyticsSections({
  benchmark,
  exposureMenu,
  loadingAncillary,
  loadingExposures,
  marketCycle,
  onExposureSelectionChange,
  portfolioExposures,
  riskAnalysis,
  riskExposures,
  selectedExposureCategorical,
  selectedExposureContinuous,
  stats,
  client,
  portfolioManagers,
  hasExposures,
  hasPortfolio,
  clientAum,
}: PortfolioAnalyticsSectionsProps) {
  // The overlap endpoints only need name + weights.
  const overlapManagers: OverlapManagerInput[] = portfolioManagers.map((m) => ({
    matched_name: m.matched_name,
    weight_file_name: m.weight_file_name,
    current_weight: m.current_weight ?? 0,
    proposed_weight: m.proposed_weight ?? 0,
  }));
  const vgRows = [
    { label: "3-Factor Current", value: metricValue(stats?.current, "vg_3factor") },
    { label: "3-Factor Proposed", value: metricValue(stats?.proposed, "vg_3factor") },
    { label: "Full Model Current", value: metricValue(stats?.current, "vg_full") },
    { label: "Full Model Proposed", value: metricValue(stats?.proposed, "vg_full") },
  ];
  const exposureLabelFor = fieldLabel(exposureMenu);
  void exposureLabelFor;

  const riskMaxAbs = Math.max(
    ...((riskExposures?.factors ?? []).flatMap((factor) => [
      Math.abs(riskExposures?.current?.[factor] ?? 0),
      Math.abs(riskExposures?.proposed?.[factor] ?? 0),
    ])),
    0.01,
  );

  return (
    <>
      <div className="mb-16" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="summary-box plain">
            <div className="summary-box-title">Value — Growth Positioning</div>
            <div>
              {vgRows.map((row) => {
                const value = row.value;
                const width = Math.min(100, Math.abs(value) * 50);
                const left = value >= 0 ? 50 - width : 50;
                return (
                  <div key={row.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                      <span style={{ color: "var(--text2)", fontSize: 11 }}>{row.label}</span>
                      <span className={`mono ${valueColorClass(value)}`}>{formatPercent(value)}</span>
                    </div>
                    <div style={{ position: "relative", height: 18, border: "1px solid var(--border)", background: "var(--surface2)", borderRadius: 3 }}>
                      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "var(--text3)" }} />
                      <div
                        style={{
                          position: "absolute",
                          left: `${left}%`,
                          width: `${width}%`,
                          top: 0,
                          bottom: 0,
                          background: value >= 0 ? "rgba(213,61,95,.85)" : "rgba(0,163,122,.85)",
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel" id="portfolio-edge-section">
            <div className="panel-header" style={{ padding: "4px 12px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span className="panel-title">Portfolio Edge</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>Weighted avg Norm Skill Z</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              <div style={{ padding: "4px 12px 6px", borderRight: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text2)", textTransform: "uppercase", letterSpacing: ".06em" }}>Current</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 17, fontWeight: 600, color: stats?.edge_current.z != null && stats.edge_current.z < 0 ? "var(--red)" : "var(--green)" }}>
                  {stats?.edge_current.z != null ? `${stats.edge_current.z >= 0 ? "+" : ""}${formatNumber(stats.edge_current.z, 2)}` : "--"}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>
                  {stats?.edge_current.total_weight ? `${formatPercent(stats.edge_current.covered_weight, 1)} of ${formatPercent(stats.edge_current.total_weight, 1)} scored` : ""}
                </div>
              </div>
              <div style={{ padding: "4px 12px 6px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text2)", textTransform: "uppercase", letterSpacing: ".06em" }}>Proposed</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 17, fontWeight: 600, color: stats?.edge_proposed.z != null && stats.edge_proposed.z < 0 ? "var(--red)" : "var(--green)" }}>
                  {stats?.edge_proposed.z != null ? `${stats.edge_proposed.z >= 0 ? "+" : ""}${formatNumber(stats.edge_proposed.z, 2)}` : "--"}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>
                  {stats?.edge_proposed.total_weight ? `${formatPercent(stats.edge_proposed.covered_weight, 1)} of ${formatPercent(stats.edge_proposed.total_weight, 1)} scored` : ""}
                </div>
              </div>
            </div>
          </div>

          <DiverseOwnershipSection client={client} managers={portfolioManagers} />
        </div>

        {/* Flex column so the exposures table can stretch to the full height
            of the left stack instead of leaving dead space below it. */}
        <div className="panel" id="risk-section" style={{ display: "flex", flexDirection: "column" }}>
          <div className="panel-header" style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span className="panel-title">FactSet Risk Exposures — Active Style</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginLeft: "auto" }}>
              {riskExposures?.benchmark?.matched_column ? `Active exposures vs ${riskExposures.benchmark.matched_column}` : benchmark}
            </span>
          </div>
          {loadingAncillary && !riskExposures ? (
            <div style={{ padding: 14, textAlign: "center", color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 11 }}>
              Loading risk exposures...
            </div>
          ) : riskExposures?.error ? (
            <div style={{ padding: 14, textAlign: "center", color: "var(--amber)", fontFamily: "var(--mono)", fontSize: 11 }}>
              {riskExposures.error}
            </div>
          ) : !riskExposures ? (
            <div style={{ padding: 14, textAlign: "center", color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 11 }}>
              Upload a FactSet Risk file to see portfolio factor exposures.
            </div>
          ) : (
            <div style={{ overflowX: "auto", flex: 1 }}>
              {/* height:100% makes the browser distribute the panel's spare
                  vertical space across the factor rows, so the table always
                  reaches the bottom of the panel. */}
              <table className="data-table w-full" style={{ height: "100%" }}>
                <thead>
                  {/* Group labels belong on the FIRST row, spanning their
                      value+bar pair; the sub-row carries Value/Bar. These were
                      previously inverted (and missing colspans), so the header
                      read "Value | Bar" above "Current Weights | Bar". */}
                  <tr>
                    <th style={{ width: 140 }} rowSpan={2}>Factor</th>
                    <th colSpan={2} className="period-group sep-col">Current Weights</th>
                    <th colSpan={2} className="period-group sep-col">Proposed Weights</th>
                    <th className="sep-col" rowSpan={2}>Delta</th>
                  </tr>
                  <tr>
                    <th className="sub sep-col">Value</th>
                    <th className="sub">Bar</th>
                    <th className="sub sep-col">Value</th>
                    <th className="sub">Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {riskExposures.factors.map((factor) => {
                    const current = riskExposures.current[factor];
                    const proposed = riskExposures.proposed[factor];
                    const delta = riskExposures.delta[factor];
                    const bar = (value: number | null | undefined, color: string) => {
                      if (value == null) {
                        return <td />;
                      }

                      const width = Math.abs(value) / riskMaxAbs * 50;
                      const start = value >= 0 ? 50 : 50 - width;
                      return (
                        <td>
                          <div style={{ position: "relative", height: 12, background: "var(--border)", borderRadius: 3 }}>
                            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "var(--text3)" }} />
                            <div style={{ position: "absolute", left: `${start}%`, width: `${width}%`, top: 0, bottom: 0, background: color, borderRadius: 3 }} />
                          </div>
                        </td>
                      );
                    };

                    return (
                      <tr key={factor}>
                        <td>{factor}</td>
                        <td className="mono sep-col">{formatSignedDecimal(current)}</td>
                        {bar(current, "#5b7083")}
                        <td className="mono sep-col">{formatSignedDecimal(proposed)}</td>
                        {bar(proposed, "var(--accent)")}
                        <td className="mono sep-col">{formatSignedDecimal(delta)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Client redemption sits between the headline metrics row and Market
          Cycle. Only meaningful once a portfolio is loaded. */}
      {hasPortfolio ? (
        <ClientRedemptionSection
          client={client}
          managers={portfolioManagers}
          clientAum={clientAum}
        />
      ) : null}

      {/* Market cycle takes 2/3 of the row with holdings overlap alongside on
          the right. OverlapSection renders nothing without a FactSet exposures
          file, so the grid collapses to a single full-width column then. It is
          owned by the `overlap` feature — composed in here, not reimplemented. */}
      <div
        className="mb-16"
        style={{
          display: "grid",
          gridTemplateColumns: hasExposures ? "3fr 2fr" : "1fr",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <MarketCycleSection
          benchmark={benchmark}
          loading={loadingAncillary}
          data={marketCycle}
        />
        <OverlapSection
          client={client}
          managers={overlapManagers}
          hasExposures={hasExposures}
        />
      </div>

      <PortfolioExposuresSection
        exposureMenu={exposureMenu}
        loading={loadingExposures}
        data={portfolioExposures}
        selectedCategorical={selectedExposureCategorical}
        selectedContinuous={selectedExposureContinuous}
        onSelectionChange={onExposureSelectionChange}
      />

      <div className="contrib-section mb-16">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Marginal Contribution to Risk</span>
            {riskAnalysis ? (
              <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
                {riskAnalysis.peer_group} · {riskAnalysis.start_date ?? "--"} → {riskAnalysis.end_date ?? "--"}
                {riskAnalysis.n_months ? ` · ${riskAnalysis.n_months} mo` : ""}
              </span>
            ) : null}
          </div>
          <MarginalContributionChart data={riskAnalysis} loading={loadingAncillary} />
        </div>
      </div>

      <div className="contrib-section mb-16">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Scenario Analysis</span>
            {riskAnalysis && !riskAnalysis.error ? (
              <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
                {riskAnalysis.peer_group} · {riskAnalysis.start_date ?? "--"} →{" "}
                {riskAnalysis.end_date ?? "--"}
                {riskAnalysis.n_months ? ` · ${riskAnalysis.n_months} mo` : ""}
              </span>
            ) : null}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th rowSpan={2}>Benchmark</th>
                  <th colSpan={2} className="period-group sep-col">Upside Capture</th>
                  <th colSpan={2} className="period-group sep-col">Downside Capture</th>
                  <th colSpan={2} className="period-group sep-col">Tracking Error</th>
                  <th colSpan={2} className="period-group sep-col">Beta</th>
                  <th colSpan={2} className="period-group sep-col">Max Drawdown</th>
                </tr>
                <tr>
                  <th className="sub sep-col">Current</th><th className="sub">Proposed</th>
                  <th className="sub sep-col">Current</th><th className="sub">Proposed</th>
                  <th className="sub sep-col">Current</th><th className="sub">Proposed</th>
                  <th className="sub sep-col">Current</th><th className="sub">Proposed</th>
                  <th className="sub sep-col">Current</th><th className="sub">Proposed</th>
                </tr>
              </thead>
              <tbody>
                {riskAnalysis?.error ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: "center", color: "var(--amber)", padding: 20 }}>
                      {riskAnalysis.error}
                    </td>
                  </tr>
                ) : (
                  ([
                    { key: "core", label: "Core" },
                    { key: "value_tilted", label: "Value-Tilted (85/15)" },
                    { key: "growth_tilted", label: "Growth-Tilted (85/15)" },
                    { key: "infl_sensitive", label: "Inflation Sensitive" },
                  ] as const).map((row) => {
                    const current = riskAnalysis?.scenario?.current?.[row.key] ?? null;
                    const proposed = riskAnalysis?.scenario?.proposed?.[row.key] ?? null;
                    // Full index string (e.g. "85% MSCI EAFE Small Cap NR USD +
                    // 15% …") is far too long for the cell — show the short
                    // sleeve label and put the resolved index on hover.
                    const fullName = riskAnalysis?.benchmarks?.[row.key] ?? null;
                    // No metrics on either side means this sleeve doesn't exist
                    // for the peer group. Collapse the row to one message rather
                    // than printing dashes plus a portfolio-level max drawdown
                    // that has nothing to do with this (absent) benchmark.
                    if (!current && !proposed) {
                      return (
                        <tr key={row.key}>
                          <td title={fullName ?? undefined}>{row.label}</td>
                          <td
                            colSpan={10}
                            className="mono"
                            style={{ textAlign: "center", color: "var(--text3)" }}
                          >
                            Not available for this peer group
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={row.key}>
                        <td title={fullName ?? undefined}>{row.label}</td>
                        <td className="mono sep-col">{current ? formatNumber(current.upside_capture, 1) : "--"}</td>
                        <td className="mono">{proposed ? formatNumber(proposed.upside_capture, 1) : "--"}</td>
                        <td className="mono sep-col">{current ? formatNumber(current.downside_capture, 1) : "--"}</td>
                        <td className="mono">{proposed ? formatNumber(proposed.downside_capture, 1) : "--"}</td>
                        <td className="mono sep-col">{current ? formatPercent(current.tracking_error, 2) : "--"}</td>
                        <td className="mono">{proposed ? formatPercent(proposed.tracking_error, 2) : "--"}</td>
                        <td className="mono sep-col">{current ? formatNumber(current.beta, 2) : "--"}</td>
                        <td className="mono">{proposed ? formatNumber(proposed.beta, 2) : "--"}</td>
                        <td className="mono sep-col">{formatPercent(riskAnalysis?.scenario?.current?.max_drawdown, 2)}</td>
                        <td className="mono">{formatPercent(riskAnalysis?.scenario?.proposed?.max_drawdown, 2)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="contrib-section mb-16">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Value vs Growth Regime (Trailing 60 Months)</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th rowSpan={2}>Regime</th>
                  <th rowSpan={2}>Months</th>
                  <th colSpan={2} className="period-group sep-col">Avg Monthly Return</th>
                  <th colSpan={2} className="period-group sep-col">Downside Deviation</th>
                </tr>
                <tr>
                  <th className="sub sep-col">Current</th><th className="sub">Proposed</th>
                  <th className="sub sep-col">Current</th><th className="sub">Proposed</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { key: "value_outperform", label: "Value-Tilt Outperforming" },
                  { key: "growth_outperform", label: "Growth-Tilt Outperforming" },
                ] as const).map((row) => {
                  const regime = riskAnalysis?.regime?.[row.key] ?? null;
                  return (
                    <tr key={row.key}>
                      <td>{row.label}</td>
                      <td className="mono">{regime?.n_months ?? 0}</td>
                      <td className="mono sep-col">{formatPercent(regime?.current?.avg_return, 2)}</td>
                      <td className="mono">{formatPercent(regime?.proposed?.avg_return, 2)}</td>
                      <td className="mono sep-col">{formatPercent(regime?.current?.downside_dev, 2)}</td>
                      <td className="mono">{formatPercent(regime?.proposed?.downside_dev, 2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ManagerStruggleSection struggle={riskAnalysis?.manager_struggle ?? null} />

      {/* The Current Portfolio Contribution and Contribution by Style Group
          tables moved to the Performance Attribution tab
          (features/attribution) on 2026-08-13. */}

      <div className="summary-box plain">
        <div className="summary-box-title">Style Summary</div>
        <div className="flex gap-16" style={{ marginBottom: 12 }}>
          <div style={{ flex: 1 }}><div className="summary-col-label">Metric</div></div>
          <div style={{ minWidth: 60, textAlign: "right" }}><div className="summary-col-label">Current</div></div>
          <div style={{ minWidth: 60, textAlign: "right" }}><div className="summary-col-label">Proposed</div></div>
          <div style={{ minWidth: 60, textAlign: "right" }}><div className="summary-col-label">Delta</div></div>
        </div>
        <div>
          {STYLE_METRICS.map((metric) => {
            const current = metricValue(stats?.current, metric.key);
            const proposed = metricValue(stats?.proposed, metric.key);
            const delta = metricValue(stats?.delta, metric.key);
            return (
              <div key={metric.key} className="summary-row">
                <span className="summary-label">{metric.label}</span>
                <div className="summary-vals">
                  <span className="summary-val current">{formatPercent(current)}</span>
                  <span className="summary-val proposed">{formatPercent(proposed)}</span>
                  <span className={`summary-val ${deltaClassName(delta)}`}>
                    {delta >= 0 ? "+" : ""}
                    {formatPercent(delta)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}