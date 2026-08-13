"use client";

import type { MarketCyclePlacement } from "../types";

// ── Bucket → x position lookup (mirrors old MC_BUCKETS) ──────────────────
export const MC_BUCKETS: Array<{ key: string; x: number }> = [
  { key: "Deep Value 1", x: 0.15 },
  { key: "Deep Value 2", x: 0.30 },
  { key: "Deep Value 3", x: 0.45 },
  { key: "Relative Value 1", x: 0.65 },
  { key: "Relative Value 2", x: 0.80 },
  { key: "Relative Value 3", x: 0.95 },
  { key: "GARP / Core 1", x: 1.20 },
  { key: "GARP / Core 2", x: 1.55 },
  { key: "GARP / Core 3", x: 1.90 },
  { key: "Core Growth 1", x: 2.10 },
  { key: "Core Growth 2", x: 2.275 },
  { key: "Core Growth 3", x: 2.45 },
  { key: "High Growth 1", x: 2.55 },
  { key: "High Growth 2", x: 2.75 },
  { key: "High Growth 3", x: 2.95 },
  { key: "Defensive 1", x: 3.10 },
  { key: "Defensive 2", x: 3.35 },
  { key: "Defensive 3", x: 3.60 },
];

// Wave shape: low-left rising to peak ~x=2.6, steep descent into recession.
// Returns y in roughly [-0.1, 1.0] where 1 = top of plot, 0 = baseline.
function waveY(x: number): number {
  if (x <= 0) return 0.12;
  if (x >= 4) return 0.0;
  if (x <= 2.6) {
    const t = x / 2.6;
    return 0.12 + (0.88 - 0.12) * (3 * t * t - 2 * t * t * t);
  }
  if (x <= 3.5) {
    const t = (x - 2.6) / 0.9;
    return 0.88 - (0.88 - -0.05) * (3 * t * t - 2 * t * t * t);
  }
  const t = (x - 3.5) / 0.5;
  return -0.05 + 0.05 * (3 * t * t - 2 * t * t * t);
}

function labelOffsets(placements: MarketCyclePlacement[], xScale: (x: number) => number) {
  const offsets = placements.map(() => ({ dx: 0, dy: 20 }));
  const order = placements
    .map((p, i) => ({ i, px: xScale(p.x ?? 0) }))
    .sort((a, b) => a.px - b.px);
  let lastPx = -999;
  let sign = 1;
  let stack = 0;
  for (const o of order) {
    if (o.px - lastPx < 42) {
      stack++;
      offsets[o.i].dy = sign > 0 ? 20 + stack * 14 : -(6 + stack * 14);
      sign = -sign;
    } else {
      stack = 0;
      sign = 1;
      offsets[o.i].dy = 20;
      lastPx = o.px;
    }
  }
  return offsets;
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (!cur) {
      cur = w;
      continue;
    }
    if ((`${cur} ${w}`).length > maxChars) {
      lines.push(cur);
      cur = w;
    } else {
      cur += ` ${w}`;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

// Apply user-selected bucket overrides to placements.
export function mcApplyOverrides(
  placements: MarketCyclePlacement[] | null | undefined,
  overrides: Record<string, string>,
): MarketCyclePlacement[] {
  if (!Array.isArray(placements)) return [];
  return placements.map((p) => {
    const override = overrides[p.name];
    if (!override || override === p.bucket) {
      return { ...p, is_override: false };
    }
    const def = MC_BUCKETS.find((b) => b.key === override);
    if (!def) return { ...p, is_override: false };
    return {
      ...p,
      bucket: override,
      x: def.x,
      is_override: true,
      _original_bucket: p.bucket,
      _original_x: p.x ?? null,
    };
  });
}

// Classify a placement as the portfolio moves from current → proposed weights.
export type McStatus = "retained" | "removed" | "added";

export function mcStatus(p: MarketCyclePlacement): McStatus {
  const cw = p.current_weight || 0;
  const pw = p.proposed_weight || 0;
  if (cw > 0 && pw <= 0) return "removed";
  if (cw <= 0 && pw > 0) return "added";
  return "retained";
}

// Dot colors for the combined market-cycle chart.
export const MC_STATUS_COLORS: Record<McStatus, { fill: string; stroke: string }> = {
  retained: { fill: "#0077cc", stroke: "#004a80" },
  removed: { fill: "#d94b42", stroke: "#a3352e" },
  added: { fill: "#22a24d", stroke: "#14713a" },
};

const MC_STATUS_LABELS: Record<McStatus, string> = {
  retained: "Retained",
  removed: "Removed",
  added: "Added",
};

function mcTip(
  p: MarketCyclePlacement,
  portfolioKey: "current" | "proposed" | "combined",
): string {
  const lines = [
    portfolioKey === "combined" ? `${p.name} — ${MC_STATUS_LABELS[mcStatus(p)]}` : p.name,
    `Bucket: ${p.bucket}${p.is_override ? " (override)" : ""}`,
    ...(p.is_override && p._original_bucket ? [`Default bucket: ${p._original_bucket}`] : []),
    `Initial: ${p.initial_bucket}${p.is_defensive ? " → Defensive" : ""}`,
    ...(p.v_vs_g != null
      ? [`V-vs-G: ${p.v_vs_g.toFixed(3)} (pctl ${(p.v_pct * 100).toFixed(1)}%)`]
      : [`V pctl: ${(p.v_pct * 100).toFixed(1)}%`]),
    ...(p.q_vs_d != null
      ? [`Q-vs-D: ${p.q_vs_d.toFixed(3)} (pctl ${(p.q_pct * 100).toFixed(1)}%)`]
      : [`Q pctl: ${(p.q_pct * 100).toFixed(1)}%`]),
    ...(p.downside_capture != null ? [`10yr Downside Cap: ${p.downside_capture.toFixed(1)}`] : []),
    portfolioKey === "combined"
      ? `Weight: ${((p.current_weight || 0) * 100).toFixed(1)}% → ${((p.proposed_weight || 0) * 100).toFixed(1)}%`
      : `Weight: ${((portfolioKey === "current" ? p.current_weight : p.proposed_weight) * 100).toFixed(1)}%`,
  ];
  return lines.join("\n");
}

const PHASES = [
  { x0: 0.0, x1: 1.0, label: "RECOVERY", gradId: "ph_green" },
  { x0: 1.0, x1: 2.0, label: "MID", gradId: "ph_yellow" },
  { x0: 2.0, x1: 3.0, label: "LATE", gradId: "ph_orange" },
  { x0: 3.0, x1: 4.0, label: "RECESSION", gradId: "ph_red" },
];

const MACRO_BULLETS = [
  [
    "Activity rebounds (GDP, IP, employment, incomes)",
    "Credit begins to grow",
    "Profits start to increase",
    "Monetary policy still easy",
  ],
  [
    "Growth is accelerating",
    "Credit growth strong",
    "Profit growth accelerating; sales still moribund",
    "Monetary policy neutral",
  ],
  [
    "Above trend GDP growth",
    "Profits peaking",
    "Inflation increasing",
    "Monetary policy contracting",
  ],
  [
    "Growth declining",
    "Credit dries up",
    "Profits decline",
    "Policy eases",
  ],
];

const METRICS_BULLETS = [
  ["Low Price to Book", "High Operating Leverage"],
  ["Low Price to Earnings and Free Cash Flow", "Increasing ROE"],
  ["Improving Earnings Growth", "Fair valuation / Low PEG Ratio"],
  ["High Sales Growth", "Improving ROE", "Earnings Stability", "Low Debt/Equity", "High/Stable Dividend", "Low Volatility"],
];

const QUALITY_LABELS = [
  { x: 0.5, text: "CYCLICAL / LOW QUALITY VALUE", row: 0 },
  { x: 1.5, text: "GARP / BLEND", row: 0 },
  { x: 2.5, text: "HIGH QUALITY / STABLE GROWTH", row: 0 },
  { x: 3.5, text: "DEFENSIVE", row: 0 },
  { x: 1.0, text: "RELATIVE / HIGH QUALITY VALUE", row: 1 },
  { x: 2.85, text: "CYCLICAL / HIGH GROWTH", row: 1 },
];

export type MarketCycleChartProps = {
  placements: MarketCyclePlacement[];
  portfolioKey: "current" | "proposed" | "combined";
};

export function MarketCycleChart({ placements, portfolioKey }: MarketCycleChartProps) {
  const W = 720;
  const marginX = 8;
  const chartLeft = marginX;
  const chartRight = W - marginX;
  const chartW = chartRight - chartLeft;

  const phaseHeaderY = 2;
  const phaseHeaderH = 24;
  const macroLabelY = phaseHeaderY + phaseHeaderH + 2;
  const labelBandH = 16;
  const macroPanelY = macroLabelY + labelBandH;
  const macroPanelH = 82;
  const momentumY = macroPanelY + macroPanelH + 6;
  const momentumH = 12;
  const plotTop = momentumY + momentumH + 4;
  const plotH = 165;
  const plotBottom = plotTop + plotH;
  const qualY = plotBottom + 3;
  const qualH = 22;
  const metricsLabelY = qualY + qualH + 4;
  const metricsPanelY = metricsLabelY + labelBandH;
  const metricsPanelH = 90;
  const H = metricsPanelY + metricsPanelH + 4;

  const xScale = (x: number) => chartLeft + (x / 4) * chartW;
  const waveY0 = plotBottom - 0.15 * plotH;
  const waveH = 0.92 * plotH;
  const yScale = (y: number) => waveY0 - y * waveH;

  // Build wave path
  const points: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = (i / 100) * 4;
    points.push(`${xScale(x).toFixed(1)},${yScale(waveY(x)).toFixed(1)}`);
  }
  const wavePath = `M ${points.join(" L ")}`;

  const offsets = labelOffsets(placements, xScale);
  const dotColor = portfolioKey === "current" ? "#2d5a90" : "#0077cc";
  const dotStroke = portfolioKey === "current" ? "#1a3856" : "#004a80";
  const gp = `mcg_${portfolioKey}_`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", display: "block", fontFamily: "var(--sans)" }}
    >
      <defs>
        <linearGradient id={`${gp}ph_green`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#a8d982" />
          <stop offset="100%" stopColor="#e8d764" />
        </linearGradient>
        <linearGradient id={`${gp}ph_yellow`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#e8d764" />
          <stop offset="100%" stopColor="#f3b14a" />
        </linearGradient>
        <linearGradient id={`${gp}ph_orange`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#f3b14a" />
          <stop offset="100%" stopColor="#ec7e3e" />
        </linearGradient>
        <linearGradient id={`${gp}ph_red`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#ec7e3e" />
          <stop offset="100%" stopColor="#d94b42" />
        </linearGradient>
        <linearGradient id={`${gp}wave`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#a8d982" />
          <stop offset="38%" stopColor="#e8d764" />
          <stop offset="62%" stopColor="#f3b14a" />
          <stop offset="85%" stopColor="#ec7e3e" />
          <stop offset="100%" stopColor="#d94b42" />
        </linearGradient>
        <linearGradient id={`${gp}qual`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#a8d982" />
          <stop offset="38%" stopColor="#e8d764" />
          <stop offset="62%" stopColor="#f3b14a" />
          <stop offset="85%" stopColor="#ec7e3e" />
          <stop offset="100%" stopColor="#d94b42" />
        </linearGradient>
        <linearGradient id={`${gp}redmark`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#d94b42" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#d94b42" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Phase headers */}
      {PHASES.map((p, i) => {
        const x0 = xScale(p.x0);
        const x1 = xScale(p.x1);
        const w = x1 - x0 - (i < PHASES.length - 1 ? 3 : 0);
        return (
          <g key={`ph-${i}`}>
            <rect
              x={x0 + (i === 0 ? 0 : 1.5)}
              y={phaseHeaderY}
              width={w - (i === 0 ? 0 : 1.5)}
              height={phaseHeaderH}
              fill={`url(#${gp}${p.gradId})`}
            />
            <text
              x={(x0 + x1) / 2}
              y={phaseHeaderY + phaseHeaderH / 2 + 5}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="#3a3a3a"
              letterSpacing="1.5"
            >
              {p.label}
            </text>
          </g>
        );
      })}

      {/* Macro Environment label band */}
      <rect x={chartLeft} y={macroLabelY} width={chartW} height={labelBandH} fill="#eaeaea" />
      <text
        x={chartLeft + chartW / 2}
        y={macroLabelY + labelBandH / 2 + 3.5}
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="#3a3a3a"
        letterSpacing="1.3"
      >
        MACRO ECONOMIC ENVIRONMENT
      </text>

      {/* Macro panels */}
      {PHASES.map((p, i) => {
        const x0 = xScale(p.x0);
        const x1 = xScale(p.x1);
        const panelW = x1 - x0 - 6;
        const maxChars = Math.max(20, Math.floor(panelW / 4.8));
        let yCursor = macroPanelY + 12;
        const items: React.ReactNode[] = [];
        MACRO_BULLETS[i].forEach((b, bi) => {
          const wrapped = wrapText(b, maxChars);
          wrapped.forEach((line, li) => {
            const isFirst = li === 0;
            if (isFirst) {
              items.push(
                <rect key={`bul-${bi}-${li}`} x={x0 + 8} y={yCursor - 6} width={4} height={4} fill="#3a3a3a" />,
              );
            }
            items.push(
              <text key={`txt-${bi}-${li}`} x={x0 + 16} y={yCursor} fontSize="9" fill="#333">
                {line}
              </text>,
            );
            yCursor += 11;
          });
          yCursor += 3;
        });
        return (
          <g key={`mp-${i}`}>
            <rect
              x={x0 + (i === 0 ? 0 : 1.5)}
              y={macroPanelY}
              width={x1 - x0 - 3}
              height={macroPanelH}
              fill="#fafafa"
              stroke="#d8d8d8"
              strokeWidth="1"
            />
            {items}
          </g>
        );
      })}

      {/* MOMENTUM divider */}
      <line
        x1={chartLeft}
        y1={momentumY + momentumH / 2}
        x2={chartLeft + chartW * 0.42}
        y2={momentumY + momentumH / 2}
        stroke="#bbbbbb"
        strokeWidth="0.5"
      />
      <text
        x={chartLeft + chartW / 2}
        y={momentumY + momentumH / 2 + 3.5}
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="#3a3a3a"
        letterSpacing="1.3"
      >
        MOMENTUM
      </text>
      <line
        x1={chartLeft + chartW * 0.58}
        y1={momentumY + momentumH / 2}
        x2={chartLeft + chartW}
        y2={momentumY + momentumH / 2}
        stroke="#bbbbbb"
        strokeWidth="0.5"
      />

      {/* Plot frame */}
      <rect x={chartLeft} y={plotTop} width={chartW} height={plotH} fill="#fafafa" stroke="#d4d4d4" strokeWidth="1" />
      {PHASES.map((p, i) => {
        const x1px = xScale(p.x1);
        const markW = 40;
        return (
          <g key={`pf-${i}`}>
            {i > 0 ? (
              <line
                x1={xScale(p.x0)}
                y1={plotTop}
                x2={xScale(p.x0)}
                y2={plotBottom}
                stroke="#dcdcdc"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ) : null}
            <rect x={x1px - markW - 2} y={plotTop + 2} width={markW} height={8} fill={`url(#${gp}redmark)`} />
          </g>
        );
      })}

      {/* Wave */}
      <path d={wavePath} fill="none" stroke={`url(#${gp}wave)`} strokeWidth="5.5" strokeLinecap="round" />

      {/* Manager dots + labels */}
      {placements.length && portfolioKey === "combined" ? (
        <>
          {/* Group by x (y is a pure function of x) so managers landing on
              the exact same placement collapse into ONE dot, split by the
              statuses present: removed+added = half red / half green,
              retained+added = half blue / half green, retained+removed =
              half blue / half red, all three = three wedges. Solid color
              when every co-located manager shares one status. */}
          {Object.values(
            placements.reduce<Record<string, MarketCyclePlacement[]>>((acc, p) => {
              const key = (p.x ?? 0).toFixed(3);
              (acc[key] = acc[key] || []).push(p);
              return acc;
            }, {}),
          ).map((grp) => {
            const cx = xScale(grp[0].x ?? 0);
            const cy = yScale(waveY(grp[0].x ?? 0));
            const r = 9;
            // Fixed left→right order: removed (red), retained (blue), added (green).
            const statuses = (["removed", "retained", "added"] as McStatus[]).filter((s) =>
              grp.some((p) => mcStatus(p) === s),
            );
            const tip = grp.map((p) => mcTip(p, portfolioKey)).join("\n───\n");
            const key = `grp-${(grp[0].x ?? 0).toFixed(3)}`;
            if (statuses.length === 1) {
              const c = MC_STATUS_COLORS[statuses[0]];
              return (
                <circle key={key} cx={cx} cy={cy} r={r} fill={c.fill} stroke={c.stroke} strokeWidth="1.5">
                  <title>{tip}</title>
                </circle>
              );
            }
            if (statuses.length === 2) {
              // Vertical split: left semicircle = first status, right = second.
              return (
                <g key={key}>
                  <path
                    d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} Z`}
                    fill={MC_STATUS_COLORS[statuses[0]].fill}
                  />
                  <path
                    d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`}
                    fill={MC_STATUS_COLORS[statuses[1]].fill}
                  />
                  <circle cx={cx} cy={cy} r={r} fill="none" stroke="#555" strokeWidth="1.5">
                    <title>{tip}</title>
                  </circle>
                </g>
              );
            }
            // All three statuses share the spot: three 120° wedges from 12 o'clock.
            const wedge = (i: number) => {
              const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
              const a1 = a0 + (2 * Math.PI) / 3;
              const x0 = cx + r * Math.cos(a0);
              const y0 = cy + r * Math.sin(a0);
              const x1 = cx + r * Math.cos(a1);
              const y1 = cy + r * Math.sin(a1);
              return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`;
            };
            return (
              <g key={key}>
                {statuses.map((s, i) => (
                  <path key={s} d={wedge(i)} fill={MC_STATUS_COLORS[s].fill} />
                ))}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#555" strokeWidth="1.5">
                  <title>{tip}</title>
                </circle>
              </g>
            );
          })}
          {/* Labels: one per manager, so both names in a shared placement still show. */}
          {placements.map((p, idx) => {
            const cx = xScale(p.x ?? 0);
            const cy = yScale(waveY(p.x ?? 0));
            const display = p.name.length > 18 ? `${p.name.slice(0, 18)}…` : p.name;
            return (
              <text
                key={`lbl-${idx}`}
                x={cx}
                y={cy + offsets[idx].dy}
                textAnchor="middle"
                fontSize="11"
                fill="#2a2a2a"
                fontWeight="500"
              >
                {display}
              </text>
            );
          })}
        </>
      ) : placements.length ? (
        placements.map((p, idx) => {
          const cx = xScale(p.x ?? 0);
          const cy = yScale(waveY(p.x ?? 0));
          const off = offsets[idx];
          const tip = mcTip(p, portfolioKey);
          const display = p.name.length > 18 ? `${p.name.slice(0, 18)}…` : p.name;
          return (
            <g key={`mgr-${idx}`}>
              <circle cx={cx} cy={cy} r={9} fill={dotColor} stroke={dotStroke} strokeWidth="1.5">
                <title>{tip}</title>
              </circle>
              <text x={cx} y={cy + off.dy} textAnchor="middle" fontSize="11" fill="#2a2a2a" fontWeight="500">
                {display}
              </text>
            </g>
          );
        })
      ) : (
        <text
          x={chartLeft + chartW / 2}
          y={(plotTop + plotBottom) / 2}
          textAnchor="middle"
          fontFamily="IBM Plex Mono"
          fontSize="11"
          fill="#888"
        >
          {portfolioKey === "combined"
            ? "No managers in portfolio"
            : `No managers with ${portfolioKey} weight > 0`}
        </text>
      )}

      {/* Quality gradient strip */}
      <rect x={chartLeft} y={qualY} width={chartW} height={qualH} fill={`url(#${gp}qual)`} />
      {QUALITY_LABELS.map((q, i) => (
        <text
          key={`q-${i}`}
          x={xScale(q.x)}
          y={q.row === 0 ? qualY + 9 : qualY + 19}
          textAnchor="middle"
          fontSize="8"
          fontWeight="700"
          fill="#fff"
          letterSpacing="0.4"
        >
          {q.text}
        </text>
      ))}

      {/* Key Security Metrics label band */}
      <rect x={chartLeft} y={metricsLabelY} width={chartW} height={labelBandH} fill="#eaeaea" />
      <text
        x={chartLeft + chartW / 2}
        y={metricsLabelY + labelBandH / 2 + 3.5}
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="#3a3a3a"
        letterSpacing="1.3"
      >
        KEY SECURITY METRICS
      </text>

      {/* Metrics panels */}
      {PHASES.map((p, i) => {
        const x0 = xScale(p.x0);
        const x1 = xScale(p.x1);
        const panelW = x1 - x0 - 6;
        const maxChars = Math.max(18, Math.floor(panelW / 4.8));
        let yCursor = metricsPanelY + 12;
        const items: React.ReactNode[] = [];
        METRICS_BULLETS[i].forEach((b, bi) => {
          const wrapped = wrapText(b, maxChars);
          wrapped.forEach((line, li) => {
            const isFirst = li === 0;
            if (isFirst) {
              items.push(
                <rect key={`mb-${bi}-${li}`} x={x0 + 8} y={yCursor - 6} width={4} height={4} fill="#3a3a3a" />,
              );
            }
            items.push(
              <text key={`mt-${bi}-${li}`} x={x0 + 16} y={yCursor} fontSize="9" fill="#333">
                {line}
              </text>,
            );
            yCursor += 11;
          });
          yCursor += 3;
        });
        return (
          <g key={`metp-${i}`}>
            <rect
              x={x0 + (i === 0 ? 0 : 1.5)}
              y={metricsPanelY}
              width={x1 - x0 - 3}
              height={metricsPanelH}
              fill="#fafafa"
              stroke="#d8d8d8"
              strokeWidth="1"
            />
            {items}
          </g>
        );
      })}
    </svg>
  );
}
