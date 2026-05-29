"use client";

import type { OptimizerSummary } from "../types";

const cardStyle: React.CSSProperties = {
  padding: "10px 14px",
  border: "1px solid var(--border)",
  background: "var(--bg1)",
};
const label: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--text3)",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
const value: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 16,
  color: "var(--text1)",
  marginTop: 4,
};

function pct(v: number) {
  return `${(v * 100).toFixed(2)}%`;
}

export function OptimizerSummaryPanel({ summary }: { summary: OptimizerSummary }) {
  const excluded =
    (summary.candidates_excluded_no_skill ?? 0) +
    (summary.candidates_excluded_xus ?? 0) +
    (summary.candidates_excluded_forced_firm ?? 0);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 10,
        marginTop: 16,
      }}
    >
      <div style={cardStyle}>
        <div style={label}>Expected norm skill</div>
        <div style={value}>{summary.expected_norm_skill.toFixed(3)}</div>
      </div>
      <div style={cardStyle}>
        <div style={label}>Portfolio V-G (3-factor)</div>
        <div style={value}>{summary.portfolio_vg_3factor.toFixed(3)}</div>
      </div>
      <div style={cardStyle}>
        <div style={label}>Managers</div>
        <div style={value}>
          {summary.n_managers}{" "}
          <span style={{ color: "var(--text3)", fontSize: 12 }}>
            ({summary.n_selected} picked · {summary.n_forced} forced)
          </span>
        </div>
      </div>
      <div style={cardStyle}>
        <div style={label}>Total weight</div>
        <div style={value}>{pct(summary.total_weight)}</div>
      </div>
      <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
        <div style={label}>Candidates considered</div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--text2)",
            marginTop: 4,
          }}
        >
          {summary.candidates_considered} eligible
          {excluded > 0 && (
            <>
              {" · "}excluded:{" "}
              {summary.candidates_excluded_no_skill ?? 0} no-skill ·{" "}
              {summary.candidates_excluded_xus ?? 0} xUS ·{" "}
              {summary.candidates_excluded_forced_firm ?? 0} forced-firm
            </>
          )}
          {summary.skill_uncovered_weight > 0 && (
            <>
              {" · "}skill uncovered weight:{" "}
              <span style={{ color: "var(--yellow)" }}>
                {pct(summary.skill_uncovered_weight)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
