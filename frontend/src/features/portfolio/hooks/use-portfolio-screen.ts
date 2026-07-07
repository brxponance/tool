"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";
import type { BackendStatus } from "@/features/setup/types";

import {
  createClient,
  deleteClient,
  getBenchmarkCatalog,
  getPortfolioContribution,
  getPortfolioContributionPreview,
  getPortfolio,
  getPortfolioClients,
  getPortfolioExposures,
  getPortfolioExposuresMenu,
  getPortfolioMarketCycle,
  getPortfolioRiskAnalysis,
  getPortfolioRiskExposures,
  getPortfolioStatus,
  getPortfolioStats,
  savePortfolioDraft,
  updateClient,
} from "../api/get-portfolio-screen-data";
import {
  getPortfolioManagerCatalog,
  getPortfolioManagerDetail,
} from "../api/portfolio-manager-catalog";
import type {
  ClientsResponse,
  ContributionResponse,
  ExposureMenuGroup,
  MarketCycleResponse,
  PortfolioManager,
  PortfolioManagerCatalogItem,
  PortfolioManagerDetailResponse,
  PortfolioExposuresResponse,
  PortfolioResponse,
  PortfolioStats,
  RiskAnalysisResponse,
  RiskExposuresResponse,
} from "../types";

type PortfolioScreenState = {
  clients: ClientsResponse["clients"];
  benchmarks: ClientsResponse["benchmarks"];
  clientsEditable: boolean;
  benchmarkOptions: string[];
  status: BackendStatus | null;
  selectedClient: string | null;
  portfolio: PortfolioResponse | null;
  stats: PortfolioStats | null;
  riskExposures: RiskExposuresResponse | null;
  riskAnalysis: RiskAnalysisResponse | null;
  contribution: ContributionResponse | null;
  marketCycle: MarketCycleResponse | null;
  exposureMenu: ExposureMenuGroup[];
  selectedExposureGrouping: string | null;
  selectedExposureSubGrouping: string | null;
  portfolioExposures: PortfolioExposuresResponse | null;
  persistedPortfolioManagers: PortfolioManager[] | null;
  addableManagers: PortfolioManagerCatalogItem[];
  loading: boolean;
  loadingPortfolio: boolean;
  loadingAncillary: boolean;
  loadingExposures: boolean;
  loadingManagerCatalog: boolean;
  managerCatalogError: string | null;
  error: string | null;
};

const initialState: PortfolioScreenState = {
  clients: [],
  benchmarks: {},
  clientsEditable: false,
  benchmarkOptions: [],
  status: null,
  selectedClient: null,
  portfolio: null,
  stats: null,
  riskExposures: null,
  riskAnalysis: null,
  contribution: null,
  marketCycle: null,
  exposureMenu: [],
  selectedExposureGrouping: null,
  selectedExposureSubGrouping: null,
  portfolioExposures: null,
  persistedPortfolioManagers: null,
  addableManagers: [],
  loading: true,
  loadingPortfolio: false,
  loadingAncillary: false,
  loadingExposures: false,
  loadingManagerCatalog: false,
  managerCatalogError: null,
  error: null,
};

const EMPTY_STYLE_METRICS = {
  vg_full: 0,
  vg_3factor: 0,
  Core: 0,
  Growth: 0,
  Value: 0,
  Yield: 0,
  Quality: 0,
  Dynamic: 0,
  Defensive: 0,
  "Low Vol": 0,
  pct_small: 0,
  pct_em: 0,
};

function isFulfilled<T>(
  result: PromiseSettledResult<T>,
): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled";
}

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function hasStatusCode(error: unknown, status: number) {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === status
  );
}

function portfolioManagerKey(manager: Pick<PortfolioManager, "tab" | "matched_name">) {
  return `${manager.tab}::${manager.matched_name}`;
}

function clonePortfolioManagers(managers: PortfolioManager[]) {
  return managers.map((manager) => ({ ...manager }));
}

function portfolioHasDraftChanges(
  portfolio: PortfolioResponse,
  persistedManagers: PortfolioManager[] | null,
) {
  if (!persistedManagers) {
    return true;
  }

  if (portfolio.managers.length !== persistedManagers.length) {
    return true;
  }

  const persistedByKey = new Map(
    persistedManagers.map((manager) => [portfolioManagerKey(manager), manager]),
  );

  for (const manager of portfolio.managers) {
    const persisted = persistedByKey.get(portfolioManagerKey(manager));
    if (!persisted) {
      return true;
    }

    if (
      manager.current_weight !== persisted.current_weight ||
      manager.proposed_weight !== persisted.proposed_weight
    ) {
      return true;
    }
  }

  return false;
}

function firstExposureGrouping(menu: ExposureMenuGroup[]) {
  return menu[0]?.cols[0]?.col ?? null;
}

function pickExposureGrouping(
  menu: ExposureMenuGroup[],
  currentGrouping: string | null,
) {
  if (
    currentGrouping &&
    menu.some((group) => group.cols.some((option) => option.col === currentGrouping))
  ) {
    return currentGrouping;
  }
  return firstExposureGrouping(menu);
}

function emptyPortfolioStats(): PortfolioStats {
  return {
    current: { ...EMPTY_STYLE_METRICS },
    proposed: { ...EMPTY_STYLE_METRICS },
    delta: { ...EMPTY_STYLE_METRICS },
    edge_current: {
      z: null,
      covered_weight: 0,
      total_weight: 0,
    },
    edge_proposed: {
      z: null,
      covered_weight: 0,
      total_weight: 0,
    },
  };
}

function emptyRiskExposures(error?: string): RiskExposuresResponse {
  return {
    factors: [],
    current: {},
    proposed: {},
    delta: {},
    unmatched: [],
    error,
  };
}

function emptyRiskAnalysis(error?: string): RiskAnalysisResponse {
  return {
    peer_group: "--",
    n_months: 0,
    n_capture: 0,
    start_date: null,
    end_date: null,
    has_infl: false,
    benchmarks: {},
    scenario: {
      current: {
        max_drawdown: null,
        core: null,
        value_tilted: null,
        growth_tilted: null,
        infl_sensitive: null,
      },
      proposed: {
        max_drawdown: null,
        core: null,
        value_tilted: null,
        growth_tilted: null,
        infl_sensitive: null,
      },
    },
    marginal: {
      current: {
        base_te: null,
        base_dd: null,
        managers: [],
      },
      proposed: {
        base_te: null,
        base_dd: null,
        managers: [],
      },
    },
    regime: {
      value_outperform: null,
      growth_outperform: null,
    },
    error,
  };
}

function emptyContribution(error?: string): ContributionResponse {
  return {
    managers: [],
    unmatched: [],
    error,
  };
}

function emptyMarketCycle(error?: string): MarketCycleResponse {
  return {
    current: [],
    proposed: [],
    tabs_without_universe: [],
    n_total: 0,
    error,
  };
}

function fallbackExposureResponse(
  grouping: string,
  error: string,
): PortfolioExposuresResponse {
  return {
    grouping,
    display_label: grouping,
    group_category: "",
    is_categorical: true,
    rows: [],
    matched: [],
    unmatched: [],
    coverage_current: 0,
    coverage_proposed: 0,
    benchmark_coverage: 0,
    benchmark_name: "",
    benchmark_fallback: false,
    available_benchmarks: [],
    error,
  };
}

function buildPortfolioManager(
  manager: PortfolioManagerCatalogItem,
  detail: PortfolioManagerDetailResponse,
): PortfolioManager {
  return {
    weight_file_name: manager.name,
    matched_name: manager.name,
    tab: manager.tab,
    current_weight: 0,
    proposed_weight: 0,
    r2_full: detail.r2_full,
    r2_3factor: detail.r2_3factor,
    ns_z: detail.ns_z,
    ns_skill: detail.ns_skill,
    vg_full: detail.vg_full ?? manager.vg_full ?? 0,
    vg_3factor: detail.vg_3factor ?? manager.vg_3factor ?? 0,
    pct_small: detail.pct_small ?? 0,
    pct_em: detail.pct_em ?? 0,
    style_buckets: detail.style_buckets ?? {},
    betas_full: detail.betas_full ?? {},
    betas_3factor: detail.betas_3factor ?? {},
    ns_n_obs: detail.ns_n_obs,
    ns_n_peers: detail.ns_n_peers,
    ns_adj_method: detail.ns_adj_method,
    ns_last_month: detail.ns_last_month,
  };
}

export function usePortfolioScreen() {
  const [state, setState] = useState<PortfolioScreenState>(initialState);
  const portfolioRequestRef = useRef(0);
  const derivedRequestRef = useRef(0);
  const loadSelectedPortfolio = useEffectEvent((client: string) => {
    void loadPortfolio(client);
  });
  const refreshDerivedData = useEffectEvent(
    async (
      client: string,
      portfolio: PortfolioResponse,
      status: BackendStatus,
      grouping: string | null,
      subGrouping: string | null,
      persistedManagers: PortfolioManager[] | null,
    ) => {
      const requestId = ++derivedRequestRef.current;
      const hasDraftChanges = portfolioHasDraftChanges(portfolio, persistedManagers);

      const contributionRequest = hasDraftChanges
        ? getPortfolioContributionPreview(portfolio.managers).catch((error: unknown) => {
            if (hasStatusCode(error, 404)) {
              throw new Error(
                "Contribution preview is unavailable because the running backend is missing the preview route.",
              );
            }
            throw error;
          })
        : getPortfolioContribution(client);

      setState((current) => ({
        ...current,
        loadingAncillary: true,
        loadingExposures: Boolean(status.has_exposures && grouping),
      }));

      if (!portfolio.managers.length) {
        setState((current) => ({
          ...current,
          stats: emptyPortfolioStats(),
          riskExposures: status.has_security_risk || status.has_risk ? emptyRiskExposures() : null,
          riskAnalysis: null,
          contribution: emptyContribution(),
          marketCycle: null,
          portfolioExposures: grouping
            ? fallbackExposureResponse(grouping, "No managers in the preview portfolio.")
            : null,
          loadingAncillary: false,
          loadingExposures: false,
        }));
        return;
      }

      const [
        statsResult,
        riskExposuresResult,
        riskAnalysisResult,
        contributionResult,
        marketCycleResult,
        exposuresResult,
      ] = await Promise.allSettled([
        getPortfolioStats(portfolio),
        status.has_security_risk || status.has_risk
          ? getPortfolioRiskExposures(client, portfolio.managers, status.has_security_risk)
          : Promise.resolve(null),
        getPortfolioRiskAnalysis(client, portfolio.managers),
        contributionRequest,
        getPortfolioMarketCycle(client, portfolio.managers),
        status.has_exposures && grouping
          ? getPortfolioExposures(client, portfolio.managers, grouping, subGrouping)
          : Promise.resolve(null),
      ]);

      if (requestId !== derivedRequestRef.current) {
        return;
      }

      setState((current) => ({
        ...current,
        stats: isFulfilled(statsResult)
          ? statsResult.value
          : emptyPortfolioStats(),
        riskExposures:
          isFulfilled(riskExposuresResult) && riskExposuresResult.value
            ? riskExposuresResult.value
            : status.has_security_risk || status.has_risk
              ? emptyRiskExposures(
                  riskExposuresResult.status === "rejected"
                    ? toErrorMessage(riskExposuresResult.reason, "Unable to load risk exposures.")
                    : undefined,
                )
              : null,
        riskAnalysis: isFulfilled(riskAnalysisResult)
          ? riskAnalysisResult.value
          : emptyRiskAnalysis(
              toErrorMessage(riskAnalysisResult.reason, "Unable to load risk analysis."),
            ),
        contribution: isFulfilled(contributionResult)
          ? contributionResult.value
          : emptyContribution(
              toErrorMessage(contributionResult.reason, "Unable to load contribution data."),
            ),
        marketCycle: isFulfilled(marketCycleResult)
          ? marketCycleResult.value
          : emptyMarketCycle(
              toErrorMessage(marketCycleResult.reason, "Unable to load market-cycle placements."),
            ),
        portfolioExposures:
          status.has_exposures && grouping
            ? isFulfilled(exposuresResult) && exposuresResult.value
              ? exposuresResult.value
              : fallbackExposureResponse(
                  grouping,
                  exposuresResult.status === "rejected"
                    ? toErrorMessage(
                        exposuresResult.reason,
                        "Unable to load portfolio exposures.",
                      )
                    : "Unable to load portfolio exposures.",
                )
            : null,
        loadingAncillary: false,
        loadingExposures: false,
      }));
    },
  );

  async function loadClients() {
    setState((current) => ({ ...current, loading: true, error: null }));

    try {
      const [clientsData, status, benchmarkCatalog] = await Promise.all([
        getPortfolioClients(),
        getPortfolioStatus(),
        // Non-critical: an empty list just means the benchmark dropdown has
        // only the current value; never let it break client loading.
        getBenchmarkCatalog().catch(() => ({ benchmarks: [] as string[] })),
      ]);
      const selectedClient = clientsData.clients[0] ?? null;

      setState((current) => ({
        ...current,
        clients: clientsData.clients,
        benchmarks: clientsData.benchmarks,
        clientsEditable: Boolean(clientsData.editable),
        benchmarkOptions: benchmarkCatalog.benchmarks ?? [],
        status,
        selectedClient,
        loading: false,
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the client roster.",
      }));
    }
  }

  async function loadPortfolio(client: string) {
    const requestId = ++portfolioRequestRef.current;
    derivedRequestRef.current += 1;
    setState((current) => ({
      ...current,
      loadingPortfolio: true,
      loadingAncillary: true,
      loadingExposures: false,
      stats: null,
      riskExposures: null,
      riskAnalysis: null,
      contribution: null,
      marketCycle: null,
      portfolioExposures: null,
      error: null,
    }));

    try {
      const [status, portfolio] = await Promise.all([
        getPortfolioStatus(),
        getPortfolio(client),
      ]);
      const exposureMenuResult = status.has_exposures
        ? await getPortfolioExposuresMenu()
        : null;
      const exposureMenu = exposureMenuResult?.menu ?? [];
      const selectedExposureGrouping = pickExposureGrouping(
        exposureMenu,
        state.selectedExposureGrouping,
      );

      if (requestId !== portfolioRequestRef.current) {
        return;
      }

      setState((current) => ({
        ...current,
        status,
        portfolio,
        persistedPortfolioManagers: clonePortfolioManagers(portfolio.managers),
        exposureMenu,
        selectedExposureGrouping,
        loadingPortfolio: false,
        loadingAncillary: true,
        loadingExposures: Boolean(status.has_exposures && selectedExposureGrouping),
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        portfolio: null,
        stats: null,
        riskExposures: null,
        riskAnalysis: null,
        contribution: null,
        marketCycle: null,
        exposureMenu: [],
        selectedExposureGrouping: null,
        portfolioExposures: null,
        persistedPortfolioManagers: null,
        loadingPortfolio: false,
        loadingAncillary: false,
        loadingExposures: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the portfolio feature.",
      }));
    }
  }

  async function ensureManagerCatalog() {
    if (state.addableManagers.length || state.loadingManagerCatalog) {
      return state.addableManagers;
    }

    setState((current) => ({
      ...current,
      loadingManagerCatalog: true,
      managerCatalogError: null,
    }));

    try {
      const response = await getPortfolioManagerCatalog();
      setState((current) => ({
        ...current,
        addableManagers: response.managers,
        loadingManagerCatalog: false,
        managerCatalogError: null,
      }));
      return response.managers;
    } catch (error) {
      const message = toErrorMessage(error, "Unable to load the manager catalog.");
      setState((current) => ({
        ...current,
        loadingManagerCatalog: false,
        managerCatalogError: message,
      }));
      throw error;
    }
  }

  useEffect(() => {
    void loadClients();
  }, []);

  useEffect(() => {
    if (!state.selectedClient) {
      return;
    }

    loadSelectedPortfolio(state.selectedClient);
  }, [state.selectedClient]);

  useEffect(() => {
    if (!state.selectedClient || !state.portfolio || !state.status) {
      return;
    }

    const client = state.selectedClient;
    const portfolio = state.portfolio;
    const status = state.status;
    const grouping = state.selectedExposureGrouping;
    const subGrouping = state.selectedExposureSubGrouping;
    const persistedManagers = state.persistedPortfolioManagers;
    const timeoutId = window.setTimeout(() => {
      void refreshDerivedData(client, portfolio, status, grouping, subGrouping, persistedManagers);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    state.portfolio,
    state.selectedClient,
    state.selectedExposureGrouping,
    state.selectedExposureSubGrouping,
    state.status,
  ]);

  // "Dirty" when the current portfolio differs from what's persisted in the
  // DB — drives the Save/Discard button state. Only meaningful when the DB is
  // on (otherwise there's nothing to save to).
  const hasUnsavedChanges =
    state.clientsEditable &&
    Boolean(state.portfolio) &&
    portfolioHasDraftChanges(
      state.portfolio as PortfolioResponse,
      state.persistedPortfolioManagers,
    );

  return {
    ...state,
    hasUnsavedChanges,
    async savePortfolio() {
      if (!state.selectedClient || !state.portfolio) {
        throw new Error("Load a client before saving.");
      }
      const managers = state.portfolio.managers.map((m) => ({
        // weight_file_name is the stable DB identity (the original workbook
        // name). matched_name is the fuzzy-matched clone key used only for
        // analytics — never persist it as the row key or the manager gets
        // silently renamed on save. Fall back to matched_name only for
        // managers added in-session that have no separate file name.
        weight_file_name: m.weight_file_name ?? m.matched_name,
        matched_name: m.matched_name,
        tab: m.tab,
        current_weight: m.current_weight,
        proposed_weight: m.proposed_weight,
        style_buckets: m.style_buckets ?? null,
        is_placeholder: m.is_placeholder ?? false,
      }));
      await savePortfolioDraft(state.selectedClient, managers);
      // Snapshot the now-persisted managers so hasUnsavedChanges goes false.
      setState((current) => ({
        ...current,
        persistedPortfolioManagers: current.portfolio
          ? clonePortfolioManagers(current.portfolio.managers)
          : current.persistedPortfolioManagers,
      }));
    },
    discardChanges() {
      // Reload from the backend, dropping in-memory edits back to the saved
      // version. loadPortfolio resets persistedPortfolioManagers too.
      if (state.selectedClient) {
        void loadPortfolio(state.selectedClient);
      }
    },
    async addManager(manager: PortfolioManagerCatalogItem) {
      if (!state.portfolio) {
        throw new Error("Load a portfolio before adding managers.");
      }

      const exists = state.portfolio.managers.some(
        (current) => current.matched_name === manager.name && current.tab === manager.tab,
      );
      if (exists) {
        throw new Error("That manager is already in the portfolio.");
      }

      const detail = await getPortfolioManagerDetail(manager.tab, manager.name);
      if (detail.error) {
        throw new Error(detail.error);
      }

      const nextManager = buildPortfolioManager(manager, detail);
      startTransition(() => {
        setState((current) => {
          if (!current.portfolio) {
            return current;
          }

          const duplicate = current.portfolio.managers.some(
            (existingManager) =>
              existingManager.matched_name === nextManager.matched_name &&
              existingManager.tab === nextManager.tab,
          );
          if (duplicate) {
            return current;
          }

          return {
            ...current,
            portfolio: {
              ...current.portfolio,
              managers: [...current.portfolio.managers, nextManager],
            },
            error: null,
          };
        });
      });
    },
    ensureManagerCatalog,
    removeManager(managerKey: string) {
      startTransition(() => {
        setState((current) => {
          if (!current.portfolio) {
            return current;
          }

          return {
            ...current,
            portfolio: {
              ...current.portfolio,
              managers: current.portfolio.managers.filter(
                (manager) => `${manager.tab}::${manager.matched_name}` !== managerKey,
              ),
            },
          };
        });
      });
    },
    setSelectedExposureGrouping(grouping: string) {
      startTransition(() => {
        setState((current) => ({
          ...current,
          selectedExposureGrouping: grouping,
          selectedExposureSubGrouping: null,
        }));
      });
    },
    setExposureSelection(
      categorical: string | null,
      continuous: string | null,
    ) {
      startTransition(() => {
        setState((current) => {
          // Mode A (cat only) | Mode B (cont only) | Mode C (cat + cont nested)
          let grouping: string | null = null;
          let subGrouping: string | null = null;
          if (categorical && continuous) {
            grouping = categorical;
            subGrouping = continuous;
          } else if (categorical) {
            grouping = categorical;
          } else if (continuous) {
            grouping = continuous;
          }
          return {
            ...current,
            selectedExposureGrouping: grouping,
            selectedExposureSubGrouping: subGrouping,
          };
        });
      });
    },
    setSelectedClient(client: string) {
      startTransition(() => {
        setState((current) => ({ ...current, selectedClient: client }));
      });
    },
    // Apply a roster returned by a CRUD endpoint and select `preferred` (or the
    // first remaining client). Selecting triggers the existing portfolio-load
    // effect via selectedClient.
    async addClient(input: { name: string; benchmark?: string | null }) {
      const data = await createClient(input);
      const preferred = data.created;
      setState((current) => ({
        ...current,
        clients: data.clients,
        benchmarks: data.benchmarks,
        clientsEditable: Boolean(data.editable ?? current.clientsEditable),
        selectedClient: data.clients.includes(preferred)
          ? preferred
          : (data.clients[0] ?? null),
      }));
    },
    async renameClient(
      currentName: string,
      input: { name?: string; benchmark?: string | null },
    ) {
      const data = await updateClient(currentName, input);
      const preferred = data.renamed_to;
      setState((current) => ({
        ...current,
        clients: data.clients,
        benchmarks: data.benchmarks,
        clientsEditable: Boolean(data.editable ?? current.clientsEditable),
        selectedClient: data.clients.includes(preferred)
          ? preferred
          : (data.clients[0] ?? null),
      }));
    },
    async removeClient(name: string) {
      const data = await deleteClient(name);
      setState((current) => ({
        ...current,
        clients: data.clients,
        benchmarks: data.benchmarks,
        clientsEditable: Boolean(data.editable ?? current.clientsEditable),
        selectedClient: data.clients[0] ?? null,
      }));
    },
    updateManagerProposedWeight(managerKey: string, proposedWeightPercent: number) {
      startTransition(() => {
        setState((current) => {
          if (!current.portfolio) {
            return current;
          }

          const nextWeight = Math.max(0, (Number.isFinite(proposedWeightPercent) ? proposedWeightPercent : 0) / 100);
          let changed = false;
          const nextManagers = current.portfolio.managers.map((manager) => {
            if (`${manager.tab}::${manager.matched_name}` !== managerKey) {
              return manager;
            }

            if (manager.proposed_weight === nextWeight) {
              return manager;
            }

            changed = true;
            return {
              ...manager,
              proposed_weight: nextWeight,
            };
          });

          if (!changed) {
            return current;
          }

          return {
            ...current,
            portfolio: {
              ...current.portfolio,
              managers: nextManagers,
            },
          };
        });
      });
    },
    reload() {
      if (state.selectedClient) {
        void loadPortfolio(state.selectedClient);
        return;
      }
      void loadClients();
    },
  };
}