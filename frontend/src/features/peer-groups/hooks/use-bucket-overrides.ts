"use client";

import { useCallback, useState } from "react";

import { STYLE_BUCKET_KEYS, type StyleBucketKey } from "../types";

export type BucketOverrideMap = Record<string, Partial<Record<StyleBucketKey, number>>>;

const overrideKey = (tab: string, name: string) => `${tab}|${name}`;

export function useBucketOverrides() {
  const [overrides, setOverrides] = useState<BucketOverrideMap>({});

  const setOne = useCallback((tab: string, name: string, bucket: StyleBucketKey, value: string) => {
    const k = overrideKey(tab, name);
    setOverrides((prev) => {
      const next = { ...prev };
      const cur = { ...(next[k] || {}) };
      const parsed = parseFloat(value);
      if (value === "" || Number.isNaN(parsed)) {
        delete cur[bucket];
      } else {
        // accept either decimal (0.55) or percent (55)
        cur[bucket] = parsed > 1.5 ? parsed / 100 : parsed;
      }
      if (Object.keys(cur).length === 0) delete next[k];
      else next[k] = cur;
      return next;
    });
  }, []);

  const setExclusive = useCallback((tab: string, name: string, bucket: StyleBucketKey) => {
    const k = overrideKey(tab, name);
    const ov: Partial<Record<StyleBucketKey, number>> = {};
    STYLE_BUCKET_KEYS.forEach((b) => {
      ov[b] = b === bucket ? 1.0 : 0.0;
    });
    setOverrides((prev) => ({ ...prev, [k]: ov }));
  }, []);

  const clearOne = useCallback((tab: string, name: string) => {
    const k = overrideKey(tab, name);
    setOverrides((prev) => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setOverrides({});
  }, []);

  const getFor = useCallback(
    (tab: string, name: string) => overrides[overrideKey(tab, name)],
    [overrides],
  );

  return { overrides, setOne, setExclusive, clearOne, clearAll, getFor };
}
