"use client";

import { useMemo } from "react";

import { getBucketOverride, STYLE_BUCKET_KEYS } from "@/lib/state/bucket-overrides";
import { cn } from "@/lib/utils";

import { updatePlaceholderBuckets } from "@/features/portfolio/api/get-portfolio-screen-data";

import { SkillTable } from "../components/skill-table";
import { StyleExposuresTable } from "../components/style-exposures-table";
import { useBucketOverrides } from "../hooks/use-bucket-overrides";
import {
  PEER_STYLES,
  PEER_TAB_GROUPS,
  usePeerGroupsScreen,
} from "../hooks/use-peer-groups-screen";

export function PeerGroupsRoute() {
  const {
    selections,
    toggle,
    isSelected,
    reload,
    invalidate,
    loading,
    error,
    allManagers,
  } = usePeerGroupsScreen();
  const overrides = useBucketOverrides();

  // Persist Placeholder edits so they survive a refresh / backend restart —
  // mirrors savePlaceholderBuckets in the reference UI. Other peer-group
  // overrides remain session-only ("what-if" analysis on cloned managers).
  const tableOverrides = useMemo(() => {
    const persistPlaceholderBuckets = (name: string) => {
      // Merge server-truth buckets with the live overrides (the store is
      // synchronous, so reading right after setOne sees the new state).
      const manager = allManagers.find((m) => m.name === name);
      const merged: Record<string, number> = { ...(manager?.style_buckets ?? {}) };
      const override = getBucketOverride("Placeholder", name) ?? {};
      STYLE_BUCKET_KEYS.forEach((key) => {
        if (key in override) {
          merged[key] = override[key] as number;
        }
      });
      // Drop zero/empty entries to keep the persisted state clean.
      const clean: Record<string, number> = {};
      Object.keys(merged).forEach((key) => {
        if ((merged[key] || 0) > 0.0005) {
          clean[key] = merged[key];
        }
      });
      void updatePlaceholderBuckets(name, clean)
        .then(() => invalidate("Placeholder"))
        .catch((persistError: unknown) => {
          console.error("Failed to persist placeholder buckets:", persistError);
        });
    };

    return {
      ...overrides,
      setOne: (tab: string, name: string, bucket: (typeof STYLE_BUCKET_KEYS)[number], value: string) => {
        overrides.setOne(tab, name, bucket, value);
        if (tab === "Placeholder") {
          persistPlaceholderBuckets(name);
        }
      },
      setExclusive: (tab: string, name: string, bucket: (typeof STYLE_BUCKET_KEYS)[number]) => {
        overrides.setExclusive(tab, name, bucket);
        if (tab === "Placeholder") {
          persistPlaceholderBuckets(name);
        }
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides, allManagers]);

  const displayLabel = selections
    .map((s) =>
      s.tab === "Placeholder"
        ? "Placeholder managers (no clone)"
        : `${s.tab === "USSC" ? "US SC" : s.tab} ${s.style}`,
    )
    .join(" + ");

  // The tables receive rows tagged with their own tab (_tab); the tab prop
  // is only the fallback for untagged rows.
  const fallbackTab = selections[0]?.tab ?? "EAFE";

  return (
    <div>
      <div className="peer-selector">
        {PEER_TAB_GROUPS.map((block) => (
          <div key={block.group} className="peer-selector-row">
            <span className="peer-selector-label">{block.group}</span>
            {block.rows.map((row, idx) => {
              const style = PEER_STYLES[idx];
              const active = isSelected(row.id, style);
              return (
                <button
                  key={row.label}
                  type="button"
                  className={cn("peer-btn", active && "active")}
                  onClick={() => toggle(row.id, style)}
                  title="Click to add/remove this peer group from the view"
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
          <span>
            {selections.length > 1
              ? `${selections.length} peer groups selected — click a highlighted button to remove it`
              : "Click additional peer groups to view them together"}
          </span>
          {loading && <span>Loading…</span>}
          {error && <span style={{ color: "var(--red)" }}>{error}</span>}
        </div>
      </div>

      {allManagers.length === 0 ? (
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
            managers={allManagers}
            tab={fallbackTab}
            displayLabel={displayLabel}
            overrides={tableOverrides}
          />
          <SkillTable managers={allManagers} tab={fallbackTab} />
        </>
      )}
    </div>
  );
}
