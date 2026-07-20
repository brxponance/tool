import { useEffect, useState } from "react";

import { useConfirm } from "@/components/layout/confirm-dialog";
import { formatNumber, formatPercent } from "@/lib/utils";

import type { IdealComplementResponse, PortfolioManager } from "../types";
import { PlaceholderBucketsModal } from "./placeholder-buckets-modal";

// Total column count of the managers table — used for full-width ideal
// complement rows appended to the table body.
const COLSPAN_ALL = 17;

type PortfolioTableProps = {
  managers: PortfolioManager[];
  onProposedWeightChange(managerKey: string, proposedWeightPercent: number): void;
  onRemoveManager(managerKey: string): void;
  onPlaceholderSaved?: () => void;
  idealComplement?: IdealComplementResponse | null;
  idealComplementLoading?: boolean;
  idealComplementError?: string | null;
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
}: {
  data?: IdealComplementResponse | null;
  loading?: boolean;
  error?: string | null;
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
          colSpan={COLSPAN_ALL}
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
          <td className={`mono ${vg3Class}`}>{formatPercent(vg3)}</td>
          <td className={`mono ${vgFClass}`}>{formatPercent(vgF)}</td>
          <td className={`mono ${nsClass}`}>
            {nsZ == null ? "--" : `${nsZ >= 0 ? "+" : ""}${formatNumber(nsZ, 2)}`}
          </td>
          <td colSpan={COLSPAN_ALL - 7} />
        </tr>
      ) : null}
    </>
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
}: PortfolioTableProps) {
  const [draftWeights, setDraftWeights] = useState<Record<string, string>>(() => draftWeightsFor(managers));
  const [editingPlaceholder, setEditingPlaceholder] = useState<PortfolioManager | null>(null);
  const { confirm, dialog } = useConfirm();

  useEffect(() => {
    setDraftWeights(draftWeightsFor(managers));
  }, [managers]);

  return (
    <div className="overflow-x-auto">
      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Tab</th>
              <th>Manager</th>
              <th>Current Wt</th>
              <th>Proposed Wt</th>
              <th>3F V-G</th>
              <th>Full V-G</th>
              <th title="Normalized Skill Z-score: annualized since-inception skill, z-scored against same-window peers">
                Norm Skill (Z)
              </th>
              <th>Core</th>
              <th>Value</th>
              <th>Growth</th>
              <th>Yield</th>
              <th>Quality</th>
              <th>Dynamic</th>
              <th>Defensive</th>
              <th>Low Vol</th>
              <th>R² Full</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!managers.length ? (
              <tr>
                <td colSpan={17} style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
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
              <IdealComplementRows
                data={idealComplement}
                loading={idealComplementLoading}
                error={idealComplementError}
              />
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