"use client";

import { useState } from "react";

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
  color: "var(--text1)",
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

  async function handleRun() {
    if (!client) return;
    setResult({ data: null, loading: true, error: null });
    try {
      const res = await getDiverseOwnership(managers, threshold);
      setResult({ data: res, loading: false, error: null });
    } catch (err) {
      setResult({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "Could not compute diverse ownership.",
      });
    }
  }

  const data = result.data;

  return (
    <div className="contrib-section mb-16">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Diverse / Woman-Owned Ownership</span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text3)",
            }}
          >
            Portfolio weight held with firms at or above the diversity threshold
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
                  background: "var(--surface1)",
                  color: "var(--text1)",
                }}
              />
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>% diverse/female</span>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!ready || result.loading}
              onClick={() => void handleRun()}
            >
              {result.loading ? "Computing…" : "Compute"}
            </button>
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
