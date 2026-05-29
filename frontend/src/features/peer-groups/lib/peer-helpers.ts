import { STYLE_BUCKET_KEYS, type PeerGroupManager, type StyleBucketKey } from "../types";

export type EffectiveBuckets = {
  buckets: Record<string, number>;
  overriddenKeys: Set<StyleBucketKey>;
  isOverridden: boolean;
};

export function effectiveBuckets(
  computed: Record<string, number> | undefined,
  override: Partial<Record<StyleBucketKey, number>> | undefined,
): EffectiveBuckets {
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

// (Value + Yield) - Growth — same formula as the original market_cycle.py / index.html.
export function vgFromBuckets(buckets: Record<string, number>) {
  return (buckets.Value || 0) + (buckets.Yield || 0) - (buckets.Growth || 0);
}

export function bucketSum(buckets: Record<string, number>) {
  return STYLE_BUCKET_KEYS.reduce((s, k) => s + (buckets[k] || 0), 0);
}

export function decoratedManagers(
  managers: PeerGroupManager[],
  tab: string,
  getOverride: (
    tab: string,
    name: string,
  ) => Partial<Record<StyleBucketKey, number>> | undefined,
) {
  return managers.map((m) => {
    const ov = getOverride(tab, m.name);
    const eff = effectiveBuckets(m.style_buckets, ov);
    const vg = eff.isOverridden ? vgFromBuckets(eff.buckets) : m.vg_full || 0;
    return {
      ...m,
      _buckets: eff.buckets,
      _overriddenKeys: eff.overriddenKeys,
      _overridden: eff.isOverridden,
      _effectiveVg: vg,
      _bucketSum: bucketSum(eff.buckets),
    };
  });
}

export type DecoratedManager = ReturnType<typeof decoratedManagers>[number];

// Filter managers by style using ORIGINAL vg_full (not user-edited) so a row
// stays in the same peer style after edits — matches original index.html behavior.
export function filterByStyle(
  managers: PeerGroupManager[],
  style: "Growth" | "Core" | "Value",
  tab?: string,
) {
  // Placeholder peer tab has no Growth/Core/Value split — show all
  // managers regardless of the selected style (legacy behaviour).
  if (tab === "Placeholder") return managers;
  return managers.filter((m) => {
    const vg = m.vg_full || 0;
    if (style === "Value") return vg > 0.25;
    if (style === "Growth") return vg < -0.25;
    return vg >= -0.25 && vg <= 0.25;
  });
}

export function fmtPctFromDecimal(value: number | null | undefined, digits = 1) {
  if (value == null || Number.isNaN(value)) return "--";
  return `${(value * 100).toFixed(digits)}%`;
}

export function fmtSignedNumber(value: number | null | undefined, digits = 2) {
  if (value == null || Number.isNaN(value)) return "--";
  return (value >= 0 ? "+" : "") + value.toFixed(digits);
}
