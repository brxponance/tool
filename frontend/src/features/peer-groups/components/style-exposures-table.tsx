"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { useBucketOverrides } from "../hooks/use-bucket-overrides";
import {
  decoratedManagers,
  fmtPctFromDecimal,
  type DecoratedManager,
} from "../lib/peer-helpers";
import { STYLE_BUCKET_KEYS, type PeerGroupManager, type StyleBucketKey } from "../types";

type Props = {
  managers: PeerGroupManager[];
  tab: string;
  displayLabel: string;
  overrides: ReturnType<typeof useBucketOverrides>;
};

type SortState = { col: string | null; dir: 1 | -1 };

const STRING_COLS = new Set(["name"]);

const BUCKET_SORT_KEY: Record<StyleBucketKey, string> = {
  Core: "_core",
  Value: "_value",
  Growth: "_growth",
  Yield: "_yield",
  Quality: "_quality",
  Dynamic: "_dynamic",
  Defensive: "_defensive",
  "Low Vol": "_lowvol",
};

export function StyleExposuresTable({ managers, tab, displayLabel, overrides }: Props) {
  const [sort, setSort] = useState<SortState>({ col: null, dir: 1 });

  const decorated = useMemo(() => {
    const rows = decoratedManagers(managers, tab, overrides.getFor).map((m) => {
      const sb = m._buckets || {};
      return {
        ...m,
        _core: sb.Core || 0,
        _value: sb.Value || 0,
        _growth: sb.Growth || 0,
        _yield: sb.Yield || 0,
        _quality: sb.Quality || 0,
        _dynamic: sb.Dynamic || 0,
        _defensive: sb.Defensive || 0,
        _lowvol: sb["Low Vol"] || 0,
        vg_full: m._effectiveVg,
      };
    });
    if (sort.col) {
      const c = sort.col;
      rows.sort((a, b) => {
        // @ts-expect-error dynamic key
        const av = a[c] ?? (STRING_COLS.has(c) ? "" : -Infinity);
        // @ts-expect-error dynamic key
        const bv = b[c] ?? (STRING_COLS.has(c) ? "" : -Infinity);
        if (STRING_COLS.has(c)) return sort.dir * String(av).localeCompare(String(bv));
        return sort.dir * ((bv as number) - (av as number));
      });
    }
    return rows;
  }, [managers, tab, overrides, sort]);

  const onSort = (col: string) => {
    setSort((prev) =>
      prev.col === col ? { col, dir: (prev.dir * -1) as 1 | -1 } : { col, dir: 1 },
    );
  };

  const sortClass = (col: string) =>
    cn("sortable", sort.col === col && (sort.dir === 1 ? "sort-desc" : "sort-asc"));

  const overrideCount = decorated.filter((m) => m._overridden).length;

  return (
    <div className="panel mb-16">
      <div className="panel-header">
        <span className="panel-title">{displayLabel} — Style Exposures</span>
        <span
          style={{
            marginLeft: 8,
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text3)",
          }}
        >
          Click column header to sort · Edit a cell directly, or hover to show{" "}
          <span className="mono" style={{ color: "var(--accent)" }}>
            →100
          </span>{" "}
          to isolate one bucket
        </span>
        {overrideCount > 0 && (
          <button
            className="btn btn-outline btn-sm"
            style={{ marginLeft: 8 }}
            onClick={() => {
              if (confirm("Reset all style bucket overrides for every manager?")) {
                overrides.clearAll();
              }
            }}
          >
            Reset overrides ({overrideCount})
          </button>
        )}
      </div>
      <div className="panel-body" style={{ padding: 0, overflowX: "auto" }}>
        <table className="data-table w-full">
          <thead>
            <tr>
              <th
                className={sortClass("name")}
                onClick={() => onSort("name")}
                style={{ textAlign: "left" }}
              >
                Manager
              </th>
              <th className={sortClass("r2_full")} onClick={() => onSort("r2_full")}>
                R² Full
              </th>
              <th className={sortClass("vg_full")} onClick={() => onSort("vg_full")}>
                V-G Full
              </th>
              {STYLE_BUCKET_KEYS.map((b) => (
                <th
                  key={b}
                  className={sortClass(BUCKET_SORT_KEY[b])}
                  onClick={() => onSort(BUCKET_SORT_KEY[b])}
                >
                  {b}
                </th>
              ))}
              <th style={{ minWidth: 52 }}>Sum</th>
              <th className={sortClass("pct_small")} onClick={() => onSort("pct_small")}>
                % Small
              </th>
              <th className={sortClass("pct_em")} onClick={() => onSort("pct_em")}>
                % EM
              </th>
            </tr>
          </thead>
          <tbody>
            {decorated.map((m) => (
              <Row
                key={m.name}
                m={m}
                tab={tab}
                onEdit={(b, v) => overrides.setOne(tab, m.name, b, v)}
                onExclusive={(b) => overrides.setExclusive(tab, m.name, b)}
                onClearMgr={() => overrides.clearOne(tab, m.name)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type RowProps = {
  m: DecoratedManager & {
    _core: number;
    _value: number;
    _growth: number;
    _yield: number;
    _quality: number;
    _dynamic: number;
    _defensive: number;
    _lowvol: number;
  };
  tab: string;
  onEdit: (bucket: StyleBucketKey, value: string) => void;
  onExclusive: (bucket: StyleBucketKey) => void;
  onClearMgr: () => void;
};

function Row({ m, tab, onEdit, onExclusive, onClearMgr }: RowProps) {
  const sumOff = Math.abs(m._bucketSum - 1.0) > 0.02;
  const vg = m._effectiveVg;
  const vgClass = vg > 0.05 ? "val-pos" : vg < -0.05 ? "val-neg" : "val-neu";

  const detailHref = `/manager-detail?tab=${encodeURIComponent(tab)}&manager=${encodeURIComponent(m.name)}`;

  const bucketCells: { key: StyleBucketKey; value: number }[] = [
    { key: "Core", value: m._core },
    { key: "Value", value: m._value },
    { key: "Growth", value: m._growth },
    { key: "Yield", value: m._yield },
    { key: "Quality", value: m._quality },
    { key: "Dynamic", value: m._dynamic },
    { key: "Defensive", value: m._defensive },
    { key: "Low Vol", value: m._lowvol },
  ];

  return (
    <tr>
      <td style={{ fontWeight: 500 }}>
        {m._overridden && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onClearMgr();
            }}
            title="Click to reset this manager's overrides"
            style={{ color: "var(--amber)", marginRight: 4, cursor: "pointer" }}
          >
            ●
          </span>
        )}
        <Link href={detailHref} style={{ color: "var(--accent)" }}>
          {m.name}
        </Link>
      </td>
      <td className="mono">
        {m.r2_full != null ? `${(m.r2_full * 100).toFixed(1)}%` : "--"}
      </td>
      <td className={cn("mono", vgClass)}>{fmtPctFromDecimal(vg)}</td>
      {bucketCells.map((c) => (
        <BucketCell
          key={c.key}
          bucketKey={c.key}
          value={c.value}
          overridden={m._overriddenKeys.has(c.key)}
          onChange={(v) => onEdit(c.key, v)}
          onExclusive={() => onExclusive(c.key)}
        />
      ))}
      <td
        className="mono"
        style={{
          color: sumOff ? "var(--amber)" : "var(--text3)",
          fontWeight: sumOff ? 500 : 400,
        }}
        title={sumOff ? "Sum deviates from 100%" : undefined}
      >
        {(m._bucketSum * 100).toFixed(1)}%
      </td>
      <td className="mono">{fmtPctFromDecimal(m.pct_small)}</td>
      <td className="mono">{fmtPctFromDecimal(m.pct_em)}</td>
    </tr>
  );
}

type BucketCellProps = {
  bucketKey: StyleBucketKey;
  value: number;
  overridden: boolean;
  onChange: (value: string) => void;
  onExclusive: () => void;
};

function BucketCell({ bucketKey, value, overridden, onChange, onExclusive }: BucketCellProps) {
  const displayValue = ((value || 0) * 100).toFixed(1);
  const [draft, setDraft] = useState(displayValue);
  const [focused, setFocused] = useState(false);
  // React's documented "derived state from props" pattern: re-sync when the
  // upstream value changes (e.g. external override clear) while the cell is
  // not being actively edited.
  const [lastValue, setLastValue] = useState(displayValue);
  if (lastValue !== displayValue) {
    setLastValue(displayValue);
    if (!focused) setDraft(displayValue);
  }
  return (
    <td className={overridden ? "mono bucket-override" : "mono bucket-edit"}>
      <div className="bucket-cell-wrap">
        <input
          type="text"
          value={draft}
          className="bucket-input"
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          title="Edit to override; clear to revert"
        />
        <button
          type="button"
          className="bucket-100-btn"
          onClick={onExclusive}
          title={`Set ${bucketKey} to 100% and zero all other buckets for this manager`}
        >
          →100
        </button>
      </div>
    </td>
  );
}
