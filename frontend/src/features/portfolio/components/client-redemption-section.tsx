"use client";

import { useMemo, useState } from "react";

import { formatDollars, formatNumber, formatPercent, formatSignedPercent } from "@/lib/utils";

import { optimizeRedemption } from "../api/get-portfolio-screen-data";
import type { PortfolioManager, RedemptionResponse } from "../types";

type ClientRedemptionSectionProps = {
  client: string | null;
  managers: PortfolioManager[];
  clientAum: number | null;
};

type Scope = "all" | "only" | "except";

function managerKey(manager: PortfolioManager) {
  return `${manager.tab}::${manager.matched_name}`;
}

// Parse a user-typed dollar amount, tolerating "$", commas, and a trailing
// B/M/K unit so "50m" and "50,000,000" both work.
function parseAmount(raw: string): number | null {
  const s = raw.trim().replace(/[$,\s]/g, "");
  if (!s) return null;
  const m = /^(-?\d+(?:\.\d+)?)([bmk])?$/i.exec(s);
  if (!m) return null;
  const value = Number.parseFloat(m[1]);
  if (!Number.isFinite(value)) return null;
  const unit = (m[2] ?? "").toLowerCase();
  const mult = unit === "b" ? 1e9 : unit === "m" ? 1e6 : unit === "k" ? 1e3 : 1;
  return value * mult;
}

export function ClientRedemptionSection({
  client,
  managers,
  clientAum,
}: ClientRedemptionSectionProps) {
  const [amountText, setAmountText] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<RedemptionResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const held = useMemo(
    () => managers.filter((m) => (m.current_weight ?? 0) > 0),
    [managers],
  );

  const amount = parseAmount(amountText);
  const canRun = client != null && clientAum != null && amount != null && amount > 0 && held.length > 0;

  function togglePicked(key: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  async function run() {
    if (!canRun || client == null || amount == null) return;
    setRunning(true);
    setError(null);
    setResult(null);
    const chosen = held
      .filter((m) => picked.has(managerKey(m)))
      .map((m) => ({ name: m.matched_name, tab: m.tab }));
    try {
      const res = await optimizeRedemption({
        client,
        clientAum,
        redemptionAmount: amount,
        managers,
        include: scope === "only" ? chosen : [],
        exclude: scope === "except" ? chosen : [],
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Redemption request failed.");
    } finally {
      setRunning(false);
    }
  }

  const summary = result?.summary;
  const rows = result?.redemption_managers ?? [];

  return (
    <div className="contrib-section mb-16">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Client Redemption</span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: clientAum == null ? "var(--warning, #b7791f)" : "var(--text3)",
            }}
          >
            {clientAum == null
              ? "No client AUM in the weights file — add the total to column C of the client header row."
              : `Total AUM: ${formatDollars(clientAum)}`}
          </span>
        </div>

        <div className="panel-body" style={{ padding: 12 }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text3)",
              marginBottom: 10,
            }}
          >
            Pulls from the lowest-edge managers first, holding 3-factor V-G within
            ±1% of the current portfolio (and inside the ±7% cap).
          </div>

          <div className="flex items-center mb-16" style={{ gap: 10, flexWrap: "wrap" }}>
            <label
              style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)" }}
              htmlFor="redemption-amount"
            >
              Redeem
            </label>
            <input
              id="redemption-amount"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 50,000,000 or 50m"
              value={amountText}
              disabled={clientAum == null}
              onChange={(event) => setAmountText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && canRun) void run();
              }}
              style={{ width: 200 }}
            />
            {amount != null ? (
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)" }}>
                {formatDollars(amount)}
                {clientAum ? ` · ${formatPercent(amount / clientAum)} of AUM` : ""}
              </span>
            ) : amountText.trim() ? (
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--danger, #c0392b)" }}>
                Enter a number, e.g. 50,000,000
              </span>
            ) : null}

            <div className="select-wrap" style={{ marginLeft: 8 }}>
              <select
                value={scope}
                disabled={clientAum == null}
                onChange={(event) => setScope(event.target.value as Scope)}
                aria-label="Redemption scope"
              >
                <option value="all">Whole portfolio</option>
                <option value="only">Only selected managers</option>
                <option value="except">Everything except selected</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!canRun || running}
              onClick={() => void run()}
            >
              {running ? "Sizing..." : "Run"}
            </button>
          </div>

          {scope !== "all" ? (
            <div className="mb-16" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {held.map((manager) => {
                const key = managerKey(manager);
                const on = picked.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    className={`btn btn-sm ${on ? "btn-primary" : "btn-outline"}`}
                    onClick={() => togglePicked(key)}
                    style={{ fontSize: 10 }}
                  >
                    {manager.matched_name}
                  </button>
                );
              })}
              {!picked.size ? (
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--text3)",
                    alignSelf: "center",
                  }}
                >
                  {scope === "only"
                    ? "Select at least one manager to redeem from."
                    : "Select managers to protect from the redemption."}
                </span>
              ) : null}
            </div>
          ) : null}

          {error ? <div className="alert alert-error">{error}</div> : null}
          {result && result.status === "error" ? (
            <div className="alert alert-error">{result.error}</div>
          ) : null}
          {result && result.status === "infeasible" ? (
            <div className="alert alert-warn">{result.error}</div>
          ) : null}
          {result && result.status === "warning" && result.error ? (
            <div className="alert alert-warn">{result.error}</div>
          ) : null}

          {summary ? (
            <>
              <div
                className="flex mb-16"
                style={{ gap: 24, flexWrap: "wrap", fontFamily: "var(--mono)", fontSize: 11 }}
              >
                <span>
                  <span style={{ color: "var(--text3)" }}>Redeemed </span>
                  <strong>{formatDollars(summary.redemption_amount)}</strong>
                </span>
                <span>
                  <span style={{ color: "var(--text3)" }}>New total </span>
                  <strong>{formatDollars(summary.new_total_aum)}</strong>
                </span>
                <span>
                  <span style={{ color: "var(--text3)" }}>3F V-G </span>
                  {formatSignedPercent(summary.orig_vg_3factor, 2)} →{" "}
                  <strong>{formatSignedPercent(summary.new_vg_3factor, 2)}</strong>
                  <span style={{ color: "var(--text3)" }}>
                    {" "}
                    (band {formatSignedPercent(summary.vg_lo, 2)}…
                    {formatSignedPercent(summary.vg_hi, 2)})
                  </span>
                </span>
                <span>
                  <span style={{ color: "var(--text3)" }}>Edge </span>
                  {summary.orig_edge == null ? "--" : formatNumber(summary.orig_edge, 2)} →{" "}
                  <strong>
                    {summary.new_edge == null ? "--" : formatNumber(summary.new_edge, 2)}
                  </strong>
                </span>
                <span>
                  <span style={{ color: "var(--text3)" }}>Reduced </span>
                  {summary.n_reduced}
                  {summary.n_dropped ? (
                    <span style={{ color: "var(--danger, #c0392b)" }}>
                      {" "}
                      · {summary.n_dropped} fully redeemed
                    </span>
                  ) : null}
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>Manager</th>
                      <th>Current Wt</th>
                      <th className="sep-col">Current $</th>
                      <th>Pull $</th>
                      <th>Remaining $</th>
                      <th className="sep-col">New Wt</th>
                      <th>3F V-G</th>
                      <th>Norm Z</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const pulled = row.pull_dollars > 0;
                      const dropped = row.remaining_dollars <= 0 && row.current_dollars > 0;
                      return (
                        <tr key={`${row.tab}::${row.name}`}>
                          <td style={{ fontWeight: pulled ? 500 : 400 }}>
                            {row.name}
                            {!row.eligible ? (
                              <span
                                className="badge mono"
                                style={{ marginLeft: 6, fontSize: 9 }}
                                title="Excluded from this redemption"
                              >
                                held
                              </span>
                            ) : null}
                            {dropped ? (
                              <span
                                className="badge mono"
                                style={{
                                  marginLeft: 6,
                                  fontSize: 9,
                                  background: "var(--danger, #c0392b)",
                                  color: "#fff",
                                }}
                              >
                                terminated
                              </span>
                            ) : null}
                          </td>
                          <td className="mono">{formatPercent(row.current_weight)}</td>
                          <td className="mono sep-col">{formatDollars(row.current_dollars)}</td>
                          <td
                            className="mono"
                            style={{ color: pulled ? "var(--danger, #c0392b)" : "var(--text3)" }}
                          >
                            {pulled ? `-${formatDollars(row.pull_dollars)}` : "--"}
                          </td>
                          <td className="mono">{formatDollars(row.remaining_dollars)}</td>
                          <td className="mono sep-col">{formatPercent(row.remaining_weight)}</td>
                          <td className="mono">{formatPercent(row.vg_3factor)}</td>
                          <td className="mono">
                            {row.ns_z == null ? "--" : formatNumber(row.ns_z, 2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
