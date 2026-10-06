"use client";

import { useEffect, useRef, useState } from "react";

import {
  getClients,
  getPortfolioContribution,
  getThemes,
} from "../api/get-attribution-data";
import { ContributionSections } from "../components/contribution-sections";
import { ThemeDiscoverySection } from "../components/theme-discovery-section";
import type { ContributionResponse, ThemeDiscoveryResponse } from "../types";

// Performance Attribution tab. Hosts benchmark theme discovery (P1) above the
// portfolio-contribution tables that were moved here from the Portfolio tab.
// Theme discovery reads its own uploaded FactSet Contribution file and is
// independent of the client selector — it describes the BENCHMARK, not a
// portfolio, so it renders whether or not a client is chosen.
export function AttributionRoute() {
  const [clients, setClients] = useState<string[]>([]);
  const [benchmarks, setBenchmarks] = useState<Record<string, string>>({});
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [contribution, setContribution] = useState<ContributionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);

  const [themes, setThemes] = useState<ThemeDiscoveryResponse | null>(null);
  const [themeBenchmark, setThemeBenchmark] = useState<string>("");
  const [themePeriod, setThemePeriod] = useState<string>("");
  const themeRef = useRef(0);

  useEffect(() => {
    getClients()
      .then((resp) => {
        setClients(resp.clients ?? []);
        setBenchmarks(resp.benchmarks ?? {});
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unable to load clients.");
      });
  }, []);

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
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
            Benchmark: {benchmark}
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
      />

      <ContributionSections contribution={contribution} />
    </div>
  );
}
