"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getPeerGroupSummary } from "../api/get-peer-groups-screen-data";
import type { PeerGroupManager, PeerGroupsResponse, PeerStyle } from "../types";
import { filterByStyle } from "../lib/peer-helpers";

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

export type Selection = { tab: string; style: PeerStyle };

const selKey = (s: Selection) => `${s.tab}|${s.style}`;

export function usePeerGroupsScreen() {
  // Multiple peer groups can be viewed at once (e.g. EAFE Growth + EAFE
  // Core). Buttons toggle selections; the tables show the union.
  const [selections, setSelections] = useState<Selection[]>([
    { tab: "EAFE", style: "Growth" },
  ]);
  const [dataByTab, setDataByTab] = useState<Record<string, PeerGroupsResponse>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<Map<string, PeerGroupsResponse>>(new Map());

  async function loadTabs(tabs: string[]) {
    const missing = tabs.filter((t) => !cache.current.has(t));
    // Sync anything already cached into state first.
    setDataByTab((prev) => {
      const next = { ...prev };
      tabs.forEach((t) => {
        const hit = cache.current.get(t);
        if (hit) next[t] = hit;
      });
      return next;
    });
    if (!missing.length) return;
    setLoading(true);
    setError(null);
    try {
      const fetched = await Promise.all(
        missing.map(async (t) => [t, await getPeerGroupSummary(t)] as const),
      );
      fetched.forEach(([t, resp]) => cache.current.set(t, resp));
      setDataByTab((prev) => {
        const next = { ...prev };
        fetched.forEach(([t, resp]) => {
          next[t] = resp;
        });
        return next;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load the selected peer group.",
      );
    } finally {
      setLoading(false);
    }
  }

  const tabsKey = [...new Set(selections.map((s) => s.tab))].sort().join(",");
  useEffect(() => {
    void loadTabs(tabsKey ? tabsKey.split(",") : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabsKey]);

  // Toggle a peer group in/out of the selection; the last one stays put.
  function toggle(tab: string, style: PeerStyle) {
    setSelections((prev) => {
      const key = selKey({ tab, style });
      const exists = prev.some((s) => selKey(s) === key);
      if (exists) {
        return prev.length > 1 ? prev.filter((s) => selKey(s) !== key) : prev;
      }
      return [...prev, { tab, style }];
    });
  }

  function isSelected(tab: string, style: PeerStyle) {
    return selections.some((s) => s.tab === tab && s.style === style);
  }

  function reload() {
    const tabs = [...new Set(selections.map((s) => s.tab))];
    tabs.forEach((t) => cache.current.delete(t));
    void loadTabs(tabs);
  }

  // Drop a tab's cached response so the next visit refetches (used after
  // persisting placeholder buckets server-side).
  function invalidate(tab: string) {
    cache.current.delete(tab);
    void loadTabs([...new Set(selections.map((s) => s.tab))]);
  }

  // Union of every selected peer group, each row tagged with its own tab so
  // edits and detail links stay tab-correct in a mixed table. Deduped by
  // tab+name (a manager sits in exactly one style bucket per tab).
  const allManagers = useMemo(() => {
    const seen = new Set<string>();
    const out: PeerGroupManager[] = [];
    selections.forEach((sel) => {
      const managers = dataByTab[sel.tab]?.managers ?? [];
      filterByStyle(managers, sel.style, sel.tab).forEach((m) => {
        const key = `${sel.tab}|${m.name}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ ...m, _tab: sel.tab });
      });
    });
    return out;
  }, [selections, dataByTab]);

  return {
    selections,
    toggle,
    isSelected,
    reload,
    invalidate,
    loading,
    error,
    allManagers,
  };
}
