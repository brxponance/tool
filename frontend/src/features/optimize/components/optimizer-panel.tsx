"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getOptimizeCandidates,
  runClientOptimizer,
} from "../api/get-optimize-data";
import type {
  ForcedManagerInput,
  OptimizerCandidate,
  OptimizerResponse,
} from "../types";

// Client-scoped optimizer panel — mirrors the reference "Portfolio
// Optimization" panel that sits to the right of the Portfolio Managers table.
// It sends {client_name, forced_managers} only; the backend derives the peer
// group and applies fixed constraints.

type Props = {
  clientName: string | null;
};

const DEFAULT_STATUS = "Click Run to optimize.";

function fmtOptPct(v: number | null | undefined, digits = 1): string {
  if (v == null || Number.isNaN(v)) {
    return "--";
  }
  return `${(v * 100).toFixed(digits)}%`;
}

// Accept either "Name [tab]" (from datalist) or just "Name" (auto-resolve tab)
function parseForcedSearchInput(
  s: string,
  candidates: OptimizerCandidate[],
): { name: string; tab: string } | null {
  if (!s) {
    return null;
  }
  const m = s.match(/^(.+?)\s*\[([A-Za-z_]+)\]\s*$/);
  if (m) {
    return { name: m[1].trim(), tab: m[2].trim() };
  }
  // No tab: try to match unique candidate by name
  const matches = candidates.filter(
    (c) => c.name.toLowerCase() === s.trim().toLowerCase(),
  );
  if (matches.length === 1) {
    return { name: matches[0].name, tab: matches[0].tab };
  }
  return null;
}

const inputStyle: React.CSSProperties = {
  padding: "3px 6px",
  fontFamily: "var(--mono)",
  fontSize: 11,
  border: "1px solid var(--border)",
  borderRadius: 3,
  background: "var(--surface)",
  color: "var(--text)",
};

export function OptimizerPanel({ clientName }: Props) {
  const [forced, setForced] = useState<ForcedManagerInput[]>([]);
  const [candidates, setCandidates] = useState<OptimizerCandidate[]>([]);
  const [result, setResult] = useState<OptimizerResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<{ text: string; tone: "muted" | "amber" }>(
    { text: DEFAULT_STATUS, tone: "muted" },
  );
  const [peerLabel, setPeerLabel] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [weightValue, setWeightValue] = useState("");

  // Peer group used for the candidate list — resolved from the last run,
  // defaulting to 'EAFE' until known.
  const peerGroupRef = useRef<string | null>(null);

  const loadCandidates = useCallback(async () => {
    const pg = peerGroupRef.current || "EAFE";
    try {
      const data = await getOptimizeCandidates(pg);
      setCandidates(data.candidates || []);
    } catch {
      setCandidates([]);
    }
  }, []);

  // Refresh candidate list when the active portfolio changes. We don't
  // auto-run the optimizer — that's a manual action — but we do want the
  // autocomplete to show the right peer-group first. Previous results are
  // reset (forced list stays — user might want the same overrides across
  // clients).
  useEffect(() => {
    setResult(null);
    setStatus({ text: DEFAULT_STATUS, tone: "muted" });
    setPeerLabel("");
    void loadCandidates();
  }, [clientName, loadCandidates]);

  const addForcedManager = useCallback(() => {
    const parsed = parseForcedSearchInput(searchValue, candidates);
    const wRaw = weightValue.trim();
    // Empty weight is allowed — means "require but optimizer picks weight"
    let weight: number | null = null;
    if (wRaw !== "") {
      const wPct = parseFloat(wRaw);
      if (Number.isNaN(wPct) || wPct <= 0 || wPct > 100) {
        window.alert(
          "Weight must be between 0 and 100, or leave blank to let the optimizer choose.",
        );
        return;
      }
      weight = wPct / 100;
    }
    if (!parsed) {
      window.alert(
        'Pick a manager from the suggestions, or type exactly "Manager Name [Tab]".',
      );
      return;
    }
    // Verify it's a known buy-list candidate
    const exists = candidates.find(
      (c) => c.name === parsed.name && c.tab === parsed.tab,
    );
    if (!exists) {
      window.alert(`"${parsed.name}" [${parsed.tab}] is not in the buy list.`);
      return;
    }
    // Reject duplicates
    if (forced.find((f) => f.name === parsed.name && f.tab === parsed.tab)) {
      window.alert("Already forced.");
      return;
    }
    setForced((curr) => [
      ...curr,
      { name: parsed.name, tab: parsed.tab, weight },
    ]);
    setSearchValue("");
    setWeightValue("");
  }, [searchValue, weightValue, candidates, forced]);

  const removeForcedManager = useCallback((index: number) => {
    setForced((curr) => curr.filter((_, i) => i !== index));
  }, []);

  const runOptimization = useCallback(async () => {
    if (!clientName) {
      setStatus({ text: "Select a portfolio first.", tone: "muted" });
      return;
    }
    setStatus({ text: "Optimizing…", tone: "muted" });
    setResult(null);
    setRunning(true);
    try {
      const res = await runClientOptimizer({
        client_name: clientName,
        forced_managers: forced,
      });
      peerGroupRef.current = res.peer_group || peerGroupRef.current;
      setPeerLabel(res.peer_group ? `peer: ${res.peer_group}` : "");

      if (res.status === "error" || res.status === "infeasible") {
        setStatus({
          text: res.error || "Optimization failed.",
          tone: "amber",
        });
        return;
      }
      if (res.status === "warning") {
        setStatus({ text: res.error || "", tone: "amber" });
      } else {
        setStatus({ text: "", tone: "muted" });
      }
      setResult(res);
    } catch (e) {
      setStatus({
        text: `Request failed: ${e instanceof Error ? e.message : e}`,
        tone: "amber",
      });
    } finally {
      setRunning(false);
    }
  }, [clientName, forced]);

  // Exclude any already-pinned. Show "Name [tab]" so peer-group is visible.
  const pinned = new Set(forced.map((f) => `${f.tab}::${f.name}`));
  const datalistOptions = candidates.filter(
    (c) => !pinned.has(`${c.tab}::${c.name}`),
  );

  const managers = result?.optimized_managers ?? [];
  const summary = result?.summary;
  const uncovered = summary?.skill_uncovered_weight ?? 0;
  const portVg = summary?.portfolio_vg_3factor ?? 0;
  const portVgClass =
    portVg > 0.05 ? "val-pos" : portVg < -0.05 ? "val-neg" : "val-neu";
  const expSkill = summary?.expected_norm_skill ?? 0;
  const skillClass = expSkill > 0 ? "skill-pos" : expSkill < 0 ? "skill-neg" : "";

  return (
    <div
      className="panel"
      id="optimizer-panel"
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "calc(50% - 8px)",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div
        className="panel-header"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        <span className="panel-title">Portfolio Optimization</span>
        <span
          id="opt-peer-label"
          style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}
        >
          {peerLabel}
        </span>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          style={{ marginLeft: "auto" }}
          disabled={running}
          onClick={() => void runOptimization()}
        >
          Run
        </button>
      </div>
      <div
        className="panel-body"
        style={{
          padding: "10px 12px",
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        {/* Constraint summary */}
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            color: "var(--text3)",
            lineHeight: 1.5,
            marginBottom: 8,
          }}
        >
          Max norm skill · 4–8 managers · 5–20% per mgr · V-G within ±7% of 0
        </div>

        {/* Forced manager section */}
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 3,
            padding: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text2)",
              textTransform: "uppercase",
              letterSpacing: ".05em",
              marginBottom: 6,
            }}
          >
            Forced managers
          </div>
          <div style={{ marginBottom: 6 }}>
            {!forced.length ? (
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--text3)",
                  fontStyle: "italic",
                }}
              >
                None — optimizer chooses freely
              </div>
            ) : (
              forced.map((f, i) => {
                const hasWeight = f.weight != null && f.weight > 0;
                return (
                  <div
                    key={`${f.tab}::${f.name}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "3px 6px",
                      background: "rgba(0,119,204,.06)",
                      borderRadius: 3,
                      marginBottom: 3,
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                    }}
                  >
                    <span className="badge badge-blue mono" style={{ fontSize: 9 }}>
                      {f.tab}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.name}
                    </span>
                    {hasWeight ? (
                      <span style={{ color: "var(--text2)" }}>
                        {((f.weight ?? 0) * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span
                        style={{ color: "var(--text3)", fontStyle: "italic" }}
                        title="No fixed weight — optimizer will choose"
                      >
                        optimizer
                      </span>
                    )}
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ color: "var(--text3)", padding: "0 4px" }}
                      onClick={() => removeForcedManager(i)}
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              id="forced-search"
              placeholder="Search manager…"
              list="opt-cand-list"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ ...inputStyle, flex: 1, minWidth: 140 }}
            />
            <datalist id="opt-cand-list">
              {datalistOptions.map((c) => (
                <option key={`${c.tab}::${c.name}`} value={`${c.name} [${c.tab}]`} />
              ))}
            </datalist>
            <input
              type="number"
              id="forced-weight"
              placeholder="% (opt.)"
              step={0.1}
              min={0}
              max={100}
              value={weightValue}
              onChange={(e) => setWeightValue(e.target.value)}
              title="Optional. Leave blank to let the optimizer choose the weight (within 5–20%)."
              style={{ ...inputStyle, width: 78 }}
            />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={addForcedManager}
            >
              Add
            </button>
          </div>
        </div>

        {/* Results table (scrolls with body if too tall) */}
        {status.text ? (
          <div
            id="opt-status"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: status.tone === "amber" ? "var(--amber)" : "var(--text3)",
              marginBottom: 6,
            }}
          >
            {status.text}
          </div>
        ) : null}
        {result && managers.length > 0 ? (
          <table className="data-table w-full" id="opt-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left", width: 50 }}>Tab</th>
                <th style={{ textAlign: "left" }}>Manager</th>
                <th>Wt</th>
                <th>3F V-G</th>
                <th>Norm Skill (Z)</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((m) => {
                const w = m.weight || 0;
                const vg3 = m.vg_3factor || 0;
                const vg3Class =
                  vg3 > 0.05 ? "val-pos" : vg3 < -0.05 ? "val-neg" : "val-neu";
                const nsZ = m.ns_z;
                const nsClass = nsZ == null ? "" : nsZ > 0 ? "skill-pos" : "skill-neg";
                return (
                  <tr key={`${m.tab}::${m.name}`}>
                    <td>
                      <span className="badge badge-blue mono" style={{ fontSize: 9 }}>
                        {m.tab}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {m.is_forced ? (
                        <span
                          style={{ color: "var(--amber)", marginRight: 3 }}
                          title="Forced by user"
                        >
                          ●
                        </span>
                      ) : null}
                      {m.name}
                    </td>
                    <td className="mono">{fmtOptPct(w, 1)}</td>
                    <td className={`mono ${vg3Class}`}>{fmtOptPct(vg3, 1)}</td>
                    <td className={`mono ${nsClass}`}>
                      {nsZ == null ? (
                        <span style={{ color: "var(--text3)" }}>--</span>
                      ) : (
                        `${nsZ >= 0 ? "+" : ""}${nsZ.toFixed(2)}`
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}
      </div>
      {/* Sticky summary footer — stays visible regardless of body scroll */}
      {result && summary ? (
        <div
          id="opt-summary-footer"
          style={{
            flexShrink: 0,
            borderTop: "1px solid var(--border)",
            padding: "8px 12px",
            background: "var(--surface)",
          }}
        >
          <div
            id="opt-summary"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text2)",
              lineHeight: 1.6,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "4px 12px",
              }}
            >
              <span style={{ color: "var(--text3)" }}>Portfolio V-G (3F):</span>
              <span className={portVgClass}>
                {fmtOptPct(summary.portfolio_vg_3factor, 2)}
              </span>
              <span style={{ color: "var(--text3)" }}>Expected Norm Skill:</span>
              <span className={skillClass}>
                {`${expSkill >= 0 ? "+" : ""}${expSkill.toFixed(2)}`}
              </span>
              <span style={{ color: "var(--text3)" }}>Managers:</span>
              <span>
                {summary.n_managers} ({summary.n_forced} forced +{" "}
                {summary.n_selected} optimized) of {summary.candidates_considered}{" "}
                candidates
              </span>
              <span style={{ color: "var(--text3)" }}>Total weight:</span>
              <span>{fmtOptPct(summary.total_weight, 1)}</span>
            </div>
            {uncovered > 0 ? (
              <div style={{ color: "var(--amber)" }}>
                ⚠ {(uncovered * 100).toFixed(1)}% of weight lacks norm skill
                (forced)
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
