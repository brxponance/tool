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

  // Bootstrap: load status + clients once.
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      backendJson<BackendStatus>("status").catch(() => null),
      getPortfolioClients().catch(() => null),
    ]).then(([status, clientsRes]) => {
      if (cancelled) return;
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
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const status =
        (await backendJson<BackendStatus>("status").catch(() => null)) ?? null;
      const portfolio = await getPortfolio(client);
      const managers = portfolio.managers;
      const useSecurityRisk = !!status?.has_security_risk;

      const [
        report,
        riskExposures,
        marketCycle,
        riskAnalysis,
        regionExp,
        countryExp,
        sectorExp,
        industryExp,
      ] = await Promise.all([
        getReportPayload(client).catch((err: Error) => ({
          client,
          error: err.message,
        }) as ReportPayload),
        status?.has_risk || status?.has_security_risk
          ? getPortfolioRiskExposures(client, managers, useSecurityRisk).catch(() => null)
          : Promise.resolve(null),
        getPortfolioMarketCycle(client, managers).catch(() => null),
        getPortfolioRiskAnalysis(client, managers).catch(() => null),
        status?.has_exposures
          ? getPortfolioExposures(client, managers, "Region", null).catch(() => null)
          : Promise.resolve(null),
        status?.has_exposures
          ? getPortfolioExposures(client, managers, "Country", null).catch(() => null)
          : Promise.resolve(null),
        status?.has_exposures
          ? getPortfolioExposures(client, managers, "Sector", null).catch(() => null)
          : Promise.resolve(null),
        status?.has_exposures
          ? getPortfolioExposures(client, managers, "Industry", null).catch(() => null)
          : Promise.resolve(null),
      ]);

      if (requestId.current !== id) return;

      setState((s) => ({
        ...s,
        status,
        report,
        riskExposures,
        marketCycle,
        riskAnalysis,
        exposures: {
          Region: regionExp,
          Country: countryExp,
          Sector: sectorExp,
          Industry: industryExp,
        },
        loading: false,
        error: null,
      }));
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
