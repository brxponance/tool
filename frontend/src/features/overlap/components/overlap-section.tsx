"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getHoldingsOverlap, getHoldingsOverlapDetail } from "../api/get-overlap-data";
import type {
  HoldingsOverlapDetailResponse,
  HoldingsOverlapResponse,
  MatchBasis,
  OverlapAxisManager,
  OverlapManagerInput,
  OverlapPair,
  WeightState,
} from "../types";
import { OverlapDetailTable } from "./overlap-detail-table";

// Pairwise holdings-overlap section for the Portfolio tab. Both weight states
// are fetched and rendered together (Current above Proposed) so a rebalance's
// effect on doubling-up is visible without toggling, and they share ONE colour
// scale so a cell of the same weight is the same shade in both.
//
// The engine returns both bases for every pair, so the Strategy / Client-scaled
// switch is a pure re-render with no refetch.

type Basis = "internal" | "scaled";

type Props = {
  client: string | null;
  managers: OverlapManagerInput[];
  /** Hide entirely when no exposures file is loaded (matches the reference). */
  hasExposures?: boolean;
};

// Trim regional/style suffixes for axis labels so the grid stays compact; the
// full name is always available on hover.
function shortName(name: string) {
  return (
    String(name)
      .replace(
        /\s+(EAFE(\s*\+\s*Canada)?|ACWI(\s*ex\s*US)?|xUS|Non[- ]US|International|Global|World)(\s+(SC|Small\s*Cap|SMID))?.*$/i,
        "",
      )
      .trim() || name
  );
}

// Sequential white → accent ramp, normalised against the matrix max so
// contrast stays usable regardless of the absolute overlap level.
function cellColor(value: number, vmax: number) {
  if (!vmax || value <= 0) {
    return { bg: "var(--surface2)", fg: "var(--text3)" };
  }
  const t = Math.min(1, value / vmax);
  const r = Math.round(255 + t * (0 - 255));
  const g = Math.round(255 + t * (119 - 255));
  const b = Math.round(255 + t * (204 - 255));
  return { bg: `rgb(${r},${g},${b})`, fg: t > 0.55 ? "#fff" : "var(--text)" };
}

const pairKey = (i: number, j: number) => (i < j ? `${i}-${j}` : `${j}-${i}`);

function OverlapMatrixGrid({
  label,
  data,
  basis,
  vmax,
  onCellClick,
  activeKey,
}: {
  label: string;
  data: HoldingsOverlapResponse | null;
  basis: Basis;
  vmax: number;
  onCellClick: (i: number, j: number, state: WeightState) => void;
  activeKey: string | null;
}) {
  const state = label.toLowerCase() as WeightState;
  const managers: OverlapAxisManager[] = data?.managers ?? [];
  const pairs: OverlapPair[] = data?.pairs ?? [];
  const n = managers.length;

  // Fill the column: the table spans the full panel width and cells get taller
  // when there are fewer managers, so small portfolios don't leave a sea of
  // white space while 10-manager grids still fit without scrolling.
  const cellH = n <= 4 ? 64 : n <= 6 ? 54 : n <= 8 ? 46 : 40;
  const bigCells = cellH >= 54;

  const pmap = useMemo(() => {
    const m = new Map<string, OverlapPair>();
    pairs.forEach((p) => m.set(pairKey(p.i, p.j), p));
    return m;
  }, [pairs]);

  const headLabel: React.CSSProperties = {
    fontFamily: "var(--mono)",
    fontSize: 9,
    color: "var(--text2)",
    textTransform: "uppercase",
    letterSpacing: ".06em",
    fontWeight: 600,
    margin: "10px 0 4px",
    textAlign: "center",
  };

  if (n < 2) {
    return (
      <div>
        <div style={headLabel}>{label}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", padding: "8px 0" }}>
          Need at least two matched managers with a positive {state} weight.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={headLabel}>{label}</div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "separate",
            borderSpacing: 0,
            fontFamily: "var(--mono)",
            width: "100%",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: 140 }} />
            {managers.map((_, idx) => (
              <col key={idx} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th style={{ background: "transparent", padding: 0 }} />
              {managers.map((m, idx) => (
                <th
                  key={idx}
                  title={`${m.display} · ${m.count} holdings · ${m.alloc.toFixed(1)}%`}
                  style={{
                    fontSize: 9,
                    color: "var(--text2)",
                    fontWeight: 600,
                    height: 78,
                    verticalAlign: "bottom",
                    paddingBottom: 6,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      transform: "rotate(-55deg)",
                      transformOrigin: "left bottom",
                      width: 16,
                      textAlign: "left",
                    }}
                  >
                    {shortName(m.display)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {managers.map((rowMgr, i) => (
              <tr key={i}>
                <td
                  title={`${rowMgr.display} · ${rowMgr.alloc.toFixed(1)}%`}
                  style={{
                    fontSize: 10,
                    color: "var(--text)",
                    fontWeight: 600,
                    textAlign: "right",
                    padding: "0 8px 0 4px",
                    whiteSpace: "nowrap",
                    maxWidth: 150,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {shortName(rowMgr.display)}{" "}
                  <small style={{ color: "var(--text3)", fontWeight: 400, fontSize: 9 }}>
                    ({rowMgr.count})
                  </small>
                </td>
                {managers.map((colMgr, j) => {
                  const base: React.CSSProperties = {
                    height: cellH,
                    border: "1px solid var(--surface)",
                    textAlign: "center",
                    lineHeight: 1.15,
                    padding: 0,
                  };
                  if (i === j) {
                    return (
                      <td
                        key={j}
                        title={`${rowMgr.display} — ${rowMgr.count} holdings`}
                        style={{ ...base, background: "var(--surface2)", color: "var(--text3)", cursor: "default" }}
                      >
                        <div style={{ fontSize: bigCells ? 12 : 11, fontWeight: 600 }}>{rowMgr.count}</div>
                        <div style={{ fontSize: bigCells ? 10 : 9, opacity: 0.82 }}>holdings</div>
                      </td>
                    );
                  }
                  const key = pairKey(i, j);
                  const pair = pmap.get(key);
                  const met = pair ? pair[basis] : null;
                  const cnt = met?.shared_count ?? 0;
                  const cw = met?.common_weight ?? 0;
                  const isActive = activeKey === `${key}:${state}`;
                  const click = () => onCellClick(Math.min(i, j), Math.max(i, j), state);
                  if (!cnt) {
                    return (
                      <td
                        key={j}
                        onClick={click}
                        title="No shared holdings"
                        style={{
                          ...base,
                          color: "var(--text3)",
                          cursor: "pointer",
                          outline: isActive ? "2px solid var(--accent)" : undefined,
                          outlineOffset: isActive ? -2 : undefined,
                        }}
                      >
                        <div style={{ fontSize: bigCells ? 12 : 11, fontWeight: 600 }}>0</div>
                        <div style={{ fontSize: bigCells ? 10 : 9, opacity: 0.82 }}>—</div>
                      </td>
                    );
                  }
                  const col = cellColor(cw, vmax);
                  return (
                    <td
                      key={j}
                      onClick={click}
                      title={`${rowMgr.display} × ${colMgr.display}\n${cnt} shared holdings\ncommon weight ${cw.toFixed(2)}%`}
                      style={{
                        ...base,
                        background: col.bg,
                        color: col.fg,
                        cursor: "pointer",
                        outline: isActive ? "2px solid var(--accent)" : undefined,
                        outlineOffset: isActive ? -2 : undefined,
                      }}
                    >
                      <div style={{ fontSize: bigCells ? 12 : 11, fontWeight: 600 }}>{cnt}</div>
                      <div style={{ fontSize: bigCells ? 10 : 9, opacity: 0.82 }}>{cw.toFixed(1)}%</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export function OverlapSection({ client, managers, hasExposures = true }: Props) {
  const [basis, setBasis] = useState<Basis>("internal");
  const [matchBasis, setMatchBasis] = useState<MatchBasis>("issuer");
  const [current, setCurrent] = useState<HoldingsOverlapResponse | null>(null);
  const [proposed, setProposed] = useState<HoldingsOverlapResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<{
    key: string | null;
    title: string;
    data: HoldingsOverlapDetailResponse | null;
    loading: boolean;
    error: string | null;
  }>({ key: null, title: "", data: null, loading: false, error: null });

  // Refire on client / weight changes, debounced — mirrors scheduleOverlap().
  const signature = managers
    .map((m) => `${m.matched_name}:${m.current_weight ?? 0}:${m.proposed_weight ?? 0}`)
    .join("|");
  const reqId = useRef(0);

  useEffect(() => {
    if (!client || !managers.length || !hasExposures) {
      setCurrent(null);
      setProposed(null);
      return;
    }
    const id = ++reqId.current;
    setLoading(true);
    const timer = setTimeout(() => {
      Promise.all([
        getHoldingsOverlap(client, managers, "current", matchBasis),
        getHoldingsOverlap(client, managers, "proposed", matchBasis),
      ])
        .then(([cur, prop]) => {
          if (id !== reqId.current) return;
          setError(cur.error ?? prop.error ?? null);
          setCurrent(cur);
          setProposed(prop);
          setLoading(false);
        })
        .catch((err: unknown) => {
          if (id !== reqId.current) return;
          setError(err instanceof Error ? err.message : "Overlap request failed.");
          setLoading(false);
        });
    }, 450);
    return () => clearTimeout(timer);
    // managers captured via `signature`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, signature, matchBasis, hasExposures]);

  const openDetail = useCallback(
    (i: number, j: number, state: WeightState) => {
      const src = state === "proposed" ? proposed : current;
      const mi = src?.managers?.[i];
      const mj = src?.managers?.[j];
      if (!client || !mi || !mj) return;
      const key = `${pairKey(i, j)}:${state}`;
      setDetail({
        key,
        title: `${mi.display} × ${mj.display} · ${state}`,
        data: null,
        loading: true,
        error: null,
      });
      getHoldingsOverlapDetail(client, managers, mi.name, mj.name, state, matchBasis)
        .then((d) =>
          setDetail((prev) =>
            prev.key === key ? { ...prev, data: d, loading: false, error: d.error ?? null } : prev,
          ),
        )
        .catch((err: unknown) =>
          setDetail((prev) =>
            prev.key === key
              ? {
                  ...prev,
                  loading: false,
                  error: err instanceof Error ? err.message : "Detail request failed.",
                }
              : prev,
          ),
        );
    },
    [client, managers, matchBasis, current, proposed],
  );

  // One scale across both matrices so Current and Proposed are comparable.
  const vmax = useMemo(() => {
    let v = 0;
    [current, proposed].forEach((d) =>
      (d?.pairs ?? []).forEach((p) => {
        const cw = p[basis].common_weight;
        if (cw > v) v = cw;
      }),
    );
    return v;
  }, [current, proposed, basis]);

  if (!hasExposures) return null;

  const basisLabel =
    basis === "internal"
      ? "strategy similarity (manager internal weights)"
      : "client-scaled weights (actual portfolio doubling-up)";
  const matchLabel =
    matchBasis === "issuer" ? "matched by issuer (share classes collapsed)" : "matched by exact security (SEDOL)";
  const unmatched = current?.unmatched ?? proposed?.unmatched ?? [];
  const cashWarnings = current?.cash_warnings ?? proposed?.cash_warnings ?? [];

  const segButton = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--mono)",
    fontSize: 10,
    padding: "4px 10px",
    background: active ? "var(--accent)" : "var(--surface)",
    color: active ? "#fff" : "var(--text2)",
    border: "none",
    cursor: "pointer",
    letterSpacing: ".03em",
  });
  const segWrap: React.CSSProperties = {
    display: "inline-flex",
    border: "1px solid var(--border)",
    borderRadius: 4,
    overflow: "hidden",
  };
  const segLabel: React.CSSProperties = {
    fontFamily: "var(--mono)",
    fontSize: 9,
    color: "var(--text2)",
    textTransform: "uppercase",
    letterSpacing: ".06em",
    fontWeight: 600,
  };

  return (
    <div className="contrib-section" style={{ height: "100%" }}>
      <div className="panel" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div className="panel-header">
          <span className="panel-title">Holdings Overlap</span>
          <span
            id="overlap-subtitle"
            style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginLeft: 8 }}
          >
            {matchLabel} · common weight = Σ min(wᵢ,wⱼ) over shared holdings · {basisLabel}
          </span>
          {loading ? (
            <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
              Computing…
            </span>
          ) : null}
        </div>

        <div
          style={{
            padding: "8px 16px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 18px",
            alignItems: "center",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={segLabel}>Weight basis</span>
          <div style={segWrap}>
            <button type="button" style={segButton(basis === "internal")} onClick={() => setBasis("internal")}>
              Strategy
            </button>
            <button
              type="button"
              style={{ ...segButton(basis === "scaled"), borderLeft: "1px solid var(--border)" }}
              onClick={() => setBasis("scaled")}
            >
              Client-scaled
            </button>
          </div>

          <span style={segLabel}>Match on</span>
          <div style={segWrap}>
            <button
              type="button"
              style={segButton(matchBasis === "issuer")}
              onClick={() => setMatchBasis("issuer")}
              title="Collapse A/H shares, ADRs and preferreds of the same issuer into one holding"
            >
              Issuer
            </button>
            <button
              type="button"
              style={{ ...segButton(matchBasis === "sedol"), borderLeft: "1px solid var(--border)" }}
              onClick={() => setMatchBasis("sedol")}
              title="Match holdings by exact SEDOL — share classes count separately"
            >
              Security
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginLeft: "auto",
              fontFamily: "var(--mono)",
              fontSize: 9,
              color: "var(--text3)",
            }}
          >
            <span>low</span>
            <span
              style={{
                width: 80,
                height: 8,
                borderRadius: 2,
                background: "linear-gradient(90deg,var(--surface2),var(--accent))",
              }}
            />
            <span>high overlap</span>
          </div>
        </div>

        <div
          className="panel-body"
          style={{
            padding: 12,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {error ? <div className="alert alert-error">{error}</div> : null}
          {unmatched.length ? (
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber, #d68c1f)", marginBottom: 8 }}>
              ⚠ No holdings data for: {unmatched.join(", ")}
            </div>
          ) : null}
          {cashWarnings.length ? (
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber, #d68c1f)", marginBottom: 8 }}>
              ⚠ Heavy cash (possible transition/liquidated account):{" "}
              {cashWarnings.map((w) => `${w.manager} (${w.cash_pct}% cash)`).join(", ")}
            </div>
          ) : null}

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <OverlapMatrixGrid
              label="Current"
              data={current}
              basis={basis}
              vmax={vmax}
              onCellClick={openDetail}
              activeKey={detail.key}
            />
            <OverlapMatrixGrid
              label="Proposed"
              data={proposed}
              basis={basis}
              vmax={vmax}
              onCellClick={openDetail}
              activeKey={detail.key}
            />
          </div>

          {detail.key ? (
            <div style={{ marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>{detail.title}</span>
                <button
                  type="button"
                  onClick={() => setDetail({ key: null, title: "", data: null, loading: false, error: null })}
                  style={{ color: "var(--text3)", cursor: "pointer", background: "none", border: "none" }}
                  aria-label="Close shared holdings"
                >
                  ✕
                </button>
              </div>
              <OverlapDetailTable data={detail.data} loading={detail.loading} error={detail.error} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
