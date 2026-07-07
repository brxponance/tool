"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getPortfolio, getPortfolioClients } from "@/features/portfolio/api/get-portfolio-screen-data";
import type { PortfolioManager } from "@/features/portfolio/types";

import {
  getHoldingsOverlap,
  getHoldingsOverlapDetail,
} from "../api/get-overlap-data";
import type {
  HoldingsOverlapDetailResponse,
  HoldingsOverlapResponse,
  MatchBasis,
  OverlapManagerInput,
  WeightState,
} from "../types";

function toInputs(managers: PortfolioManager[]): OverlapManagerInput[] {
  return managers.map((m) => ({
    matched_name: m.matched_name,
    weight_file_name: m.weight_file_name,
    current_weight: m.current_weight ?? 0,
    proposed_weight: m.proposed_weight ?? 0,
  }));
}

type DetailState = {
  key: string | null; // `${i}:${j}` of the open pair
  data: HoldingsOverlapDetailResponse | null;
  loading: boolean;
  error: string | null;
};

export function useOverlapScreen() {
  const [clients, setClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [managers, setManagers] = useState<PortfolioManager[]>([]);
  const [weightState, setWeightState] = useState<WeightState>("current");
  const [matchBasis, setMatchBasis] = useState<MatchBasis>("sedol");

  const [matrix, setMatrix] = useState<HoldingsOverlapResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [detail, setDetail] = useState<DetailState>({
    key: null,
    data: null,
    loading: false,
    error: null,
  });

  const requestRef = useRef(0);

  // Load client list on mount.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await getPortfolioClients();
        if (cancelled) return;
        setClients(res.clients);
        if (res.clients.length && !selectedClient) {
          setSelectedClient(res.clients[0]);
        }
      } catch {
        // Client list is optional here — the picker just stays empty.
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = useCallback(
    async (client: string, state: WeightState, basis: MatchBasis) => {
      const ticket = ++requestRef.current;
      setLoading(true);
      setError(null);
      setDetail({ key: null, data: null, loading: false, error: null });
      try {
        const portfolio = await getPortfolio(client);
        if (ticket !== requestRef.current) return;
        const mgrs = portfolio.managers ?? [];
        setManagers(mgrs);
        const res = await getHoldingsOverlap(client, toInputs(mgrs), state, basis);
        if (ticket !== requestRef.current) return;
        setMatrix(res);
        setError(res.error ?? null);
      } catch (err) {
        if (ticket !== requestRef.current) return;
        setMatrix(null);
        setError(err instanceof Error ? err.message : "Could not compute holdings overlap.");
      } finally {
        if (ticket === requestRef.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  // Recompute whenever client / weight-state / match-basis changes.
  useEffect(() => {
    if (selectedClient) {
      void run(selectedClient, weightState, matchBasis);
    }
  }, [selectedClient, weightState, matchBasis, run]);

  const openDetail = useCallback(
    async (i: number, j: number, nameI: string, nameJ: string) => {
      if (!selectedClient) return;
      const key = `${i}:${j}`;
      // Toggle closed if the same pair is clicked again.
      if (detail.key === key) {
        setDetail({ key: null, data: null, loading: false, error: null });
        return;
      }
      setDetail({ key, data: null, loading: true, error: null });
      try {
        const res = await getHoldingsOverlapDetail(
          selectedClient,
          toInputs(managers),
          nameI,
          nameJ,
          weightState,
          matchBasis,
        );
        setDetail({ key, data: res, loading: false, error: res.error ?? null });
      } catch (err) {
        setDetail({
          key,
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : "Could not load pair detail.",
        });
      }
    },
    [selectedClient, managers, weightState, matchBasis, detail.key],
  );

  return {
    clients,
    selectedClient,
    setSelectedClient,
    weightState,
    setWeightState,
    matchBasis,
    setMatchBasis,
    matrix,
    loading,
    error,
    detail,
    openDetail,
  };
}
