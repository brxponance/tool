"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getManagerPortfolioExposures,
  getManagerPortfolioExposuresMenu,
} from "../api/get-manager-exposures";
import type {
  ManagerExposureMenuGroup,
  ManagerPortfolioExposuresResponse,
} from "../types";

type Selection = {
  categorical: string | null;
  continuous: string | null;
};

type DataState = {
  data: ManagerPortfolioExposuresResponse | null;
  loading: boolean;
  error: string | null;
};

const emptyData: DataState = { data: null, loading: false, error: null };

export function useManagerExposures(args: {
  name: string | null;
  tab: string | null;
  benchmarkHint: string | null;
  hasExposures: boolean;
}) {
  const { name, tab, benchmarkHint, hasExposures } = args;

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

  useEffect(() => {
    if (!hasExposures || !name || !tab || !grouping) {
      setState(emptyData);
      return;
    }
    const id = ++requestId.current;
    setState((curr) => ({ ...curr, loading: true, error: null }));
    getManagerPortfolioExposures(name, tab, grouping, subGrouping, benchmarkHint)
      .then((data) => {
        if (requestId.current === id) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (requestId.current === id) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Request failed.",
          });
        }
      });
  }, [hasExposures, name, tab, grouping, subGrouping, benchmarkHint]);

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
