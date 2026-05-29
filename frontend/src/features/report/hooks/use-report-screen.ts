"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { backendJson } from "@/lib/backend";
import type { BackendStatus } from "@/features/setup/types";
import {
  getPortfolio,
  getPortfolioClients,
  getPortfolioExposures,
  getPortfolioMarketCycle,
  getPortfolioRiskAnalysis,
  getPortfolioRiskExposures,
} from "@/features/portfolio/api/get-portfolio-screen-data";
import type {
  MarketCycleResponse,
  PortfolioManager,
  PortfolioExposuresResponse,
  RiskAnalysisResponse,
  RiskExposuresResponse,
} from "@/features/portfolio/types";

import { getReportPayload } from "../api/get-report";
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
  riskExposures: RiskExposuresResponse | null;
  marketCycle: MarketCycleResponse | null;
  riskAnalysis: RiskAnalysisResponse | null;
  exposures: ExposuresPack;
  loading: boolean;
  error: string | null;
};

const initialExposures: ExposuresPack = {
  Region: null,
  Country: null,
  Sector: null,
  Industry: null,
};

type ClientReportCache = Pick<
  ReportState,
  "status" | "report" | "riskExposures" | "marketCycle" | "riskAnalysis" | "exposures"
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
    riskExposures: null,
    marketCycle: null,
    riskAnalysis: null,
    exposures: initialExposures,
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
      riskExposures: null,
      marketCycle: null,
      riskAnalysis: null,
      exposures: initialExposures,
    }));

    const savePartial = (patch: ClientReportPatch) => {
      const current = clientCacheRef.current[client] ?? {
        status: statusRef.current,
        report: null,
        riskExposures: null,
        marketCycle: null,
        riskAnalysis: null,
        exposures: initialExposures,
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
        riskExposures: null,
        marketCycle: null,
        riskAnalysis: null,
        exposures: initialExposures,
      };
      clientCacheRef.current[client] = baseCache;
      setState((s) => ({ ...s, ...baseCache, loading: false, error: null }));

      const portfolio = await getPortfolio(client).catch(() => null);
      if (!portfolio || requestId.current !== id) return;

      const managers: PortfolioManager[] = portfolio.managers;
      const useSecurityRisk = !!status?.has_security_risk;

      if (status?.has_risk || status?.has_security_risk) {
        const riskExposures = await getPortfolioRiskExposures(
          client,
          managers,
          useSecurityRisk,
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

        const Sector = await getPortfolioExposures(client, managers, "Sector", null).catch(() => null);
        savePartial({ exposures: { Sector } });

        const Industry = await getPortfolioExposures(client, managers, "Industry", null).catch(() => null);
        savePartial({ exposures: { Industry } });
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
