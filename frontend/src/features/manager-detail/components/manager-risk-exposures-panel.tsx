"use client";

import { useEffect, useState } from "react";

import { getManagerRiskExposures } from "../api/get-manager-exposures";
import { mgrBenchmarkHint } from "../lib/benchmark-hint";
import type { ManagerRiskExposuresResponse } from "../types";

type ManagerRef = { name: string; tab: string };

type Props = {
  managers: ManagerRef[];
  useSecurityRisk: boolean;
  hasRiskFile: boolean;
};

type LoadState = {
  // One response per manager, aligned with the managers prop.
  data: Array<ManagerRiskExposuresResponse | null>;
  loading: boolean;
  error: string | null;
};

function fmtVal(v: number | null | undefined) {
  if (v == null || Number.isNaN(v)) return "--";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(3)}`;
}

// Drop the peer-group suffix ('Channing EAFE' → 'Channing') and then clip,
// so five columns still fit the left panel without scrolling.
function shortName(name: string, max: number) {
  const trimmed = name
    .replace(
      /\s+(EAFE(\s*\+\s*Canada)?|ACWI(\s*ex[- ]?US)?|xUS|Non[- ]?US|International|Global|World|EM|US)(\s+(SC|Small\s*Cap|SMID))?\s*$/i,
      "",
    )
    .trim();
  const base = trimmed || name;
  return base.length > max ? `${base.slice(0, max)}…` : base;
}

// Active style exposures for one or more managers side by side — numbers
// only (the single-manager diverging bars don't scale to five columns).
export function ManagerRiskExposuresPanel({
  managers,
  useSecurityRisk,
  hasRiskFile,
}: Props) {
  const [state, setState] = useState<LoadState>({
    data: [],
    loading: false,
    error: null,
  });

  const signature = managers.map((m) => `${m.tab}::${m.name}`).join("|");

  useEffect(() => {
    if (!hasRiskFile || !managers.length) {
      setState({ data: [], loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState({ data: [], loading: true, error: null });
    Promise.all(
      managers.map((m) =>
        getManagerRiskExposures(
          m.name,
          m.tab,
          mgrBenchmarkHint(m.name, m.tab),
          useSecurityRisk,
        ).catch(() => null),
      ),
    ).then((results) => {
      if (cancelled) return;
      setState({ data: results, loading: false, error: null });
    });
    return () => {
      cancelled = true;
    };
    // managers captured via signature
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, useSecurityRisk, hasRiskFile]);

  const results = state.data;
  const firstWithData = results.find((r) => r?.factors?.length);
  const factors = firstWithData?.factors ?? [];
  const anyValue = results.some((r) =>
    (r?.factors ?? []).some((f) => r?.current?.[f] != null),
  );
  const benchNames = Array.from(
    new Set(
      results
        .map((r) => r?.benchmark?.matched_column)
        .filter((b): b is string => !!b),
    ),
  );

  // Column budget: the factor label shrinks and names/values compress as
  // managers are added, so five columns still fit without a scrollbar.
  const n = managers.length;
  const labelPct = n <= 1 ? 46 : n === 2 ? 40 : n === 3 ? 34 : n === 4 ? 28 : 24;
  const nameLen = n <= 1 ? 18 : n === 2 ? 14 : n === 3 ? 12 : n === 4 ? 10 : 9;
  const valFontSize = n >= 4 ? 10 : 11;

  return (
    <div className="panel" id="mgr-risk-section">
      <div
        className="panel-header"
        style={{
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span className="panel-title">FactSet Risk Exposures — Active Style</span>
        {benchNames.length ? (
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text3)",
            }}
          >
            vs {benchNames.join(" · ")}
          </span>
        ) : null}
      </div>
      {!hasRiskFile ? (
        <div
          style={{
            padding: 14,
            textAlign: "center",
            color: "var(--text3)",
            fontFamily: "var(--mono)",
            fontSize: 11,
          }}
        >
          Upload a FactSet Risk file on the Setup tab to see manager factor
          exposures.
        </div>
      ) : state.loading ? (
        <div
          style={{
            padding: 14,
            textAlign: "center",
            color: "var(--text3)",
            fontFamily: "var(--mono)",
            fontSize: 11,
          }}
        >
          Computing…
        </div>
      ) : !anyValue ? (
        <div
          style={{
            padding: 14,
            textAlign: "center",
            color: "var(--amber)",
            fontFamily: "var(--mono)",
            fontSize: 11,
          }}
        >
          {results.length && results.every((r) => r?.error)
            ? results[0]?.error
            : "Risk file loaded but no matching column for the selected manager(s)."}
        </div>
      ) : (
        <div>
          {/* No horizontal scroll even at 5 managers: fixed layout, a
              proportionally narrower factor column, and names truncated
              harder as columns are added. */}
          <table
            className="data-table tight w-full"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <colgroup>
              <col style={{ width: `${labelPct}%` }} />
              {managers.map((m) => (
                <col key={`${m.tab}-${m.name}`} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Factor</th>
                {managers.map((m, i) => (
                  <th
                    key={`${m.tab}-${m.name}`}
                    title={
                      results[i]?.benchmark?.matched_column
                        ? `${m.name} vs ${results[i]?.benchmark?.matched_column}`
                        : m.name
                    }
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: 9,
                      // Globals left-align every table's 2nd column (meant for
                      // name columns); force uniform alignment so the first
                      // manager column doesn't get lopsided whitespace.
                      textAlign: "right",
                    }}
                  >
                    {shortName(m.name, nameLen)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {factors.map((f) => (
                <tr key={f}>
                  <td
                    style={{
                      fontWeight: 500,
                      fontSize: 11,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={f}
                  >
                    {f}
                  </td>
                  {managers.map((m, i) => (
                    <td
                      key={`${m.tab}-${m.name}`}
                      className="mono"
                      style={{ fontSize: valFontSize, textAlign: "right" }}
                    >
                      {fmtVal(results[i]?.current?.[f])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
