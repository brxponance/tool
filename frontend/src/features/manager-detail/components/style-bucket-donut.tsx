"use client";

const BUCKET_COLORS: Record<string, string> = {
  Core: "#378add",
  Growth: "#E24B4A",
  Value: "#00d4a0",
  Yield: "#f4a938",
  Quality: "#8b5cf6",
  Dynamic: "#f97316",
  Defensive: "#6b7280",
  "Low Vol": "#14b8a6",
  Momentum: "#ec4899",
  Regional: "#84cc16",
  "Small Cap": "#a78bfa",
  Other: "#94a3b8",
};

type StyleBucketDonutProps = {
  buckets: Record<string, number>;
  size?: number;
};

export function StyleBucketDonut({ buckets, size = 220 }: StyleBucketDonutProps) {
  const entries = Object.entries(buckets ?? {})
    .filter(([, value]) => value > 0.005)
    .sort((left, right) => right[1] - left[1]);

  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  if (!entries.length || total <= 0) {
    return (
      <div
        style={{ height: size }}
        className="flex items-center justify-center text-[11px] text-[var(--text3)] font-mono"
      >
        No style bucket data
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;
  const innerRadius = radius * 0.55;

  // Build cumulative angle offsets so we never mutate during render.
  const fractions = entries.map(([, value]) => value / total);
  const offsets: number[] = [];
  fractions.reduce((acc, f) => {
    offsets.push(acc);
    return acc + f;
  }, 0);

  const arcs = entries.map(([label, value], index) => {
    const fraction = fractions[index];
    const start = -Math.PI / 2 + offsets[index] * Math.PI * 2;
    const end = start + fraction * Math.PI * 2;
    const largeArc = end - start > Math.PI ? 1 : 0;

    const x1 = cx + radius * Math.cos(start);
    const y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);
    const x3 = cx + innerRadius * Math.cos(end);
    const y3 = cy + innerRadius * Math.sin(end);
    const x4 = cx + innerRadius * Math.cos(start);
    const y4 = cy + innerRadius * Math.sin(start);

    const path = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ");

    return {
      label,
      value,
      path,
      color: BUCKET_COLORS[label] ?? "#94a3b8",
    };
  });

  return (
    <div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((arc) => (
          <path
            key={arc.label}
            d={arc.path}
            fill={arc.color}
            stroke="#111720"
            strokeWidth={1}
          >
            <title>{`${arc.label}: ${(arc.value * 100).toFixed(1)}%`}</title>
          </path>
        ))}
      </svg>
      <div className="pie-legend">
        {arcs.map((arc) => (
          <div key={arc.label} className="pie-legend-item">
            <div className="pie-swatch" style={{ background: arc.color }} />
            <span>
              {arc.label} {Math.round(arc.value * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
