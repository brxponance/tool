"use client";

import { useEffect, useRef, useState } from "react";

import { getClients, getPortfolioContribution } from "../api/get-attribution-data";
import { ContributionSections } from "../components/contribution-sections";
import type { ContributionResponse } from "../types";

// Performance Attribution tab. Currently hosts the portfolio-contribution
// tables (moved from the Portfolio tab); the quarterly attribution / theme
// identification work will land here next.
export function AttributionRoute() {
  const [clients, setClients] = useState<string[]>([]);
  const [benchmarks, setBenchmarks] = useState<Record<string, string>>({});
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [contribution, setContribution] = useState<ContributionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);

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

      <ContributionSections contribution={contribution} />
    </div>
  );
}
