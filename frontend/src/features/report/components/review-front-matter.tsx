"use client";

import {
  INTERNAL_GUIDELINES,
  MACRO_HORIZON,
  MACRO_THEMES,
  MACRO_VIEWS,
} from "../lib/quarterly-review-content";

// Front matter of the combined Quarterly Review: cover, the firm's internal
// guidelines (the limits every client page is checked against), and the
// house macro views (thesis bullets + the view vector the client pages test
// positioning against). All content comes from quarterly-review-content.ts.

function quarterLabel(d = new Date()) {
  return `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`;
}

export function ReviewCover({ clients }: { clients: number }) {
  return (
    <div className="rpt-cover">
      <div className="rpt-cover-eyebrow">Quarterly Review</div>
      <div className="rpt-cover-client">Portfolio Review — {quarterLabel()}</div>
      <div className="rpt-cover-meta">
        <span>
          As of: <strong>{new Date().toISOString().slice(0, 10)}</strong>
        </span>
        <span className="rpt-cover-sep">·</span>
        <span>
          Clients: <strong>{clients}</strong>
        </span>
        <span className="rpt-cover-sep">·</span>
        <span>Guidelines · Macro views · Manager universe · Client portfolios</span>
      </div>
    </div>
  );
}

export function InternalGuidelines() {
  return (
    <section className="rpt-section">
      <h3 className="rpt-section-title">Internal Guidelines</h3>
      <table className="rpt-guide-table">
        <thead>
          <tr>
            <th>Guideline</th>
            <th className="num">Limit</th>
            <th className="num">Flag at</th>
            <th>Definition</th>
          </tr>
        </thead>
        <tbody>
          {INTERNAL_GUIDELINES.filter((g) => g.scope === "Firm").map((g) => (
            <tr key={g.kind}>
              <td className="rpt-guide-label">{g.label}</td>
              <td className="num">
                {g.kind === "min_dwbe_share" ? "≥ " : "≤ "}
                {g.limit}%
              </td>
              <td className="num">
                {g.kind === "min_dwbe_share" ? "< " : "≥ "}
                {g.warn}%
              </td>
              <td className="rpt-guide-note">{g.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="rpt-caption">
        Firm-wide limits. Each client page carries a compliance panel against these
        (plus that client&rsquo;s own preferences), with the managers driving any flag.
      </div>
    </section>
  );
}

const VIEW_LABEL = { OW: "Overweight", UW: "Underweight", N: "Neutral" } as const;

export function MacroViews() {
  return (
    <div className="rpt-row-2col rpt-macro-row">
      <section className="rpt-section">
        <h3 className="rpt-section-title">Macro Views — {MACRO_HORIZON}</h3>
        <ul className="rpt-guideline-list">
          {MACRO_THEMES.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
      <section className="rpt-section">
        <h3 className="rpt-section-title">House View Vector</h3>
        <table className="rpt-view-table">
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Bucket</th>
              <th>View</th>
              <th>Conviction</th>
              <th>Rationale</th>
            </tr>
          </thead>
          <tbody>
            {MACRO_VIEWS.map((v) => (
              <tr key={`${v.dimension}-${v.bucket}`}>
                <td className="rpt-view-dim">{v.dimension}</td>
                <td>{v.bucket}</td>
                <td className={`rpt-view-dir ${v.view.toLowerCase()}`}>{VIEW_LABEL[v.view]}</td>
                <td className="rpt-view-conv">{"●".repeat(v.conviction)}{"○".repeat(3 - v.conviction)}</td>
                <td className="rpt-view-why">{v.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
