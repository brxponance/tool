"use client";

import { formatDateLabel } from "@/lib/utils";

type CumulativeSkillChartProps = {
  dates: string[];
  values: Array<number | null>;
};

export function CumulativeSkillChart({ dates, values }: CumulativeSkillChartProps) {
  // Backend returns most-recent-first; flip to chronological and drop nulls.
  const points: Array<{ date: string; value: number }> = [];
  const limit = Math.min(values.length, dates.length);
  for (let i = 0; i < limit; i += 1) {
    const v = values[i];
    if (v == null || Number.isNaN(v)) continue;
    points.push({ date: dates[i], value: v });
  }
  points.reverse();

  if (!points.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-[11px] text-[var(--text3)] font-mono">
        No skill history available
      </div>
    );
  }

  const width = 640;
  const height = 220;
  const padLeft = 40;
  const padRight = 12;
  const padTop = 12;
  const padBottom = 24;

  const xs = (i: number) =>
    padLeft + (i / Math.max(points.length - 1, 1)) * (width - padLeft - padRight);

  const valuesArr = points.map((p) => p.value);
  let yMin = Math.min(0, ...valuesArr);
  let yMax = Math.max(0, ...valuesArr);
  if (yMin === yMax) {
    yMin -= 0.01;
    yMax += 0.01;
  }
  const yPad = (yMax - yMin) * 0.08;
  yMin -= yPad;
  yMax += yPad;
  const ys = (v: number) =>
    padTop + (1 - (v - yMin) / (yMax - yMin)) * (height - padTop - padBottom);

  const polyline = points.map((p, i) => `${xs(i)},${ys(p.value)}`).join(" ");
  const last = points[points.length - 1];
  const isPositive = last.value >= 0;
  const stroke = isPositive ? "#00d4a0" : "#ff4d6d";
  const fill = isPositive ? "rgba(0,212,160,0.10)" : "rgba(255,77,109,0.10)";

  const area = `${xs(0)},${ys(yMin < 0 ? 0 : yMin)} ${polyline} ${xs(points.length - 1)},${ys(yMin < 0 ? 0 : yMin)}`;

  // Y axis ticks: 4 evenly spaced
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => yMin + t * (yMax - yMin));
  const xTickIdx = [
    0,
    Math.floor((points.length - 1) / 3),
    Math.floor((2 * (points.length - 1)) / 3),
    points.length - 1,
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 220 }}>
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
            {fmtPct(t)}
          </text>
        </g>
      ))}
      <polygon points={area} fill={fill} />
      <polyline points={polyline} fill="none" stroke={stroke} strokeWidth={2} />
      {xTickIdx.map((i) => (
        <text
          key={i}
          x={xs(i)}
          y={height - 6}
          textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
          fontSize="10"
          fill="#7a9ab5"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          {formatDateLabel(points[i].date)}
        </text>
      ))}
    </svg>
  );
}
