import { formatNumber, formatPercent } from "@/lib/utils";

import type {
  ContributionManager,
  ContributionResponse,
  ExposureMenuGroup,
  MarketCycleResponse,
  PortfolioExposuresResponse,
  PortfolioStats,
  RiskAnalysisResponse,
  RiskExposuresResponse,
} from "../types";
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

function contributionCellClass(value: number | null | undefined, kind: "style" | "skill") {
  if (value == null) {
    return "";
  }
  if (kind === "style") {
    return value >= 0 ? "skill-pos" : "skill-neg";
  }
  return value >= 0 ? "skill-pos" : "skill-neg";
}

function buildContributionGroups(managers: ContributionManager[]) {
  const groups: Record<string, ContributionManager[]> = {
    "Value (V-G > 25%)": [],
    Core: [],
    "Growth (V-G < -25%)": [],
  };

  managers.forEach((manager) => {
    if ((manager.vg_full ?? 0) > 0.25) {
      groups["Value (V-G > 25%)"].push(manager);
      return;
    }
    if ((manager.vg_full ?? 0) < -0.25) {
      groups["Growth (V-G < -25%)"].push(manager);
      return;
    }
    groups.Core.push(manager);
  });

  return Object.entries(groups)
    .map(([label, rows]) => {
      const totalWeight = rows.reduce((sum, row) => sum + (row.weight || 0), 0);
      const sumStat = (key: keyof ContributionManager) => {
        const available = rows.filter((row) => row[key] != null);
        if (!available.length) {
          return null;
        }
        return available.reduce(
          (sum, row) => sum + (row.weight || 0) * Number(row[key] || 0),
          0,
        );
      };

      return {
        label,
        totalWeight,
        qtd_style: sumStat("qtd_style"),
        qtd_skill: sumStat("qtd_skill"),
        t1_style: sumStat("t1_style"),
        t1_skill: sumStat("t1_skill"),
        t3_style: sumStat("t3_style"),
        t3_skill: sumStat("t3_skill"),
      };
    })
    .filter((group) => group.totalWeight > 0);
}

function totalContribution(groups: ReturnType<typeof buildContributionGroups>) {
  return groups.reduce(
    (total, group) => ({
      totalWeight: total.totalWeight + group.totalWeight,
      qtd_style: (total.qtd_style ?? 0) + (group.qtd_style ?? 0),
      qtd_skill: (total.qtd_skill ?? 0) + (group.qtd_skill ?? 0),
      t1_style: (total.t1_style ?? 0) + (group.t1_style ?? 0),
      t1_skill: (total.t1_skill ?? 0) + (group.t1_skill ?? 0),
      t3_style: (total.t3_style ?? 0) + (group.t3_style ?? 0),
      t3_skill: (total.t3_skill ?? 0) + (group.t3_skill ?? 0),
    }),
    {
      totalWeight: 0,
      qtd_style: 0,
      qtd_skill: 0,
      t1_style: 0,
      t1_skill: 0,
      t3_style: 0,
      t3_skill: 0,
    },
  );
}

function fieldLabel(groups: ExposureMenuGroup[]) {
  const flat = groups.flatMap((group) => group.cols);
  return (value: string | null) => flat.find((item) => item.col === value)?.label ?? value ?? "Group";
}

type PortfolioAnalyticsSectionsProps = {
  benchmark: string;
  contribution: ContributionResponse | null;
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
};

export function PortfolioAnalyticsSections({
  benchmark,
  contribution,
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
}: PortfolioAnalyticsSectionsProps) {
  const vgRows = [
    { label: "3-Factor Current", value: metricValue(stats?.current, "vg_3factor") },
    { label: "3-Factor Proposed", value: metricValue(stats?.proposed, "vg_3factor") },
    { label: "Full Model Current", value: metricValue(stats?.current, "vg_full") },
    { label: "Full Model Proposed", value: metricValue(stats?.proposed, "vg_full") },
  ];
  const exposureLabelFor = fieldLabel(exposureMenu);
  void exposureLabelFor;
  const contributionGroups = buildContributionGroups(contribution?.managers ?? []);
  const contributionTotals = totalContribution(contributionGroups);

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
            <div className="panel-header" style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span className="panel-title">Portfolio Edge</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>Weighted avg Norm Skill Z</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              <div style={{ padding: "10px 14px", borderRight: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text2)", textTransform: "uppercase", letterSpacing: ".06em" }}>Current</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 600, marginTop: 2, color: stats?.edge_current.z != null && stats.edge_current.z < 0 ? "var(--red)" : "var(--green)" }}>
                  {stats?.edge_current.z != null ? `${stats.edge_current.z >= 0 ? "+" : ""}${formatNumber(stats.edge_current.z, 2)}` : "--"}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", marginTop: 1 }}>
                  {stats?.edge_current.total_weight ? `${formatPercent(stats.edge_current.covered_weight, 1)} of ${formatPercent(stats.edge_current.total_weight, 1)} scored` : ""}
                </div>
              </div>
              <div style={{ padding: "10px 14px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text2)", textTransform: "uppercase", letterSpacing: ".06em" }}>Proposed</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 600, marginTop: 2, color: stats?.edge_proposed.z != null && stats.edge_proposed.z < 0 ? "var(--red)" : "var(--green)" }}>
                  {stats?.edge_proposed.z != null ? `${stats.edge_proposed.z >= 0 ? "+" : ""}${formatNumber(stats.edge_proposed.z, 2)}` : "--"}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", marginTop: 1 }}>
                  {stats?.edge_proposed.total_weight ? `${formatPercent(stats.edge_proposed.covered_weight, 1)} of ${formatPercent(stats.edge_proposed.total_weight, 1)} scored` : ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel" id="risk-section">
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
            <div style={{ overflowX: "auto" }}>
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th style={{ width: 140 }}>Factor</th>
                    <th className="sep-col">Value</th>
                    <th>Bar</th>
                    <th className="sep-col">Value</th>
                    <th>Bar</th>
                    <th className="sep-col">Delta</th>
                  </tr>
                  <tr>
                    <th></th>
                    <th className="sub sep-col">Current Weights</th>
                    <th className="sub">Bar</th>
                    <th className="sub sep-col">Proposed Weights</th>
                    <th className="sub">Bar</th>
                    <th className="sub sep-col">Value</th>
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

      <MarketCycleSection
        benchmark={benchmark}
        loading={loadingAncillary}
        data={marketCycle}
      />

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
                    const current = riskAnalysis?.scenario.current[row.key] ?? null;
                    const proposed = riskAnalysis?.scenario.proposed[row.key] ?? null;
                    return (
                      <tr key={row.key}>
                        <td>{riskAnalysis?.benchmarks[row.key] ?? row.label}</td>
                        <td className="mono sep-col">{current ? formatNumber(current.upside_capture, 1) : "--"}</td>
                        <td className="mono">{proposed ? formatNumber(proposed.upside_capture, 1) : "--"}</td>
                        <td className="mono sep-col">{current ? formatNumber(current.downside_capture, 1) : "--"}</td>
                        <td className="mono">{proposed ? formatNumber(proposed.downside_capture, 1) : "--"}</td>
                        <td className="mono sep-col">{current ? formatPercent(current.tracking_error, 2) : "--"}</td>
                        <td className="mono">{proposed ? formatPercent(proposed.tracking_error, 2) : "--"}</td>
                        <td className="mono sep-col">{current ? formatNumber(current.beta, 2) : "--"}</td>
                        <td className="mono">{proposed ? formatNumber(proposed.beta, 2) : "--"}</td>
                        <td className="mono sep-col">{formatPercent(riskAnalysis?.scenario.current.max_drawdown, 2)}</td>
                        <td className="mono">{formatPercent(riskAnalysis?.scenario.proposed.max_drawdown, 2)}</td>
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
                  const regime = riskAnalysis?.regime[row.key] ?? null;
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

      <div className="contrib-section">
        <div className="panel mb-16">
          <div className="panel-header">
            <span className="panel-title">Current Portfolio Contribution</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th rowSpan={2}>Manager</th>
                  <th rowSpan={2}>Weight</th>
                  <th colSpan={4} className="period-group sep-col">Past Quarter</th>
                  <th colSpan={2} className="period-group sep-col">Trailing 1 Year</th>
                  <th colSpan={2} className="period-group sep-col">Trailing 3 Year</th>
                </tr>
                <tr>
                  <th className="sub sep-col">Mgr Return</th>
                  <th className="sub">Bench Excess</th>
                  <th className="sub">Passive Style</th>
                  <th className="sub">Mgr Skill</th>
                  <th className="sub sep-col">Passive Style</th>
                  <th className="sub">Mgr Skill</th>
                  <th className="sub sep-col">Passive Style</th>
                  <th className="sub">Mgr Skill</th>
                </tr>
              </thead>
              <tbody>
                {contribution?.error ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", color: "var(--amber)", padding: 20 }}>
                      {contribution.error}
                    </td>
                  </tr>
                ) : contribution?.managers.length ? (
                  contribution.managers.map((manager) => (
                    <tr key={manager.name}>
                      <td>{manager.name}</td>
                      <td className="mono">{formatPercent(manager.weight)}</td>
                      <td className="mono sep-col">{manager.qtd_mgr == null ? "--" : `${manager.qtd_mgr.toFixed(1)}%`}</td>
                      <td className="mono">{manager.qtd_bench == null ? "--" : `${manager.qtd_bench.toFixed(1)}%`}</td>
                      <td className={`mono ${contributionCellClass(manager.qtd_style, "style")}`}>{manager.qtd_style == null ? "--" : `${manager.qtd_style.toFixed(1)}%`}</td>
                      <td className={`mono ${contributionCellClass(manager.qtd_skill, "skill")}`}>{manager.qtd_skill == null ? "--" : `${manager.qtd_skill.toFixed(1)}%`}</td>
                      <td className={`mono sep-col ${contributionCellClass(manager.t1_style, "style")}`}>{manager.t1_style == null ? "--" : `${manager.t1_style.toFixed(1)}%`}</td>
                      <td className={`mono ${contributionCellClass(manager.t1_skill, "skill")}`}>{manager.t1_skill == null ? "--" : `${manager.t1_skill.toFixed(1)}%`}</td>
                      <td className={`mono sep-col ${contributionCellClass(manager.t3_style, "style")}`}>{manager.t3_style == null ? "--" : `${manager.t3_style.toFixed(1)}%`}</td>
                      <td className={`mono ${contributionCellClass(manager.t3_skill, "skill")}`}>{manager.t3_skill == null ? "--" : `${manager.t3_skill.toFixed(1)}%`}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
                      Select a portfolio to load data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel mb-16">
          <div className="panel-header"><span className="panel-title">Contribution by Style Group</span></div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th rowSpan={2}>Group</th>
                  <th rowSpan={2}>Weight</th>
                  <th colSpan={2} className="period-group sep-col">Past Quarter Contribution</th>
                  <th colSpan={2} className="period-group sep-col">Trailing 1yr Contribution</th>
                  <th colSpan={2} className="period-group sep-col">Trailing 3yr Contribution</th>
                </tr>
                <tr>
                  <th className="sub sep-col">Style</th><th className="sub">Skill</th>
                  <th className="sub sep-col">Style</th><th className="sub">Skill</th>
                  <th className="sub sep-col">Style</th><th className="sub">Skill</th>
                </tr>
              </thead>
              <tbody>
                {contributionGroups.length ? (
                  <>
                    {contributionGroups.map((group) => (
                      <tr key={group.label}>
                        <td>{group.label}</td>
                        <td className="mono">{formatPercent(group.totalWeight)}</td>
                        <td className={`mono sep-col ${contributionCellClass(group.qtd_style, "style")}`}>{group.qtd_style == null ? "--" : `${group.qtd_style.toFixed(2)}%`}</td>
                        <td className={`mono ${contributionCellClass(group.qtd_skill, "skill")}`}>{group.qtd_skill == null ? "--" : `${group.qtd_skill.toFixed(2)}%`}</td>
                        <td className={`mono sep-col ${contributionCellClass(group.t1_style, "style")}`}>{group.t1_style == null ? "--" : `${group.t1_style.toFixed(2)}%`}</td>
                        <td className={`mono ${contributionCellClass(group.t1_skill, "skill")}`}>{group.t1_skill == null ? "--" : `${group.t1_skill.toFixed(2)}%`}</td>
                        <td className={`mono sep-col ${contributionCellClass(group.t3_style, "style")}`}>{group.t3_style == null ? "--" : `${group.t3_style.toFixed(2)}%`}</td>
                        <td className={`mono ${contributionCellClass(group.t3_skill, "skill")}`}>{group.t3_skill == null ? "--" : `${group.t3_skill.toFixed(2)}%`}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>Estimated Total Contribution</td>
                      <td className="mono">{formatPercent(contributionTotals.totalWeight)}</td>
                      <td className={`mono sep-col ${contributionCellClass(contributionTotals.qtd_style, "style")}`}>{contributionTotals.qtd_style.toFixed(2)}%</td>
                      <td className={`mono ${contributionCellClass(contributionTotals.qtd_skill, "skill")}`}>{contributionTotals.qtd_skill.toFixed(2)}%</td>
                      <td className={`mono sep-col ${contributionCellClass(contributionTotals.t1_style, "style")}`}>{contributionTotals.t1_style.toFixed(2)}%</td>
                      <td className={`mono ${contributionCellClass(contributionTotals.t1_skill, "skill")}`}>{contributionTotals.t1_skill.toFixed(2)}%</td>
                      <td className={`mono sep-col ${contributionCellClass(contributionTotals.t3_style, "style")}`}>{contributionTotals.t3_style.toFixed(2)}%</td>
                      <td className={`mono ${contributionCellClass(contributionTotals.t3_skill, "skill")}`}>{contributionTotals.t3_skill.toFixed(2)}%</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
                      Select a portfolio to load data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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