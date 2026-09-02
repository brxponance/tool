"use client";

import { useMemo, useState } from "react";

import type {
  ManagerExposureMenuGroup,
  ManagerExposureRow,
  ManagerPortfolioExposuresResponse,
} from "../types";

type ManagerRef = { name: string; tab: string };

type Props = {
  managers: ManagerRef[];
  exposureMenu: ManagerExposureMenuGroup[];
  loading: boolean;
  // One response per manager, aligned with `managers`.
  data: Array<ManagerPortfolioExposuresResponse | null>;
  selectedCategorical: string | null;
  selectedContinuous: string | null;
  onSelectionChange(categorical: string | null, continuous: string | null): void;
};

// Mirrors the portfolio section's benchmark-name shortening so column
// headers read 'MSCI EAFE' rather than 'MSCI EAFE NR USD'.
function shortenExpBenchmark(name: string | null | undefined) {
  if (!name) return null;
  return name
    .replace(/\bNR USD\b/gi, "")
    .replace(/\bTR USD\b/gi, "")
    .replace(/\bIndex\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isCategoricalCol(menu: ManagerExposureMenuGroup[], col: string | null) {
  if (!col) return false;
  const cat = menu.find((g) => g.group === "Categorical");
  return !!cat?.cols.some((c) => c.col === col);
}

function colLabel(menu: ManagerExposureMenuGroup[], col: string | null) {
  if (!col) return "";
  for (const grp of menu) {
    const c = grp.cols.find((x) => x.col === col);
    if (c) return c.label;
  }
  return col;
}

// Same cell treatment as the Portfolio tab: value + proportional bar.
function ValueCell({
  value,
  fillClass,
  maxAbs,
}: {
  value: number | null | undefined;
  fillClass: string;
  maxAbs: number;
}) {
  if (value == null || Number.isNaN(value)) {
    return (
      <td className="exp-cell">
        <div className="exp-cell-inner">
          <span className="exp-val" style={{ color: "var(--text3)" }}>
            --
          </span>
        </div>
      </td>
    );
  }
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

// Portfolio Exposures for one or more managers. Identical chrome to the
// Portfolio tab's section (A · Categorical / B · Continuous selector rows,
// nested quintile drill-down, value bars); the Current/Proposed/delta
// columns are replaced by one column per selected manager.
export function ManagerExposuresCompareTable({
  managers,
  exposureMenu,
  loading,
  data,
  selectedCategorical,
  selectedContinuous,
  onSelectionChange,
}: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleRow = (label: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
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

  // Row order and benchmark come from the first manager that returned data.
  const base = data.find((d) => d && !d.error && (d.rows ?? []).length) ?? null;

  const grouping = base?.grouping ?? selectedCategorical ?? selectedContinuous ?? null;
  const subGrouping = base?.sub_grouping ?? selectedContinuous ?? null;
  const wantNested = isCategoricalCol(exposureMenu, grouping) && !!subGrouping;
  const isNested = !!base?.is_nested || wantNested;
  const subLabel = base?.sub_label || colLabel(exposureMenu, subGrouping);
  const headerLabel = isNested
    ? `${base?.display_label ?? grouping ?? "Group"} × ${subLabel}`
    : base?.display_label ?? grouping ?? "Group";

  const rows = base?.rows ?? [];

  // Per-manager lookup: parent rows by label, children by "parent::child".
  const lookups = useMemo(
    () =>
      data.map((d) => {
        const map = new Map<string, number>();
        (d?.rows ?? []).forEach((r: ManagerExposureRow) => {
          map.set(r.label, r.current);
          (r.children ?? []).forEach((c) => map.set(`${r.label}::${c.label}`, c.current));
        });
        return map;
      }),
    [data],
  );

  const maxValue = useMemo(() => {
    let mv = 1;
    rows.forEach((r) => {
      mv = Math.max(mv, r.benchmark || 0);
      lookups.forEach((m) => {
        mv = Math.max(mv, m.get(r.label) ?? 0);
      });
      (r.children ?? []).forEach((c) => {
        mv = Math.max(mv, c.benchmark || 0);
        lookups.forEach((m) => {
          mv = Math.max(mv, m.get(`${r.label}::${c.label}`) ?? 0);
        });
      });
    });
    return mv;
  }, [rows, lookups]);

  const columnCount = 2 + managers.length;
  const benchShort = shortenExpBenchmark(base?.benchmark_name) ?? "Benchmark";

  const coverageNote = base ? `Holdings coverage: ${base.coverage_current}%` : "";
  // Only meaningful once a fetch has actually completed for this selection —
  // an empty `data` array means "no grouping picked yet"/"still loading",
  // not "these managers have no exposure data".
  const resultsReady = !loading && data.length === managers.length && !!base;
  const missing = resultsReady
    ? managers.filter((_, i) => {
        const d = data[i];
        return d == null || !!d.error || !(d.rows ?? []).length;
      })
    : [];

  return (
    <div className="contrib-section mb-16" id="manager-exposures-section">
      <div className="panel">
        <div
          className="panel-header"
          style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
        >
          <span className="panel-title">Portfolio Exposures</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
            {coverageNote}
          </span>
          {missing.length ? (
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)" }}>
              ⚠ No exposure data for: {missing.map((m) => m.name).join(", ")}
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
                <th style={{ textAlign: "left", minWidth: 160 }}>{headerLabel}</th>
                <th
                  className="mono"
                  style={{ minWidth: 90 }}
                  title={base?.benchmark_name ?? undefined}
                >
                  {benchShort}
                </th>
                {managers.map((m) => (
                  <th
                    key={`${m.tab}-${m.name}`}
                    className="mono"
                    style={{ minWidth: 90 }}
                    title={m.name}
                  >
                    {m.name.length > 18 ? `${m.name.slice(0, 18)}…` : m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!exposureMenu.length ? (
                <tr>
                  <td colSpan={columnCount} style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
                    Upload a FactSet Exposures file on the Setup tab.
                  </td>
                </tr>
              ) : !grouping ? (
                <tr>
                  <td colSpan={columnCount} style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
                    Pick a grouping in row A or row B above.
                  </td>
                </tr>
              ) : loading && !base ? (
                <tr>
                  <td colSpan={columnCount} style={{ textAlign: "center", color: "var(--text3)", padding: 16, fontFamily: "var(--mono)", fontSize: 10 }}>
                    Loading…
                  </td>
                </tr>
              ) : data.find((d) => d?.error) && !base ? (
                <tr>
                  <td colSpan={columnCount} style={{ textAlign: "center", color: "var(--amber)", padding: 16, fontFamily: "var(--mono)", fontSize: 10 }}>
                    ⚠ {data.find((d) => d?.error)?.error}
                  </td>
                </tr>
              ) : !rows.length ? (
                <tr>
                  <td colSpan={columnCount} style={{ textAlign: "center", color: "var(--text3)", padding: 16 }}>
                    No data.
                  </td>
                </tr>
              ) : (
                rows.flatMap((row) => {
                  const isUnclass = row.label === "Unclassified";
                  const hasChildren =
                    isNested && !isUnclass && !!(row.children ?? []).length;
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
                      {managers.map((m, i) => (
                        <ValueCell
                          key={`${m.tab}-${m.name}`}
                          value={lookups[i]?.get(row.label)}
                          fillClass="exp-cur-fill"
                          maxAbs={maxValue}
                        />
                      ))}
                    </tr>
                  );

                  if (!hasChildren) return [parentRow];

                  const childRows = (row.children ?? []).map((c, ci) => (
                    <tr
                      key={`c::${row.label}::${ci}`}
                      className={`exp-child-row${isExpanded ? "" : " hidden"}`}
                      data-parent={row.label}
                    >
                      <td className="exp-label-cell">
                        {c.label}
                        {c.range_label ? <span className="exp-q-range">{c.range_label}</span> : null}
                      </td>
                      <ValueCell value={c.benchmark || 0} fillClass="exp-bmk-fill" maxAbs={maxValue} />
                      {managers.map((m, i) => (
                        <ValueCell
                          key={`${m.tab}-${m.name}`}
                          value={lookups[i]?.get(`${row.label}::${c.label}`)}
                          fillClass="exp-cur-fill"
                          maxAbs={maxValue}
                        />
                      ))}
                    </tr>
                  ));

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
