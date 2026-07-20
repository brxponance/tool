"use client";

import { useCallback } from "react";

import {
  clearAllBucketOverrides,
  clearManagerBucketOverrides,
  setBucketOverride,
  setBucketOverrideExclusive,
  useBucketOverrideMap,
  type BucketOverrideMap,
  type StyleBucketKey,
} from "@/lib/state/bucket-overrides";

export type { BucketOverrideMap };

const overrideKey = (tab: string, name: string) => `${tab}|${name}`;

// Thin feature-facing wrapper around the shared bucket-override store
// (lib/state/bucket-overrides). The store is module-level so edits made on
// the Peer Groups tab flow through to the Portfolio tab in the same session.
export function useBucketOverrides() {
  const overrides = useBucketOverrideMap();

  const setOne = useCallback(
    (tab: string, name: string, bucket: StyleBucketKey, value: string) => {
      setBucketOverride(tab, name, bucket, value);
    },
    [],
  );

  const setExclusive = useCallback((tab: string, name: string, bucket: StyleBucketKey) => {
    setBucketOverrideExclusive(tab, name, bucket);
  }, []);

  const clearOne = useCallback((tab: string, name: string) => {
    clearManagerBucketOverrides(tab, name);
  }, []);

  const clearAll = useCallback(() => {
    clearAllBucketOverrides();
  }, []);

  const getFor = useCallback(
    (tab: string, name: string) => overrides[overrideKey(tab, name)],
    [overrides],
  );

  return { overrides, setOne, setExclusive, clearOne, clearAll, getFor };
}
