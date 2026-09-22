"use client";

import { useEffect, useState } from "react";

import { getPeerGroupSummary } from "@/features/peer-groups/api/get-peer-groups-screen-data";
import { PEER_TAB_GROUPS, PEER_STYLES } from "@/features/peer-groups/hooks/use-peer-groups-screen";
import { filterByStyle } from "@/features/peer-groups/lib/peer-helpers";
import type { PeerGroupsResponse } from "@/features/peer-groups/types";
import {
  getPortfolio,
  getPortfolioClients,
} from "@/features/portfolio/api/get-portfolio-screen-data";

// Peer Group report data: every peer group the Peer Groups tab offers (six
// universes × Growth / Core / Value, plus Placeholder), each listing its
// managers sorted by Normalized Skill Z, with the total dollars the tool
// currently has invested in that strategy across all client portfolios.
//
// "Total AUM with the strategy" = Σ over clients of (current weight × client
// total AUM), i.e. the sum of each /portfolio row's aum_current. Clients
// whose weights workbook doesn't carry a total AUM contribute nothing and
// are listed in `clientsWithoutAum` so the report can flag the gap.

export type PeerGroupReportRow = {
  name: string;
  tab: string;
  ns_z: number | null;
  aum: number | null; // dollars; null when no client holds it
  n_clients: number; // clients holding it at a positive current weight
};

export type PeerGroupReportGroup = {
  key: string; // "EAFE|Growth"
  label: string; // "EAFE Growth"
  rows: PeerGroupReportRow[];
};

export type PeerGroupReportState = {
  groups: PeerGroupReportGroup[];
  clientsWithoutAum: string[];
  loading: boolean;
  error: string | null;
};

// Sort by skill, best first; managers without a score go to the bottom, alphabetically.
function bySkillDesc(a: PeerGroupReportRow, b: PeerGroupReportRow) {
  if (a.ns_z == null && b.ns_z == null) return a.name.localeCompare(b.name);
  if (a.ns_z == null) return 1;
  if (b.ns_z == null) return -1;
  return b.ns_z - a.ns_z;
}

export function usePeerGroupReport(enabled: boolean): PeerGroupReportState {
  const [state, setState] = useState<PeerGroupReportState>({
    groups: [],
    clientsWithoutAum: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    (async () => {
      // 1. Every peer tab's skill summary, in parallel.
      const tabIds = [...new Set(PEER_TAB_GROUPS.map((g) => g.rows[0].id))];
      const summaries = await Promise.all(
        tabIds.map(async (t) => [t, await getPeerGroupSummary(t)] as const),
      );
      const byTab: Record<string, PeerGroupsResponse> = Object.fromEntries(summaries);

      // 2. Every client's portfolio, in parallel → AUM per (tab, manager).
      const { clients } = await getPortfolioClients();
      const portfolios = await Promise.all(
        clients.map((c) => getPortfolio(c).catch(() => null)),
      );
      const aumByKey = new Map<string, { aum: number; clients: Set<string> }>();
      const clientsWithoutAum: string[] = [];
      portfolios.forEach((p, i) => {
        if (!p) return;
        if (p.client_aum == null) clientsWithoutAum.push(clients[i]);
        for (const m of p.managers) {
          if (!(m.current_weight > 0)) continue;
          const key = `${m.tab}|${m.matched_name}`;
          const cur = aumByKey.get(key) ?? { aum: 0, clients: new Set<string>() };
          cur.clients.add(clients[i]);
          if (m.aum_current != null) cur.aum += m.aum_current;
          aumByKey.set(key, cur);
        }
      });

      // 3. One group per Peer Groups tab button, in the tab's order.
      const groups: PeerGroupReportGroup[] = [];
      for (const block of PEER_TAB_GROUPS) {
        const tab = block.rows[0].id;
        const managers = byTab[tab]?.managers ?? [];
        const styles = tab === "Placeholder" ? ["Core" as const] : PEER_STYLES;
        for (const style of styles) {
          const label =
            tab === "Placeholder" ? "Placeholder" : `${block.group} ${style}`;
          const rows = filterByStyle(managers, style, tab)
            .map((m) => {
              const hit = aumByKey.get(`${tab}|${m.name}`);
              return {
                name: m.name,
                tab,
                ns_z: m.ns_z ?? null,
                aum: hit && hit.aum > 0 ? hit.aum : null,
                n_clients: hit?.clients.size ?? 0,
              };
            })
            .sort(bySkillDesc);
          groups.push({ key: `${tab}|${style}`, label, rows });
        }
      }

      if (!cancelled) {
        setState({ groups, clientsWithoutAum, loading: false, error: null });
      }
    })().catch((err: unknown) => {
      if (cancelled) return;
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Could not load the peer group report.",
      }));
    });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return state;
}
