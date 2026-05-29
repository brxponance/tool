"use client";

import { useMemo } from "react";

import type { ReportMockData, ReportMockMcrMgr } from "../lib/report-mock";

// SVG-based grouped bar chart for Marginal Contribution to Risk. Two series
// per manager (Current TE, Current DD) rendered as side-by-side bars sorted
// by descending base weight. Mirrors the Chart.js layout in the legacy
// monolith but stays dependency-free.

const COLOR_TE = "rgba(0, 119, 204, 0.85)";
const COLOR_DD = "rgba(0, 119, 204, 0.40)";

type SeriesPoint = { label: string; te: number; dd: number };

function buildSeries(mgrs: ReportMockMcrMgr[]): SeriesPoint[] {
  // te_delta_pct and dd_delta_pct are decimals → render as percentage points
  return [...mgrs]
    .sort((a, b) => (b.base_weight ?? 0) - (a.base_weight ?? 0))
    .map((m) => ({
      label: m.name,
      te: (m.te_delta_pct ?? 0) * 100,
      dd: (m.dd_delta_pct ?? 0) * 100,
    }));
}

function niceStep(maxAbs: number): number {
  if (maxAbs <= 0) return 0.5;
  const exp = Math.floor(Math.log10(maxAbs));
  const base = Math.pow(10, exp);
  const n = maxAbs / base;
  if (n <= 1) return 0.2 * base;
  if (n <= 2) return 0.5 * base;
  if (n <= 5) return 1 * base;
  return 2 * base;
}

function ticksFor(maxAbs: number): number[] {
  const step = niceStep(maxAbs);
  const upper = Math.ceil(maxAbs / step) * step;
  const out: number[] = [];
  for (let v = -upper; v <= upper + 1e-9; v += step) {
    out.push(Math.round(v * 1000) / 1000);
  }
  return out;
}

function fmtPct(v: number, digits = 2): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(digits)}%`;
}

export function ReportMCR({ mcr }: { mcr: ReportMockData["mcr"] }) {
  const series = useMemo(() => buildSeries(mcr.managers), [mcr.managers]);

  // Layout constants
  const WIDTH = 880;
  const HEIGHT = 240;
  const PAD_TOP = 16;
  const PAD_BOTTOM = 64;
  const PAD_LEFT = 56;
  const PAD_RIGHT = 14;
  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const allVals = series.flatMap((s) => [s.te, s.dd]);
  const maxAbs = Math.max(0.5, ...allVals.map(Math.abs));
  const ticks = ticksFor(maxAbs);
  const yMax = Math.max(...ticks);
  const yMin = -yMax;

  function yPos(v: number): number {
    const frac = (v - yMin) / (yMax - yMin);
    return PAD_TOP + plotH - frac * plotH;
  }
  const y0 = yPos(0);

  // Each manager group occupies a slot; two bars sit side-by-side inside.
  const slotW = plotW / Math.max(1, series.length);
  const barGap = 4;
  const barW = Math.max(6, (slotW - barGap * 3) / 2);

  return (
    <section className="rpt-section">
      <h3 className="rpt-section-title">Marginal Contribution to Risk — Current</h3>
      <div className="rpt-mcr-wrap">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Y axis grid + labels */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD_LEFT}
                x2={WIDTH - PAD_RIGHT}
                y1={yPos(t)}
                y2={yPos(t)}
                stroke="#e2e7ed"
                strokeWidth={1}
              />
              <text
                x={PAD_LEFT - 6}
                y={yPos(t) + 3}
                fontFamily="var(--mono)"
                fontSize={10}
                fill="#4a6478"
                textAnchor="end"
              >
                {fmtPct(t)}
              </text>
            </g>
          ))}

          {/* Zero line accent */}
          <line
            x1={PAD_LEFT}
            x2={WIDTH - PAD_RIGHT}
            y1={y0}
            y2={y0}
            stroke="#7a9ab5"
            strokeWidth={1}
          />

          {/* Bars */}
          {series.map((s, i) => {
            const slotX = PAD_LEFT + i * slotW;
            const teX = slotX + barGap;
            const ddX = teX + barW + barGap;
            const teY = yPos(Math.max(0, s.te));
            const teH = Math.abs(yPos(s.te) - y0);
            const ddY = yPos(Math.max(0, s.dd));
            const ddH = Math.abs(yPos(s.dd) - y0);
            return (
              <g key={s.label}>
                <rect x={teX} y={teY} width={barW} height={teH} fill={COLOR_TE} />
                <rect x={ddX} y={ddY} width={barW} height={ddH} fill={COLOR_DD} />
                <text
                  x={slotX + slotW / 2}
                  y={HEIGHT - PAD_BOTTOM + 14}
                  fontFamily="var(--sans)"
                  fontSize={10}
                  fill="#4a6478"
                  textAnchor="end"
                  transform={`rotate(-22 ${slotX + slotW / 2} ${HEIGHT - PAD_BOTTOM + 14})`}
                >
                  {s.label}
                </text>
              </g>
            );
          })}

          {/* Legend (bottom center) */}
          <g transform={`translate(${WIDTH / 2 - 110} ${HEIGHT - 14})`}>
            <rect x={0} y={-9} width={10} height={10} fill={COLOR_TE} />
            <text x={14} y={0} fontFamily="var(--mono)" fontSize={10} fill="#4a6478">
              Current TE
            </text>
            <rect x={100} y={-9} width={10} height={10} fill={COLOR_DD} />
            <text x={114} y={0} fontFamily="var(--mono)" fontSize={10} fill="#4a6478">
              Current DD
            </text>
          </g>
        </svg>
      </div>
      <div className="rpt-caption">
        <span style={{ color: "var(--text3)" }}>Base — </span>
        TE:{" "}
        <strong style={{ color: "var(--text)" }}>
          {(mcr.base_te * 100).toFixed(2)}%
        </strong>{" "}
        · DD:{" "}
        <strong style={{ color: "var(--text)" }}>
          {(mcr.base_dd * 100).toFixed(2)}%
        </strong>
        <span style={{ color: "var(--text3)", marginLeft: 10 }}>
          Bars show the relative % change in TE / DD from adding +1pp to that
          manager (with other managers reduced proportionally).
        </span>
      </div>
    </section>
  );
}
