"use client";

import { rptFmtPct1, rptFmtPp } from "../lib/report-format";
import type {
  ReportMockData,
  ReportMockExposureGroup,
  ReportMockExposureRow,
} from "../lib/report-mock";

function ExposureRows({
  rows,
  dir,
}: {
  rows: ReportMockExposureRow[];
  dir: "ow" | "uw";
}) {
  return (
    <>
      {rows.map((x) => (
        <tr key={`${dir}-${x.label}`}>
          <td>{x.label}</td>
          <td>{rptFmtPct1(x.port)}</td>
          <td style={{ color: "var(--text2)" }}>{rptFmtPct1(x.bmk)}</td>
          <td
            className={`rpt-exp-active ${dir === "ow" ? "val-pos" : "val-neg"}`}
          >
            {rptFmtPp(x.active)}
          </td>
        </tr>
      ))}
    </>
  );
}

function ExposureCard({
  title,
  data,
}: {
  title: string;
  data: ReportMockExposureGroup;
}) {
  return (
    <div className="rpt-exp-card">
      <div className="rpt-exp-card-title">{title}</div>
      <table className="rpt-exp-table">
        <thead>
          <tr>
            <th>Bucket</th>
            <th>Port</th>
            <th>Bmk</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="rpt-exp-sub ow">
              ▲ Top 3 Overweights
            </td>
          </tr>
          <ExposureRows rows={data.ow} dir="ow" />
          <tr>
            <td colSpan={4} className="rpt-exp-sub uw">
              ▼ Top 3 Underweights
            </td>
          </tr>
          <ExposureRows rows={data.uw} dir="uw" />
        </tbody>
      </table>
    </div>
  );
}

export function ReportExposureCards({
  exposures,
}: {
  exposures: ReportMockData["exposures"];
}) {
  return (
    <section className="rpt-section">
      <h3 className="rpt-section-title">
        Portfolio Exposures vs Benchmark — Top 3 Over/Underweights
      </h3>
      <div className="rpt-exp-grid">
        <ExposureCard title="Region" data={exposures.region} />
        <ExposureCard title="Country" data={exposures.country} />
        <ExposureCard title="Sector" data={exposures.sector} />
        <ExposureCard title="Industry" data={exposures.industry} />
      </div>
    </section>
  );
}
