"use client";

import { useEffect, useState } from "react";

import { getManagerRiskExposures } from "../api/get-manager-exposures";
import type { ManagerRiskExposuresResponse } from "../types";

type Props = {
  name: string;
  tab: string;
  benchmarkHint: string | null;
  useSecurityRisk: boolean;
  hasRiskFile: boolean;
};

type LoadState = {
  data: ManagerRiskExposuresResponse | null;
  loading: boolean;
  error: string | null;
};

function fmtVal(v: number | null | undefined) {
  if (v == null || Number.isNaN(v)) return "--";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(3)}`;
}

export function ManagerRiskExposuresPanel({
  name,
  tab,
  benchmarkHint,
  useSecurityRisk,
  hasRiskFile,
}: Props) {
  const [state, setState] = useState<LoadState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!hasRiskFile) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    getManagerRiskExposures(name, tab, benchmarkHint, useSecurityRisk)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Request failed.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [name, tab, benchmarkHint, useSecurityRisk, hasRiskFile]);

  const data = state.data;
  const factors = data?.factors ?? [];
  const cur = data?.current ?? {};
  const hasManagerData = factors.some((f) => cur[f] != null);
  const allVals = factors
    .map((f) => cur[f])
    .filter((v): v is number => v != null);
  const maxAbs = allVals.length
    ? Math.max(...allVals.map(Math.abs), 0.01)
    : 1.0;

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
        {data?.benchmark?.matched_column && (
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text3)",
            }}
          >
            vs {data.benchmark.matched_column}
          </span>
        )}
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
      ) : state.error ? (
        <div
          style={{
            padding: 14,
            color: "var(--red)",
            fontFamily: "var(--mono)",
            fontSize: 11,
          }}
        >
          {state.error}
        </div>
      ) : data?.error ? (
        <div
          style={{
            padding: 14,
            textAlign: "center",
            color: "var(--amber)",
            fontFamily: "var(--mono)",
            fontSize: 11,
          }}
        >
          {data.error}
        </div>
      ) : !hasManagerData ? (
        <div
          style={{
            padding: 14,
            textAlign: "center",
            color: "var(--amber)",
            fontFamily: "var(--mono)",
            fontSize: 11,
          }}
        >
          Risk file loaded but this manager has no matching column. Check that
          the manager name matches a column in the risk file.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="data-table w-full">
            <thead>
              <tr>
                <th style={{ width: 140, textAlign: "left" }}>Factor</th>
                <th style={{ minWidth: 60 }}>Value</th>
                <th style={{ width: 160 }}>Bar</th>
              </tr>
            </thead>
            <tbody>
              {factors.map((f) => {
                const v = cur[f];
                const width = v != null ? (Math.abs(v) / maxAbs) * 50 : 0;
                const start = v != null && v >= 0 ? 50 : 50 - width;
                return (
                  <tr key={f}>
                    <td style={{ fontWeight: 500, fontSize: 12 }}>{f}</td>
                    <td className="mono" style={{ fontSize: 11 }}>
                      {fmtVal(v)}
                    </td>
                    <td>
                      {v != null ? (
                        <div
                          style={{
                            position: "relative",
                            height: 12,
                            background: "var(--border)",
                            borderRadius: 3,
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: "50%",
                              top: 0,
                              bottom: 0,
                              width: 1,
                              background: "var(--text3)",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              left: `${start}%`,
                              width: `${width}%`,
                              top: 0,
                              bottom: 0,
                              background: "var(--text2)",
                              borderRadius: 3,
                            }}
                          />
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
