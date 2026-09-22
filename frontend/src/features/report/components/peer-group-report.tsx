"use client";

import { formatDollarsCompact } from "@/lib/utils";

import type {
  PeerGroupReportGroup,
  PeerGroupReportState,
} from "../hooks/use-peer-group-report";
import { rptFmtSigned } from "../lib/report-format";

// Peer Group report: one table per peer group (as offered on the Peer Groups
// tab), managers sorted by Normalized Skill Z. Columns: manager + skill,
// total AUM the tool has in the strategy across all clients, and a wide Notes
// column (empty for now — free-text notes per manager are the next step).
//
// Kept separate from the Quarterly Portfolio Report for now; the plan is to
// combine them (plus the dispersion report and every client's report) into
// one long document later.

// Rows that need a written justification in the Notes column: strong skill
// with none of our money, or our money behind weak skill.
function flagFor(r: PeerGroupReportGroup["rows"][number]) {
  if (r.ns_z != null && r.ns_z >= 0.5 && r.aum == null)
    return { cls: "hi-no-aum", text: "High skill · no assets — justify" };
  if (r.ns_z != null && r.ns_z <= -0.5 && r.aum != null)
    return { cls: "aum-lo-skill", text: "Assets · weak skill — review" };
  return null;
}

// PLACEHOLDER (2026-09-11): average investment score from the manager's
// scoresheet — not in the tool yet. Pseudo-random 1.0–5.0 in 0.5 steps,
// seeded from the manager name so a value is stable across renders and
// between the on-screen table and the PDF. Replace with the real score when
// scoresheets are loaded.
function placeholderInvScore(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return 1 + (h % 9) * 0.5; // 1.0, 1.5, … 5.0
}

function GroupTable({ group }: { group: PeerGroupReportGroup }) {
  return (
    <section className="rpt-section rpt-pg-group">
      <h3 className="rpt-section-title">{group.label}</h3>
      {group.rows.length ? (
        <table className="rpt-pg-table">
          <colgroup>
            <col className="rpt-pg-col-mgr" />
            <col className="rpt-pg-col-aum" />
            <col className="rpt-pg-col-score" />
            <col className="rpt-pg-col-notes" />
          </colgroup>
          <thead>
            <tr>
              <th>Manager · Norm Skill (Z)</th>
              <th>Total AUM</th>
              <th className="rpt-pg-score">
                Ave Inv Score<span className="rpt-example-tag">example</span>
              </th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {group.rows.map((r) => {
              const flag = flagFor(r);
              return (
              <tr key={r.name} className={flag ? `flag-${flag.cls}` : undefined}>
                <td>
                  <div className="rpt-pg-mgr">
                    <span className="rpt-pg-name">{r.name}</span>
                    <span
                      className={`rpt-pg-z ${
                        r.ns_z == null ? "na" : r.ns_z < 0 ? "neg" : "pos"
                      }`}
                    >
                      {r.ns_z == null ? "—" : rptFmtSigned(r.ns_z)}
                    </span>
                  </div>
                </td>
                <td className="rpt-pg-aum">
                  {r.aum != null ? formatDollarsCompact(r.aum) : "—"}
                  {r.n_clients > 0 && (
                    <div className="rpt-pg-aum-sub">
                      {r.n_clients} client{r.n_clients === 1 ? "" : "s"}
                    </div>
                  )}
                </td>
                <td className="rpt-pg-score">{placeholderInvScore(r.name).toFixed(1)}</td>
                <td className="rpt-pg-notes">
                  {flag && <span className={`rpt-pg-flag ${flag.cls}`}>{flag.text}</span>}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="rpt-caption">No managers in this peer group.</div>
      )}
    </section>
  );
}

export function PeerGroupReport({ state }: { state: PeerGroupReportState }) {
  const { groups, clientsWithoutAum, loading, error } = state;
  const asOf = new Date().toISOString().slice(0, 10);
  return (
    <div className="rpt-sheet" id="peer-group-report">
      <div className="rpt-cover">
        <div className="rpt-cover-eyebrow">Peer Group Report</div>
        <div className="rpt-cover-client">Manager Universe by Peer Group</div>
        <div className="rpt-cover-meta">
          <span>
            As of: <strong>{asOf}</strong>
          </span>
          <span className="rpt-cover-sep">·</span>
          <span>
            Peer groups: <strong>{groups.length}</strong>
          </span>
          <span className="rpt-cover-sep">·</span>
          <span>Sorted by Normalized Skill (Z), best first</span>
        </div>
        {clientsWithoutAum.length > 0 && (
          <div className="rpt-caption">
            Total AUM excludes {clientsWithoutAum.join(", ")}: no client total
            AUM in the weights workbook.
          </div>
        )}
      </div>

      {loading && <div className="rpt-caption">Loading peer groups…</div>}
      {error && (
        <div className="rpt-caption" style={{ color: "var(--red)" }}>
          {error}
        </div>
      )}
      {/* One capture page per peer group for the Full Review PDF — ids
          rpt-pg-page-<n>, in order. A whole universe on one page (tried
          2026-09-10) is too tall: EAFE is 55 rows and shrank to unreadable. */}
      {groups.map((g, i) => (
        <div key={g.key} id={`rpt-pg-page-${i + 1}`} className="rpt-pdf-page">
          <GroupTable group={g} />
        </div>
      ))}
    </div>
  );
}
