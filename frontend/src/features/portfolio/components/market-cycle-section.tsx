"use client";

import { useMemo, useState } from "react";

import type { MarketCycleResponse, MarketCyclePlacement } from "../types";

import { MC_BUCKETS, MarketCycleChart, mcApplyOverrides } from "./market-cycle-chart";

type MarketCycleSectionProps = {
  benchmark: string;
  loading: boolean;
  data: MarketCycleResponse | null;
};

function fmtPct(value: number | null | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) return "--";
  return `${(value * 100).toFixed(digits)}%`;
}

function fmtNum(value: number | null | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) return "--";
  return value.toFixed(digits);
}

export function MarketCycleSection({ benchmark, loading, data }: MarketCycleSectionProps) {
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const setOverride = (name: string, bucket: string, defaultBucket: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (bucket === defaultBucket) {
        delete next[name];
      } else {
        next[name] = bucket;
      }
      return next;
    });
  };

  const resetOverride = (name: string) => {
    setOverrides((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const currentWithOverrides = useMemo(
    () => (data ? mcApplyOverrides(data.current, overrides) : []),
    [data, overrides],
  );
  const proposedWithOverrides = useMemo(
    () => (data ? mcApplyOverrides(data.proposed, overrides) : []),
    [data, overrides],
  );

  // Combine current+proposed for the placement table, sorted by effective x.
  const tableRows = useMemo<MarketCyclePlacement[]>(() => {
    if (!data) return [];
    const byName: Record<string, MarketCyclePlacement> = {};
    (data.current ?? []).forEach((p) => {
      byName[p.name] = p;
    });
    (data.proposed ?? []).forEach((p) => {
      byName[p.name] = p;
    });
    const list = Object.values(byName);
    const effectiveX = (p: MarketCyclePlacement) => {
      const ov = overrides[p.name];
      if (ov) {
        return MC_BUCKETS.find((b) => b.key === ov)?.x ?? p.x ?? 0;
      }
      return p.x ?? 0;
    };
    list.sort((a, b) => effectiveX(a) - effectiveX(b));
    return list;
  }, [data, overrides]);

  const missingTabs = data?.tabs_without_universe ?? [];
  const hasPlacements =
    (data?.current?.length ?? 0) > 0 || (data?.proposed?.length ?? 0) > 0;
  // Hard-fail only when the backend explicitly errored or no placements
  // exist at all. Missing peer tabs are a soft warning shown above the
  // chart so users can still see classifications for the tabs that do
  // have universe data.
  const fatal = data?.error || (data?.missing_universe && !hasPlacements);

  return (
    <div className="contrib-section mb-16" id="market-cycle-section">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Market Cycle Chart</span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
            {benchmark}
          </span>
        </div>

        {loading && !data ? (
          <div style={{ padding: 16, textAlign: "center", color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 11 }}>
            Loading market-cycle placements...
          </div>
        ) : fatal ? (
          <div style={{ padding: 16, textAlign: "center", color: "var(--amber)", fontFamily: "var(--mono)", fontSize: 11 }}>
            {data?.error ?? "No universe data available for any portfolio peer tab."}
          </div>
        ) : data ? (
          <>
            {missingTabs.length > 0 && (
              <div
                style={{
                  padding: "8px 16px",
                  background: "rgba(214,140,31,0.08)",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--amber)",
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                }}
              >
                Universe data missing for: {missingTabs.join(", ")} —
                managers from these peer groups are excluded from the chart.
                Upload their universe returns and re-run universe clones to
                include them.
              </div>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                padding: 16,
                background: "var(--surface)",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--text2)",
                    textAlign: "center",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  Current Portfolio
                </div>
                <MarketCycleChart placements={currentWithOverrides} portfolioKey="current" />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--text2)",
                    textAlign: "center",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  Proposed Portfolio
                </div>
                <MarketCycleChart placements={proposedWithOverrides} portfolioKey="proposed" />
              </div>
            </div>

            {tableRows.length ? (
              <div style={{ padding: "0 16px 16px" }}>
                <table className="data-table w-full" style={{ marginTop: 8 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>Manager</th>
                      <th style={{ textAlign: "left" }}>Initial Peer Group</th>
                      <th style={{ textAlign: "left", minWidth: 190 }}>Final Bucket</th>
                      <th>V-vs-G %ile</th>
                      <th>Q-vs-D %ile</th>
                      <th>10yr DnCap</th>
                      <th>Current Wt</th>
                      <th>Proposed Wt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((p) => {
                      const overrideValue = overrides[p.name];
                      const isOverridden = !!overrideValue && overrideValue !== p.bucket;
                      const currentBucket = overrideValue || p.bucket;
                      return (
                        <tr key={p.name}>
                          <td style={{ fontWeight: 500 }}>{p.name}</td>
                          <td className="mono" style={{ color: "var(--text2)" }}>
                            {p.initial_bucket}
                            {p.is_defensive ? (
                              <span style={{ color: "var(--red)", fontSize: 9, marginLeft: 4 }}>→DEF</span>
                            ) : null}
                          </td>
                          <td>
                            <select
                              className="mono"
                              style={{
                                fontFamily: "var(--mono)",
                                fontSize: 11,
                                padding: "2px 4px",
                                background: "var(--surface)",
                                color: "var(--text)",
                                border: "1px solid var(--border2)",
                                borderRadius: 3,
                              }}
                              value={currentBucket}
                              onChange={(event) =>
                                setOverride(p.name, event.target.value, p.bucket)
                              }
                            >
                              {MC_BUCKETS.map((b) => (
                                <option key={b.key} value={b.key}>
                                  {b.key}
                                </option>
                              ))}
                            </select>
                            {isOverridden ? (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm"
                                  style={{ padding: "1px 6px", fontSize: 10, marginLeft: 4 }}
                                  title={`Reset to default: ${p.bucket}`}
                                  onClick={() => resetOverride(p.name)}
                                >
                                  ×
                                </button>
                                <span
                                  style={{ color: "var(--accent)", fontSize: 9, marginLeft: 4 }}
                                  title={`Default: ${p.bucket}`}
                                >
                                  (override)
                                </span>
                              </>
                            ) : null}
                          </td>
                          <td className="mono">{fmtPct(p.v_pct, 1)}</td>
                          <td className="mono">{fmtPct(p.q_pct, 1)}</td>
                          <td className="mono">{fmtNum(p.downside_capture, 1)}</td>
                          <td className="mono">
                            {p.current_weight > 0 ? `${(p.current_weight * 100).toFixed(1)}%` : "--"}
                          </td>
                          <td className="mono">
                            {p.proposed_weight > 0 ? `${(p.proposed_weight * 100).toFixed(1)}%` : "--"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
          </>
        ) : (
          <div style={{ padding: 16, textAlign: "center", color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 11 }}>
            No market-cycle data available.
          </div>
        )}
      </div>
    </div>
  );
}
