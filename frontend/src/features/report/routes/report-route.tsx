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
import { ReportExportCards } from "../components/report-export-cards";
import { useReportScreen } from "../hooks/use-report-screen";
import { buildReportView } from "../lib/build-report-view";

// Report tab: the three export cards (Quarterly Portfolio Report PDF,
// Dispersion Report, Returns Download).
//
// The on-screen "Default Portfolio Report" preview and its toolbar were
// removed (user request, 2026-09-03) — BUT the report sheet itself must stay
// mounted: the Quarterly Portfolio Report PDF is assembled by switching the
// sheet through each selected client and html2canvas-capturing its sections
// (PPTX_CAPTURE_TARGETS ids). It is therefore rendered off-screen below,
// invisible to the user but fully laid out for capture.

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
    // The two data-* attributes are the render-settled signal the multi-client
    // PDF export polls: it switches client, waits for `client` to match and
    // `loading` to clear, then captures. Reading the DOM avoids stale closures
    // inside the export's async loop.
    <div
      id="page-reports"
      data-report-client={selectedClient ?? ""}
      data-report-loading={loading ? "1" : "0"}
    >
      <ReportExportCards
        client={selectedClient}
        clients={clients}
        onSelectClient={selectClient}
      />

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

      {/* Off-screen capture surface for the Quarterly PDF export — keeps full
          layout (920px sheet width) so html2canvas renders it correctly, but
          is invisible and takes no space in the page flow. Do not unmount. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -10000,
          top: 0,
          width: 920,
          pointerEvents: "none",
        }}
      >
      <div className="rpt-sheet">
        <ReportCover data={r} />
        <div id="rpt-capture-portfolio-managers">
          <ReportHoldings managers={r.managers} />
        </div>

        <div className="rpt-row-2col">
          <div id="rpt-capture-vg-positioning">
            <ReportVGPositioning portfolioVg={r.portfolio_vg} />
          </div>
          <div id="rpt-capture-factset-risk">
            <ReportFactsetRisk fr={r.factset_risk} />
          </div>
        </div>

        <ReportExposureCards exposures={r.exposures} />

        <div id="rpt-capture-market-cycle">
          <ReportMarketCycle placements={r.market_cycle} />
        </div>
        <div id="rpt-capture-mcr">
          <ReportMCR mcr={r.mcr} />
        </div>

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
    </div>
  );
}
