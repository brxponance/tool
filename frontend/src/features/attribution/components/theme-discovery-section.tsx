"use client";

import { useState } from "react";

import { formatPercent } from "@/lib/utils";

import type { ThemeDiscoveryResponse, ThemeRow } from "../types";

// Benchmark theme discovery (P1). Ranks grouping combinations by how much they
// added or cost versus the benchmark's own average return.
//
// Why there are three views rather than one ranked list: E_G answers "what
// moved the benchmark" and favours large groups; intensity answers "what
// punched above its weight" and favours concentrated ones. A 25%-weight sector
// beating by 60bps and a 3%-weight industry beating by 900bps are both worth
// knowing, and neither ranking surfaces the other.

type View = "contributors" | "detractors" | "most_outsized";

const VIEWS: Array<{ key: View; label: string; note: string }> = [
  { key: "contributors", label: "Top contributors", note: "ranked by contribution vs benchmark" },
  { key: "detractors", label: "Top detractors", note: "ranked by contribution vs benchmark" },
  { key: "most_outsized", label: "Most outsized", note: "ranked by impact per unit of weight" },
];

function signClass(value: number | null | undefined) {
  if (value == null) return "";
  return value >= 0 ? "skill-pos" : "skill-neg";
}

function bps(value: number | null | undefined) {
  if (value == null) return "--";
  return `${value >= 0 ? "+" : ""}${value.toFixed(0)}`;
}

function ThemeTable({
  rows,
  ratioAvailable,
  onPinTheme,
  pinnedLabel,
}: {
  rows: ThemeRow[];
  ratioAvailable: boolean;
  onPinTheme?: (row: ThemeRow) => void;
  pinnedLabel?: string | null;
}) {
  if (!rows.length) {
    return (
      <div style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
        No groups cleared the weight floor for this view.
      </div>
    );
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="data-table w-full">
        <thead>
          <tr>
            <th style={{ width: 28 }}>#</th>
            <th>Theme</th>
            <th className="mono">Weight</th>
            <th className="mono">Group Ret</th>
            <th className="mono">vs Bmk</th>
            <th className="mono sep-col" title="Weight × (group return − benchmark return)">
              Impact (bps)
            </th>
            <th className="mono" title="Share of the benchmark's total active dispersion">
              Share
            </th>
            <th className="mono" title="Share of dispersion per unit of weight. >1 = outsized.">
              Intensity
            </th>
            {ratioAvailable ? (
              <>
                <th
                  className="mono"
                  title="How much of the benchmark's total return this group accounted for. Can exceed 100% — winners and losers offset, so the survivors carry more than the net."
                >
                  Sh. of Ret
                </th>
                <th
                  className="mono"
                  title="Share of return minus share of weight, in percentage points. A group with 20% of the weight would account for 20% of the return if it were unremarkable; this is how far past that it landed."
                >
                  Excess
                </th>
              </>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={`${row.label}-${idx}`}
              onClick={onPinTheme ? () => onPinTheme(row) : undefined}
              style={
                onPinTheme
                  ? {
                      cursor: "pointer",
                      background:
                        pinnedLabel === row.label ? "var(--row-active, rgba(127,127,127,0.12))" : undefined,
                    }
                  : undefined
              }
              title={onPinTheme ? "Click to see who held this theme" : undefined}
            >
              <td className="mono" style={{ color: "var(--text3)" }}>{idx + 1}</td>
              <td title={`${row.detail} — ${row.members} securities`}>{row.label}</td>
              <td className="mono">{formatPercent(row.w, 2)}</td>
              <td className="mono">{formatPercent(row.r_g, 1)}</td>
              <td className={`mono ${signClass(row.excess)}`}>
                {formatPercent(row.excess, 1)}
              </td>
              <td className={`mono sep-col ${signClass(row.e_g_bps)}`} style={{ fontWeight: 600 }}>
                {bps(row.e_g_bps)}
              </td>
              <td className="mono">{formatPercent(row.share, 1)}</td>
              <td
                className="mono"
                style={{
                  color: (row.intensity ?? 0) >= 1.5 ? "var(--amber)" : undefined,
                  fontWeight: (row.intensity ?? 0) >= 1.5 ? 600 : undefined,
                }}
              >
                {row.intensity == null ? "--" : `${row.intensity.toFixed(2)}×`}
              </td>
              {ratioAvailable ? (
                <>
                  <td className="mono">
                    {row.phi == null ? "--" : `${(row.phi * 100).toFixed(0)}%`}
                  </td>
                  <td className={`mono ${signClass(row.excess_share)}`}>
                    {row.excess_share == null
                      ? "--"
                      : `${row.excess_share >= 0 ? "+" : ""}${(row.excess_share * 100).toFixed(0)}pp`}
                  </td>
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type Props = {
  data: ThemeDiscoveryResponse | null;
  loading?: boolean;
  onSelectBenchmark?: (benchmark: string) => void;
  onSelectPeriod?: (period: string) => void;
  /** Clicking a theme row pins it, opening the positioning panel below. */
  onPinTheme?: (row: ThemeRow) => void;
  pinnedLabel?: string | null;
  emptyHint?: string;
};

export function ThemeDiscoverySection({
  data,
  loading,
  onSelectBenchmark,
  onSelectPeriod,
  onPinTheme,
  pinnedLabel,
  emptyHint,
}: Props) {
  const [view, setView] = useState<View>("contributors");

  const hint =
    emptyHint ??
    "Upload a FactSet Exposures file carrying Average Weight and Contribution To Return on the Setup tab.";

  if (!data || data.error) {
    return (
      <div className="panel mb-16">
        <div className="panel-header">
          <span className="panel-title">Benchmark Theme Discovery</span>
        </div>
        <div style={{ textAlign: "center", color: data?.error ? "var(--amber)" : "var(--text3)", padding: 20 }}>
          {loading ? "Loading…" : data?.error ?? hint}
        </div>
      </div>
    );
  }

  const rec = data.reconciliation;
  const reconciled =
    rec.sum_weight_ok && rec.partition_sum_ok && rec.total_matches_reported !== false;
  const active = VIEWS.find((v) => v.key === view) ?? VIEWS[0];

  return (
    <div className="panel mb-16">
      <div className="panel-header" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span className="panel-title">Benchmark Theme Discovery</span>
        {data.available_benchmarks?.length > 1 && onSelectBenchmark ? (
          <div className="select-wrap">
            <select value={data.benchmark} onChange={(e) => onSelectBenchmark(e.target.value)}>
              {data.available_benchmarks.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        ) : (
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
            {data.benchmark}
          </span>
        )}
        {data.periods?.length > 1 && onSelectPeriod ? (
          <div className="select-wrap">
            <select value={data.period} onChange={(e) => onSelectPeriod(e.target.value)}>
              {data.periods.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        ) : (
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
            {data.period}
          </span>
        )}
      </div>

      {/* The backdrop. Without R_b on screen a reader cannot tell whether a
          positive impact means "beat a rising market" or "cushioned a fall". */}
      <div
        style={{
          display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center",
          padding: "8px 16px", borderBottom: "1px solid var(--border)",
          fontFamily: "var(--mono)", fontSize: 10, color: "var(--text2)",
        }}
      >
        <span>
          Benchmark return{" "}
          <strong className={signClass(data.r_b_bps)}>{bps(data.r_b_bps)} bps</strong>
        </span>
        <span>{data.n_securities} securities</span>
        <span>{data.n_candidates} groups tested</span>
        <span>floor {formatPercent(data.min_weight, 0)} weight</span>
        <span style={{ color: reconciled ? "var(--green)" : "var(--amber)" }}>
          {reconciled ? "✓ reconciled" : "⚠ reconciliation failed"}
        </span>
        {!data.ratio_available ? (
          <span style={{ color: "var(--text3)" }}>
            benchmark return within ±{data.ratio_floor_bps.toFixed(0)}bps — share-of-return
            ratio withheld as meaningless at this level
          </span>
        ) : null}
      </div>

      {!reconciled ? (
        <div style={{ padding: "8px 16px", background: "rgba(217,75,66,.06)", fontSize: 11, color: "var(--amber)" }}>
          Weights sum to {formatPercent(rec.sum_weight, 3)}; partition residual{" "}
          {rec.partition_sum_e_g.toExponential(2)}
          {rec.total_matches_reported === false
            ? `; Σ contribution ${formatPercent(rec.sum_contribution, 3)} ≠ reported total ${formatPercent(rec.reported_total, 3)}`
            : ""}
          . Treat the ranking below as unverified until this clears.
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 6, padding: "8px 16px", flexWrap: "wrap", alignItems: "baseline" }}>
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            className={`btn ${view === v.key ? "btn-primary" : "btn-outline"} btn-sm`}
            style={{ fontSize: 10, padding: "2px 8px" }}
            onClick={() => setView(v.key)}
          >
            {v.label}
          </button>
        ))}
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", marginLeft: 4 }}>
          {active.note}
        </span>
      </div>

      <ThemeTable
        rows={data[view]}
        ratioAvailable={data.ratio_available}
        onPinTheme={onPinTheme}
        pinnedLabel={pinnedLabel}
      />
    </div>
  );
}
