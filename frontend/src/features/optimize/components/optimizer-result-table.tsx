"use client";

import type { OptimizedManager } from "../types";

const th: React.CSSProperties = {
  textAlign: "left",
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--text3)",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  padding: "8px 10px",
  borderBottom: "1px solid var(--border)",
};
const td: React.CSSProperties = {
  padding: "8px 10px",
  fontFamily: "var(--mono)",
  fontSize: 12,
  color: "var(--text)",
  borderBottom: "1px solid var(--border)",
};
const tdNum: React.CSSProperties = { ...td, textAlign: "right" };
const thNum: React.CSSProperties = { ...th, textAlign: "right" };

function fmtPct(v: number) {
  return `${(v * 100).toFixed(2)}%`;
}

export function OptimizerResultTable({
  managers,
}: {
  managers: OptimizedManager[];
}) {
  if (!managers.length) {
    return null;
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
      <thead>
        <tr>
          <th style={th}>Manager</th>
          <th style={th}>Tab</th>
          <th style={thNum}>Weight</th>
          <th style={thNum}>ns_z</th>
          <th style={thNum}>V-G (3-factor)</th>
          <th style={thNum}>R² (full)</th>
          <th style={th}>Source</th>
        </tr>
      </thead>
      <tbody>
        {managers.map((m) => (
          <tr key={`${m.tab}::${m.name}`}>
            <td style={td}>{m.name}</td>
            <td style={td}>{m.tab}</td>
            <td style={tdNum}>{fmtPct(m.weight)}</td>
            <td style={tdNum}>{m.ns_z != null ? m.ns_z.toFixed(2) : "—"}</td>
            <td style={tdNum}>{m.vg_3factor != null ? m.vg_3factor.toFixed(3) : "—"}</td>
            <td style={tdNum}>{m.r2_full != null ? m.r2_full.toFixed(3) : "—"}</td>
            <td style={td}>
              {m.is_forced ? (
                <span style={{ color: "var(--accent)" }}>
                  Forced ({m.forced_kind ?? "pinned"})
                </span>
              ) : (
                <span style={{ color: "var(--text3)" }}>Optimizer</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
