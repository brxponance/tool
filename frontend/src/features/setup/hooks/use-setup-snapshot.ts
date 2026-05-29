"use client";

import { useEffect, useState } from "react";

import { getSetupSnapshot } from "../api/get-setup-snapshot";
import type { SetupSnapshot } from "../types";

type SetupState = {
  data: SetupSnapshot | null;
  loading: boolean;
  error: string | null;
};

const initialState: SetupState = {
  data: null,
  loading: true,
  error: null,
};

export function useSetupSnapshot() {
  const [state, setState] = useState<SetupState>(initialState);

  async function load(showPending = true) {
    if (showPending) {
      setState((current) => ({ ...current, loading: true, error: null }));
    }

    try {
      const data = await getSetupSnapshot();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to reach the Flask backend.",
      });
    }
  }

  useEffect(() => {
    let cancelled = false;

    void getSetupSnapshot()
      .then((data) => {
        if (cancelled) {
          return;
        }
        setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        setState({
          data: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to reach the Flask backend.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    ...state,
    reload: load,
  };
}