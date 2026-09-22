"use client";

import {
  rptFmtPct1,
  rptFmtSigned,
} from "../lib/report-format";
import type { ClientGuidelines } from "../lib/client-guidelines";
import type {
  ReportMockData,
  ReportMockHolding,
} from "../lib/report-mock";

// ── Cover ────────────────────────────────────────────────────────────────
export function ReportCover({ data }: { data: ReportMockData }) {
  return (
    <div className="rpt-cover">
      <div className="rpt-cover-eyebrow">Default Portfolio Report</div>
      <div className="rpt-cover-client">{data.client}</div>
      <div className="rpt-cover-meta">
        <span>
          Benchmark: <strong>{data.benchmark}</strong>
        </span>
        <span className="rpt-cover-sep">·</span>
        <span>
          As of: <strong>{data.as_of}</strong>
        </span>
        <span className="rpt-cover-sep">·</span>
        <span>
          Managers: <strong>{data.managers.length}</strong>
        </span>
      </div>
    </div>
  );
}

// ── Client Restrictions / Preferences ────────────────────────────────────
function GuidelineList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rpt-section">
      <h3 className="rpt-section-title">{title}</h3>
      {items.length ? (
        <ul className="rpt-guideline-list">
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      ) : (
        <div className="rpt-caption">None specified.</div>
      )}
    </section>
  );
}

export function ReportClientGuidelines({
  guidelines,
}: {
  guidelines: ClientGuidelines;
}) {
  return (
    <div className="rpt-row-2col rpt-guidelines-row">
      <GuidelineList title="Client Restrictions" items={guidelines.restrictions} />
      <GuidelineList title="Client Preferences" items={guidelines.preferences} />
    </div>
  );
}

// ── Holdings ─────────────────────────────────────────────────────────────
export function ReportHoldings({
  managers,
}: {
  managers: ReportMockHolding[];
}) {
  const totalWeight = managers.reduce((s, m) => s + m.weight, 0);
  return (
    <section className="rpt-section">
      <h3 className="rpt-section-title">Holdings</h3>
      <table className="rpt-holdings-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Manager</th>
            <th style={{ textAlign: "left", width: 90 }}>Peer Group</th>
            <th style={{ width: 80 }}>Weight</th>
            <th style={{ width: 80 }}>3F V-G</th>
            <th style={{ width: 80 }}>Full V-G</th>
            <th
              style={{ width: 110 }}
              title="Normalized Skill Z-score: annualized since-inception skill, z-scored against same-window peers"
            >
              Norm Skill (Z)
            </th>
          </tr>
        </thead>
        <tbody>
          {managers.map((m) => {
            const vg3cls = m.vg_3factor > 0 ? "val-pos" : "val-neg";
            const vgFcls = m.vg_full > 0 ? "val-pos" : "val-neg";
            const skillCls = m.ns_z > 0 ? "skill-pos" : "skill-neg";
            return (
              <tr key={m.name}>
                <td>{m.name}</td>
                <td>{m.tab}</td>
                <td>{rptFmtPct1(m.weight)}</td>
                <td className={vg3cls}>{rptFmtSigned(m.vg_3factor)}</td>
                <td className={vgFcls}>{rptFmtSigned(m.vg_full)}</td>
                <td className={skillCls}>{rptFmtSigned(m.ns_z)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            <td>{rptFmtPct1(totalWeight)}</td>
            <td colSpan={3}></td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}

// ── Value-Growth Positioning (gradient track + marker) ───────────────────
const VG_SCALE = 4; // ±4 covers the typical V-G range

function vgPctFor(v: number): number {
  return Math.max(0, Math.min(100, 50 + (v / VG_SCALE) * 50));
}

function VgRow({ label, value }: { label: string; value: number }) {
  const left = vgPctFor(value);
  const valCls = value > 0 ? "val-pos" : "val-neg";
  return (
    <div className="rpt-vg-row">
      <div className="rpt-vg-label">{label}</div>
      <div>
        <div className="rpt-vg-track">
          <div className="rpt-vg-zero"></div>
          <div
            className="rpt-vg-marker"
            style={{ left: `calc(${left}% - 1.5px)` }}
          />
        </div>
        <div className="rpt-vg-scale">
          <span>Growth −{VG_SCALE}</span>
          <span>0</span>
          <span>Value +{VG_SCALE}</span>
        </div>
      </div>
      <div className={`rpt-vg-value ${valCls}`}>{rptFmtSigned(value)}</div>
    </div>
  );
}

export function ReportVGPositioning({
  portfolioVg,
}: {
  portfolioVg: ReportMockData["portfolio_vg"];
}) {
  return (
    <section className="rpt-section">
      <h3 className="rpt-section-title">Value–Growth Positioning</h3>
      <VgRow label="3-Factor" value={portfolioVg.vg_3factor} />
      <VgRow label="Full" value={portfolioVg.vg_full} />
    </section>
  );
}

// ── Normalized Skill + Diverse / Woman Owned ─────────────────────────────
// Sits under Value–Growth Positioning in the report's left column. Mirrors
// the Portfolio tab's "Portfolio Edge" and "Diverse / Woman Owned" panels
// (current weights only — the report has no proposed column). Either stat
// renders a dash when its data isn't loaded; there is intentionally no mock.
function StatCell({
  label,
  value,
  valueColor,
  sub,
}: {
  label: string;
  value: string;
  valueColor?: string;
  sub: string;
}) {
  return (
    <div className="rpt-stat-cell">
      <div className="rpt-stat-label">{label}</div>
      <div className="rpt-stat-value" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </div>
      <div className="rpt-stat-sub">{sub}</div>
    </div>
  );
}

export function ReportSkillAndOwnership({
  edge,
  diverse,
}: {
  edge: ReportMockData["portfolio_edge"];
  diverse: ReportMockData["diverse_ownership"];
}) {
  const z = edge?.z ?? null;
  const skillValue = z == null ? "—" : rptFmtSigned(z);
  const skillColor =
    z == null ? "var(--text3)" : z < 0 ? "var(--red)" : "var(--green)";
  const skillSub =
    edge && edge.total_weight > 0
      ? `${edge.covered_weight.toFixed(1)}% of ${edge.total_weight.toFixed(1)}% scored`
      : "Not scored";

  const divValue = diverse ? `${diverse.weight_pct.toFixed(1)}%` : "—";
  const divSub = diverse
    ? `${diverse.n_diverse} / ${diverse.n_firms} firms · ≥${diverse.threshold}% owned` +
      (diverse.unknown_weight_pct > 0
        ? ` · unmatched ${diverse.unknown_weight_pct.toFixed(1)}%`
        : "")
    : "No qualitative data loaded";

  return (
    <section className="rpt-section rpt-stat-section">
      <h3 className="rpt-section-title">Normalized Skill & Diverse / Woman Owned</h3>
      <div className="rpt-stat-grid">
        <StatCell
          label="Normalized Skill (Wtd Avg Z)"
          value={skillValue}
          valueColor={skillColor}
          sub={skillSub}
        />
        <StatCell
          label="Diverse / Woman Owned"
          value={divValue}
          valueColor={diverse ? "var(--accent)" : "var(--text3)"}
          sub={divSub}
        />
      </div>
    </section>
  );
}

// ── FactSet Risk — Current ───────────────────────────────────────────────
export function ReportFactsetRisk({
  fr,
}: {
  fr: ReportMockData["factset_risk"];
}) {
  const factors = fr.factors;
  const maxAbs = Math.max(
    ...factors.map((f) => Math.abs(fr.current[f] ?? 0)),
    0.01,
  );

  return (
    <section className="rpt-section">
      <h3 className="rpt-section-title">FactSet Risk — Current</h3>
      <div>
        {fr.benchmark.matched_column && (
          <div
            style={{
              margin: "0 0 6px",
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text2)",
            }}
          >
            Active exposures vs{" "}
            <strong style={{ color: "var(--text)" }}>
              {fr.benchmark.matched_column}
            </strong>
          </div>
        )}
        <div style={{ overflowX: "auto" }}>
          <table
            className="data-table contrib-table w-full"
            style={{ tableLayout: "auto" }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", width: 140 }}>Factor</th>
                <th style={{ textAlign: "center" }}>Active</th>
                <th style={{ textAlign: "center", width: 140 }}>Bar</th>
              </tr>
            </thead>
            <tbody>
              {factors.map((f) => {
                const v = fr.current[f];
                const pct = (Math.abs(v) / maxAbs) * 100;
                const left = v >= 0 ? 50 : 50 - pct / 2;
                const width = pct / 2;
                return (
                  <tr key={f}>
                    <td
                      style={{
                        fontWeight: 500,
                        fontSize: 12,
                        textAlign: "left",
                      }}
                    >
                      {f}
                    </td>
                    <td
                      className="mono"
                      style={{ fontSize: 11, textAlign: "center" }}
                    >
                      {v != null ? v.toFixed(3) : "--"}
                    </td>
                    <td>
                      <div className="factor-bar-track">
                        <div
                          className="factor-bar-fill"
                          style={{
                            left: `${left.toFixed(1)}%`,
                            width: `${width.toFixed(1)}%`,
                            background: "var(--text2)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            left: "50%",
                            width: 1,
                            height: "100%",
                            background: "var(--text3)",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
