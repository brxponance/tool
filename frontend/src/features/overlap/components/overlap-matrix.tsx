"use client";

import type { HoldingsOverlapResponse, OverlapPair } from "../types";

type MetricKey = "common_weight" | "jaccard";

type Props = {
  data: HoldingsOverlapResponse;
  metric: MetricKey;
  onMetricChange: (m: MetricKey) => void;
  activePairKey: string | null;
  onCellClick: (i: number, j: number, nameI: string, nameJ: string) => void;
};

// The two bases the engine returns per pair. "internal" = strategy similarity
// (each manager's own weights). "scaled" = client doubling-up (weights ×
// allocation). We show internal on the upper triangle and scaled on the lower.
function metricValue(pair: OverlapPair, basis: "internal" | "scaled", metric: MetricKey) {
  const m = pair[basis];
  return metric === "jaccard" ? m.jaccard : m.common_weight;
}

// common_weight is a fraction of portfolio weight (0–1 on internal basis,
// smaller on scaled); jaccard is 0–1. Both map cleanly to a 0–1 intensity by
// normalising against the max cell so the strongest overlap is fully saturated.
function cellColor(intensity: number) {
  const clamped = Math.max(0, Math.min(1, intensity));
  // Xponance accent blue, from transparent → saturated.
  return `rgba(37, 99, 235, ${(0.08 + clamped * 0.82).toFixed(3)})`;
}

function fmt(value: number, metric: MetricKey) {
  // jaccard is a 0–1 fraction (name overlap); common_weight is already in
  // percentage points (Σ min of the managers' internal position weights,
  // which sum to ~100), so it must NOT be multiplied by 100 again.
  if (metric === "jaccard") return `${(value * 100).toFixed(0)}%`;
  return `${value.toFixed(2)}%`;
}

export function OverlapMatrix({
  data,
  metric,
  onMetricChange,
  activePairKey,
  onCellClick,
}: Props) {
  const managers = data.managers ?? [];
  const pairs = data.pairs ?? [];
  const n = managers.length;

  // Index the pairs by (i,j) for O(1) cell lookup.
  const pairByKey = new Map<string, OverlapPair>();
  for (const p of pairs) {
    pairByKey.set(`${p.i}:${p.j}`, p);
  }

  // Max value across both bases for intensity normalisation.
  let maxVal = 0;
  for (const p of pairs) {
    maxVal = Math.max(
      maxVal,
      metricValue(p, "internal", metric),
      metricValue(p, "scaled", metric),
    );
  }
  const norm = maxVal > 0 ? maxVal : 1;

  const cellStyle: React.CSSProperties = {
    width: 64,
    height: 44,
    textAlign: "center",
    verticalAlign: "middle",
    fontFamily: "var(--mono)",
    fontSize: 11,
    border: "1px solid var(--border)",
  };
  const headStyle: React.CSSProperties = {
    fontFamily: "var(--mono)",
    fontSize: 10,
    color: "var(--text3)",
    padding: "4px 6px",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>Metric:</span>
          <div className="select-wrap">
            <select value={metric} onChange={(e) => onMetricChange(e.target.value as MetricKey)}>
              <option value="common_weight">Common weight (Σ min)</option>
              <option value="jaccard">Jaccard (name overlap)</option>
            </select>
          </div>
        </div>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
          Upper triangle = strategy similarity · Lower triangle = client doubling-up · click a cell for shared holdings
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={headStyle}></th>
              {managers.map((m, idx) => (
                <th key={idx} style={headStyle} title={`${m.display} · ${m.count} holdings · ${m.alloc.toFixed(1)}%`}>
                  {idx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {managers.map((rowMgr, i) => (
              <tr key={i}>
                <th style={{ ...headStyle, textAlign: "right", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}
                    title={`${rowMgr.display} · ${rowMgr.count} holdings · ${rowMgr.alloc.toFixed(1)}%`}>
                  {i + 1}. {rowMgr.display}
                </th>
                {managers.map((_, j) => {
                  if (i === j) {
                    return (
                      <td key={j} style={{ ...cellStyle, background: "var(--surface2)", color: "var(--text3)" }}>
                        —
                      </td>
                    );
                  }
                  // Pairs are stored with i < j. Upper triangle (j > i) uses
                  // the internal basis; lower triangle (j < i) uses scaled.
                  const isUpper = j > i;
                  const key = isUpper ? `${i}:${j}` : `${j}:${i}`;
                  const pair = pairByKey.get(key);
                  if (!pair) {
                    return <td key={j} style={cellStyle} />;
                  }
                  const basis = isUpper ? "internal" : "scaled";
                  const val = metricValue(pair, basis, metric);
                  const isActive = activePairKey === key;
                  return (
                    <td
                      key={j}
                      style={{
                        ...cellStyle,
                        background: cellColor(val / norm),
                        cursor: "pointer",
                        outline: isActive ? "2px solid var(--accent)" : undefined,
                        color: val / norm > 0.55 ? "#fff" : "var(--text)",
                      }}
                      title={`${rowMgr.display} × ${managers[j].display} — ${basis}`}
                      onClick={() => onCellClick(pair.i, pair.j, pair.name_i, pair.name_j)}
                    >
                      {val > 0 ? fmt(val, metric) : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {n > 0 && (
        <div style={{ marginTop: 12, fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
          {managers.map((m, idx) => (
            <span key={idx} style={{ marginRight: 16 }}>
              {idx + 1}. {m.display} ({m.count} holdings, {m.alloc.toFixed(1)}%)
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
