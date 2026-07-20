"use client";

import { startTransition, useEffect, useState } from "react";

import {
  getManagerDetailScreenData,
  getManagerDirectory,
} from "../api/get-manager-detail-screen-data";
import type {
  ManagerDetailScreenData,
  ManagerDirectoryItem,
} from "../types";

type RequestedSelection = {
  manager?: string | null;
  tab?: string | null;
};

type ManagerDetailState = {
  directory: ManagerDirectoryItem[];
  selected: ManagerDirectoryItem | null;
  data: ManagerDetailScreenData | null;
  loadingDirectory: boolean;
  loadingDetail: boolean;
  error: string | null;
};

const initialState: ManagerDetailState = {
  directory: [],
  selected: null,
  data: null,
  loadingDirectory: true,
  loadingDetail: false,
  error: null,
};

function logManagerDetail(message: string, payload?: Record<string, unknown>) {
  if (payload) {
    console.info("[manager-detail]", message, payload);
    return;
  }

  console.info("[manager-detail]", message);
}

export function useManagerDetailScreen(requestedSelection: RequestedSelection) {
  const [state, setState] = useState<ManagerDetailState>(initialState);

  async function loadDirectory() {
    logManagerDetail("directory load started", {
      requestedManager: requestedSelection.manager ?? null,
      requestedTab: requestedSelection.tab ?? null,
    });

    setState((current) => ({ ...current, loadingDirectory: true, error: null }));

    try {
      const directoryResponse = await getManagerDirectory();
      logManagerDetail("directory load succeeded", {
        count: directoryResponse.managers.length,
        firstManager: directoryResponse.managers[0]?.name ?? null,
        firstTab: directoryResponse.managers[0]?.tab ?? null,
      });

      setState((current) => ({
        ...current,
        directory: directoryResponse.managers,
        loadingDirectory: false,
      }));
    } catch (error) {
      console.error("[manager-detail] directory load failed", error);

      setState((current) => ({
        ...current,
        loadingDirectory: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the manager directory.",
      }));
    }
  }

  async function loadDetail(selected: ManagerDirectoryItem) {
    logManagerDetail("detail load started", {
      manager: selected.name,
      tab: selected.tab,
    });

    setState((current) => ({ ...current, loadingDetail: true, error: null }));

    try {
      const data = await getManagerDetailScreenData(selected.tab, selected.name);
      logManagerDetail("detail load succeeded", {
        manager: selected.name,
        tab: selected.tab,
        benchmark: data.summary.benchmark_name,
        r2Full: data.summary.r2_full,
        recommendationCount: data.recommendations.closest_matches.length,
        styleBucketCount: Object.keys(data.raw.style_buckets ?? {}).length,
        factorCount: Object.keys(data.summary.betas_full ?? {}).length,
      });

      setState((current) => ({ ...current, data, loadingDetail: false }));
    } catch (error) {
      console.error("[manager-detail] detail load failed", {
        manager: selected.name,
        tab: selected.tab,
        error,
      });

      setState((current) => ({
        ...current,
        data: null,
        loadingDetail: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load manager detail.",
      }));
    }
  }

  useEffect(() => {
    void loadDirectory();
  }, []);

  // Match the reference UI: no auto-select on load — the page shows an empty
  // "Search for a manager above" state until the user picks one. The single
  // exception is an explicit query-param deep link (?manager=...), applied
  // once when the directory arrives.
  const [requestApplied, setRequestApplied] = useState(false);

  useEffect(() => {
    if (requestApplied || !state.directory.length) {
      return;
    }

    if (!requestedSelection.manager) {
      setRequestApplied(true);
      return;
    }

    const requested = state.directory.find(
      (item) =>
        item.name === requestedSelection.manager &&
        (!requestedSelection.tab || item.tab === requestedSelection.tab),
    );

    setRequestApplied(true);

    if (!requested) {
      logManagerDetail("requested manager not found in directory", {
        requestedManager: requestedSelection.manager,
        requestedTab: requestedSelection.tab ?? null,
      });
      return;
    }

    logManagerDetail("selection initialized", {
      requestedManager: requestedSelection.manager,
      requestedTab: requestedSelection.tab ?? null,
      selectedManager: requested.name,
      selectedTab: requested.tab,
      source: "requested",
    });

    setState((current) => ({ ...current, selected: requested }));
  }, [requestApplied, requestedSelection.manager, requestedSelection.tab, state.directory]);

  useEffect(() => {
    if (!state.selected) {
      return;
    }

    logManagerDetail("selected manager changed", {
      manager: state.selected.name,
      tab: state.selected.tab,
    });

    void loadDetail(state.selected);
  }, [state.selected]);

  return {
    ...state,
    selectManager(selected: ManagerDirectoryItem) {
      logManagerDetail("user selected manager", {
        manager: selected.name,
        tab: selected.tab,
      });

      startTransition(() => {
        setState((current) => ({ ...current, selected }));
      });
    },
    clearSelection() {
      logManagerDetail("selection cleared");

      startTransition(() => {
        setState((current) => ({
          ...current,
          selected: null,
          data: null,
          error: null,
          loadingDetail: false,
        }));
      });
    },
    reload() {
      if (state.selected) {
        logManagerDetail("manual reload requested", {
          mode: "detail",
          manager: state.selected.name,
          tab: state.selected.tab,
        });
        void loadDetail(state.selected);
        return;
      }

      logManagerDetail("manual reload requested", { mode: "directory" });
      void loadDirectory();
    },
  };
}