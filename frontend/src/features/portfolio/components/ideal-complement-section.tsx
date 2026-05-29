"use client";

import { useState } from "react";

import { findIdealComplement } from "../api/get-portfolio-screen-data";
import type {
  IdealComplementCandidate,
  IdealComplementResponse,
  PortfolioManager,
} from "../types";

type Props = {
  client: string | null;
  managers: PortfolioManager[];
  onAddManager?: (candidate: IdealComplementCandidate) => void;
};

type ResultState = {
  data: IdealComplementResponse | null;
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
  fontSize: 14,
  color: "var(--text1)",
  marginTop: 2,
};

function pct(v: number | null | undefined, digits = 1) {
  if (v == null) return "—";
  return `${(v * 100).toFixed(digits)}%`;
}

function num(v: number | null | undefined, digits = 3) {
  if (v == null) return "—";
  return v.toFixed(digits);
}

export function IdealComplementSection({ client, managers, onAddManager }: Props) {
  const [result, setResult] = useState<ResultState>({
    data: null,
    loading: false,
    error: null,
  });

  const hasProposed = managers.some((m) => (m.proposed_weight ?? 0) > 0);
  const ready = Boolean(client) && hasProposed;

  async function handleRun() {
    if (!client) return;
    setResult({ data: null, loading: true, error: null });
    try {
      const res = await findIdealComplement(client, managers);
      setResult({ data: res, loading: false, error: null });
    } catch (err) {
      setResult({
        data: null,
        loading: false,
        error:
          err instanceof Error
            ? err.message
            : "Could not compute ideal complement.",
      });
    }
  }

  const best = result.data?.best;
  const errMsg = result.data?.error ?? result.error;

  return (
    <div className="contrib-section mb-16">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Ideal Complement</span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text3)",
            }}
          >
            Finds the candidate that best offsets proposed-portfolio underperformance
          </span>
        </div>
        <div className="panel-body" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!ready || result.loading}
              onClick={() => void handleRun()}
            >
              {result.loading ? "Searching…" : "Find Ideal Complement"}
            </button>
            {!ready && (
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--text3)",
                }}
              >
                {client
                  ? "Set a proposed weight on at least one manager to enable."
                  : "Select a client first."}
              </span>
            )}
            {errMsg && (
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--red)",
                }}
              >
                {errMsg}
              </span>
            )}
          </div>

          {best && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: 12,
                padding: 12,
                border: "1px solid var(--border)",
                background: "var(--surface2)",
                alignItems: "end",
              }}
            >
              <div style={{ gridColumn: "1 / span 2" }}>
                <div style={cellLabel}>Recommended manager</div>
                <div style={cellValue}>
                  {best.name}{" "}
                  <span style={{ color: "var(--text3)", fontSize: 12 }}>
                    · {best.tab}
                  </span>
                </div>
              </div>
              <div>
                <div style={cellLabel}>Hit rate</div>
                <div style={cellValue}>{pct(best.hit_rate)}</div>
              </div>
              <div>
                <div style={cellLabel}>Avg excess</div>
                <div style={cellValue}>{pct(best.avg_excess, 2)}</div>
              </div>
              <div>
                <div style={cellLabel}>Overlap months</div>
                <div style={cellValue}>{best.n_months}</div>
              </div>
              <div style={{ gridColumn: "1 / span 3" }}>
                <div style={cellLabel}>
                  Stats — V-G (3-factor) · R² · norm-skill Z
                </div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--text2)",
                    marginTop: 4,
                  }}
                >
                  {num(best.vg_3factor)} · {num(best.r2_full)} ·{" "}
                  {best.ns_z != null ? best.ns_z.toFixed(2) : "—"}
                </div>
              </div>
              {onAddManager && (
                <div style={{ gridColumn: "4 / span 2", justifySelf: "end" }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => onAddManager(best)}
                  >
                    Add to portfolio
                  </button>
                </div>
              )}
            </div>
          )}

          {result.data && !best && !errMsg && (
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--text3)",
              }}
            >
              No candidates met the minimum overlap threshold.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
