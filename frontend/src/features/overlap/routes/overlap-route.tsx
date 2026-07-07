"use client";

import { useState } from "react";

import { OverlapDetailTable } from "../components/overlap-detail-table";
import { OverlapMatrix } from "../components/overlap-matrix";
import { useOverlapScreen } from "../hooks/use-overlap-screen";

export function OverlapRoute() {
  const {
    clients,
    selectedClient,
    setSelectedClient,
    weightState,
    setWeightState,
    matchBasis,
    setMatchBasis,
    matrix,
    loading,
    error,
    detail,
    openDetail,
  } = useOverlapScreen();

  const [metric, setMetric] = useState<"common_weight" | "jaccard">("common_weight");

  const hasMatrix = matrix && (matrix.managers?.length ?? 0) > 0 && (matrix.pairs?.length ?? 0) > 0;

  return (
    <div id="page-overlap">
      <div className="flex gap-16 mb-16 items-center" style={{ flexWrap: "wrap" }}>
        <div className="select-wrap">
          <select
            value={selectedClient ?? ""}
            onChange={(event) => {
              if (event.target.value) setSelectedClient(event.target.value);
            }}
          >
            <option value="">-- Select Portfolio --</option>
            {clients.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>Weights:</span>
          <div className="select-wrap">
            <select value={weightState} onChange={(e) => setWeightState(e.target.value as "current" | "proposed")}>
              <option value="current">Current</option>
              <option value="proposed">Proposed</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>Match by:</span>
          <div className="select-wrap">
            <select value={matchBasis} onChange={(e) => setMatchBasis(e.target.value as "sedol" | "issuer")}>
              <option value="sedol">Exact security (SEDOL)</option>
              <option value="issuer">Issuer (collapse share classes)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <span style={{ color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 10 }}>Computing…</span>
        ) : null}
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}

      {matrix?.note ? <div className="alert alert-warn">{matrix.note}</div> : null}

      {matrix?.unmatched && matrix.unmatched.length ? (
        <div className="alert alert-warn">
          <strong>No exposure match:</strong> {matrix.unmatched.join(", ")}
        </div>
      ) : null}

      <div className="panel mb-16">
        <div className="panel-header">
          <span className="panel-title">Holdings Overlap Matrix</span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
            {matrix?.benchmark_name ? `Benchmark hint: ${matrix.benchmark_name}` : "Pairwise security overlap"}
          </span>
        </div>
        <div className="panel-body" style={{ padding: 16 }}>
          {hasMatrix ? (
            <OverlapMatrix
              data={matrix}
              metric={metric}
              onMetricChange={setMetric}
              activePairKey={detail.key}
              onCellClick={openDetail}
            />
          ) : (
            <div style={{ padding: 24, textAlign: "center", color: "var(--text3)" }}>
              {loading
                ? "Computing overlap…"
                : selectedClient
                  ? "Fewer than two managers matched the exposures file, or no exposure data is loaded. Upload a FactSet exposures file on the Setup tab."
                  : "Select a portfolio to see the holdings-overlap matrix."}
            </div>
          )}
        </div>
      </div>

      {detail.key && (
        <div className="panel mb-16">
          <div className="panel-header">
            <span className="panel-title">Shared Holdings</span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <OverlapDetailTable data={detail.data} loading={detail.loading} error={detail.error} />
          </div>
        </div>
      )}
    </div>
  );
}
