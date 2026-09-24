"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { backendJson } from "@/lib/backend";
import type { BackendStatus } from "@/features/setup/types";
import {
  getDiverseOwnership,
  getPortfolio,
  getPortfolioClients,
  getPortfolioExposures,
  getPortfolioMarketCycle,
  getPortfolioRiskAnalysis,
  getPortfolioRiskExposures,
  getPortfolioStats,
} from "@/features/portfolio/api/get-portfolio-screen-data";
import type {
  DiverseOwnershipResponse,
  MarketCycleResponse,
  PortfolioManager,
  PortfolioExposuresResponse,
  PortfolioStats,
  RiskAnalysisResponse,
  RiskExposuresResponse,
} from "@/features/portfolio/types";

// Same majority-ownership cut-off the Portfolio tab's Diverse / Woman Owned
// panel defaults to; the report has no threshold control.
export const REPORT_DIVERSE_THRESHOLD = 50;

import { getReportPayload } from "../api/get-report";
import type { ManagerExposuresPack } from "../lib/client-risk";
import type { ReportPayload } from "../types";

export type ExposuresPack = {
  Region: PortfolioExposuresResponse | null;
  Country: PortfolioExposuresResponse | null;
  Sector: PortfolioExposuresResponse | null;
  Industry: PortfolioExposuresResponse | null;
};

export type ReportState = {
  clients: string[];
  benchmarks: Record<string, string>;
  selectedClient: string | null;
  status: BackendStatus | null;
  report: ReportPayload | null;
  // Portfolio Edge (weighted-avg Normalized Skill Z) and the diverse /
  // woman-owned rollup — the same two endpoints the Portfolio tab uses, fed
  // the same /portfolio managers, so the report agrees with the tab.
  stats: PortfolioStats | null;
  diverse: DiverseOwnershipResponse | null;
  // The /portfolio managers (weights, AUM, qualitative fields) — the
  // guideline checks need them.
  managers: PortfolioManager[];
  riskExposures: RiskExposuresResponse | null;
  marketCycle: MarketCycleResponse | null;
  riskAnalysis: RiskAnalysisResponse | null;
  exposures: ExposuresPack;
  // Each manager's own Country / Sector / Industry exposures (fetched one
  // manager at a time at weight 1) so the report can say which managers
  // drive a bucket. Filled after the portfolio-level exposures.
  managerExposures: ManagerExposuresPack;
  loading: boolean;
  error: string | null;
};

const initialExposures: ExposuresPack = {
  Region: null,
  Country: null,
  Sector: null,
  Industry: null,
};

const initialManagerExposures: ManagerExposuresPack = {
  Country: {},
  Sector: {},
  Industry: {},
};

type ClientReportCache = Pick<
  ReportState,
  | "status"
  | "report"
  | "stats"
  | "diverse"
  | "managers"
  | "riskExposures"
  | "marketCycle"
  | "riskAnalysis"
  | "exposures"
  | "managerExposures"
>;

type ClientReportPatch =
  Partial<Omit<ClientReportCache, "exposures">> & { exposures?: Partial<ExposuresPack> };

export function useReportScreen() {
  const [state, setState] = useState<ReportState>({
    clients: [],
    benchmarks: {},
    selectedClient: null,
    status: null,
    report: null,
    stats: null,
    diverse: null,
    managers: [],
    riskExposures: null,
    marketCycle: null,
    riskAnalysis: null,
    exposures: initialExposures,
    managerExposures: initialManagerExposures,
    loading: false,
    error: null,
  });
  const requestId = useRef(0);
  const statusRef = useRef<BackendStatus | null>(null);
  const clientCacheRef = useRef<Record<string, ClientReportCache>>({});

  // Bootstrap: load status + clients once.
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      backendJson<BackendStatus>("status").catch(() => null),
      getPortfolioClients().catch(() => null),
    ]).then(([status, clientsRes]) => {
      if (cancelled) return;
      statusRef.current = status;
      setState((s) => ({
        ...s,
        status,
        clients: clientsRes?.clients ?? [],
        benchmarks: clientsRes?.benchmarks ?? {},
        selectedClient: s.selectedClient ?? clientsRes?.clients?.[0] ?? null,
      }));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadForClient = useCallback(async (client: string) => {
    const id = ++requestId.current;
    const cached = clientCacheRef.current[client];
    if (cached) {
      setState((s) => ({
        ...s,
        ...cached,
        loading: false,
        error: null,
      }));
      return;
    }

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
      report: null,
      stats: null,
      diverse: null,
      managers: [],
      riskExposures: null,
      marketCycle: null,
      riskAnalysis: null,
      exposures: initialExposures,
      managerExposures: initialManagerExposures,
    }));

    const savePartial = (patch: ClientReportPatch) => {
      const current = clientCacheRef.current[client] ?? {
        status: statusRef.current,
        report: null,
        stats: null,
        diverse: null,
        managers: [],
        riskExposures: null,
        marketCycle: null,
        riskAnalysis: null,
        exposures: initialExposures,
        managerExposures: initialManagerExposures,
      };
      clientCacheRef.current[client] = {
        ...current,
        ...patch,
        exposures: {
          ...current.exposures,
          ...(patch.exposures ?? {}),
        },
      };
      if (requestId.current !== id) return;
      setState((s) => ({
        ...s,
        ...patch,
        exposures: {
          ...s.exposures,
          ...(patch.exposures ?? {}),
        },
      }));
    };

    try {
      const status =
        statusRef.current ??
        (await backendJson<BackendStatus>("status").catch(() => null)) ??
        null;
      statusRef.current = status;

      const report = await getReportPayload(client).catch((err: Error) => ({
          client,
          error: err.message,
        }) as ReportPayload);

      if (requestId.current !== id) return;

      const baseCache: ClientReportCache = {
        status,
        report,
        stats: null,
        diverse: null,
        managers: [],
        riskExposures: null,
        marketCycle: null,
        riskAnalysis: null,
        exposures: initialExposures,
        managerExposures: initialManagerExposures,
      };
      clientCacheRef.current[client] = baseCache;
      setState((s) => ({ ...s, ...baseCache, loading: false, error: null }));

      const portfolio = await getPortfolio(client).catch(() => null);
      if (!portfolio || requestId.current !== id) return;

      const managers: PortfolioManager[] = portfolio.managers;
      savePartial({ managers });

      const stats = await getPortfolioStats(managers).catch(() => null);
      savePartial({ stats });

      const diverse = await getDiverseOwnership(managers, REPORT_DIVERSE_THRESHOLD).catch(() => null);
      savePartial({ diverse });

      if (status?.has_security_risk) {
        const riskExposures = await getPortfolioRiskExposures(
          client,
          managers,
        ).catch(() => null);
        savePartial({ riskExposures });
      }

      const marketCycle = await getPortfolioMarketCycle(client, managers).catch(() => null);
      savePartial({ marketCycle });

      const riskAnalysis = await getPortfolioRiskAnalysis(client, managers).catch(() => null);
      savePartial({ riskAnalysis });

      if (status?.has_exposures) {
        const Region = await getPortfolioExposures(client, managers, "Region", null).catch(() => null);
        savePartial({ exposures: { Region } });

        const Country = await getPortfolioExposures(client, managers, "Country", null).catch(() => null);
        savePartial({ exposures: { Country } });

        // "GICS Sector" / "GICS Industry" are the FactSet COLUMN names the
        // backend matches on — "Sector" / "Industry" are only display
        // labels. Passing a label misses the categorical branch in
        // exposures_engine._portfolio_exposure, buckets every security as
        // Unclassified, and returns a Cash+Unclassified pair that looks like
        // a valid response. Do not "tidy" these back to the short names.
        const Sector = await getPortfolioExposures(client, managers, "GICS Sector", null).catch(() => null);
        savePartial({ exposures: { Sector } });

        const Industry = await getPortfolioExposures(client, managers, "GICS Industry", null).catch(() => null);
        savePartial({ exposures: { Industry } });

        // Per-manager exposures for the "driven by" columns: each held
        // manager alone at weight 1, for the three groupings the guideline
        // and risk checks use. Parallel — ~3 calls per manager.
        const held = managers.filter((m) => (m.current_weight || 0) > 0);
        const perManager = async (grouping: "Country" | "GICS Sector" | "GICS Industry") => {
          const entries = await Promise.all(
            held.map(async (m) => {
              const solo = { ...m, current_weight: 1, proposed_weight: 1 };
              const res = await getPortfolioExposures(client, [solo], grouping, null).catch(() => null);
              return [m.matched_name, res?.rows ?? []] as const;
            }),
          );
          return Object.fromEntries(entries);
        };
        const [Country_m, Sector_m, Industry_m] = await Promise.all([
          perManager("Country"),
          perManager("GICS Sector"),
          perManager("GICS Industry"),
        ]);
        if (requestId.current !== id) return;
        savePartial({ managerExposures: { Country: Country_m, Sector: Sector_m, Industry: Industry_m } });
      }
    } catch (err) {
      if (requestId.current !== id) return;
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load report.",
      }));
    }
  }, []);

  useEffect(() => {
    if (!state.selectedClient) return;
    void loadForClient(state.selectedClient);
  }, [state.selectedClient, loadForClient]);

  const selectClient = useCallback((client: string) => {
    setState((s) => ({ ...s, selectedClient: client }));
  }, []);

  return { state, selectClient };
}
