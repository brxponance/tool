import { useEffect, useState } from "react";

import { useConfirm } from "@/components/layout/confirm-dialog";
import { formatDollars, formatNumber, formatPercent } from "@/lib/utils";

import type {
  IdealComplementResponse,
  IdealFactorComplementResponse,
  PortfolioManager,
} from "../types";
import { PlaceholderBucketsModal } from "./placeholder-buckets-modal";

// Column count of the managers table without the optional AUM group. Used for
// full-width rows (ideal complement, AUM banner) appended to the table body.
const COLSPAN_BASE = 17;
// The AUM group adds two sub-columns (Cur / Prop) after Proposed Wt.
const AUM_COLS = 2;

type PortfolioTableProps = {
  managers: PortfolioManager[];
  onProposedWeightChange(managerKey: string, proposedWeightPercent: number): void;
  onRemoveManager(managerKey: string): void;
  onPlaceholderSaved?: () => void;
  idealComplement?: IdealComplementResponse | null;
  idealComplementLoading?: boolean;
  idealComplementError?: string | null;
  idealFactorComplement?: IdealFactorComplementResponse | null;
  idealFactorComplementLoading?: boolean;
  idealFactorComplementError?: string | null;
  // Client total AUM in raw dollars. When null the AUM column group and the
  // "Client Total AUM" banner are hidden entirely (older weights files).
  clientAum?: number | null;
};

function proposedWeightLabel(manager: PortfolioManager) {
  return (manager.proposed_weight * 100).toFixed(1);
}

function draftWeightsFor(managers: PortfolioManager[]) {
  return Object.fromEntries(
    managers.map((manager) => [`${manager.tab}::${manager.matched_name}`, proposedWeightLabel(manager)]),
  );
}

function IdealComplementRows({
  data,
  loading,
  error,
  colSpanAll,
  aumCols,
}: {
  data?: IdealComplementResponse | null;
  loading?: boolean;
  error?: string | null;
  colSpanAll: number;
  aumCols: number;
}) {
  const best = data?.best;

  let stat: React.ReactNode;
  if (loading && !best) {
    stat = <span style={{ color: "var(--text3)" }}>Computing…</span>;
  } else if (error || data?.error) {
    stat = <span style={{ color: "var(--text3)" }}>{error ?? data?.error}</span>;
  } else if (!best) {
    stat = (
      <span style={{ color: "var(--text3)" }}>
        Select a portfolio to see the best-fit complement.
      </span>
    );
  } else {
    const hr = `${(best.hit_rate * 100).toFixed(1)}%`;
    const ae = `${((best.avg_excess ?? 0) * 100).toFixed(2)}%`;
    const bench = data?.benchmark_name || data?.peer_benchmark || "benchmark";
    stat = (
      <>
        Hit rate <strong>{hr}</strong> · Avg excess <strong>{ae}</strong> ·{" "}
        {best.n_months} mo (of {data?.n_underperform_months ?? "?"} underperformance
        mo) · <span style={{ color: "var(--text3)" }}>vs {bench}</span>
      </>
    );
  }

  const vg3 = best?.vg_3factor ?? 0;
  const vgF = best?.vg_full ?? 0;
  const vg3Class = vg3 > 0.05 ? "val-pos" : vg3 < -0.05 ? "val-neg" : "val-neu";
  const vgFClass = vgF > 0.05 ? "val-pos" : vgF < -0.05 ? "val-neg" : "val-neu";
  const nsZ = best?.ns_z;
  const nsClass = nsZ == null ? "" : nsZ > 0 ? "skill-pos" : "skill-neg";

  return (
    <>
      <tr>
        <td
          colSpan={colSpanAll}
          style={{
            borderTop: "2px solid var(--accent)",
            background: "var(--surface2)",
            padding: "8px 10px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontWeight: 600,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              color: "var(--accent)",
              marginRight: 12,
            }}
          >
            Ideal Complement
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)" }}>
            {stat}
          </span>
        </td>
      </tr>
      {best ? (
        <tr style={{ background: "var(--surface2)" }}>
          <td>
            <span className="badge badge-blue mono">{best.tab}</span>
          </td>
          <td style={{ fontWeight: 500 }}>{best.name}</td>
          <td className="mono" style={{ color: "var(--text3)" }}>
            —
          </td>
          <td className="mono" style={{ color: "var(--text3)" }}>
            —
          </td>
          {aumCols ? <td colSpan={aumCols} className="mono" style={{ color: "var(--text3)" }}>—</td> : null}
          <td className={`mono ${vg3Class}`}>{formatPercent(vg3)}</td>
          <td className={`mono ${vgFClass}`}>{formatPercent(vgF)}</td>
          <td className={`mono ${nsClass}`}>
            {nsZ == null ? "--" : `${nsZ >= 0 ? "+" : ""}${formatNumber(nsZ, 2)}`}
          </td>
          <td colSpan={colSpanAll - 7 - aumCols} />
        </tr>
      ) : null}
    </>
  );
}

// Best-fit FACTOR index for the proposed book — the style tilt it's missing.
// Rendered as a single summary row (there is no manager to slot in, so unlike
// IdealComplementRows there's no second row of per-manager stats).
function IdealFactorComplementRow({
  data,
  loading,
  error,
  colSpanAll,
}: {
  data?: IdealFactorComplementResponse | null;
  loading?: boolean;
  error?: string | null;
  colSpanAll: number;
}) {
  const best = data?.best;

  let stat: React.ReactNode;
  if (loading && !best) {
    stat = <span style={{ color: "var(--text3)" }}>Computing…</span>;
  } else if (error || data?.error) {
    stat = <span style={{ color: "var(--text3)" }}>{error ?? data?.error}</span>;
  } else if (!best) {
    stat = (
      <span style={{ color: "var(--text3)" }}>
        Select a portfolio to see the missing factor tilt.
      </span>
    );
  } else {
    const hr = `${(best.hit_rate * 100).toFixed(1)}%`;
    const ae = `${((best.avg_excess ?? 0) * 100).toFixed(2)}%`;
    const bench = data?.benchmark_name || data?.peer_benchmark || "benchmark";
    stat = (
      <>
        <span className="badge badge-blue mono" style={{ marginRight: 8 }}>
          {best.category ?? "Factor"}
        </span>
        <strong>{best.name}</strong> · Hit rate <strong>{hr}</strong> · Avg excess{" "}
        <strong>{ae}</strong> · {best.n_months} mo (of{" "}
        {data?.n_underperform_months ?? "?"} underperformance mo) ·{" "}
        <span style={{ color: "var(--text3)" }}>vs {bench}</span>
      </>
    );
  }

  return (
    <tr>
      <td
        colSpan={colSpanAll}
        style={{
          borderTop: "1px solid var(--border2)",
          background: "var(--surface2)",
          padding: "8px 10px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontWeight: 600,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            color: "var(--accent)",
            marginRight: 12,
          }}
          title="The style/factor sleeve whose returns best offset the proposed portfolio's underperformance months"
        >
          Ideal Factor Complement
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)" }}>
          {stat}
        </span>
      </td>
    </tr>
  );
}

export function PortfolioTable({
  managers,
  onProposedWeightChange,
  onRemoveManager,
  onPlaceholderSaved,
  idealComplement,
  idealComplementLoading,
  idealComplementError,
  idealFactorComplement,
  idealFactorComplementLoading,
  idealFactorComplementError,
  clientAum,
}: PortfolioTableProps) {
  const [draftWeights, setDraftWeights] = useState<Record<string, string>>(() => draftWeightsFor(managers));
  const [editingPlaceholder, setEditingPlaceholder] = useState<PortfolioManager | null>(null);
  const { confirm, dialog } = useConfirm();

  useEffect(() => {
    setDraftWeights(draftWeightsFor(managers));
  }, [managers]);

  // The AUM group only exists when the weights file carried a client total.
  const showAum = clientAum != null;
  const aumCols = showAum ? AUM_COLS : 0;
  const colSpanAll = COLSPAN_BASE + aumCols;
  // Sub-columns force a two-row header; without them a single row is cleaner.
  const headSpan = showAum ? 2 : undefined;

  return (
    <div className="overflow-x-auto">
      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th rowSpan={headSpan} style={{ width: 60 }}>Tab</th>
              <th rowSpan={headSpan}>Manager</th>
              <th rowSpan={headSpan}>Current Wt</th>
              <th rowSpan={headSpan}>Proposed Wt</th>
              {showAum ? (
                <th
                  colSpan={AUM_COLS}
                  className="period-group sep-col"
                  style={{ textAlign: "center" }}
                  title="Manager weight × client total AUM"
                >
                  AUM ($)
                </th>
              ) : null}
              <th rowSpan={headSpan}>3F V-G</th>
              <th rowSpan={headSpan}>Full V-G</th>
              <th rowSpan={headSpan} title="Normalized Skill Z-score: annualized since-inception skill, z-scored against same-window peers">
                Norm Skill (Z)
              </th>
              <th rowSpan={headSpan}>Core</th>
              <th rowSpan={headSpan}>Value</th>
              <th rowSpan={headSpan}>Growth</th>
              <th rowSpan={headSpan}>Yield</th>
              <th rowSpan={headSpan}>Quality</th>
              <th rowSpan={headSpan}>Dynamic</th>
              <th rowSpan={headSpan}>Defensive</th>
              <th rowSpan={headSpan}>Low Vol</th>
              <th rowSpan={headSpan}>R² Full</th>
              <th rowSpan={headSpan}></th>
            </tr>
            {showAum ? (
              <tr>
                <th className="sub sep-col" title="Current weight × client total AUM">Cur</th>
                <th className="sub" title="Proposed weight × client total AUM">Prop</th>
              </tr>
            ) : null}
          </thead>
          <tbody>
            {showAum && managers.length ? (
              <tr
                style={{
                  background: "var(--surface3, var(--surface2))",
                  borderBottom: "2px solid var(--border2)",
                }}
              >
                <td />
                <td
                  style={{
                    fontWeight: 600,
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    whiteSpace: "nowrap",
                  }}
                >
                  Client Total AUM
                </td>
                <td />
                <td />
                <td
                  className="mono sep-col"
                  colSpan={AUM_COLS}
                  style={{ fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  {formatDollars(clientAum)}
                </td>
                <td colSpan={COLSPAN_BASE - 4} />
              </tr>
            ) : null}
            {!managers.length ? (
              <tr>
                <td colSpan={colSpanAll} style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
                  No managers in the preview portfolio yet.
                </td>
              </tr>
            ) : managers.map((manager) => {
              const vg3 = manager.vg_3factor ?? 0;
              const full = manager.vg_full ?? 0;
              const nsZ = manager.ns_z;
              const managerKey = `${manager.tab}::${manager.matched_name}`;
              const currentDraft = draftWeights[managerKey] ?? proposedWeightLabel(manager);
              const r2Pct = manager.r2_full != null ? manager.r2_full * 100 : null;
              const r2Label = r2Pct != null ? r2Pct.toFixed(1) : "--";

              const vg3Class = vg3 > 0.05 ? "val-pos" : vg3 < -0.05 ? "val-neg" : "val-neu";
              const fullClass = full > 0.05 ? "val-pos" : full < -0.05 ? "val-neg" : "val-neu";
              const nsClass = nsZ == null ? "" : nsZ > 0 ? "skill-pos" : nsZ < 0 ? "skill-neg" : "";

              const isPlaceholder = manager.is_placeholder === true;

              return (
                <tr key={managerKey}>
                  <td>
                    {isPlaceholder ? (
                      <span
                        className="badge mono"
                        style={{
                          background: "var(--yellow, #f5b400)",
                          color: "var(--bg1, #000)",
                        }}
                        title="Placeholder — no clone data. Click 'Edit buckets' to set style allocation."
                      >
                        PH
                      </span>
                    ) : (
                      <span className="badge badge-blue mono">{manager.tab}</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {manager.matched_name}
                    {isPlaceholder && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ marginLeft: 8, fontSize: 10, padding: "2px 6px" }}
                        onClick={() => setEditingPlaceholder(manager)}
                      >
                        Edit buckets
                      </button>
                    )}
                  </td>
                  <td className="mono">{formatPercent(manager.current_weight)}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={currentDraft}
                      onChange={(event) => {
                        setDraftWeights((current) => ({
                          ...current,
                          [managerKey]: event.target.value,
                        }));
                      }}
                      onBlur={() => {
                        const nextValue = Number.parseFloat(currentDraft);
                        const normalizedValue = Number.isFinite(nextValue)
                          ? Math.max(0, nextValue)
                          : 0;
                        const normalizedLabel = normalizedValue.toFixed(1);

                        setDraftWeights((current) => ({
                          ...current,
                          [managerKey]: normalizedLabel,
                        }));

                        if (normalizedLabel !== proposedWeightLabel(manager)) {
                          onProposedWeightChange(managerKey, normalizedValue);
                        }
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.currentTarget.blur();
                          return;
                        }

                        if (event.key === "Escape") {
                          const resetValue = proposedWeightLabel(manager);
                          setDraftWeights((current) => ({
                            ...current,
                            [managerKey]: resetValue,
                          }));
                          event.currentTarget.blur();
                        }
                      }}
                    />
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginLeft: 2 }}>
                      %
                    </span>
                  </td>
                  {showAum ? (
                    <>
                      {/* Derived from the LIVE weights rather than the backend's
                          aum_current/aum_proposed so the proposed dollars track
                          weight edits immediately instead of after a refetch. */}
                      <td className="mono sep-col" style={{ whiteSpace: "nowrap" }}>
                        {formatDollars((clientAum ?? 0) * (manager.current_weight ?? 0))}
                      </td>
                      <td className="mono" style={{ whiteSpace: "nowrap" }}>
                        {formatDollars((clientAum ?? 0) * (manager.proposed_weight ?? 0))}
                      </td>
                    </>
                  ) : null}
                  <td className={`mono ${vg3Class}`}>{formatPercent(vg3)}</td>
                  <td className={`mono ${fullClass}`}>{formatPercent(full)}</td>
                  <td className={`mono ${nsClass}`}>{nsZ == null ? "--" : `${nsZ >= 0 ? "+" : ""}${formatNumber(nsZ, 2)}`}</td>
                  <td className="mono">{formatPercent(manager.style_buckets.Core ?? 0)}</td>
                  <td className="mono">{formatPercent(manager.style_buckets.Value ?? 0)}</td>
                  <td className="mono">{formatPercent(manager.style_buckets.Growth ?? 0)}</td>
                  <td className="mono">{formatPercent(manager.style_buckets.Yield ?? 0)}</td>
                  <td className="mono">{formatPercent(manager.style_buckets.Quality ?? 0)}</td>
                  <td className="mono">{formatPercent(manager.style_buckets.Dynamic ?? 0)}</td>
                  <td className="mono">{formatPercent(manager.style_buckets.Defensive ?? 0)}</td>
                  <td className="mono">{formatPercent(manager.style_buckets["Low Vol"] ?? 0)}</td>
                  <td>
                    <span className="mono" style={{ color: "var(--text2)" }}>{r2Label}%</span>
                    <span className="r2-bar">
                      <span className="r2-fill" style={{ width: `${Math.max(0, Math.min(r2Pct ?? 0, 100))}%` }} />
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={async () => {
                        const ok = await confirm({
                          title: "Remove manager",
                          message: `Are you sure you want to remove "${manager.matched_name}" from this portfolio?`,
                          confirmLabel: "Remove",
                          danger: true,
                        });
                        if (ok) {
                          onRemoveManager(managerKey);
                        }
                      }}
                      style={{ color: "var(--text3)", cursor: "pointer" }}
                      aria-label={`Remove ${manager.matched_name}`}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
            {managers.length ? (
              <>
                <IdealComplementRows
                  data={idealComplement}
                  loading={idealComplementLoading}
                  error={idealComplementError}
                  colSpanAll={colSpanAll}
                  aumCols={aumCols}
                />
                <IdealFactorComplementRow
                  data={idealFactorComplement}
                  loading={idealFactorComplementLoading}
                  error={idealFactorComplementError}
                  colSpanAll={colSpanAll}
                />
              </>
            ) : null}
          </tbody>
        </table>
      </div>
      <PlaceholderBucketsModal
        manager={editingPlaceholder}
        onClose={() => setEditingPlaceholder(null)}
        onSaved={() => {
          setEditingPlaceholder(null);
          onPlaceholderSaved?.();
        }}
      />
      {dialog}
    </div>
  );
}