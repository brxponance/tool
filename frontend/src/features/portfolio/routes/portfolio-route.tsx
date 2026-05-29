"use client";

import { useState } from "react";

import { formatPercent, sum } from "@/lib/utils";

import { AddManagerModal } from "../components/add-manager-modal";
import { IdealComplementSection } from "../components/ideal-complement-section";
import { PortfolioAnalyticsSections } from "../components/portfolio-analytics-sections";
import { PortfolioTable } from "../components/portfolio-table";
import { usePortfolioScreen } from "../hooks/use-portfolio-screen";

export function PortfolioRoute() {
  const [isAddManagerOpen, setIsAddManagerOpen] = useState(false);
  const {
    addManager,
    addableManagers,
    benchmarks,
    clients,
    contribution,
    ensureManagerCatalog,
    error,
    exposureMenu,
    loadingAncillary,
    loadingExposures,
    loadingManagerCatalog,
    loadingPortfolio,
    managerCatalogError,
    marketCycle,
    portfolioExposures,
    portfolio,
    reload,
    removeManager,
    riskAnalysis,
    riskExposures,
    selectedClient,
    selectedExposureGrouping,
    selectedExposureSubGrouping,
    setExposureSelection,
    setSelectedClient,
    stats,
    updateManagerProposedWeight,
  } = usePortfolioScreen();

  const managers = portfolio?.managers ?? [];
  const proposedTotal = sum(managers.map((manager) => manager.proposed_weight));
  const benchmark = portfolio?.client_benchmark ?? benchmarks[selectedClient ?? ""] ?? "--";
  const unmatched = portfolio?.unmatched ?? [];

  // Derive A/B picks from the single grouping/sub state in the hook.
  const isCategoricalGrouping = exposureMenu
    .find((g) => g.group === "Categorical")
    ?.cols.some((c) => c.col === selectedExposureGrouping);
  const selectedExposureCategorical = isCategoricalGrouping
    ? selectedExposureGrouping
    : null;
  const selectedExposureContinuous = isCategoricalGrouping
    ? selectedExposureSubGrouping
    : selectedExposureGrouping;

  return (
    <div id="page-portfolio">
      <div className="flex gap-16 mb-16 items-center" style={{ flexWrap: "wrap" }}>
        <div className="select-wrap">
          <select
            value={selectedClient ?? ""}
            onChange={(event) => {
              if (event.target.value) {
                setSelectedClient(event.target.value);
              }
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
        <button
          type="button"
          className="btn btn-outline btn-sm"
          disabled={!portfolio || loadingPortfolio}
          onClick={() => {
            setIsAddManagerOpen(true);
            void ensureManagerCatalog();
          }}
        >
          + Add Manager
        </button>
        {loadingPortfolio ? (
          <span style={{ color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 10 }}>
            Refreshing...
          </span>
        ) : null}
        <div className="ml-auto flex gap-8 items-center">
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>Proposed total:</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)" }}>
            {formatPercent(proposedTotal)}
          </span>
        </div>
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}

      {unmatched.length ? (
        <div className="alert alert-warn">
          <strong>Unmatched:</strong> {unmatched.join(", ")}
        </div>
      ) : null}

      <div className="panel mb-16">
        <div className="panel-header">
          <span className="panel-title">Portfolio Managers</span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
            Edit proposed weight to model changes
          </span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          {portfolio ? (
            <PortfolioTable
              managers={portfolio.managers}
              onProposedWeightChange={updateManagerProposedWeight}
              onRemoveManager={removeManager}
              onPlaceholderSaved={reload}
            />
          ) : (
            <div style={{ padding: 24, textAlign: "center", color: "var(--text3)" }}>
              No portfolio payload is available yet. Start the backend and load weights.
            </div>
          )}
        </div>
      </div>

      <PortfolioAnalyticsSections
        benchmark={benchmark}
        contribution={contribution}
        exposureMenu={exposureMenu}
        loadingAncillary={loadingAncillary}
        loadingExposures={loadingExposures}
        marketCycle={marketCycle}
        onExposureSelectionChange={setExposureSelection}
        portfolioExposures={portfolioExposures}
        riskAnalysis={riskAnalysis}
        riskExposures={riskExposures}
        selectedExposureCategorical={selectedExposureCategorical}
        selectedExposureContinuous={selectedExposureContinuous}
        stats={stats}
      />

      {portfolio && (
        <IdealComplementSection client={selectedClient} managers={managers} />
      )}

      <AddManagerModal
        existingManagers={managers}
        loading={loadingManagerCatalog}
        managerCatalogError={managerCatalogError}
        managers={addableManagers}
        onAdd={addManager}
        onClose={() => setIsAddManagerOpen(false)}
        open={isAddManagerOpen}
      />
    </div>
  );
}