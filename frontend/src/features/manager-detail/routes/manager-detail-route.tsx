"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { backendJson } from "@/lib/backend";
import type { BackendStatus } from "@/features/setup/types";
import { PortfolioExposuresSection } from "@/features/portfolio/components/portfolio-exposures-section";
import type {
  ExposureMenuGroup,
  PortfolioExposuresResponse,
} from "@/features/portfolio/types";

import { CumulativeSkillChart } from "../components/cumulative-skill-chart";
import { ManagerRiskExposuresPanel } from "../components/manager-risk-exposures-panel";
// (useRef is used for the click-outside wrapper only; selection sync uses
// a state sentinel to satisfy the react-hooks/refs lint rule.)
import { StyleBucketDonut } from "../components/style-bucket-donut";
import { useManagerDetailScreen } from "../hooks/use-manager-detail-screen";
import { useManagerExposures } from "../hooks/use-manager-exposures";
import { mgrBenchmarkHint } from "../lib/benchmark-hint";
import type { PeriodReturnKey } from "../types";

const PERIOD_KEYS: PeriodReturnKey[] = ["qtd", "ytd", "t1", "t3", "t5", "si"];
const PERIOD_LABELS: Record<PeriodReturnKey, string> = {
  qtd: "QTD",
  ytd: "YTD",
  t1: "Trailing 1yr",
  t3: "Trailing 3yr",
  t5: "Trailing 5yr",
  si: "Since Inception",
};

function fmtPct(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "--";
  return `${(value * 100).toFixed(1)}%`;
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
    data,
    directory,
    error,
    loadingDetail,
    loadingDirectory,
    selected,
    selectManager,
    clearSelection,
  } = useManagerDetailScreen({ manager: initialManager, tab: initialTab });

  const [search, setSearch] = useState(initialManager ?? "");
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  // Benchmark hint for the FactSet risk + exposures requests. Mirrors the
  // reference UI's mgrBenchmarkHint(): manual overrides, xUS→ACWI-ex-US
  // rerouting, and tab inference for Placeholder managers — instead of the
  // regression benchmark from /manager_skill_summary.
  const benchmarkHint = selected
    ? mgrBenchmarkHint(selected.name, selected.tab)
    : null;

  const exposures = useManagerExposures({
    name: selected?.name ?? null,
    tab: selected?.tab ?? null,
    benchmarkHint,
    hasExposures: !!status?.has_exposures,
  });

  // Sync the search box when the selection changes from elsewhere (initial
  // load, directory default). Derived-state-from-props pattern with a state
  // sentinel to avoid setState-in-effect and ref-during-render lints.
  const [lastSyncedName, setLastSyncedName] = useState<string | null>(null);
  const incomingName = selected?.name ?? null;
  if (incomingName !== lastSyncedName) {
    setLastSyncedName(incomingName);
    if (incomingName && incomingName !== search) {
      setSearch(incomingName);
    }
  }

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
    return directory.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 10);
  }, [search, directory]);

  const benchShort = (data?.summary.benchmark_name ?? "Benchmark")
    .replace("NR USD", "")
    .replace("TR USD", "")
    .trim();

  const periodReturns = data?.summary.period_returns;
  const isPlaceholder = !!data?.summary.is_placeholder;

  return (
    <div>
      <div className="detail-search-wrap">
        <div className="detail-search-row" ref={wrapRef}>
          <input
            type="text"
            className="detail-search-input"
            placeholder="Search for a manager..."
            value={search}
            autoComplete="off"
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
            disabled={!selected || loadingDetail}
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
                    setSearch(m.name);
                    setShowSuggestions(false);
                    selectManager(m);
                  }}
                >
                  {m.name}{" "}
                  <span style={{ color: "var(--text3)", fontSize: 10 }}>{m.tab}</span>
                </div>
              ))}
            </div>
          )}
        </div>
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
      ) : !selected ? (
        <div
          style={{
            color: "var(--text3)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          Search for a manager above to view their detail.
        </div>
      ) : loadingDetail || !data ? (
        <div
          style={{
            color: "var(--text3)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          Loading {selected.name}...
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>{data.summary.name}</span>
            <span className="badge badge-blue" style={{ marginLeft: 8 }}>
              {data.summary.tab}
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
              {data.summary.r2_full != null
                ? `${(data.summary.r2_full * 100).toFixed(1)}%`
                : "--"}
            </span>
          </div>

          <div
            className="detail-charts-grid"
            style={{
              gridTemplateColumns: "400px 1fr",
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
              {isPlaceholder ? (
                <PlaceholderNaBox title="Factor Composition (Full Model)" />
              ) : (
                <div className="chart-box">
                  <div className="chart-title">Factor Composition (Full Model)</div>
                  <StyleBucketDonut buckets={data.summary.style_buckets} />
                </div>
              )}
              <ManagerRiskExposuresPanel
                name={data.summary.name}
                tab={data.summary.tab}
                benchmarkHint={benchmarkHint}
                useSecurityRisk={!!status?.has_security_risk}
                hasRiskFile={
                  !!status?.has_risk || !!status?.has_security_risk
                }
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
              {isPlaceholder ? (
                <PlaceholderNaBox title="Cumulative Skill vs Static Clone" />
              ) : (
                <div className="chart-box">
                  <div className="chart-title">Cumulative Skill vs Static Clone</div>
                  <CumulativeSkillChart
                    dates={data.summary.dates}
                    values={data.summary.cumulative_skill}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Period Returns</span>
            </div>
            <div className="panel-body" style={{ padding: 0, overflowX: "auto" }}>
              <table className="data-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Series</th>
                    {PERIOD_KEYS.map((key) => (
                      <th key={key}>{PERIOD_LABELS[key]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Manager</td>
                    {PERIOD_KEYS.map((key) => (
                      <td key={key} className="mono">
                        {fmtPct(periodReturns?.mgr?.[key])}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ color: "var(--accent2)" }}>Static Clone</td>
                    {PERIOD_KEYS.map((key) => (
                      <td key={key} className="mono" style={{ color: "var(--accent2)" }}>
                        {fmtPct(periodReturns?.clone?.[key])}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ color: "var(--text2)" }}>{benchShort}</td>
                    {PERIOD_KEYS.map((key) => (
                      <td key={key} className="mono" style={{ color: "var(--text2)" }}>
                        {fmtPct(periodReturns?.bench?.[key])}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Portfolio Exposures section (reuses portfolio feature's
              component — its data shape matches manager-level exposures
              since both go through /portfolio_exposures with different
              manager payloads). Only renders when an exposures file is
              loaded; the section itself shows an empty state otherwise. */}
          <div style={{ marginTop: 16 }}>
            <PortfolioExposuresSection
              exposureMenu={exposures.exposureMenu as ExposureMenuGroup[]}
              loading={exposures.loading}
              data={exposures.data as PortfolioExposuresResponse | null}
              selectedCategorical={exposures.selectedCategorical}
              selectedContinuous={exposures.selectedContinuous}
              onSelectionChange={exposures.setSelection}
              hideProposed
            />
          </div>
        </>
      )}
    </div>
  );
}
