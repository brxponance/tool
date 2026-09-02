"use client";

import { formatDateLabel } from "@/lib/utils";

// Categorical palette for up to MAX_COMPARE_MANAGERS series.
export const SERIES_COLORS = ["#0077cc", "#d94b42", "#22a24d", "#8b5cf6", "#d68c1f"];

export type SkillSeries = {
  name: string;
  // Backend order: most-recent-first. Values are the ADDITIVE cumulative
  // excess in percentage points (data_loader.compute_cumulative_skill).
  dates: string[];
  values: Array<number | null>;
};

type CumulativeSkillChartProps = {
  series: SkillSeries[];
};

type Point = { date: string; value: number };

// Chronological (date, cumulative-excess-%) pairs, nulls dropped.
function toChrono(s: SkillSeries): Point[] {
  const points: Point[] = [];
  const limit = Math.min(s.values.length, s.dates.length);
  for (let i = 0; i < limit; i += 1) {
    const v = s.values[i];
    if (v == null || Number.isNaN(v)) continue;
    points.push({ date: s.dates[i], value: v });
  }
  points.reverse();
  return points;
}

// Growth of $100 invested in the manager's excess return over its static
// clone. The backend's cumulative series is additive, so differencing
// consecutive values recovers each month's excess return; those compound
// from $100 at `startDate` (the common rebase point).
function growthOf100(points: Point[], startDate: string): Point[] {
  const out: Point[] = [];
  let value = 100;
  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];
    if (p.date < startDate) continue;
    if (!out.length) {
      // Rebase: $100 at the common start month.
      out.push({ date: p.date, value: 100 });
      continue;
    }
    const monthlyExcess = (p.value - points[i - 1].value) / 100;
    value *= 1 + monthlyExcess;
    out.push({ date: p.date, value });
  }
  return out;
}

export function CumulativeSkillChart({ series }: CumulativeSkillChartProps) {
  const raw = series
    .map((s) => ({ name: s.name, points: toChrono(s) }))
    .filter((s) => s.points.length > 1);

  if (!raw.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-[11px] text-[var(--text3)] font-mono">
        No skill history available
      </div>
    );
  }

  // Rebase everyone to the LATEST inception in the selection so the
  // comparison is like-for-like: a 2008-start manager restarts at $100 on
  // the 2012-start manager's first month.
  const commonStart = raw
    .map((s) => s.points[0].date)
    .reduce((a, b) => (a > b ? a : b));

  const drawn = raw
    .map((s) => ({ name: s.name, points: growthOf100(s.points, commonStart) }))
    .filter((s) => s.points.length > 1);

  if (!drawn.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-[11px] text-[var(--text3)] font-mono">
        No overlapping history across the selected managers
      </div>
    );
  }

  const allDates = Array.from(
    new Set(drawn.flatMap((s) => s.points.map((p) => p.date))),
  ).sort();
  const dateIdx = new Map(allDates.map((d, i) => [d, i]));

  // Shorter than a standalone chart: Period Returns shares this column
  // underneath, so the chart gives up vertical space to it.
  const width = 960;
  const height = 250;
  const padLeft = 56;
  const padRight = 16;
  const padTop = 12;
  const padBottom = 26;

  const xs = (i: number) =>
    padLeft + (i / Math.max(allDates.length - 1, 1)) * (width - padLeft - padRight);

  // Domain from the data; $100 is the reference line (the rebase level),
  // included so gains and losses read against the starting stake.
  const allVals = drawn.flatMap((s) => s.points.map((p) => p.value));
  let yMin = Math.min(100, ...allVals);
  let yMax = Math.max(100, ...allVals);
  if (yMin === yMax) {
    yMin -= 1;
    yMax += 1;
  }
  const yPad = (yMax - yMin) * 0.06;
  yMin -= yPad;
  yMax += yPad;
  const ys = (v: number) =>
    padTop + (1 - (v - yMin) / (yMax - yMin)) * (height - padTop - padBottom);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => yMin + t * (yMax - yMin));
  const xTickIdx = [0, 0.25, 0.5, 0.75, 1]
    .map((t) => Math.round(t * (allDates.length - 1)))
    .filter((v, i, arr) => arr.indexOf(v) === i);

  const fmtDollars = (v: number) => `$${v.toFixed(0)}`;

  const single = drawn.length === 1;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          padding: "2px 8px 6px",
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--text2)",
          alignItems: "center",
        }}
      >
        {!single &&
          drawn.map((s, i) => (
            <span key={s.name} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  width: 14,
                  height: 3,
                  background: SERIES_COLORS[i % SERIES_COLORS.length],
                  display: "inline-block",
                  borderRadius: 2,
                }}
              />
              {s.name}
              <span style={{ color: "var(--text3)" }}>
                {fmtDollars(s.points[s.points.length - 1].value)}
              </span>
            </span>
          ))}
        <span style={{ marginLeft: "auto", color: "var(--text3)" }}>
          $100 rebased {formatDateLabel(commonStart)}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={padLeft}
              x2={width - padRight}
              y1={ys(t)}
              y2={ys(t)}
              stroke="#e2e7ed"
              strokeDasharray="3 4"
            />
            <text
              x={padLeft - 6}
              y={ys(t) + 3}
              textAnchor="end"
              fontSize="10"
              fill="#7a9ab5"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            >
              {fmtDollars(t)}
            </text>
          </g>
        ))}
        {yMin < 100 && yMax > 100 ? (
          <line
            x1={padLeft}
            x2={width - padRight}
            y1={ys(100)}
            y2={ys(100)}
            stroke="#9db4c8"
            strokeWidth={1}
          />
        ) : null}
        {drawn.map((s, si) => {
          const pts = s.points
            .map((p) => `${xs(dateIdx.get(p.date) ?? 0).toFixed(1)},${ys(p.value).toFixed(1)}`)
            .join(" ");
          const last = s.points[s.points.length - 1];
          const color = single
            ? last.value >= 100
              ? "#00a37a"
              : "#d53d5f"
            : SERIES_COLORS[si % SERIES_COLORS.length];
          const first = s.points[0];
          const baseline = ys(Math.max(yMin, Math.min(100, yMax)));
          return (
            <g key={s.name}>
              {single ? (
                <polygon
                  points={`${xs(dateIdx.get(first.date) ?? 0)},${baseline} ${pts} ${xs(dateIdx.get(last.date) ?? 0)},${baseline}`}
                  fill={
                    last.value >= 100 ? "rgba(0,163,122,0.10)" : "rgba(213,61,95,0.10)"
                  }
                />
              ) : null}
              <polyline points={pts} fill="none" stroke={color} strokeWidth={2}>
                <title>{`${s.name} — ${fmtDollars(last.value)}`}</title>
              </polyline>
            </g>
          );
        })}
        {xTickIdx.map((i) => (
          <text
            key={i}
            x={xs(i)}
            y={height - 8}
            textAnchor={i === 0 ? "start" : i === allDates.length - 1 ? "end" : "middle"}
            fontSize="10"
            fill="#7a9ab5"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          >
            {formatDateLabel(allDates[i])}
          </text>
        ))}
      </svg>
    </div>
  );
}
