"use client";

import { rptFmtRet, rptFmtSigned, rptValCls } from "../lib/report-format";
import type {
  ReportMockComplements,
  ReportMockPerf,
} from "../lib/report-mock";

const TRAILING_KEYS = ["mrq", "t1y", "t3y", "t5y", "t10y", "si"] as const;
type TrailingKey = (typeof TRAILING_KEYS)[number];
const TRAILING_LABELS: Record<TrailingKey, string> = {
  mrq: "MRQ",
  t1y: "1 Year",
  t3y: "3 Year",
  t5y: "5 Year",
  t10y: "10 Year",
  si: "Since Inception",
};

function inceptionLabel(perf: ReportMockPerf): string {
  if (!perf.inception_date) return "Since Inception";
  const m = perf.inception_date.match(/^(\d{4})/);
  return m ? `Since Inception (${m[1]})` : "Since Inception";
}

// ── Trailing periods table ───────────────────────────────────────────────
export function ReportPerfTrailing({
  perf,
  includeClone,
}: {
  perf: ReportMockPerf;
  includeClone: boolean;
}) {
  const periods = perf.periods;
  const portVals = TRAILING_KEYS.map((k) => periods[k]?.port ?? null);
  const bmkVals = TRAILING_KEYS.map((k) => periods[k]?.bmk ?? null);
  const cloneVals = TRAILING_KEYS.map((k) => periods[k]?.clone ?? null);
  const excessVals = portVals.map((p, i) =>
    p != null && bmkVals[i] != null ? p - (bmkVals[i] as number) : null,
  );
  const excessClone = includeClone
    ? portVals.map((p, i) =>
        p != null && cloneVals[i] != null ? p - (cloneVals[i] as number) : null,
      )
    : null;

  const headers = TRAILING_KEYS.map((k) =>
    k === "si" ? inceptionLabel(perf) : TRAILING_LABELS[k],
  );

  const row = (
    label: string,
    vals: Array<number | null>,
    cls = "",
  ) => (
    <tr className={cls}>
      <td>{label}</td>
      {vals.map((v, i) => (
        <td key={i} className={rptValCls(v)}>
          {rptFmtRet(v)}
        </td>
      ))}
    </tr>
  );

  return (
    <table className="rpt-perf-table">
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Return Stream</th>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {row(perf.name, portVals)}
        {row("Benchmark", bmkVals)}
        {includeClone && row("Portfolio Clone", cloneVals)}
        {row("Excess vs Benchmark", excessVals, "excess-row")}
        {includeClone &&
          excessClone &&
          row("Excess vs Clone", excessClone, "excess-vs-clone-row")}
      </tbody>
    </table>
  );
}

// ── Calendar-year table ──────────────────────────────────────────────────
export function ReportPerfCalendar({
  perf,
  includeClone,
}: {
  perf: ReportMockPerf;
  includeClone: boolean;
}) {
  const cal = perf.calendar;
  const portVals = cal.map((c) => c.port);
  const bmkVals = cal.map((c) => c.bmk);
  const cloneVals = cal.map((c) => c.clone ?? null);
  const excessVals = portVals.map((p, i) => p - bmkVals[i]);
  const excessClone = includeClone
    ? portVals.map((p, i) =>
        cloneVals[i] != null ? p - (cloneVals[i] as number) : null,
      )
    : null;

  const row = (
    label: string,
    vals: Array<number | null>,
    cls = "",
  ) => (
    <tr className={cls}>
      <td>{label}</td>
      {vals.map((v, i) => (
        <td key={i} className={rptValCls(v)}>
          {rptFmtRet(v)}
        </td>
      ))}
    </tr>
  );

  return (
    <table className="rpt-perf-table">
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Return Stream</th>
          {cal.map((c) => (
            <th key={c.year}>{c.year}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {row(perf.name, portVals)}
        {row("Benchmark", bmkVals)}
        {includeClone && row("Portfolio Clone", cloneVals)}
        {row("Excess vs Benchmark", excessVals, "excess-row")}
        {includeClone &&
          excessClone &&
          row("Excess vs Clone", excessClone, "excess-vs-clone-row")}
      </tbody>
    </table>
  );
}

// ── Quarterly excess matrix ──────────────────────────────────────────────
export function ReportQtrExcess({ perf }: { perf: ReportMockPerf }) {
  // Pivot quarterly_excess into byYear[year][quarter] = {port, bmk}
  const byYear: Record<
    number,
    Record<number, { port: number; bmk: number }>
  > = {};
  perf.quarterly_excess.forEach((rec) => {
    const m = String(rec.qtr || "").match(/^Q([1-4])\s+(\d{4})$/);
    if (!m) return;
    const q = Number(m[1]);
    const year = Number(m[2]);
    if (!byYear[year]) byYear[year] = {};
    byYear[year][q] = { port: rec.port, bmk: rec.bmk };
  });
  // Map calendar-year excess so we can use it for Total Year
  const calByYear: Record<number, number | null> = {};
  perf.calendar.forEach((c) => {
    calByYear[Number(c.year)] =
      c.port != null && c.bmk != null ? c.port - c.bmk : null;
  });

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <table className="rpt-qtr-table">
      <thead>
        <tr>
          <th style={{ textAlign: "left", width: 80 }}>Year</th>
          <th>Q1</th>
          <th>Q2</th>
          <th>Q3</th>
          <th>Q4</th>
          <th style={{ borderLeft: "1px solid var(--border)" }}>Total Year</th>
        </tr>
      </thead>
      <tbody>
        {years.map((year) => {
          const cells = [1, 2, 3, 4].map((q) => {
            const rec = byYear[year][q];
            if (!rec || rec.port == null || rec.bmk == null) {
              return (
                <td key={q} style={{ color: "var(--text3)" }}>
                  —
                </td>
              );
            }
            const ex = rec.port - rec.bmk;
            return (
              <td key={q} className={`excess-cell ${rptValCls(ex)}`}>
                {rptFmtRet(ex)}
              </td>
            );
          });

          // Total Year: prefer calendar; else compound quarterly
          let tot: number | null = calByYear[year] ?? null;
          if (tot == null) {
            const recs = byYear[year];
            const haveAll = [1, 2, 3, 4].every(
              (q) =>
                recs[q] && recs[q].port != null && recs[q].bmk != null,
            );
            if (haveAll) {
              const portYr =
                [1, 2, 3, 4].reduce(
                  (a, q) => a * (1 + recs[q].port),
                  1,
                ) - 1;
              const bmkYr =
                [1, 2, 3, 4].reduce((a, q) => a * (1 + recs[q].bmk), 1) - 1;
              tot = portYr - bmkYr;
            }
          }
          const totCell =
            tot == null ? (
              <td
                style={{
                  color: "var(--text3)",
                  borderLeft: "1px solid var(--border)",
                }}
              >
                —
              </td>
            ) : (
              <td
                className={`excess-cell ${rptValCls(tot)}`}
                style={{
                  borderLeft: "1px solid var(--border)",
                  fontWeight: 600,
                }}
              >
                {rptFmtRet(tot)}
              </td>
            );

          return (
            <tr key={year}>
              <td>{year}</td>
              {cells}
              {totCell}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ── Ideal Complements table (3 stacked sections) ─────────────────────────
type CmpRow = {
  label: string;
  kind: "manager" | "factor";
  data:
    | ReportMockComplements["manager"]
    | ReportMockComplements["aapryl_factor"]
    | ReportMockComplements["factset_risk"];
};

function isManagerCmp(
  data: CmpRow["data"],
): data is ReportMockComplements["manager"] {
  return "tab" in (data as object) || "vg_3factor" in (data as object);
}

export function ReportComplements({ cmp }: { cmp: ReportMockComplements }) {
  const benchName = cmp.benchmark_name || "benchmark";
  const nUnder = cmp.n_underperf_months;

  const sections: CmpRow[] = [
    { label: "Ideal Manager", kind: "manager", data: cmp.manager },
    { label: "Ideal Aapryl Factor", kind: "factor", data: cmp.aapryl_factor },
    { label: "Ideal FactSet Risk", kind: "factor", data: cmp.factset_risk },
  ];

  return (
    <table className="rpt-cmp-table">
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Name</th>
          <th style={{ textAlign: "left", width: 100 }}>Category</th>
          <th style={{ width: 80 }}>3F V-G</th>
          <th style={{ width: 80 }}>Norm Skill</th>
          <th style={{ width: 70 }}>Hit Rate</th>
          <th style={{ width: 90 }}>Avg Excess</th>
          <th style={{ width: 80 }}>N Months</th>
        </tr>
      </thead>
      <tbody>
        {sections.map((s) => {
          const c = s.data;
          if (!c) return null;
          const hr = `${(c.hit_rate * 100).toFixed(1)}%`;
          const ae = rptFmtRet(c.avg_excess, 2);
          const aeCls = rptValCls(c.avg_excess);

          const isMgr = s.kind === "manager" && isManagerCmp(c);
          const mgr = isMgr ? (c as ReportMockComplements["manager"]) : null;

          return (
            <FragmentRow
              key={s.label}
              label={s.label}
              headerHr={hr}
              headerAe={ae}
              nMonths={c.n_months}
              nUnder={nUnder}
              benchName={benchName}
              name={c.name}
              isManager={isMgr}
              vg3={mgr?.vg_3factor}
              nsZ={mgr?.ns_z}
              tab={mgr?.tab}
              hitRate={hr}
              avgExcess={ae}
              avgExcessCls={aeCls}
              months={c.n_months}
            />
          );
        })}
      </tbody>
    </table>
  );
}

// Stable fragment row pair (header + data row) for one complement section.
function FragmentRow({
  label,
  headerHr,
  headerAe,
  nMonths,
  nUnder,
  benchName,
  name,
  isManager,
  vg3,
  nsZ,
  tab,
  hitRate,
  avgExcess,
  avgExcessCls,
  months,
}: {
  label: string;
  headerHr: string;
  headerAe: string;
  nMonths: number;
  nUnder: number;
  benchName: string;
  name: string;
  isManager: boolean;
  vg3?: number;
  nsZ?: number;
  tab?: string;
  hitRate: string;
  avgExcess: string;
  avgExcessCls: string;
  months: number;
}) {
  const vg3Cell = isManager ? (
    <td className={vg3 != null ? (vg3 > 0 ? "val-pos" : "val-neg") : ""}>
      {vg3 != null ? rptFmtSigned(vg3) : "--"}
    </td>
  ) : (
    <td style={{ color: "var(--text3)" }}>—</td>
  );
  const nsCell = isManager ? (
    <td className={nsZ != null ? (nsZ > 0 ? "skill-pos" : "skill-neg") : ""}>
      {nsZ != null ? rptFmtSigned(nsZ) : "--"}
    </td>
  ) : (
    <td style={{ color: "var(--text3)" }}>—</td>
  );
  const catCell = isManager ? (
    <td style={{ color: "var(--text2)" }}>{tab ?? ""}</td>
  ) : (
    <td style={{ color: "var(--text3)" }}>—</td>
  );

  return (
    <>
      <tr className="cmp-header">
        <td colSpan={7}>
          <strong>{label}</strong>
          <span className="cmp-stat">
            Hit rate <strong>{headerHr}</strong> · Avg excess{" "}
            <strong>{headerAe}</strong> · {nMonths} of {nUnder} months · vs{" "}
            {benchName}
          </span>
        </td>
      </tr>
      <tr className="cmp-row">
        <td style={{ fontWeight: 500 }}>{name}</td>
        {catCell}
        {vg3Cell}
        {nsCell}
        <td>{hitRate}</td>
        <td className={avgExcessCls}>{avgExcess}</td>
        <td>{months}</td>
      </tr>
    </>
  );
}
