"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getClients,
  getPortfolioContribution,
  getThemeDetail,
  getThemes,
} from "../api/get-attribution-data";
import { ContributionSections } from "../components/contribution-sections";
import { ThemeDiscoverySection } from "../components/theme-discovery-section";
import { ThemePositioningSection } from "../components/theme-positioning-section";
import type {
  ContributionResponse,
  ThemeDetailResponse,
  ThemeDiscoveryResponse,
  ThemeRow,
} from "../types";

// Performance Attribution tab. Hosts benchmark theme discovery (P1) above the
// portfolio-contribution tables that were moved here from the Portfolio tab.
// Theme discovery reads the FactSet Exposures upload — the same workbook the
// Exposures tab uses, parsed for its Average Weight and Contribution To Return
// columns — and is independent of the client selector: it describes the
// BENCHMARK, not a portfolio, so it renders whether or not a client is chosen.
export function AttributionRoute() {
  const [clients, setClients] = useState<string[]>([]);
  const [benchmarks, setBenchmarks] = useState<Record<string, string>>({});
  const [benchmarkSections, setBenchmarkSections] = useState<Record<string, string>>({});
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [contribution, setContribution] = useState<ContributionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);

  const [themes, setThemes] = useState<ThemeDiscoveryResponse | null>(null);
  const [themeBenchmark, setThemeBenchmark] = useState<string>("");
  const [themePeriod, setThemePeriod] = useState<string>("");
  const themeRef = useRef(0);

  const [pinned, setPinned] = useState<ThemeRow | null>(null);
  const [detail, setDetail] = useState<ThemeDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const detailRef = useRef(0);

  const loadClients = useCallback(() => {
    return getClients()
      .then((resp) => {
        setClients(resp.clients ?? []);
        setBenchmarks(resp.benchmarks ?? {});
        setBenchmarkSections(resp.benchmark_sections ?? {});
        return resp;
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unable to load clients.");
        return null;
      });
  }, []);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  // The client→benchmark map is resolved against whatever contribution file
  // the backend has loaded, so a page that mounts while the backend is
  // restarting (or mid-upload) gets an empty map and keeps it, which showed
  // every client as "not in this pull". The themes response arriving proves
  // the attribution data is up; re-ask for the clients once if the map is
  // still empty rather than making the user reload.
  const healedRef = useRef(false);
  useEffect(() => {
    if (healedRef.current) return;
    if (!themes?.available_benchmarks?.length) return;
    if (Object.keys(benchmarkSections).length > 0) return;
    healedRef.current = true;
    void loadClients();
  }, [themes?.available_benchmarks, benchmarkSections, loadClients]);

  // Picking a client points theme discovery at that client's benchmark. It
  // keys on the client alone, so a manual change in the benchmark dropdown
  // afterwards still stands until the client changes again. A client whose
  // benchmark has no section in the loaded file (MD's MSCI World ex US SC is
  // not in the Q3 pull) leaves the current selection alone rather than
  // clearing it.
  useEffect(() => {
    const section = benchmarkSections[selectedClient];
    if (section) {
      setThemeBenchmark(section);
    }
  }, [selectedClient, benchmarkSections]);

  useEffect(() => {
    const id = ++themeRef.current;
    getThemes({
      benchmark: themeBenchmark || undefined,
      period: themePeriod || undefined,
    })
      .then((resp) => {
        if (id !== themeRef.current) return;
        setThemes(resp);
      })
      .catch((err: unknown) => {
        if (id !== themeRef.current) return;
        setThemes({
          error: err instanceof Error ? err.message : "Unable to load themes.",
        } as ThemeDiscoveryResponse);
      });
  }, [themeBenchmark, themePeriod]);

  // Positioning for the pinned theme. Needs a client: the question is who in
  // THIS portfolio held it, and the composite is what carries client-space
  // weights. Re-runs when the benchmark or period changes, because the theme's
  // quintile cut-points are the benchmark's and its totals are per period.
  useEffect(() => {
    if (!pinned || !selectedClient || !themes?.benchmark) {
      setDetail(null);
      return;
    }
    const id = ++detailRef.current;
    setDetailLoading(true);
    getThemeDetail({
      benchmark: themes.benchmark,
      client: selectedClient,
      parts: pinned.parts,
      period: themes.period || undefined,
    })
      .then((resp) => {
        if (id !== detailRef.current) return;
        setDetail(resp);
      })
      .catch((err: unknown) => {
        if (id !== detailRef.current) return;
        setDetail({
          error: err instanceof Error ? err.message : "Unable to load positioning.",
        } as ThemeDetailResponse);
      })
      .finally(() => {
        if (id === detailRef.current) setDetailLoading(false);
      });
  }, [pinned, selectedClient, themes?.benchmark, themes?.period]);

  useEffect(() => {
    if (!selectedClient) {
      setContribution(null);
      return;
    }
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);
    getPortfolioContribution(selectedClient)
      .then((resp) => {
        if (requestId !== requestRef.current) return;
        setContribution(resp);
      })
      .catch((err: unknown) => {
        if (requestId !== requestRef.current) return;
        setContribution(null);
        setError(
          err instanceof Error ? err.message : "Unable to load contribution data.",
        );
      })
      .finally(() => {
        if (requestId === requestRef.current) setLoading(false);
      });
  }, [selectedClient]);

  const benchmark = benchmarks[selectedClient] ?? "";

  return (
    <div>
      <div
        className="mb-16"
        style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
      >
        <div className="select-wrap">
          <select
            value={selectedClient}
            onChange={(event) => setSelectedClient(event.target.value)}
          >
            <option value="">-- Select Portfolio --</option>
            {clients.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>
        {selectedClient && benchmark ? (
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: benchmarkSections[selectedClient] ? "var(--text3)" : "var(--amber)",
            }}
          >
            Benchmark: {benchmark}
            {benchmarkSections[selectedClient] ? "" : " — not in this pull"}
          </span>
        ) : null}
        {loading && (
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
            Loading…
          </span>
        )}
        {error && (
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--red)" }}>
            {error}
          </span>
        )}
      </div>

      <ThemeDiscoverySection
        data={themes}
        loading={themes === null}
        onSelectBenchmark={(b) => {
          setThemeBenchmark(b);
          // The period list is per-file, not per-benchmark, so it survives a
          // benchmark switch; clearing it would drop back to the quarter.
        }}
        onSelectPeriod={setThemePeriod}
        onPinTheme={(row) => setPinned((cur) => (cur?.label === row.label ? null : row))}
        pinnedLabel={pinned?.label ?? null}
      />

      {pinned && !selectedClient ? (
        <div className="panel mb-16">
          <div className="panel-header">
            <span className="panel-title">Positioning — {pinned.label}</span>
          </div>
          <div style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
            Pick a client portfolio above to see who held this theme.
          </div>
        </div>
      ) : (
        <ThemePositioningSection
          data={detail}
          loading={detailLoading}
          onClear={() => setPinned(null)}
        />
      )}

      <ContributionSections contribution={contribution} />
    </div>
  );
}
