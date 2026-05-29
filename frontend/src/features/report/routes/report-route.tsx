"use client";

import { ReportCover, ReportFactsetRisk, ReportHoldings, ReportVGPositioning } from "../components/report-page1";
import { ReportExposureCards } from "../components/report-exposure-cards";
import { ReportMarketCycle } from "../components/report-market-cycle";
import { ReportMCR } from "../components/report-mcr";
import {
  ReportComplements,
  ReportPerfCalendar,
  ReportPerfTrailing,
  ReportQtrExcess,
} from "../components/report-page3";
import { useReportScreen } from "../hooks/use-report-screen";
import { buildReportView } from "../lib/build-report-view";

// Printable portfolio report. Data flow:
//   1. User picks a client from the dropdown in the report toolbar.
//   2. Hook fans out fetches: /portfolio_report/<client> (cover + holdings +
//      V-G + perf + complements), /compute_risk_exposures (FactSet risk),
//      /market_cycle (Market Cycle), /risk_analysis (MCR),
//      /portfolio_exposures × 4 (Region / Country / Sector / Industry).
//   3. View-model layer merges real data with mock fallbacks (so sections
//      whose backend data isn't loaded yet still render with realistic-
//      looking placeholder content rather than empty boxes).

export function ReportRoute() {
  const { state, selectClient } = useReportScreen();
  const {
    clients,
    selectedClient,
    report,
    riskExposures,
    marketCycle,
    riskAnalysis,
    exposures,
    loading,
    error,
  } = state;

  const view = buildReportView({
    report,
    riskExposures,
    marketCycle,
    riskAnalysis,
    exposures,
  });
  const r = view.data;
  const reportErr = report?.error;

  return (
    <div id="page-reports">
      <div className="rpt-controls">
        <div className="rpt-title-row">
          <div>
            <div className="rpt-title">Default Portfolio Report</div>
            <div className="rpt-subtitle">
              Select a client to load real data. Sections without uploaded
              source files fall back to demo content. Page-3 &ldquo;Actual&rdquo; sections
              are omitted — they require a client-track-record file the tool
              doesn&apos;t accept yet (only &ldquo;Backtested&rdquo; is shown).
            </div>
          </div>
          <div className="rpt-actions">
            <select
              value={selectedClient ?? ""}
              onChange={(e) => e.target.value && selectClient(e.target.value)}
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                padding: "6px 10px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 3,
                color: "var(--text)",
              }}
            >
              <option value="">-- Select client --</option>
              {clients.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => window.print()}
            >
              Print / Export PDF
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text3)",
            marginBottom: 8,
          }}
        >
          Loading report for {selectedClient}…
        </div>
      )}
      {(error || reportErr) && (
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--red)",
            marginBottom: 8,
          }}
        >
          {error || reportErr}
        </div>
      )}

      <div className="rpt-sheet">
        <ReportCover data={r} />
        <ReportHoldings managers={r.managers} />

        <div className="rpt-row-2col">
          <ReportVGPositioning portfolioVg={r.portfolio_vg} />
          <ReportFactsetRisk fr={r.factset_risk} />
        </div>

        <ReportExposureCards exposures={r.exposures} />

        <ReportMarketCycle placements={r.market_cycle} />
        <ReportMCR mcr={r.mcr} />

        <section className="rpt-section rpt-section-p3 rpt-section-perf">
          <h3 className="rpt-section-title">
            Performance — Current Portfolio (Backtested)
          </h3>
          <ReportPerfTrailing perf={r.perf_backtested} includeClone={true} />
        </section>
        <section className="rpt-section rpt-section-p3">
          <h3 className="rpt-section-title">
            Calendar Year Returns — Backtested
          </h3>
          <ReportPerfCalendar perf={r.perf_backtested} includeClone={true} />
        </section>
        <section className="rpt-section rpt-section-p3">
          <h3 className="rpt-section-title">
            Quarterly Excess Returns vs Benchmark — Backtested
          </h3>
          <ReportQtrExcess perf={r.perf_backtested} />
        </section>
        <section className="rpt-section rpt-section-p3">
          <h3 className="rpt-section-title">
            Ideal Complements — Backtested Portfolio
          </h3>
          <ReportComplements cmp={r.complements_backtested} />
        </section>
      </div>
    </div>
  );
}
