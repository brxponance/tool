"use client";

import { useEffect, useRef, useState } from "react";

import { getDiverseOwnership } from "../api/get-portfolio-screen-data";
import type {
  DiverseOwnershipResponse,
  DiverseOwnershipRollup,
  PortfolioManager,
} from "../types";

type Props = {
  client: string | null;
  managers: PortfolioManager[];
};

type ResultState = {
  data: DiverseOwnershipResponse | null;
  loading: boolean;
  error: string | null;
};

const cellLabel: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--text3)",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
const cellValue: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 18,
  color: "var(--text)",
  marginTop: 2,
};

function RollupCard({ title, r }: { title: string; r: DiverseOwnershipRollup }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        background: "var(--surface2)",
        padding: 14,
      }}
    >
      <div style={{ ...cellLabel, marginBottom: 8, color: "var(--text2)" }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        <div>
          <div style={cellLabel}>Diverse weight</div>
          <div style={{ ...cellValue, color: "var(--accent)" }}>{r.weight_pct.toFixed(1)}%</div>
        </div>
        <div>
          <div style={cellLabel}>Diverse firms</div>
          <div style={cellValue}>
            {r.n_diverse}
            <span style={{ fontSize: 12, color: "var(--text3)" }}> / {r.n_firms}</span>
          </div>
        </div>
        <div>
          <div style={cellLabel}>Firm-count ratio</div>
          <div style={{ ...cellValue, fontSize: 14 }}>{r.ratio_pct.toFixed(1)}%</div>
        </div>
        <div>
          <div style={cellLabel}>Unmatched weight</div>
          <div
            style={{
              ...cellValue,
              fontSize: 14,
              color: r.unknown_weight_pct > 20 ? "var(--amber)" : "var(--text2)",
            }}
          >
            {r.unknown_weight_pct.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiverseOwnershipSection({ client, managers }: Props) {
  const [threshold, setThreshold] = useState(50);
  const [result, setResult] = useState<ResultState>({
    data: null,
    loading: false,
    error: null,
  });

  const ready = Boolean(client) && managers.length > 0;

  // Auto-compute whenever the client, any weight, or the threshold changes —
  // the rollup is a headline number, so it should be on screen without the user
  // asking for it (and it must track proposed-weight edits live).
  const signature = managers
    .map((m) => `${m.tab}::${m.matched_name}:${m.current_weight ?? 0}:${m.proposed_weight ?? 0}`)
    .join("|");
  const reqId = useRef(0);

  useEffect(() => {
    if (!ready) {
      setResult({ data: null, loading: false, error: null });
      return;
    }
    const id = ++reqId.current;
    setResult((prev) => ({ ...prev, loading: true }));
    const timer = setTimeout(() => {
      getDiverseOwnership(managers, threshold)
        .then((res) => {
          if (id !== reqId.current) return;
          setResult({ data: res, loading: false, error: null });
        })
        .catch((err: unknown) => {
          if (id !== reqId.current) return;
          setResult({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Could not compute diverse ownership.",
          });
        });
    }, 500);
    return () => clearTimeout(timer);
    // managers captured via `signature`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, signature, threshold, ready]);

  const data = result.data;

  return (
    <div className="contrib-section mb-16">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Diverse / Woman Owned</span>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text3)",
              marginLeft: 8,
            }}
          >
            Majority-owned (≥{data?.threshold ?? threshold}%)
          </span>
        </div>
        <div className="panel-body" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>Threshold</span>
              <input
                type="number"
                min={0}
                max={100}
                step={5}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value) || 0)}
                style={{
                  width: 64,
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  padding: "4px 6px",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--text)",
                }}
              />
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>% diverse/female</span>
            </div>
            {result.loading && (
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
                Computing…
              </span>
            )}
            {!ready && (
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)" }}>
                Select a client first.
              </span>
            )}
            {result.error && (
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--red)" }}>
                {result.error}
              </span>
            )}
          </div>

          {data && !data.has_data && (
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)" }}>
              No qualitative data loaded. Upload a firm/strategy qualitative workbook on the Setup tab.
            </div>
          )}

          {data?.has_data && data.current && data.proposed && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              <RollupCard title={`Current (≥ ${data.threshold ?? threshold}%)`} r={data.current} />
              <RollupCard title={`Proposed (≥ ${data.threshold ?? threshold}%)`} r={data.proposed} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
