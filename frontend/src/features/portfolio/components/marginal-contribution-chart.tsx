"use client";

import { useMemo } from "react";

import type { RiskAnalysisResponse } from "../types";

type Props = {
  data: RiskAnalysisResponse | null;
  loading: boolean;
};

const COLORS = {
  curTE: "rgba(0, 119, 204, 0.85)",
  curDD: "rgba(0, 119, 204, 0.40)",
  propTE: "rgba(0, 163, 122, 0.85)",
  propDD: "rgba(0, 163, 122, 0.40)",
};

const SERIES: Array<{ key: keyof typeof COLORS; label: string }> = [
  { key: "curTE", label: "Current TE" },
  { key: "curDD", label: "Current DD" },
  { key: "propTE", label: "Proposed TE" },
  { key: "propDD", label: "Proposed DD" },
];

function fmtPctN(value: number | null | undefined, digits = 2): string {
  if (value == null || Number.isNaN(value)) return "--";
  return `${(value * 100).toFixed(digits)}%`;
}

function niceStep(maxAbs: number): number {
  if (maxAbs <= 0) return 0.5;
  const exp = Math.floor(Math.log10(maxAbs));
  const base = Math.pow(10, exp);
  const n = maxAbs / base;
  let step;
  if (n <= 1) step = 0.2;
  else if (n <= 2) step = 0.5;
  else if (n <= 5) step = 1;
  else step = 2;
  return step * base;
}

export function MarginalContributionChart({ data, loading }: Props) {
  const cur = data?.marginal.current ?? null;
  const prop = data?.marginal.proposed ?? null;

  const { names, bars, axisMax, axisMin, ticks } = useMemo(() => {
    const curMap = Object.fromEntries((cur?.managers ?? []).map((r) => [r.name, r]));
    const propMap = Object.fromEntries((prop?.managers ?? []).map((r) => [r.name, r]));
    const allNames = Array.from(new Set([...Object.keys(curMap), ...Object.keys(propMap)]));
    allNames.sort((a, b) => {
      const wa = curMap[a]?.base_weight ?? propMap[a]?.base_weight ?? 0;
      const wb = curMap[b]?.base_weight ?? propMap[b]?.base_weight ?? 0;
      return wb - wa;
    });

    const barsByName = allNames.map((name) => ({
      name,
      values: {
        curTE: curMap[name]?.te_delta_pct != null ? curMap[name].te_delta_pct! * 100 : null,
        curDD: curMap[name]?.dd_delta_pct != null ? curMap[name].dd_delta_pct! * 100 : null,
        propTE: propMap[name]?.te_delta_pct != null ? propMap[name].te_delta_pct! * 100 : null,
        propDD: propMap[name]?.dd_delta_pct != null ? propMap[name].dd_delta_pct! * 100 : null,
      },
    }));

    let maxV = 0;
    let minV = 0;
    barsByName.forEach((b) => {
      Object.values(b.values).forEach((v) => {
        if (v == null) return;
        if (v > maxV) maxV = v;
        if (v < minV) minV = v;
      });
    });
    const absMax = Math.max(Math.abs(maxV), Math.abs(minV), 0.5);
    const step = niceStep(absMax);
    const top = Math.ceil(absMax / step) * step;
    const tickArr: number[] = [];
    for (let v = -top; v <= top + 1e-9; v += step) {
      tickArr.push(Number(v.toFixed(6)));
    }

    return {
      names: allNames,
      bars: barsByName,
      axisMax: top,
      axisMin: -top,
      ticks: tickArr,
    };
  }, [cur, prop]);

  // Layout — use a viewBox so the chart scales to fill the panel width.
  const width = 1200;
  const height = 440;
  const margin = { top: 16, right: 32, bottom: 60, left: 64 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const yScale = (v: number) =>
    margin.top + innerH * (1 - (v - axisMin) / (axisMax - axisMin));

  const groupW = names.length ? innerW / names.length : 0;
  const barGroupPad = Math.max(8, groupW * 0.18);
  const barW = names.length
    ? Math.max(4, (groupW - barGroupPad * 2) / SERIES.length)
    : 0;

  const summary = (
    <div
      id="marginal-bases"
      style={{
        display: "flex",
        gap: 24,
        padding: "6px 16px 12px",
        fontFamily: "var(--mono)",
        fontSize: 11,
      }}
    >
      <span>
        <span style={{ color: "var(--text3)" }}>Current — </span>
        Base TE:{" "}
        <span style={{ color: "var(--text)" }}>{fmtPctN(cur?.base_te)}</span> · DD:{" "}
        <span style={{ color: "var(--text)" }}>{fmtPctN(cur?.base_dd)}</span>
      </span>
      <span>
        <span style={{ color: "var(--text3)" }}>Proposed — </span>
        Base TE:{" "}
        <span style={{ color: "var(--text)" }}>{fmtPctN(prop?.base_te)}</span> · DD:{" "}
        <span style={{ color: "var(--text)" }}>{fmtPctN(prop?.base_dd)}</span>
      </span>
    </div>
  );

  if (loading && !data) {
    return (
      <div
        style={{
          padding: 20,
          textAlign: "center",
          color: "var(--text3)",
          fontFamily: "var(--mono)",
          fontSize: 11,
        }}
      >
        Loading risk analysis...
      </div>
    );
  }
  if (data?.error) {
    return (
      <div
        style={{
          padding: 20,
          textAlign: "center",
          color: "var(--amber)",
          fontFamily: "var(--mono)",
          fontSize: 11,
        }}
      >
        {data.error}
      </div>
    );
  }
  if (!names.length) {
    return (
      <>
        {summary}
        <div
          style={{
            padding: 20,
            textAlign: "center",
            color: "var(--text3)",
            fontFamily: "var(--mono)",
            fontSize: 11,
          }}
        >
          No positions to perturb.
        </div>
      </>
    );
  }

  return (
    <>
      {summary}
      <div style={{ padding: "0 12px 8px" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          width="100%"
          role="img"
          aria-label="Marginal contribution to risk"
          style={{ display: "block", height: "auto" }}
        >
          {/* Y gridlines + ticks */}
          {ticks.map((t) => {
            const y = yScale(t);
            return (
              <g key={`tick-${t}`}>
                <line
                  x1={margin.left}
                  x2={margin.left + innerW}
                  y1={y}
                  y2={y}
                  stroke={t === 0 ? "#cbd4de" : "#e2e7ed"}
                  strokeWidth={t === 0 ? 1 : 1}
                />
                <text
                  x={margin.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontFamily="var(--mono)"
                  fontSize={10}
                  fill="#4a6478"
                >
                  {(t >= 0 ? "+" : "") + t.toFixed(1) + "%"}
                </text>
              </g>
            );
          })}

          {/* Grouped bars */}
          {bars.map((g, i) => {
            const gx = margin.left + groupW * i + barGroupPad;
            const zeroY = yScale(0);
            return (
              <g key={`grp-${g.name}`}>
                {/* group separator (vertical) */}
                {i > 0 ? (
                  <line
                    x1={margin.left + groupW * i}
                    x2={margin.left + groupW * i}
                    y1={margin.top}
                    y2={margin.top + innerH}
                    stroke="#e2e7ed"
                  />
                ) : null}
                {SERIES.map((s, si) => {
                  const v = g.values[s.key];
                  if (v == null) return null;
                  const yv = yScale(v);
                  const top = Math.min(yv, zeroY);
                  const h = Math.max(1, Math.abs(yv - zeroY));
                  return (
                    <rect
                      key={s.key}
                      x={gx + si * barW}
                      y={top}
                      width={Math.max(2, barW - 1)}
                      height={h}
                      fill={COLORS[s.key]}
                    >
                      <title>{`${s.label}: ${(v >= 0 ? "+" : "") + v.toFixed(2)}%`}</title>
                    </rect>
                  );
                })}
                {/* X label */}
                <text
                  x={margin.left + groupW * (i + 0.5)}
                  y={margin.top + innerH + 18}
                  textAnchor="middle"
                  fontFamily="var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif"
                  fontSize={11}
                  fill="#4a6478"
                >
                  {g.name}
                </text>
              </g>
            );
          })}

          {/* Plot frame */}
          <rect
            x={margin.left}
            y={margin.top}
            width={innerW}
            height={innerH}
            fill="none"
            stroke="#e2e7ed"
          />
        </svg>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 18,
            paddingTop: 6,
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "#4a6478",
          }}
        >
          {SERIES.map((s) => (
            <span key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  background: COLORS[s.key],
                  borderRadius: 2,
                }}
              />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
