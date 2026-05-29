"use client";

import { useMemo, useState } from "react";

import type {
  ExposureMenuGroup,
  PortfolioExposureRow,
  PortfolioExposuresResponse,
} from "../types";

type PortfolioExposuresSectionProps = {
  exposureMenu: ExposureMenuGroup[];
  loading: boolean;
  data: PortfolioExposuresResponse | null;
  selectedCategorical: string | null;
  selectedContinuous: string | null;
  onSelectionChange(categorical: string | null, continuous: string | null): void;
};

// ── Quintile preview specs (mirrors old index.html) ──────────────────────
// Used only when backend hasn't returned children yet; produces plausible
// breakpoints & weights so users can see Mode C structure.
const PREVIEW_QUINTILE_SPECS: Record<
  string,
  { breaks: number[]; fmt: (v: number) => string }
> = {
  "New Custom ROE": { breaks: [3, 8, 14, 22], fmt: (v) => `${v.toFixed(1)}%` },
  ROIC: { breaks: [2, 6, 11, 18], fmt: (v) => `${v.toFixed(1)}%` },
  "Gross Margin NEW": { breaks: [18, 30, 45, 62], fmt: (v) => `${v.toFixed(0)}%` },
  "Net Margin": { breaks: [2, 7, 13, 22], fmt: (v) => `${v.toFixed(1)}%` },
  ROA: { breaks: [1, 4, 8, 13], fmt: (v) => `${v.toFixed(1)}%` },
  "New Price to Earnings LTM": { breaks: [8, 13, 19, 28], fmt: (v) => `${v.toFixed(1)}x` },
  "Price to Earnings - Next Twelve Months NEW": { breaks: [7, 12, 17, 24], fmt: (v) => `${v.toFixed(1)}x` },
  "Price to Book": { breaks: [0.7, 1.4, 2.4, 4.0], fmt: (v) => `${v.toFixed(2)}x` },
  "Price to FCF NEW": { breaks: [8, 14, 22, 35], fmt: (v) => `${v.toFixed(1)}x` },
  "Dividend Yield": { breaks: [0.5, 1.5, 2.8, 4.2], fmt: (v) => `${v.toFixed(1)}%` },
  "Market Capitalization": {
    breaks: [1, 5, 25, 120],
    fmt: (v) => `$${v >= 1 ? v.toFixed(0) : v.toFixed(1)}B`,
  },
  "RSI 63": { breaks: [35, 45, 55, 65], fmt: (v) => v.toFixed(0) },
  "RSI 252": { breaks: [35, 45, 55, 65], fmt: (v) => v.toFixed(0) },
  "Earnings Growth - 3-5 Year Projected NEW": { breaks: [2, 7, 12, 20], fmt: (v) => `${v.toFixed(1)}%` },
  "Earnings Growth - 3 Year Historical NEW": { breaks: [-3, 5, 12, 22], fmt: (v) => `${v.toFixed(1)}%` },
  "Hist 3Yr Sales Growth": { breaks: [-1, 4, 9, 16], fmt: (v) => `${v.toFixed(1)}%` },
  "Beta (3 yr)": { breaks: [0.55, 0.85, 1.05, 1.30], fmt: (v) => v.toFixed(2) },
  "Return Vol - 252D": { breaks: [12, 18, 24, 32], fmt: (v) => `${v.toFixed(0)}%` },
  "Skewness - 252D": { breaks: [-0.6, -0.2, 0.1, 0.5], fmt: (v) => v.toFixed(2) },
  "Kurtosis - 252D": { breaks: [1.5, 2.8, 4.2, 6.5], fmt: (v) => v.toFixed(1) },
};

function hash01(input: string) {
  let h = 0;
  const s = String(input ?? "");
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return (((h % 1000) + 1000) % 1000) / 1000;
}

function previewQuintileRanges(parentLabel: string, subCol: string | null) {
  if (!subCol) return ["", "", "", "", ""] as const;
  const spec = PREVIEW_QUINTILE_SPECS[subCol];
  if (!spec) return ["", "", "", "", ""] as const;
  const factor = 0.8 + hash01(`${parentLabel}|${subCol}`) * 0.4;
  const [p20, p40, p60, p80] = spec.breaks.map((v) => v * factor);
  const f = spec.fmt;
  return [
    `≥ ${f(p80)}`,
    `${f(p60)} – ${f(p80)}`,
    `${f(p40)} – ${f(p60)}`,
    `${f(p20)} – ${f(p40)}`,
    `< ${f(p20)}`,
  ] as const;
}

function previewChildren(
  row: PortfolioExposureRow,
  subCol: string | null,
): PortfolioExposureRow[] {
  const split = (v: number) => [v * 0.30, v * 0.25, v * 0.20, v * 0.15, v * 0.10];
  const b = split(row.benchmark || 0);
  const c = split(row.current || 0);
  const p = split(row.proposed || 0);
  const ranges = previewQuintileRanges(row.label, subCol);
  const labels = ["Q1 (High)", "Q2", "Q3", "Q4", "Q5 (Low)"];
  return labels.map((label, i) => ({
    label,
    range_label: ranges[i],
    benchmark: b[i],
    current: c[i],
    proposed: p[i],
    delta_current: c[i] - b[i],
    delta_proposed: p[i] - b[i],
  }));
}

function isCategoricalCol(menu: ExposureMenuGroup[], col: string | null) {
  if (!col) return false;
  const cat = menu.find((g) => g.group === "Categorical");
  return !!cat?.cols.some((c) => c.col === col);
}

function colLabel(menu: ExposureMenuGroup[], col: string | null) {
  if (!col) return "";
  for (const grp of menu) {
    const c = grp.cols.find((x) => x.col === col);
    if (c) return c.label;
  }
  return col;
}

function ValueCell({
  value,
  fillClass,
  maxAbs,
}: {
  value: number;
  fillClass: string;
  maxAbs: number;
}) {
  const w = Math.max(2, Math.round((value / Math.max(maxAbs, 0.0001)) * 100));
  return (
    <td className="exp-cell">
      <div className="exp-cell-inner">
        <span className="exp-val">{value.toFixed(1)}%</span>
        <span className="exp-bar-track">
          <span className={`exp-bar-fill ${fillClass}`} style={{ width: `${w}%` }} />
        </span>
      </div>
    </td>
  );
}

function DeltaCell({ value, maxAbs }: { value: number; maxAbs: number }) {
  const absPct = Math.min(50, Math.round((Math.abs(value) / Math.max(maxAbs, 0.0001)) * 50));
  const isPos = value >= 0;
  const sign = isPos ? "+" : "";
  const cls = isPos ? "pos" : "neg";
  const fillStyle: React.CSSProperties = isPos
    ? { left: "50%", width: `${absPct}%` }
    : { right: "50%", width: `${absPct}%` };
  const txtCol =
    value > 0.5 ? "var(--amber)" : value < -0.5 ? "var(--accent)" : "var(--text3)";
  return (
    <td className="exp-cell">
      <div className="exp-cell-inner">
        <span className="exp-val" style={{ color: txtCol }}>
          {sign}
          {value.toFixed(1)}%
        </span>
        <span className="exp-delta-track">
          <span className={`exp-delta-fill ${cls}`} style={fillStyle} />
        </span>
      </div>
    </td>
  );
}

export function PortfolioExposuresSection({
  exposureMenu,
  loading,
  data,
  selectedCategorical,
  selectedContinuous,
  onSelectionChange,
}: PortfolioExposuresSectionProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleRow = (label: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleCategorical = (col: string) => {
    const next = selectedCategorical === col ? null : col;
    setExpanded(new Set());
    onSelectionChange(next, selectedContinuous);
  };

  const handleContinuous = (col: string) => {
    const next = selectedContinuous === col ? null : col;
    setExpanded(new Set());
    onSelectionChange(selectedCategorical, next);
  };

  const categoricalGroup = exposureMenu.find((g) => g.group === "Categorical");
  const continuousGroups = exposureMenu.filter((g) => g.group !== "Categorical");

  const grouping = data?.grouping ?? null;
  const subGrouping = data?.sub_grouping ?? selectedContinuous ?? null;
  const wantNested =
    isCategoricalCol(exposureMenu, grouping) && !!subGrouping;
  const isNested = !!data?.is_nested || wantNested;

  const subLabel = data?.sub_label || colLabel(exposureMenu, subGrouping);
  const headerLabel = isNested
    ? `${data?.display_label ?? grouping ?? "Group"} × ${subLabel}`
    : data?.display_label ?? grouping ?? "Group";

  const rows = data?.rows ?? [];

  const { maxValue, maxDelta } = useMemo(() => {
    let mv = 1;
    let md = 1;
    rows.forEach((r) => {
      mv = Math.max(mv, r.benchmark || 0, r.current || 0, r.proposed || 0);
      md = Math.max(md, Math.abs(r.delta_current || 0), Math.abs(r.delta_proposed || 0));
    });
    return { maxValue: mv, maxDelta: md };
  }, [rows]);

  const coverageNote = data
    ? `Portfolio coverage: ${data.coverage_current}% current / ${data.coverage_proposed}% proposed`
    : "";
  const unmatchedNote =
    data?.unmatched && data.unmatched.length
      ? `⚠ No exposure data for: ${data.unmatched.join(", ")}`
      : "";

  return (
    <div className="contrib-section mb-16" id="portfolio-exposures-section">
      <div className="panel">
        <div
          className="panel-header"
          style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
        >
          <span className="panel-title">Portfolio Exposures</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
            {coverageNote}
          </span>
          {unmatchedNote ? (
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)" }}>
              {unmatchedNote}
            </span>
          ) : null}
        </div>

        {/* Row A — Categorical */}
        <div className="exp-selector-row" data-role="group">
          <span className="role-label">A · Categorical</span>
          {categoricalGroup?.cols.map((c) => (
            <button
              key={c.col}
              type="button"
              className={`btn ${selectedCategorical === c.col ? "btn-primary" : "btn-outline"} btn-sm`}
              style={{ fontSize: 10, padding: "2px 8px" }}
              onClick={() => handleCategorical(c.col)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Row B — Continuous (grouped) */}
        <div className="exp-selector-row" data-role="sub-group">
          <span className="role-label">B · Continuous</span>
          {continuousGroups.map((grp) => (
            <div
              key={grp.group}
              style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  color: "var(--text3)",
                  paddingRight: 4,
                }}
              >
                {grp.group}
              </span>
              {grp.cols.map((c) => (
                <button
                  key={c.col}
                  type="button"
                  className={`btn ${selectedContinuous === c.col ? "btn-primary" : "btn-outline"} btn-sm`}
                  style={{ fontSize: 10, padding: "2px 8px" }}
                  onClick={() => handleContinuous(c.col)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="data-table w-full" id="exp-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left", minWidth: 160 }} id="exp-col-header">
                  {headerLabel}
                </th>
                <th className="mono" style={{ minWidth: 90 }}>Benchmark</th>
                <th className="mono" style={{ minWidth: 90 }}>Current</th>
                <th className="mono" style={{ minWidth: 90 }}>Proposed</th>
                <th className="mono" style={{ minWidth: 90 }}>Cur vs Bmk</th>
                <th className="mono" style={{ minWidth: 90 }}>Prop vs Bmk</th>
              </tr>
            </thead>
            <tbody id="exp-tbody">
              {!exposureMenu.length ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
                    Upload a FactSet Exposures file on the Setup tab.
                  </td>
                </tr>
              ) : !grouping ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
                    Pick a grouping in row A or row B above.
                  </td>
                </tr>
              ) : loading && !data ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--text3)", padding: 16, fontFamily: "var(--mono)", fontSize: 10 }}>
                    Loading…
                  </td>
                </tr>
              ) : data?.error ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--amber)", padding: 16, fontFamily: "var(--mono)", fontSize: 10 }}>
                    ⚠ {data.error}
                  </td>
                </tr>
              ) : !rows.length ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--text3)", padding: 16 }}>
                    No data.
                  </td>
                </tr>
              ) : (
                rows.flatMap((row) => {
                  const isUnclass = row.label === "Unclassified";
                  const hasChildren = isNested && !isUnclass;
                  const isExpanded = expanded.has(row.label);
                  const labelStyle: React.CSSProperties = {
                    fontWeight: isUnclass ? 400 : 500,
                    ...(isUnclass ? { fontStyle: "italic", color: "var(--text3)" } : {}),
                  };

                  const parentRow = (
                    <tr key={`p::${row.label}`}>
                      <td className="exp-label-cell" style={labelStyle}>
                        {hasChildren ? (
                          <span
                            className={`exp-chevron${isExpanded ? " expanded" : ""}`}
                            onClick={() => toggleRow(row.label)}
                            role="button"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                          >
                            ▸
                          </span>
                        ) : (
                          <span className="exp-chevron-spacer" />
                        )}
                        <span>{row.label}</span>
                      </td>
                      <ValueCell value={row.benchmark} fillClass="exp-bmk-fill" maxAbs={maxValue} />
                      <ValueCell value={row.current} fillClass="exp-cur-fill" maxAbs={maxValue} />
                      <ValueCell value={row.proposed} fillClass="exp-prop-fill" maxAbs={maxValue} />
                      <DeltaCell value={row.delta_current} maxAbs={maxDelta} />
                      <DeltaCell value={row.delta_proposed} maxAbs={maxDelta} />
                    </tr>
                  );

                  if (!isNested || isUnclass) {
                    return [parentRow];
                  }

                  let kids: PortfolioExposureRow[];
                  let insufficient = false;
                  if (row.insufficient_data) {
                    insufficient = true;
                    kids = [
                      {
                        label: "Insufficient data",
                        benchmark: row.benchmark,
                        current: row.current,
                        proposed: row.proposed,
                        delta_current: row.delta_current,
                        delta_proposed: row.delta_proposed,
                      },
                    ];
                  } else if (row.children && row.children.length) {
                    kids = row.children;
                  } else {
                    kids = previewChildren(row, subGrouping);
                  }

                  const childRows = kids.map((c, i) => {
                    const cls = `exp-child-row${isExpanded ? "" : " hidden"}${insufficient ? " insufficient" : ""}`;
                    return (
                      <tr key={`c::${row.label}::${i}`} className={cls} data-parent={row.label}>
                        <td className="exp-label-cell">
                          {c.label}
                          {c.range_label ? <span className="exp-q-range">{c.range_label}</span> : null}
                        </td>
                        <ValueCell value={c.benchmark || 0} fillClass="exp-bmk-fill" maxAbs={maxValue} />
                        <ValueCell value={c.current || 0} fillClass="exp-cur-fill" maxAbs={maxValue} />
                        <ValueCell value={c.proposed || 0} fillClass="exp-prop-fill" maxAbs={maxValue} />
                        <DeltaCell value={c.delta_current || 0} maxAbs={maxDelta} />
                        <DeltaCell value={c.delta_proposed || 0} maxAbs={maxDelta} />
                      </tr>
                    );
                  });

                  return [parentRow, ...childRows];
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
