"use client";

import { useEffect, useRef, useState } from "react";

import { getDiverseOwnership } from "../api/get-portfolio-screen-data";
import type {
  DiverseOwnershipResponse,
  DiverseOwnershipRollup,
  PortfolioManager,
} from "../types";

type Props = {
  client: string | null;
  managers: PortfolioManager[];
};

type ResultState = {
  data: DiverseOwnershipResponse | null;
  loading: boolean;
  error: string | null;
};

// One Current/Proposed stat cell, mirroring the Portfolio Edge panel: big
// headline % (portfolio weight with diverse firms) over the firm-count
// fraction, with unmatched weight as the footnote.
function RollupCell({
  label,
  r,
  divider,
}: {
  label: string;
  r: DiverseOwnershipRollup;
  divider?: boolean;
}) {
  return (
    <div style={{ padding: "4px 12px 6px", borderRight: divider ? "1px solid var(--border)" : undefined }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text2)", textTransform: "uppercase", letterSpacing: ".06em" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--mono)", display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: "var(--accent)" }}>
          {r.weight_pct.toFixed(1)}%
        </span>
        <span style={{ fontSize: 12, color: "var(--text)" }}>
          {r.n_diverse}
          <span style={{ color: "var(--text3)" }}> / {r.n_firms} firms</span>
        </span>
      </div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          color: r.unknown_weight_pct > 20 ? "var(--amber)" : "var(--text3)",
        }}
      >
        unmatched {r.unknown_weight_pct.toFixed(1)}%
      </div>
    </div>
  );
}

export function DiverseOwnershipSection({ client, managers }: Props) {
  const [threshold, setThreshold] = useState(50);
  const [result, setResult] = useState<ResultState>({
    data: null,
    loading: false,
    error: null,
  });

  const ready = Boolean(client) && managers.length > 0;

  // Auto-compute whenever the client, any weight, or the threshold changes —
  // the rollup is a headline number, so it should be on screen without the user
  // asking for it (and it must track proposed-weight edits live).
  const signature = managers
    .map((m) => `${m.tab}::${m.matched_name}:${m.current_weight ?? 0}:${m.proposed_weight ?? 0}`)
    .join("|");
  const reqId = useRef(0);

  useEffect(() => {
    if (!ready) {
      setResult({ data: null, loading: false, error: null });
      return;
    }
    const id = ++reqId.current;
    setResult((prev) => ({ ...prev, loading: true }));
    const timer = setTimeout(() => {
      getDiverseOwnership(managers, threshold)
        .then((res) => {
          if (id !== reqId.current) return;
          setResult({ data: res, loading: false, error: null });
        })
        .catch((err: unknown) => {
          if (id !== reqId.current) return;
          setResult({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Could not compute diverse ownership.",
          });
        });
    }, 500);
    return () => clearTimeout(timer);
    // managers captured via `signature`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, signature, threshold, ready]);

  const data = result.data;

  return (
    <div className="panel" id="diverse-ownership-section">
      <div className="panel-header" style={{ padding: "4px 12px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span className="panel-title">Diverse / Woman Owned</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>
          Majority-owned (≥{data?.threshold ?? threshold}%)
        </span>
        {result.loading && (
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>Computing…</span>
        )}
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>Threshold</span>
          <input
            type="number"
            min={0}
            max={100}
            step={5}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value) || 0)}
            style={{
              width: 48,
              fontFamily: "var(--mono)",
              fontSize: 11,
              padding: "2px 4px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
            }}
          />
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)" }}>%</span>
        </span>
      </div>

      {data?.has_data && data.current && data.proposed ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <RollupCell label="Current" r={data.current} divider />
          <RollupCell label="Proposed" r={data.proposed} />
        </div>
      ) : (
        <div style={{ padding: "10px 14px", fontFamily: "var(--mono)", fontSize: 11, color: result.error ? "var(--red)" : "var(--text3)" }}>
          {result.error
            ? result.error
            : !ready
              ? "Select a client first."
              : data && !data.has_data
                ? "No qualitative data loaded. Upload a firm/strategy qualitative workbook on the Setup tab."
                : "Computing…"}
        </div>
      )}
    </div>
  );
}
