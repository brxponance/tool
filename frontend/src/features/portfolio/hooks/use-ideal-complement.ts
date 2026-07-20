"use client";

import { useEffect, useRef, useState } from "react";

import { findIdealComplement } from "../api/get-portfolio-screen-data";
import type { IdealComplementResponse, PortfolioManager } from "../types";

export type IdealComplementState = {
  data: IdealComplementResponse | null;
  loading: boolean;
  error: string | null;
};

// Auto-computes the backtested ideal complement whenever the selected client
// or any manager weight changes, debounced 500ms. Mirrors the reference's
// scheduleIdealComplement/loadIdealComplement — the user never clicks a button.
export function useIdealComplement(
  client: string | null,
  managers: PortfolioManager[],
): IdealComplementState {
  const [state, setState] = useState<IdealComplementState>({
    data: null,
    loading: false,
    error: null,
  });

  // Signature over just the fields the backend consumes, so weight edits
  // retrigger the fetch while unrelated re-renders do not.
  const signature = managers
    .map(
      (m) =>
        `${m.tab}::${m.matched_name}:${m.current_weight ?? 0}:${m.proposed_weight ?? 0}`,
    )
    .join("|");

  const reqId = useRef(0);

  useEffect(() => {
    if (!client || !managers.length) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    const id = ++reqId.current;
    setState((prev) => ({ ...prev, loading: true }));
    const timer = setTimeout(() => {
      findIdealComplement(client, managers)
        .then((res) => {
          if (id !== reqId.current) return; // a newer request superseded this
          if (res.error) {
            setState({ data: null, loading: false, error: res.error });
          } else {
            setState({ data: res, loading: false, error: null });
          }
        })
        .catch((err: unknown) => {
          if (id !== reqId.current) return;
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Request failed",
          });
        });
    }, 500);
    return () => clearTimeout(timer);
    // managers is captured via `signature`; adding it would refire on identity churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, signature]);

  return state;
}
