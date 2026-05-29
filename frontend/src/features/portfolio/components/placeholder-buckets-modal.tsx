"use client";

import { useEffect, useMemo, useState } from "react";

import { updatePlaceholderBuckets } from "../api/get-portfolio-screen-data";
import type { PortfolioManager } from "../types";

type Props = {
  manager: PortfolioManager | null;
  onClose: () => void;
  onSaved: () => void;
};

const BUCKET_KEYS = [
  "Core",
  "Value",
  "Growth",
  "Yield",
  "Quality",
  "Dynamic",
  "Defensive",
  "Low Vol",
  "Small Cap",
] as const;
type BucketKey = (typeof BUCKET_KEYS)[number];

function bucketsToPctStrings(buckets: Record<string, number>): Record<BucketKey, string> {
  const out = {} as Record<BucketKey, string>;
  for (const key of BUCKET_KEYS) {
    const v = buckets[key];
    out[key] = v != null ? (v * 100).toFixed(1) : "0";
  }
  return out;
}

export function PlaceholderBucketsModal({ manager, onClose, onSaved }: Props) {
  const initial = useMemo(
    () =>
      manager ? bucketsToPctStrings(manager.style_buckets) : ({} as Record<BucketKey, string>),
    [manager],
  );
  const [drafts, setDrafts] = useState<Record<BucketKey, string>>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(initial);
    setError(null);
  }, [initial]);

  if (!manager) {
    return null;
  }

  const total = BUCKET_KEYS.reduce((acc, key) => {
    const n = Number.parseFloat(drafts[key] ?? "0");
    return acc + (Number.isFinite(n) ? n : 0);
  }, 0);

  async function handleSave() {
    if (!manager) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const buckets: Record<string, number> = {};
      for (const key of BUCKET_KEYS) {
        const n = Number.parseFloat(drafts[key] ?? "0");
        if (Number.isFinite(n) && n > 0) {
          buckets[key] = n / 100;
        }
      }
      const target = manager.weight_file_name ?? manager.matched_name;
      await updatePlaceholderBuckets(target, buckets);
      onSaved();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save placeholder buckets.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!manager) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const target = manager.weight_file_name ?? manager.matched_name;
      await updatePlaceholderBuckets(target, null);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset placeholder.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="dialog"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 520,
          maxWidth: "90vw",
          background: "var(--surface1)",
          border: "1px solid var(--border)",
          padding: 20,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text3)",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Edit placeholder buckets
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 14,
            color: "var(--text1)",
            marginTop: 4,
            marginBottom: 12,
          }}
        >
          {manager.weight_file_name ?? manager.matched_name}
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text3)",
            marginBottom: 12,
          }}
        >
          This manager has no clone data yet. Weights are normalised to sum to 100%
          server-side and override the default Core=100%.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {BUCKET_KEYS.map((key) => (
            <label
              key={key}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--text2)",
              }}
            >
              {key} (%)
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={drafts[key]}
                onChange={(e) =>
                  setDrafts((curr) => ({ ...curr, [key]: e.target.value }))
                }
                style={{
                  padding: "4px 6px",
                  background: "var(--bg1)",
                  border: "1px solid var(--border)",
                  color: "var(--text1)",
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                }}
                disabled={saving}
              />
            </label>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 14,
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: total === 0 || Math.abs(total - 100) < 0.5 ? "var(--text3)" : "var(--yellow)",
          }}
        >
          Sum: {total.toFixed(1)}%
          {total > 0 && Math.abs(total - 100) >= 0.5 && (
            <span>(will be normalised to 100% on save)</span>
          )}
        </div>

        {error && (
          <div
            style={{
              marginTop: 10,
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--red)",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 16,
          }}
        >
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => void handleReset()}
            disabled={saving}
          >
            Reset to Core=100%
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => void handleSave()}
            disabled={saving || total <= 0}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
