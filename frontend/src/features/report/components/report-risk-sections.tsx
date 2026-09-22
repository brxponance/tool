"use client";

import { formatDollarsCompact } from "@/lib/utils";

import type {
  ActiveRiskSet,
  GuidelineCheck,
  HouseViewCheck,
  WorstQuarter,
} from "../lib/client-risk";
import { STRESS_ASSUMPTIONS } from "../lib/quarterly-review-content";
import { rptFmtRet, rptFmtSigned } from "../lib/report-format";

// Client-report "Risk & Guidelines" page: compliance against the internal
// guidelines, the six largest active bets with an illustrative stress, the
// worst historical quarters vs benchmark, and positioning vs the house views.

const STATUS_LABEL = { ok: "OK", near: "Near limit", breach: "Breach", na: "n/a" } as const;

function Drivers({ drivers, unit }: { drivers: { name: string; contribution: number }[]; unit: string }) {
  if (!drivers.length) return <span className="rpt-muted">—</span>;
  return (
    <span>
      {drivers.map((d, i) => (
        <span key={d.name}>
          {i > 0 && ", "}
          {d.name} <span className="rpt-muted">{d.contribution.toFixed(1)}{unit}</span>
        </span>
      ))}
    </span>
  );
}

export function GuidelineCompliance({ checks }: { checks: GuidelineCheck[] }) {
  const flagged = checks.filter((c) => c.status === "near" || c.status === "breach").length;
  return (
    <section className="rpt-section">
      <h3 className="rpt-section-title">
        Guideline Compliance
        <span className={`rpt-flag-count ${flagged ? "warn" : ""}`}>
          {flagged ? `${flagged} flagged` : "all clear"}
        </span>
      </h3>
      <table className="rpt-risk-table">
        <thead>
          <tr>
            <th>Guideline</th>
            <th>Current</th>
            <th className="num">Value</th>
            <th className="num">Limit</th>
            <th>Status</th>
            <th>Driven by</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c) => (
            <tr key={c.guideline.kind} className={`status-${c.status}`}>
              <td>{c.guideline.label}</td>
              <td>{c.subject ?? <span className="rpt-muted">—</span>}</td>
              <td className="num">{c.value == null ? "—" : `${c.value.toFixed(1)}%`}</td>
              <td className="num">
                {c.guideline.kind === "min_dwbe_share" ? "≥" : "≤"} {c.guideline.limit}%
              </td>
              <td>
                <span className={`rpt-status ${c.status}`}>{STATUS_LABEL[c.status]}</span>
              </td>
              <td>
                <Drivers
                  drivers={c.drivers}
                  unit={c.guideline.kind === "max_product_share" ? "% of product" : " pp"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function TopActiveRisks({ risks }: { risks: ActiveRiskSet }) {
  const rows = [...risks.factors, ...risks.exposures];
  return (
    <section className="rpt-section">
      <h3 className="rpt-section-title">
        {rows.length} Largest Active Risks — {risks.factors.length} FactSet Factor,{" "}
        {risks.exposures.length} Exposure — Illustrative Stress
      </h3>
      <table className="rpt-risk-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Risk</th>
            <th>Type</th>
            <th className="num">Portfolio</th>
            <th className="num">Benchmark</th>
            <th className="num">Active</th>
            <th className="num">Impact</th>
            <th>Driven by</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.kind}-${r.label}`}>
              <td className="rpt-muted">{i + 1}</td>
              <td>
                <strong>{r.label}</strong>
              </td>
              <td className="rpt-muted">{r.kind}</td>
              <td className="num">{r.portfolio == null ? "—" : `${r.portfolio.toFixed(1)}%`}</td>
              <td className="num">{r.benchmark == null ? "—" : `${r.benchmark.toFixed(1)}%`}</td>
              <td className={`num ${r.active >= 0 ? "pos" : "neg"}`}>
                {r.kind === "Factor"
                  ? rptFmtSigned(r.active)
                  : `${r.active >= 0 ? "+" : "−"}${Math.abs(r.active).toFixed(1)} pp`}
              </td>
              <td className="num">
                <strong>−{Math.round(r.impactBps)} bps</strong>
              </td>
              <td>
                <Drivers drivers={r.drivers} unit=" pp" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="rpt-caption">
        Impact if the bet reverses: a {STRESS_ASSUMPTIONS.bucketShockPct}% relative move against
        each country / sector / industry bet, and {STRESS_ASSUMPTIONS.factorShockPctPerUnit}% per unit
        of active FactSet exposure (≈ one-sigma factor move). A ranking device, not a risk model.
        &ldquo;Driven by&rdquo; is manager weight × the manager&rsquo;s own exposure.
      </div>
    </section>
  );
}

export function WorstQuarters({ rows, benchmark }: { rows: WorstQuarter[]; benchmark: string }) {
  return (
    <section className="rpt-section">
      <h3 className="rpt-section-title">Historical Stress — Worst Quarters vs Benchmark (Backtested)</h3>
      <table className="rpt-risk-table">
        <thead>
          <tr>
            <th>Quarter</th>
            <th className="num">Portfolio</th>
            <th className="num">{benchmark}</th>
            <th className="num">Excess</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.qtr}>
              <td>{r.qtr}</td>
              <td className="num">{rptFmtRet(r.port)}</td>
              <td className="num">{rptFmtRet(r.bmk)}</td>
              <td className="num neg">
                <strong>{rptFmtRet(r.excess)}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

const ALIGN_LABEL = {
  aligned: "Aligned",
  against: "Against",
  neutral: "Not expressed",
  na: "No data",
} as const;

export function HouseViewPositioning({ checks }: { checks: HouseViewCheck[] }) {
  const against = checks.filter((c) => c.alignment === "against").length;
  return (
    <section className="rpt-section">
      <h3 className="rpt-section-title">
        Positioning vs House Views
        <span className={`rpt-flag-count ${against ? "warn" : ""}`}>
          {against ? `${against} against` : "consistent"}
        </span>
      </h3>
      <table className="rpt-risk-table">
        <thead>
          <tr>
            <th>House view</th>
            <th>Bucket</th>
            <th className="num">Portfolio active</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c) => (
            <tr key={`${c.view.dimension}-${c.view.bucket}`}>
              <td className={`rpt-view-dir ${c.view.view.toLowerCase()}`}>
                {c.view.view === "OW" ? "Overweight" : c.view.view === "UW" ? "Underweight" : "Neutral"}
                <span className="rpt-muted"> · {c.view.dimension}</span>
              </td>
              <td>{c.view.bucket}</td>
              <td className="num">
                {c.active == null
                  ? "—"
                  : c.view.dimension === "Factor"
                    ? rptFmtSigned(c.active)
                    : `${c.active >= 0 ? "+" : "−"}${Math.abs(c.active).toFixed(1)} pp`}
              </td>
              <td>
                <span className={`rpt-align ${c.alignment}`}>{ALIGN_LABEL[c.alignment]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// Compact AUM formatter re-export so the page can show client dollars.
export const fmtAum = formatDollarsCompact;
