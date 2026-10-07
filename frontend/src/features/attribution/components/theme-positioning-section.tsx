"use client";

import type { ThemeDetailResponse } from "../types";

// Manager-level attribution for one pinned theme (P2).
//
// Reads top down: what the benchmark held in this theme, what the client held
// against it, and then which managers built that position. The manager split
// is in CLIENT space, so its weights sum to the client's own and its bps sum
// to the client's contribution — that is what the reconciled marker asserts.
//
// `own` is the one manager-space column: the sleeve's weight in the theme as a
// share of ITSELF, beside the benchmark's. It answers a different question
// (was this manager's own bet large?) and is never mixed into the split.

const pct = (v: number | null | undefined, dp = 2) =>
  v == null ? "--" : `${(v * 100).toFixed(dp)}%`;

const pp = (v: number | null | undefined) =>
  v == null ? "--" : `${v >= 0 ? "+" : ""}${(v * 100).toFixed(2)}pp`;

const bps = (v: number | null | undefined) =>
  v == null ? "--" : `${v >= 0 ? "+" : ""}${Math.round(v)}`;

function sign(v: number | null | undefined) {
  if (v == null || v === 0) return "";
  return v > 0 ? "skill-pos" : "skill-neg";
}

type Props = {
  data: ThemeDetailResponse | null;
  loading?: boolean;
  onClear?: () => void;
};

export function ThemePositioningSection({ data, loading, onClear }: Props) {
  if (!data && !loading) {
    return null;
  }

  return (
    <div className="panel mb-16">
      <div
        className="panel-header"
        style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
      >
        <span className="panel-title">
          {data ? `Positioning — ${data.theme.label}` : "Positioning"}
        </span>
        {data?.client ? (
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
            {data.client} · {data.period}
          </span>
        ) : null}
        {onClear ? (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ fontSize: 10, padding: "2px 8px", marginLeft: "auto" }}
            onClick={onClear}
          >
            Unpin
          </button>
        ) : null}
      </div>

      {loading && !data ? (
        <div style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>Loading…</div>
      ) : null}

      {data?.error ? (
        <div style={{ textAlign: "center", color: "var(--amber)", padding: 20 }}>{data.error}</div>
      ) : null}

      {data && !data.error ? (
        <>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Held by</th>
                  <th className="mono">Weight</th>
                  <th className="mono">Contribution</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data.benchmark}</td>
                  <td className="mono">{pct(data.benchmark_weight)}</td>
                  <td className="mono">{pct(data.benchmark_contribution)}</td>
                </tr>
                <tr>
                  <td>{data.client ?? data.composite}</td>
                  <td className="mono">{pct(data.client_weight)}</td>
                  <td className="mono">{pct(data.client_contribution)}</td>
                </tr>
                <tr style={{ fontWeight: 600 }}>
                  <td>Active</td>
                  <td className={`mono ${sign(data.active_weight)}`}>{pp(data.active_weight)}</td>
                  <td className={`mono ${sign(data.impact_bps)}`}>{bps(data.impact_bps)} bps</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: "8px 16px",
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
              alignItems: "center",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text2)",
            }}
          >
            <span>Manager split — weights are shares of the client</span>
            <span style={{ color: data.reconciliation.matches_client ? "var(--green)" : "var(--amber)" }}>
              {data.reconciliation.matches_client
                ? "✓ sums to the client"
                : "does not sum to the client — treat as unverified"}
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th style={{ width: 28 }}>#</th>
                  <th>Manager</th>
                  <th className="mono" title="This manager's weight in the theme, as a share of the whole client portfolio">
                    Weight
                  </th>
                  <th className="mono" title="Share of the client's total weight in this theme">
                    Of theme
                  </th>
                  <th className="mono sep-col" title="Basis points this manager contributed to the client from this theme">
                    Contribution
                  </th>
                  <th className="mono" title="The sleeve's own weight in the theme, as a share of itself — its bet in manager space">
                    Own wt
                  </th>
                  <th className="mono" title="The sleeve's own weight minus the benchmark's — whether this manager is over or underweight the theme">
                    vs Bmk
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.managers.map((m, idx) => (
                  <tr key={m.name}>
                    <td className="mono" style={{ color: "var(--text3)" }}>{idx + 1}</td>
                    <td title={m.is_residual ? "Fee / transition / residual — counted in the client total, not a manager" : undefined}>
                      {m.name}
                      {m.is_residual ? (
                        <span style={{ color: "var(--text3)", fontSize: 9 }}> · residual</span>
                      ) : null}
                    </td>
                    <td className="mono">{pct(m.weight)}</td>
                    <td className="mono">{pct(m.share_of_client, 1)}</td>
                    <td className={`mono sep-col ${sign(m.contribution_bps)}`} style={{ fontWeight: 600 }}>
                      {bps(m.contribution_bps)}
                    </td>
                    <td className="mono">{pct(m.own_weight, 1)}</td>
                    <td className={`mono ${sign(m.own_active_weight)}`}>{pp(m.own_active_weight)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
