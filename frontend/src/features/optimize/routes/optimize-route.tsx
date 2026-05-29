"use client";

import { ConstraintInputs } from "../components/constraint-inputs";
import { ForcedManagersPicker } from "../components/forced-managers-picker";
import { OptimizerResultTable } from "../components/optimizer-result-table";
import { OptimizerSummaryPanel } from "../components/optimizer-summary";
import { PeerGroupSelector } from "../components/peer-group-selector";
import { useOptimizeScreen } from "../hooks/use-optimize-screen";

export function OptimizeRoute() {
  const {
    peerGroup,
    setPeerGroup,
    constraints,
    updateConstraint,
    forcedManagers,
    addForcedManager,
    updateForcedManager,
    removeForcedManager,
    candidates,
    result,
    runOptimization,
  } = useOptimizeScreen();

  const resultData = result.data;
  const managers = resultData?.optimized_managers ?? [];
  const summary = resultData?.summary;
  const isFailure =
    resultData?.status === "error" || resultData?.status === "infeasible";

  return (
    <div>
      <div className="peer-selector">
        <PeerGroupSelector value={peerGroup} onChange={setPeerGroup} />
        <ConstraintInputs value={constraints} onChange={updateConstraint} />
        <ForcedManagersPicker
          peerGroup={peerGroup}
          candidates={candidates.data}
          candidatesLoading={candidates.loading}
          candidatesError={candidates.error}
          forced={forcedManagers}
          onAdd={addForcedManager}
          onUpdate={updateForcedManager}
          onRemove={removeForcedManager}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 16,
          }}
        >
          <button
            type="button"
            className="btn btn-primary"
            disabled={result.loading}
            onClick={() => void runOptimization()}
          >
            {result.loading ? "Optimizing…" : "Optimize"}
          </button>
          {result.error && (
            <span
              style={{
                color: "var(--red)",
                fontFamily: "var(--mono)",
                fontSize: 12,
              }}
            >
              {result.error}
            </span>
          )}
          {resultData?.status === "warning" && resultData.error && (
            <span
              style={{
                color: "var(--yellow)",
                fontFamily: "var(--mono)",
                fontSize: 12,
              }}
            >
              {resultData.error}
            </span>
          )}
        </div>
      </div>

      {isFailure && resultData?.error && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            border: "1px solid var(--border)",
            background: "var(--bg1)",
            color: "var(--red)",
            fontFamily: "var(--mono)",
            fontSize: 12,
          }}
        >
          {resultData.error}
        </div>
      )}

      {summary && <OptimizerSummaryPanel summary={summary} />}
      {managers.length > 0 && <OptimizerResultTable managers={managers} />}

      {!resultData && !result.loading && (
        <div
          style={{
            color: "var(--text3)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          Configure constraints and forced managers, then run the optimizer.
        </div>
      )}
    </div>
  );
}
