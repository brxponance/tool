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

function managerKey(manager: PortfolioManager) {
  return `${manager.tab}::${manager.matched_name}`;
}

// Default V-G constraint, used only for the pre-run description. Once a run
// returns, the label switches to the tolerance the solver actually applied
// (summary.vg_tol / vg_cap) so the two can't disagree.
const DEFAULT_VG_TOL = 0.01;
const DEFAULT_VG_CAP = 0.07;

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

// One scope row: a label plus a chip per held manager. Kept as chips rather
// than the reference's search-and-add list because a client book is a handful of
// managers, so every option fits on screen and needs one click instead of three.
function ScopePicker({
  label,
  hint,
  managers,
  selected,
  disabled,
  onToggle,
  tone,
}: {
  label: string;
  hint: string;
  managers: PortfolioManager[];
  selected: Set<string>;
  disabled?: boolean;
  onToggle: (key: string) => void;
  tone: "accent" | "danger";
}) {
  const onColor = tone === "danger" ? "var(--danger, #c0392b)" : "var(--accent)";
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          color: "var(--text2)",
          textTransform: "uppercase",
          letterSpacing: ".06em",
          fontWeight: 600,
          minWidth: 168,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
        {managers.map((manager) => {
          const key = managerKey(manager);
          const on = selected.has(key);
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(key)}
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                padding: "4px 9px",
                borderRadius: 14,
                border: `1px solid ${on ? onColor : "var(--border)"}`,
                background: on ? onColor : "var(--surface)",
                color: on ? "#fff" : "var(--text2)",
                cursor: disabled ? "default" : "pointer",
                opacity: disabled ? 0.5 : 1,
              }}
            >
              {manager.matched_name}
            </button>
          );
        })}
        {!selected.size ? (
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text3)",
              alignSelf: "center",
            }}
          >
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function ClientRedemptionSection({
  client,
  managers,
  clientAum,
}: ClientRedemptionSectionProps) {
  const [amountText, setAmountText] = useState("");
  // Two independent scopes, both live at once — matching the reference tool.
  // The backend gives `include` precedence when both are non-empty.
  const [included, setIncluded] = useState<Set<string>>(new Set());
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<RedemptionResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const held = useMemo(
    () => managers.filter((m) => (m.current_weight ?? 0) > 0),
    [managers],
  );

  const amount = parseAmount(amountText);
  const canRun = client != null && clientAum != null && amount != null && amount > 0 && held.length > 0;

  function toggle(
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    other: React.Dispatch<React.SetStateAction<Set<string>>>,
    key: string,
  ) {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    // A manager can't be both pulled-only-from and protected.
    other((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }

  const asEntries = (keys: Set<string>) =>
    held.filter((m) => keys.has(managerKey(m))).map((m) => ({ name: m.matched_name, tab: m.tab }));

  async function run() {
    if (!canRun || client == null || amount == null) return;
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await optimizeRedemption({
        client,
        clientAum,
        redemptionAmount: amount,
        managers,
        include: asEntries(included),
        exclude: asEntries(excluded),
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
            ±{(((summary?.vg_tol ?? DEFAULT_VG_TOL) * 100).toFixed(0))}% of the current
            portfolio (and inside the ±
            {(((summary?.vg_cap ?? DEFAULT_VG_CAP) * 100).toFixed(0))}% cap).
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

            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!canRun || running}
              onClick={() => void run()}
            >
              {running ? "Sizing..." : "Run"}
            </button>
          </div>

          <div className="mb-16" style={{ display: "grid", gap: 10 }}>
            <ScopePicker
              label="Pull only from"
              hint="None — pull from the whole portfolio"
              managers={held}
              selected={included}
              disabled={clientAum == null}
              onToggle={(key) => toggle(setIncluded, setExcluded, key)}
              tone="accent"
            />
            <ScopePicker
              label="Exclude from redemption"
              hint="None"
              managers={held}
              selected={excluded}
              disabled={clientAum == null}
              onToggle={(key) => toggle(setExcluded, setIncluded, key)}
              tone="danger"
            />
            {included.size ? (
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
                A “pull only from” selection takes precedence — the exclude list is ignored.
              </span>
            ) : null}
          </div>

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
