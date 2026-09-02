"use client";

import { startTransition, useEffect, useRef, useState } from "react";

import {
  getManagerDetailScreenData,
  getManagerDirectory,
} from "../api/get-manager-detail-screen-data";
import {
  MAX_COMPARE_MANAGERS,
  type ManagerDetailScreenData,
  type ManagerDirectoryItem,
} from "../types";

type RequestedSelection = {
  manager?: string | null;
  tab?: string | null;
};

export type ManagerEntry = {
  item: ManagerDirectoryItem;
  data: ManagerDetailScreenData | null;
  loading: boolean;
  error: string | null;
};

type ManagerDetailState = {
  directory: ManagerDirectoryItem[];
  // Up to MAX_COMPARE_MANAGERS entries, all sharing one peer tab. The first
  // entry is the "primary" (drives defaults like the factor-composition pick).
  entries: ManagerEntry[];
  loadingDirectory: boolean;
  error: string | null;
  // Transient feedback when an add is rejected (wrong asset class, cap, …).
  notice: string | null;
};

const initialState: ManagerDetailState = {
  directory: [],
  entries: [],
  loadingDirectory: true,
  error: null,
  notice: null,
};

const entryKey = (item: ManagerDirectoryItem) => `${item.tab}::${item.name}`;

function logManagerDetail(message: string, payload?: Record<string, unknown>) {
  if (payload) {
    console.info("[manager-detail]", message, payload);
    return;
  }

  console.info("[manager-detail]", message);
}

export function useManagerDetailScreen(requestedSelection: RequestedSelection) {
  const [state, setState] = useState<ManagerDetailState>(initialState);
  // Mirror of the latest state for synchronous validation in addManager —
  // setState updaters run at render time, so side-effect flags inside them
  // are not readable right after the call.
  const stateRef = useRef(state);
  stateRef.current = state;

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

  async function loadEntry(item: ManagerDirectoryItem) {
    const key = entryKey(item);
    try {
      const data = await getManagerDetailScreenData(item.tab, item.name);
      logManagerDetail("detail load succeeded", { manager: item.name, tab: item.tab });
      setState((current) => ({
        ...current,
        entries: current.entries.map((e) =>
          entryKey(e.item) === key ? { ...e, data, loading: false } : e,
        ),
      }));
    } catch (error) {
      console.error("[manager-detail] detail load failed", {
        manager: item.name,
        tab: item.tab,
        error,
      });
      setState((current) => ({
        ...current,
        entries: current.entries.map((e) =>
          entryKey(e.item) === key
            ? {
                ...e,
                data: null,
                loading: false,
                error:
                  error instanceof Error
                    ? error.message
                    : "Unable to load manager detail.",
              }
            : e,
        ),
      }));
    }
  }

  useEffect(() => {
    void loadDirectory();
  }, []);

  // No auto-select on load — the page shows an empty "Search for a manager"
  // state until the user picks one. The single exception is an explicit
  // query-param deep link (?manager=...), applied once the directory arrives.
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
      });
      return;
    }

    setState((current) => ({
      ...current,
      entries: [{ item: requested, data: null, loading: true, error: null }],
    }));
    void loadEntry(requested);
  }, [requestApplied, requestedSelection.manager, requestedSelection.tab, state.directory]);

  function addManager(item: ManagerDirectoryItem) {
    const entries = stateRef.current.entries;
    const reject = (notice: string) =>
      setState((current) => ({ ...current, notice }));

    if (entries.some((e) => entryKey(e.item) === entryKey(item))) {
      reject(`${item.name} is already selected.`);
      return;
    }
    if (entries.length >= MAX_COMPARE_MANAGERS) {
      reject(
        `Up to ${MAX_COMPARE_MANAGERS} managers can be compared. Remove one first.`,
      );
      return;
    }
    if (entries.length > 0) {
      const tab = entries[0].item.tab;
      if (item.tab !== tab) {
        reject(
          `Comparison managers must share one asset class — this selection is ${tab}.`,
        );
        return;
      }
      if (item.is_placeholder || item.tab === "Placeholder") {
        reject("Placeholder managers have no clone data and can't be compared.");
        return;
      }
    }

    logManagerDetail("manager added to selection", {
      manager: item.name,
      tab: item.tab,
    });
    setState((current) => ({
      ...current,
      notice: null,
      entries: [
        ...current.entries,
        { item, data: null, loading: true, error: null },
      ],
    }));
    void loadEntry(item);
  }

  return {
    directory: state.directory,
    entries: state.entries,
    loadingDirectory: state.loadingDirectory,
    error: state.error,
    notice: state.notice,
    addManager(item: ManagerDirectoryItem) {
      startTransition(() => addManager(item));
    },
    removeManager(item: ManagerDirectoryItem) {
      startTransition(() => {
        setState((current) => ({
          ...current,
          notice: null,
          entries: current.entries.filter(
            (e) => entryKey(e.item) !== entryKey(item),
          ),
        }));
      });
    },
    clearSelection() {
      logManagerDetail("selection cleared");
      startTransition(() => {
        setState((current) => ({
          ...current,
          entries: [],
          error: null,
          notice: null,
        }));
      });
    },
    dismissNotice() {
      setState((current) => ({ ...current, notice: null }));
    },
  };
}
