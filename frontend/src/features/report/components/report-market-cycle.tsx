"use client";

import { MarketCycleChart } from "@/features/portfolio/components/market-cycle-chart";
import type { MarketCyclePlacement } from "@/features/portfolio/types";

import type { ReportMockPlacement } from "../lib/report-mock";

function toPortfolioPlacements(
  placements: ReportMockPlacement[],
): MarketCyclePlacement[] {
  return placements.map((p) => ({
    name: p.name,
    tab: "",  // not required by the chart's rendering
    bucket: p.bucket,
    initial_bucket: p.initial_bucket,
    current_weight: p.current_weight,
    proposed_weight: p.proposed_weight,
    v_pct: p.v_pct,
    q_pct: p.q_pct,
    v_vs_g: p.v_vs_g,
    q_vs_d: p.q_vs_d,
    x: p.x,
    downside_capture: p.downside_capture,
    is_defensive: p.is_defensive,
  }));
}

export function ReportMarketCycle({
  placements,
}: {
  placements: ReportMockPlacement[];
}) {
  const mapped = toPortfolioPlacements(placements);
  return (
    <section className="rpt-section rpt-section-mc">
      <h3 className="rpt-section-title">Market Cycle Positioning — Current</h3>
      <div className="rpt-mc-panel">
        <div className="rpt-mc-col">
          <div className="rpt-mc-col-label">Current Portfolio</div>
          <div id="rpt-mc-wrap" style={{ position: "relative" }}>
            <MarketCycleChart
              placements={mapped}
              portfolioKey="current"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
