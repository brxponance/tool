"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getManagerPortfolioExposures,
  getManagerPortfolioExposuresMenu,
} from "../api/get-manager-exposures";
import { mgrBenchmarkHint } from "../lib/benchmark-hint";
import type {
  ManagerExposureMenuGroup,
  ManagerPortfolioExposuresResponse,
} from "../types";

type ManagerRef = { name: string; tab: string };

type Selection = {
  categorical: string | null;
  continuous: string | null;
};

type DataState = {
  // One response per manager, aligned with the managers argument.
  data: Array<ManagerPortfolioExposuresResponse | null>;
  loading: boolean;
  error: string | null;
};

const emptyData: DataState = { data: [], loading: false, error: null };

// Portfolio exposures for one or more managers: the menu is shared, and each
// manager gets its own /portfolio_exposures call (the endpoint aggregates a
// manager list into one portfolio, so per-manager columns need N calls).
export function useManagerExposures(args: {
  managers: ManagerRef[];
  hasExposures: boolean;
}) {
  const { managers, hasExposures } = args;

  const [menu, setMenu] = useState<ManagerExposureMenuGroup[]>([]);
  const [selection, setSelection] = useState<Selection>({
    categorical: null,
    continuous: null,
  });
  const [state, setState] = useState<DataState>(emptyData);
  const requestId = useRef(0);

  // Load the menu once when exposures are available.
  useEffect(() => {
    if (!hasExposures) {
      setMenu([]);
      return;
    }
    let cancelled = false;
    getManagerPortfolioExposuresMenu()
      .then((res) => {
        if (!cancelled) setMenu(res.menu ?? []);
      })
      .catch(() => {
        if (!cancelled) setMenu([]);
      });
    return () => {
      cancelled = true;
    };
  }, [hasExposures]);

  // Resolve which grouping the backend should compute. If a categorical
  // is selected (with or without a continuous sub-grouping), it's Mode A/C;
  // if only continuous, Mode B.
  const grouping = selection.categorical ?? selection.continuous;
  const subGrouping = selection.categorical ? selection.continuous : null;

  const signature = managers.map((m) => `${m.tab}::${m.name}`).join("|");

  useEffect(() => {
    if (!hasExposures || !managers.length || !grouping) {
      setState(emptyData);
      return;
    }
    const id = ++requestId.current;
    setState((curr) => ({ ...curr, loading: true, error: null }));
    Promise.all(
      managers.map((m) =>
        getManagerPortfolioExposures(
          m.name,
          m.tab,
          grouping,
          subGrouping,
          mgrBenchmarkHint(m.name, m.tab),
        ).catch(() => null),
      ),
    )
      .then((data) => {
        if (requestId.current === id) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (requestId.current === id) {
          setState({
            data: [],
            loading: false,
            error: err instanceof Error ? err.message : "Request failed.",
          });
        }
      });
    // managers captured via signature
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasExposures, signature, grouping, subGrouping]);

  const setSelectionFromSection = useCallback(
    (categorical: string | null, continuous: string | null) => {
      setSelection({ categorical, continuous });
    },
    [],
  );

  return {
    exposureMenu: menu,
    data: state.data,
    loading: state.loading,
    error: state.error,
    selectedCategorical: selection.categorical,
    selectedContinuous: selection.continuous,
    setSelection: setSelectionFromSection,
  };
}
