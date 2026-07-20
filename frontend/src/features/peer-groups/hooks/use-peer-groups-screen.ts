"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getPeerGroupSummary } from "../api/get-peer-groups-screen-data";
import type { PeerGroupsResponse, PeerStyle } from "../types";

export type PeerGroupRow = { id: string; label: string };
export type PeerGroupBlock = { group: string; rows: PeerGroupRow[] };

// 6 universe tabs × 3 sub-styles, mirroring the original index.html selector.
export const PEER_TAB_GROUPS: PeerGroupBlock[] = [
  { group: "EAFE", rows: [
    { id: "EAFE", label: "EAFE Growth" },
    { id: "EAFE", label: "EAFE Core" },
    { id: "EAFE", label: "EAFE Value" },
  ]},
  { group: "ISC", rows: [
    { id: "ISC", label: "ISC Growth" },
    { id: "ISC", label: "ISC Core" },
    { id: "ISC", label: "ISC Value" },
  ]},
  { group: "ACWI", rows: [
    { id: "ACWI", label: "ACWI Growth" },
    { id: "ACWI", label: "ACWI Core" },
    { id: "ACWI", label: "ACWI Value" },
  ]},
  { group: "EM", rows: [
    { id: "EM", label: "EM Growth" },
    { id: "EM", label: "EM Core" },
    { id: "EM", label: "EM Value" },
  ]},
  { group: "US", rows: [
    { id: "US", label: "US Growth" },
    { id: "US", label: "US Core" },
    { id: "US", label: "US Value" },
  ]},
  { group: "US SC", rows: [
    { id: "USSC", label: "US SC Growth" },
    { id: "USSC", label: "US SC Core" },
    { id: "USSC", label: "US SC Value" },
  ]},
  // Placeholder peer group: managers present in FactSet exposures/risk
  // files but missing clone data (< 3 years of returns). Single Core
  // entry per legacy UX — placeholder managers don't have a Growth /
  // Value distinction without clone betas.
  { group: "Placeholder", rows: [
    { id: "Placeholder", label: "Placeholder" },
  ]},
];

export const PEER_STYLES: PeerStyle[] = ["Growth", "Core", "Value"];

type Selection = { tab: string; style: PeerStyle };

type State = {
  data: PeerGroupsResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: State = { data: null, loading: false, error: null };

export function usePeerGroupsScreen() {
  const [selection, setSelection] = useState<Selection>({ tab: "EAFE", style: "Growth" });
  const [state, setState] = useState<State>(initialState);
  const cache = useRef<Map<string, PeerGroupsResponse>>(new Map());

  async function loadTab(tab: string) {
    const hit = cache.current.get(tab);
    if (hit) {
      setState({ data: hit, loading: false, error: null });
      return;
    }
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const fresh = await getPeerGroupSummary(tab);
      cache.current.set(tab, fresh);
      setState({ data: fresh, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the selected peer group.",
      });
    }
  }

  useEffect(() => {
    void loadTab(selection.tab);
  }, [selection.tab]);

  function select(tab: string, style: PeerStyle) {
    setSelection({ tab, style });
  }

  function reload() {
    cache.current.delete(selection.tab);
    void loadTab(selection.tab);
  }

  // Drop a tab's cached response so the next visit refetches (used after
  // persisting placeholder buckets server-side).
  function invalidate(tab: string) {
    cache.current.delete(tab);
  }

  const allManagers = useMemo(() => state.data?.managers ?? [], [state.data]);

  return {
    selection,
    select,
    reload,
    invalidate,
    loading: state.loading,
    error: state.error,
    data: state.data,
    allManagers,
  };
}
