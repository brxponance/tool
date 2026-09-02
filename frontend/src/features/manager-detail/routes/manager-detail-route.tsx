"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { backendJson } from "@/lib/backend";
import type { BackendStatus } from "@/features/setup/types";

import { CumulativeSkillChart, SERIES_COLORS } from "../components/cumulative-skill-chart";
import { ManagerExposuresCompareTable } from "../components/manager-exposures-compare-table";
import { ManagerRiskExposuresPanel } from "../components/manager-risk-exposures-panel";
import { StyleBucketDonut } from "../components/style-bucket-donut";
import { useManagerDetailScreen } from "../hooks/use-manager-detail-screen";
import { useManagerExposures } from "../hooks/use-manager-exposures";
import { MAX_COMPARE_MANAGERS, type PeriodReturnKey } from "../types";

const PERIOD_KEYS: PeriodReturnKey[] = ["qtd", "ytd", "t1", "t3", "t5", "si"];
const PERIOD_LABELS: Record<PeriodReturnKey, string> = {
  qtd: "QTD",
  ytd: "YTD",
  t1: "Trailing 1yr",
  t3: "Trailing 3yr",
  t5: "Trailing 5yr",
  si: "Since Inception",
};
// Abbreviated headers — the table now lives in the narrower right column
// beside the risk panel, with the full label on hover.
const PERIOD_SHORT: Record<PeriodReturnKey, string> = {
  qtd: "QTD",
  ytd: "YTD",
  t1: "1YR",
  t3: "3YR",
  t5: "5YR",
  si: "SI",
};

function fmtPct(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "--";
  return `${(value * 100).toFixed(1)}%`;
}

// Excess skill for a period: geometric excess of manager over static clone,
// consistent with data_loader.compute_cumulative_skill's monthly math.
function skillFor(
  mgr: number | null | undefined,
  clone: number | null | undefined,
) {
  if (mgr == null || clone == null || Number.isNaN(mgr) || Number.isNaN(clone)) {
    return null;
  }
  if (clone <= -1) return null;
  return (1 + mgr) / (1 + clone) - 1;
}

// Placeholder managers (< 3 years of returns) have no clone, so the
// clone-derived chart boxes render the reference UI's N/A stub instead.
function PlaceholderNaBox({ title }: { title: string }) {
  return (
    <div
      className="chart-box"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div className="chart-title">{title}</div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px 16px",
          textAlign: "center",
          color: "var(--text3)",
          fontFamily: "var(--mono)",
          fontSize: 11,
          lineHeight: 1.5,
        }}
      >
        N/A — manager has &lt; 3 years of returns
      </div>
    </div>
  );
}

type ManagerDetailRouteProps = {
  initialManager?: string | null;
  initialTab?: string | null;
};

export function ManagerDetailRoute({
  initialManager,
  initialTab,
}: ManagerDetailRouteProps) {
  const {
    directory,
    entries,
    error,
    loadingDirectory,
    notice,
    addManager,
    removeManager,
    clearSelection,
  } = useManagerDetailScreen({ manager: initialManager, tab: initialTab });

  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [returnsMode, setReturnsMode] = useState<"returns" | "skill">("returns");
  const [compositionKey, setCompositionKey] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Poll backend status once on mount so we know whether the risk +
  // exposures panels should show their "Upload a FactSet file" empty
  // states or load real data.
  const [status, setStatus] = useState<BackendStatus | null>(null);
  useEffect(() => {
    let cancelled = false;
    backendJson<BackendStatus>("status")
      .then((s) => {
        if (!cancelled) setStatus(s);
      })
      .catch(() => {
        if (!cancelled) setStatus(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const managerRefs = useMemo(
    () => entries.map((e) => ({ name: e.item.name, tab: e.item.tab })),
    [entries],
  );

  const exposures = useManagerExposures({
    managers: managerRefs,
    hasExposures: !!status?.has_exposures,
  });

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];
    const selectedKeys = new Set(entries.map((e) => `${e.item.tab}::${e.item.name}`));
    return directory
      .filter((m) => {
        if (!m.name.toLowerCase().includes(q)) return false;
        if (selectedKeys.has(`${m.tab}::${m.name}`)) return false;
        if (entries.length > 0) {
          // Comparison additions must share the first pick's asset class,
          // and placeholders (no clone data) can't be compared.
          if (m.tab !== entries[0].item.tab) return false;
          if (m.is_placeholder || m.tab === "Placeholder") return false;
        }
        return true;
      })
      .slice(0, 10);
  }, [search, directory, entries]);

  const loadedEntries = entries.filter((e) => e.data);
  const anyLoading = entries.some((e) => e.loading);
  const primary = entries[0] ?? null;

  // Factor composition selector: default to the first manager; reset when
  // the chosen manager leaves the selection.
  const compositionEntry =
    loadedEntries.find((e) => `${e.item.tab}::${e.item.name}` === compositionKey) ??
    loadedEntries[0] ??
    null;

  const skillSeries = loadedEntries
    .filter((e) => !e.data?.summary.is_placeholder)
    .map((e) => ({
      name: e.item.name,
      dates: e.data!.summary.dates,
      values: e.data!.summary.cumulative_skill,
    }));

  const benchShort = (
    loadedEntries[0]?.data?.summary.benchmark_name ?? "Benchmark"
  )
    .replace("NR USD", "")
    .replace("TR USD", "")
    .trim();

  const single = entries.length === 1;

  return (
    <div>
      <div className="detail-search-wrap">
        <div className="detail-search-row" ref={wrapRef}>
          <input
            type="text"
            className="detail-search-input"
            placeholder={
              entries.length
                ? entries.length >= MAX_COMPARE_MANAGERS
                  ? `Maximum of ${MAX_COMPARE_MANAGERS} managers selected`
                  : `Add a ${entries[0].item.tab} manager to compare (up to ${MAX_COMPARE_MANAGERS})...`
                : "Search for a manager..."
            }
            value={search}
            autoComplete="off"
            disabled={entries.length >= MAX_COMPARE_MANAGERS}
            onChange={(event) => {
              setSearch(event.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              setSearch("");
              setShowSuggestions(false);
              clearSelection();
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={!entries.length || anyLoading}
            onClick={() => window.print()}
          >
            Print / Export PDF
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <div className="detail-suggestions">
              {suggestions.map((m) => (
                <div
                  key={`${m.tab}-${m.name}`}
                  className="detail-sugg-item"
                  onClick={() => {
                    setSearch("");
                    setShowSuggestions(false);
                    addManager(m);
                  }}
                >
                  {m.name}{" "}
                  <span style={{ color: "var(--text3)", fontSize: 10 }}>{m.tab}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {entries.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, alignItems: "center" }}>
            {entries.map((e, i) => (
              <span
                key={`${e.item.tab}-${e.item.name}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  padding: "3px 8px",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  background: "var(--surface)",
                }}
              >
                {!single ? (
                  <span
                    style={{
                      width: 10,
                      height: 3,
                      borderRadius: 2,
                      background: SERIES_COLORS[i % SERIES_COLORS.length],
                      display: "inline-block",
                    }}
                  />
                ) : null}
                {e.item.name}
                <span style={{ color: "var(--text3)", fontSize: 9 }}>{e.item.tab}</span>
                {e.loading ? (
                  <span style={{ color: "var(--text3)", fontSize: 9 }}>…</span>
                ) : null}
                <button
                  type="button"
                  aria-label={`Remove ${e.item.name}`}
                  onClick={() => removeManager(e.item)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "var(--text3)",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: 12,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : null}
        {notice ? (
          <div
            style={{
              marginTop: 6,
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--amber, #d68c1f)",
            }}
          >
            ⚠ {notice}
          </div>
        ) : null}
      </div>

      {loadingDirectory && !directory.length ? (
        <div
          style={{
            color: "var(--text3)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          Loading manager directory...
        </div>
      ) : error ? (
        <div style={{ color: "var(--red)", padding: 20 }}>{error}</div>
      ) : !entries.length ? (
        <div
          style={{
            color: "var(--text3)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          Search for a manager above to view their detail. Add more managers of
          the same asset class to compare (up to {MAX_COMPARE_MANAGERS}).
        </div>
      ) : !loadedEntries.length ? (
        <div
          style={{
            color: entries.every((e) => e.error) ? "var(--red)" : "var(--text3)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          {entries.every((e) => e.error)
            ? entries[0].error
            : `Loading ${primary?.item.name}...`}
        </div>
      ) : (
        <>
          {single ? (
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 500 }}>
                {loadedEntries[0].data!.summary.name}
              </span>
              <span className="badge badge-blue" style={{ marginLeft: 8 }}>
                {loadedEntries[0].data!.summary.tab}
              </span>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--text2)",
                  marginLeft: 8,
                }}
              >
                R&sup2;{" "}
                {loadedEntries[0].data!.summary.r2_full != null
                  ? `${(loadedEntries[0].data!.summary.r2_full * 100).toFixed(1)}%`
                  : "--"}
              </span>
            </div>
          ) : (
            <div
              style={{
                marginBottom: 12,
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--text2)",
              }}
            >
              Comparing {entries.length} {entries[0].item.tab} managers
            </div>
          )}

          <div
            className="detail-charts-grid"
            style={{
              // The risk table on the left grows a column per manager, so the
              // left track widens with the selection instead of scrolling.
              gridTemplateColumns: `${
                entries.length >= 4 ? 520 : entries.length === 3 ? 470 : 400
              }px 1fr`,
              alignItems: "start",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                minWidth: 0,
              }}
            >
              {compositionEntry?.data?.summary.is_placeholder ? (
                <PlaceholderNaBox title="Factor Composition (Full Model)" />
              ) : compositionEntry ? (
                <div className="chart-box">
                  <div
                    className="chart-title"
                    style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}
                  >
                    <span>Factor Composition (Full Model)</span>
                    {!single ? (
                      <select
                        value={`${compositionEntry.item.tab}::${compositionEntry.item.name}`}
                        onChange={(e) => setCompositionKey(e.target.value)}
                        style={{
                          marginLeft: "auto",
                          fontFamily: "var(--mono)",
                          fontSize: 10,
                          padding: "2px 4px",
                          border: "1px solid var(--border)",
                          background: "var(--surface)",
                          color: "var(--text)",
                          borderRadius: 3,
                          maxWidth: 180,
                        }}
                      >
                        {loadedEntries.map((e) => (
                          <option
                            key={`${e.item.tab}-${e.item.name}`}
                            value={`${e.item.tab}::${e.item.name}`}
                          >
                            {e.item.name}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                  <StyleBucketDonut
                    buckets={compositionEntry.data!.summary.style_buckets}
                  />
                </div>
              ) : null}
              <ManagerRiskExposuresPanel
                managers={managerRefs}
                useSecurityRisk={!!status?.has_security_risk}
                hasRiskFile={!!status?.has_risk || !!status?.has_security_risk}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                minWidth: 0,
              }}
            >
              {skillSeries.length ? (
                <div className="chart-box">
                  <div className="chart-title">Growth of $100 — Skill vs Static Clone</div>
                  <CumulativeSkillChart series={skillSeries} />
                </div>
              ) : (
                <PlaceholderNaBox title="Growth of $100 — Skill vs Static Clone" />
              )}

              {/* Period returns share the right column, filling the space
                  under the chart and beside the risk table. */}
              <div className="panel">
            <div
              className="panel-header"
              style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "6px 12px" }}
            >
              <span className="panel-title">Period Returns</span>
              <div
                style={{
                  display: "inline-flex",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  overflow: "hidden",
                  marginLeft: "auto",
                }}
              >
                {(["returns", "skill"] as const).map((mode, i) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setReturnsMode(mode)}
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      padding: "3px 9px",
                      background: returnsMode === mode ? "var(--accent)" : "var(--surface)",
                      color: returnsMode === mode ? "#fff" : "var(--text2)",
                      border: "none",
                      borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                      cursor: "pointer",
                    }}
                    title={
                      mode === "skill"
                        ? "Excess skill returns: manager vs its static clone"
                        : "Total returns"
                    }
                  >
                    {mode === "returns" ? "Returns" : "Skill"}
                  </button>
                ))}
              </div>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              <table className="data-table tight" style={{ width: "100%", tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", width: "26%" }}>
                      {returnsMode === "returns" ? "Series" : "Excess skill"}
                    </th>
                    {PERIOD_KEYS.map((key) => (
                      <th
                        key={key}
                        title={PERIOD_LABELS[key]}
                        // Explicit alignment: globals left-align each table's
                        // 2nd column, which would skew the QTD column.
                        style={{ fontSize: 9, textAlign: "right" }}
                      >
                        {PERIOD_SHORT[key]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loadedEntries.map((e) => {
                    const pr = e.data!.summary.period_returns;
                    return (
                      <tr key={`${e.item.tab}-${e.item.name}`}>
                        <td
                          style={{
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={e.item.name}
                        >
                          {e.item.name}
                        </td>
                        {PERIOD_KEYS.map((key) => {
                          if (returnsMode === "returns") {
                            return (
                              <td key={key} className="mono" style={{ textAlign: "right" }}>
                                {fmtPct(pr?.mgr?.[key])}
                              </td>
                            );
                          }
                          const s = skillFor(pr?.mgr?.[key], pr?.clone?.[key]);
                          return (
                            <td
                              key={key}
                              className="mono"
                              style={{
                                textAlign: "right",
                                color:
                                  s == null
                                    ? undefined
                                    : s >= 0
                                      ? "var(--green)"
                                      : "var(--red)",
                              }}
                            >
                              {s == null ? "--" : `${s >= 0 ? "+" : ""}${(s * 100).toFixed(1)}%`}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {returnsMode === "returns" ? (
                    <tr>
                      <td
                        style={{
                          color: "var(--text2)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={benchShort}
                      >
                        {benchShort}
                      </td>
                      {PERIOD_KEYS.map((key) => (
                        <td key={key} className="mono" style={{ color: "var(--text2)", textAlign: "right" }}>
                          {fmtPct(
                            loadedEntries[0]?.data?.summary.period_returns?.bench?.[key],
                          )}
                        </td>
                      ))}
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <ManagerExposuresCompareTable
              managers={managerRefs}
              exposureMenu={exposures.exposureMenu}
              loading={exposures.loading}
              data={exposures.data}
              selectedCategorical={exposures.selectedCategorical}
              selectedContinuous={exposures.selectedContinuous}
              onSelectionChange={exposures.setSelection}
            />
          </div>
        </>
      )}
    </div>
  );
}
