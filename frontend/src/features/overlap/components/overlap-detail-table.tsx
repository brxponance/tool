"use client";

import type { HoldingsOverlapDetailResponse } from "../types";

type Props = {
  data: HoldingsOverlapDetailResponse | null;
  loading: boolean;
  error: string | null;
};

function pct(v: number | null | undefined, digits = 2) {
  // The engine returns these weights already in percentage points (a single
  // holding's within-manager weight, e.g. 1.52 = 1.52%), so append % without
  // multiplying by 100.
  if (v == null) return "—";
  return `${v.toFixed(digits)}%`;
}

export function OverlapDetailTable({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div style={{ padding: 16, fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)" }}>
        Loading shared holdings…
      </div>
    );
  }
  if (error) {
    return <div className="alert alert-error" style={{ margin: 16 }}>{error}</div>;
  }
  if (!data) return null;

  const rows = data.rows ?? [];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)", marginBottom: 8 }}>
        <strong>{data.name_i}</strong> ({(data.alloc_i ?? 0).toFixed(1)}%) ×{" "}
        <strong>{data.name_j}</strong> ({(data.alloc_j ?? 0).toFixed(1)}%) —{" "}
        {data.shared_count ?? rows.length} shared securities
      </div>
      {rows.length === 0 ? (
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)" }}>
          No shared securities on this basis.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Security</th>
                <th>Sector</th>
                <th>Country</th>
                <th className="mono">{data.name_i} (internal)</th>
                <th className="mono">{data.name_j} (internal)</th>
                <th className="mono">{data.name_i} (scaled)</th>
                <th className="mono">{data.name_j} (scaled)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={`${r.sedol}-${idx}`}>
                  <td>
                    {r.name}
                    {r.n_lines > 1 ? (
                      <span style={{ color: "var(--text3)", fontSize: 10 }}> · {r.n_lines} lines</span>
                    ) : null}
                  </td>
                  <td>{r.sector ?? "—"}</td>
                  <td>{r.country ?? "—"}</td>
                  <td className="mono">{pct(r.wi_internal)}</td>
                  <td className="mono">{pct(r.wj_internal)}</td>
                  <td className="mono">{pct(r.wi_scaled)}</td>
                  <td className="mono">{pct(r.wj_scaled)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
