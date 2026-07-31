"use client";

import { useEffect, useState } from "react";

import { getPortfolio, getPortfolioClients } from "@/features/portfolio/api/get-portfolio-screen-data";
import type { PortfolioManager } from "@/features/portfolio/types";

import { OverlapSection } from "../components/overlap-section";
import type { OverlapManagerInput } from "../types";

function toInputs(managers: PortfolioManager[]): OverlapManagerInput[] {
  return managers.map((m) => ({
    matched_name: m.matched_name,
    weight_file_name: m.weight_file_name,
    current_weight: m.current_weight ?? 0,
    proposed_weight: m.proposed_weight ?? 0,
  }));
}

// Standalone page for the overlap matrix. Deliberately thin: it only picks a
// client and loads that client's managers, then renders the SAME OverlapSection
// the Portfolio tab composes, so the two views can never drift apart.
export function OverlapRoute() {
  const [clients, setClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [managers, setManagers] = useState<OverlapManagerInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPortfolioClients()
      .then((d) => {
        setClients(d.clients ?? []);
        if ((d.clients ?? []).length && !selectedClient) {
          setSelectedClient(d.clients[0]);
        }
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Could not load the client list."),
      );
    // one-shot on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedClient) {
      setManagers([]);
      return;
    }
    setLoading(true);
    getPortfolio(selectedClient)
      .then((p) => {
        setManagers(toInputs(p.managers ?? []));
        setError(null);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Could not load the portfolio."),
      )
      .finally(() => setLoading(false));
  }, [selectedClient]);

  return (
    <div id="page-overlap">
      <div className="flex gap-16 mb-16 items-center" style={{ flexWrap: "wrap" }}>
        <div className="select-wrap">
          <select
            value={selectedClient ?? ""}
            onChange={(event) => {
              if (event.target.value) setSelectedClient(event.target.value);
            }}
          >
            <option value="">-- Select Portfolio --</option>
            {clients.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <span style={{ color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 10 }}>
            Loading portfolio…
          </span>
        ) : null}
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}

      {selectedClient && managers.length ? (
        <OverlapSection client={selectedClient} managers={managers} />
      ) : !loading ? (
        <div style={{ padding: 24, textAlign: "center", color: "var(--text3)" }}>
          Select a portfolio to see the holdings-overlap matrix.
        </div>
      ) : null}
    </div>
  );
}
