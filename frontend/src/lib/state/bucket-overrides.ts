"use client";

// Shared style-bucket override store.
//
// The Peer Groups tab lets users edit a manager's style buckets ("what-if"
// analysis). Those edits must flow through to the Portfolio tab — manager
// table dots, /compute_portfolio_stats payloads, /market_cycle payloads —
// exactly like the reference single-file UI (clone_tool/static/index.html,
// styleBucketOverrides + effectiveBuckets/effectiveVG/effectiveVG3F).
//
// Implemented as a narrow module-level store (no provider needed) with a
// useSyncExternalStore hook for React consumers. Overrides are session-only
// and cleared when a clone run completes (see run-progress-overlay).

import { useSyncExternalStore } from "react";

export const STYLE_BUCKET_KEYS = [
  "Core",
  "Value",
  "Growth",
  "Yield",
  "Quality",
  "Dynamic",
  "Defensive",
  "Low Vol",
] as const;

export type StyleBucketKey = (typeof STYLE_BUCKET_KEYS)[number];

export type BucketOverride = Partial<Record<StyleBucketKey, number>>;
export type BucketOverrideMap = Record<string, BucketOverride>;

const overrideKey = (tab: string, name: string) => `${tab}|${name}`;

let overrides: BucketOverrideMap = {};
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getBucketOverrideMap(): BucketOverrideMap {
  return overrides;
}

export function getBucketOverride(tab: string, name: string): BucketOverride | undefined {
  return overrides[overrideKey(tab, name)];
}

// User edits one bucket cell. Empty/NaN input clears that one bucket
// override. Accepts either decimal (0.55) or percent (55) — if > 1.5,
// assume percent (mirrors the reference setStyleBucketOverride).
export function setBucketOverride(
  tab: string,
  name: string,
  bucket: StyleBucketKey,
  value: string,
) {
  const key = overrideKey(tab, name);
  const current = { ...(overrides[key] || {}) };
  const parsed = parseFloat(value);
  if (value === "" || Number.isNaN(parsed)) {
    delete current[bucket];
  } else {
    current[bucket] = parsed > 1.5 ? parsed / 100 : parsed;
  }
  const next = { ...overrides };
  if (Object.keys(current).length === 0) {
    delete next[key];
  } else {
    next[key] = current;
  }
  overrides = next;
  emit();
}

// "Make exclusive" — set ONE bucket to 100% and explicitly zero all others.
export function setBucketOverrideExclusive(tab: string, name: string, bucket: StyleBucketKey) {
  const exclusive: BucketOverride = {};
  STYLE_BUCKET_KEYS.forEach((k) => {
    exclusive[k] = k === bucket ? 1.0 : 0.0;
  });
  overrides = { ...overrides, [overrideKey(tab, name)]: exclusive };
  emit();
}

export function clearManagerBucketOverrides(tab: string, name: string) {
  const key = overrideKey(tab, name);
  if (!overrides[key]) {
    return;
  }
  const next = { ...overrides };
  delete next[key];
  overrides = next;
  emit();
}

export function clearAllBucketOverrides() {
  if (Object.keys(overrides).length === 0) {
    return;
  }
  overrides = {};
  emit();
}

// Subscribe a component to the override map. The map identity changes on
// every store update, so it can be used directly as an effect dependency.
export function useBucketOverrideMap(): BucketOverrideMap {
  return useSyncExternalStore(subscribe, getBucketOverrideMap, getBucketOverrideMap);
}

// ── Pure resolution helpers ────────────────────────────────────────────────

export type EffectiveBucketsResult = {
  buckets: Record<string, number>;
  overriddenKeys: Set<StyleBucketKey>;
  isOverridden: boolean;
};

export function mergeBucketOverride(
  computed: Record<string, number> | undefined,
  override: BucketOverride | undefined,
): EffectiveBucketsResult {
  const merged: Record<string, number> = { ...(computed || {}) };
  const overriddenKeys = new Set<StyleBucketKey>();
  if (override) {
    STYLE_BUCKET_KEYS.forEach((k) => {
      if (k in override) {
        merged[k] = override[k] as number;
        overriddenKeys.add(k);
      }
    });
  }
  return { buckets: merged, overriddenKeys, isOverridden: overriddenKeys.size > 0 };
}

// (Value + Yield) - Growth — same formula as market_cycle.py / index.html.
export function vgFromBuckets(buckets: Record<string, number>) {
  return (buckets.Value || 0) + (buckets.Yield || 0) - (buckets.Growth || 0);
}

type ManagerLike = {
  tab: string;
  matched_name: string;
  style_buckets?: Record<string, number>;
  vg_full?: number | null;
  vg_3factor?: number | null;
};

// Override-resolved style buckets for a portfolio manager. Reads the map
// passed in (from useBucketOverrideMap for reactive callers, or
// getBucketOverrideMap for imperative payload builders).
export function effectiveManagerBuckets(
  map: BucketOverrideMap,
  manager: ManagerLike,
): Record<string, number> {
  const override = map[overrideKey(manager.tab, manager.matched_name)];
  return mergeBucketOverride(manager.style_buckets, override).buckets;
}

// Only recompute V-G from buckets when an override is active — otherwise the
// server-computed value (which includes non-bucket factor contribution) wins.
export function effectiveManagerVG(map: BucketOverrideMap, manager: ManagerLike): number {
  const override = map[overrideKey(manager.tab, manager.matched_name)];
  const eff = mergeBucketOverride(manager.style_buckets, override);
  return eff.isOverridden ? vgFromBuckets(eff.buckets) : manager.vg_full || 0;
}

export function effectiveManagerVG3F(map: BucketOverrideMap, manager: ManagerLike): number {
  const override = map[overrideKey(manager.tab, manager.matched_name)];
  const eff = mergeBucketOverride(manager.style_buckets, override);
  return eff.isOverridden ? vgFromBuckets(eff.buckets) : manager.vg_3factor || 0;
}

export function isManagerOverridden(map: BucketOverrideMap, manager: ManagerLike): boolean {
  return Boolean(map[overrideKey(manager.tab, manager.matched_name)]);
}
