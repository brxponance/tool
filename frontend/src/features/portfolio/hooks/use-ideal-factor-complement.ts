"use client";

import { useEffect, useRef, useState } from "react";

import { findIdealFactorComplement } from "../api/get-portfolio-screen-data";
import type { IdealFactorComplementResponse, PortfolioManager } from "../types";

export type IdealFactorComplementState = {
  data: IdealFactorComplementResponse | null;
  loading: boolean;
  error: string | null;
};

// Auto-computes the best-fit FACTOR index (the style tilt the proposed book is
// missing) whenever the client or any weight changes, debounced 500ms. Mirrors
// useIdealComplement — same request lifecycle, different endpoint. Kept as its
// own hook so either row can fail without blanking the other.
export function useIdealFactorComplement(
  client: string | null,
  managers: PortfolioManager[],
): IdealFactorComplementState {
  const [state, setState] = useState<IdealFactorComplementState>({
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
      findIdealFactorComplement(client, managers)
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
