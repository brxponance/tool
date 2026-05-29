"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

import { SkillTable } from "../components/skill-table";
import { StyleExposuresTable } from "../components/style-exposures-table";
import { useBucketOverrides } from "../hooks/use-bucket-overrides";
import {
  PEER_STYLES,
  PEER_TAB_GROUPS,
  usePeerGroupsScreen,
} from "../hooks/use-peer-groups-screen";
import { filterByStyle } from "../lib/peer-helpers";

export function PeerGroupsRoute() {
  const { selection, select, reload, loading, error, allManagers } = usePeerGroupsScreen();
  const overrides = useBucketOverrides();

  const filtered = useMemo(
    () => filterByStyle(allManagers, selection.style, selection.tab),
    [allManagers, selection.style, selection.tab],
  );

  const displayLabel =
    selection.tab === "Placeholder"
      ? "Placeholder managers (no clone)"
      : `${selection.tab === "USSC" ? "US SC" : selection.tab} — ${selection.style}`;

  return (
    <div>
      <div className="peer-selector">
        {PEER_TAB_GROUPS.map((block) => (
          <div key={block.group} className="peer-selector-row">
            <span className="peer-selector-label">{block.group}</span>
            {block.rows.map((row, idx) => {
              const style = PEER_STYLES[idx];
              const active = selection.tab === row.id && selection.style === style;
              return (
                <button
                  key={row.label}
                  type="button"
                  className={cn("peer-btn", active && "active")}
                  onClick={() => select(row.id, style)}
                >
                  {row.label}
                </button>
              );
            })}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 4,
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text3)",
          }}
        >
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => void reload()}
          >
            Reload
          </button>
          {loading && <span>Loading {selection.tab}…</span>}
          {error && <span style={{ color: "var(--red)" }}>{error}</span>}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            color: "var(--text3)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          {loading ? "Loading…" : "No managers match this peer × style. Run the cloning engine first."}
        </div>
      ) : (
        <>
          <StyleExposuresTable
            managers={filtered}
            tab={selection.tab}
            displayLabel={displayLabel}
            overrides={overrides}
          />
          <SkillTable managers={filtered} tab={selection.tab} />
        </>
      )}
    </div>
  );
}
