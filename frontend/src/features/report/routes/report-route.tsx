"use client";

import { useEffect, useState } from "react";

import {
  ReportClientGuidelines,
  ReportCover,
  ReportFactsetRisk,
  ReportHoldings,
  ReportSkillAndOwnership,
  ReportVGPositioning,
} from "../components/report-page1";
import { ReportExposureCards } from "../components/report-exposure-cards";
import {
  ReportComplements,
  ReportPerfCalendar,
  ReportPerfTrailing,
  ReportQtrExcess,
} from "../components/report-page3";
import { PeerGroupReport } from "../components/peer-group-report";
import {
  GuidelineCompliance,
  HouseViewPositioning,
  TopActiveRisks,
  WorstQuarters,
} from "../components/report-risk-sections";
import { InternalGuidelines, MacroViews, ReviewCover } from "../components/review-front-matter";
import { ReportExportCards } from "../components/report-export-cards";
import { usePeerGroupReport } from "../hooks/use-peer-group-report";
import { useReportScreen } from "../hooks/use-report-screen";
import { getClientGuidelines } from "../lib/client-guidelines";
import {
  guidelineChecks,
  houseViewAlignment,
  topActiveRisks,
  worstQuarters,
} from "../lib/client-risk";
import { buildReportView } from "../lib/build-report-view";

// Report tab: the three export cards (Quarterly Portfolio Report PDF,
// Dispersion Report, Returns Download).
//
// The on-screen "Default Portfolio Report" preview and its toolbar were
// removed (user request, 2026-09-03) — BUT the report sheet itself must stay
// mounted: the Quarterly Portfolio Report PDF is assembled by switching the
// sheet through each selected client and html2canvas-capturing it page by
// page (PDF_CAPTURE_PAGES ids; the PPTX export uses the finer
// PPTX_CAPTURE_TARGETS ids). It is therefore rendered off-screen below,
// invisible to the user but fully laid out for capture.

export function ReportRoute() {
  const { state, selectClient } = useReportScreen();
  // The report sheets render on the page (user request, 2026-09-09 — the
  // reports are being iterated on visually). ?hidden=1 restores the old
  // off-screen mode. The PDF capture works either way.
  const [preview, setPreview] = useState(true);
  useEffect(() => {
    setPreview(!new URLSearchParams(window.location.search).has("hidden"));
  }, []);
  // Peer Group report — on-screen only for now (no PDF yet), so it is only
  // loaded and rendered in preview mode.
  const peerGroupReport = usePeerGroupReport(preview);
  const {
    clients,
    selectedClient,
    report,
    stats,
    diverse,
    managers,
    riskExposures,
    marketCycle,
    riskAnalysis,
    exposures,
    managerExposures,
    loading,
    error,
  } = state;

  const view = buildReportView({
    report,
    stats,
    diverse,
    riskExposures,
    marketCycle,
    riskAnalysis,
    exposures,
  });
  const r = view.data;
  const reportErr = report?.error;

  // Risk & Guidelines page inputs (real data; the limits / views / shock
  // sizes come from quarterly-review-content.ts).
  const checks = guidelineChecks({ exposures, managerExposures, managers, diverse });
  const risks = topActiveRisks({ exposures, riskExposures, managerExposures, managers });
  const worst = worstQuarters(r.perf_backtested.quarterly_excess);
  const houseViews = houseViewAlignment({ exposures, riskExposures });

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

      {/* The client list inside the export card selects clients for the PDF,
          not the one rendered below — this picks what you're looking at. */}
      {preview && clients.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: "16px auto 0",
            width: 1240,
            maxWidth: "100%",
          }}
        >
          <label
            htmlFor="rpt-onscreen-client"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              color: "var(--text2)",
            }}
          >
            Report shown below
          </label>
          <select
            id="rpt-onscreen-client"
            value={selectedClient ?? ""}
            onChange={(e) => selectClient(e.target.value)}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 12,
              padding: "4px 8px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 3,
              color: "var(--text)",
            }}
          >
            {clients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {loading && (
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
              Loading…
            </span>
          )}
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

      {preview && (
        <>
          <div style={{ width: 1240, margin: "24px auto 0" }}>
            <div className="rpt-sheet" id="review-front-matter">
              {/* Inner div is the PDF capture target (no sheet border). */}
              <div id="review-front-matter-page" className="rpt-pdf-page">
                <ReviewCover clients={clients.length} />
                <InternalGuidelines />
                <MacroViews />
              </div>
            </div>
          </div>
          <div style={{ width: 1240, margin: "24px auto 0" }}>
            <PeerGroupReport state={peerGroupReport} />
          </div>
        </>
      )}

      {/* Off-screen capture surface for the Quarterly PDF export — keeps full
          layout (1240px landscape sheet width) so html2canvas renders it correctly, but
          is invisible and takes no space in the page flow. Do not unmount. */}
      <div
        aria-hidden={preview ? undefined : "true"}
        style={
          preview
            ? { width: 1240, margin: "24px auto 0" }
            : {
                position: "absolute",
                left: -10000,
                top: 0,
                width: 1240,
                pointerEvents: "none",
              }
        }
      >
      <div className="rpt-sheet">
        {/* rpt-pdf-page-1 / -2 / -3 are the pages of the Quarterly PDF (see
            PDF_CAPTURE_PAGES). Market cycle and MCR were removed from the
            report on 2026-09-09 (user request). */}
        <div id="rpt-pdf-page-1" className="rpt-pdf-page">
          <ReportCover data={r} />
          <ReportClientGuidelines guidelines={getClientGuidelines(r.client)} />
          <div id="rpt-capture-portfolio-managers">
            <ReportHoldings managers={r.managers} />
          </div>

          <div className="rpt-row-2col">
            <div>
              {/* The PPTX crop covers only the V-G block; the skill /
                  ownership stats below it are report-only. */}
              <div id="rpt-capture-vg-positioning">
                <ReportVGPositioning portfolioVg={r.portfolio_vg} />
              </div>
              <ReportSkillAndOwnership
                edge={r.portfolio_edge}
                diverse={r.diverse_ownership}
              />
            </div>
            <div id="rpt-capture-factset-risk">
              <ReportFactsetRisk fr={r.factset_risk} />
            </div>
          </div>

        </div>

        <div id="rpt-pdf-page-2" className="rpt-pdf-page">
          <ReportExposureCards exposures={r.exposures} />
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
        </div>

        <div id="rpt-pdf-page-3" className="rpt-pdf-page">
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

        <div id="rpt-pdf-page-4" className="rpt-pdf-page">
          <GuidelineCompliance checks={checks} />
          <TopActiveRisks risks={risks} />
          <div className="rpt-row-2col">
            <WorstQuarters rows={worst} benchmark={r.benchmark} />
            <HouseViewPositioning checks={houseViews} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
