"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { fmtPctFromDecimal, fmtSignedNumber } from "../lib/peer-helpers";
import type { PeerGroupManager } from "../types";

type Props = {
  managers: PeerGroupManager[];
  tab: string;
};

type SortState = { col: string | null; dir: 1 | -1 };

const STRING_COLS = new Set(["name"]);

const skillColor = (v: number | null | undefined) =>
  v == null ? "" : v > 0 ? "skill-pos" : "skill-neg";

export function SkillTable({ managers, tab }: Props) {
  const [sort, setSort] = useState<SortState>({ col: null, dir: 1 });

  const rows = useMemo(() => {
    const list = managers.slice();
    if (sort.col) {
      const c = sort.col;
      list.sort((a, b) => {
        // @ts-expect-error dynamic key
        const av = a[c] ?? (STRING_COLS.has(c) ? "" : -Infinity);
        // @ts-expect-error dynamic key
        const bv = b[c] ?? (STRING_COLS.has(c) ? "" : -Infinity);
        if (STRING_COLS.has(c)) return sort.dir * String(av).localeCompare(String(bv));
        return sort.dir * ((bv as number) - (av as number));
      });
    }
    return list;
  }, [managers, sort]);

  const onSort = (col: string) =>
    setSort((p) => (p.col === col ? { col, dir: (p.dir * -1) as 1 | -1 } : { col, dir: 1 }));

  const sortClass = (col: string) =>
    cn("sortable", sort.col === col && (sort.dir === 1 ? "sort-desc" : "sort-asc"));

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Manager Skill vs Static Clone</span>
        <span
          style={{
            marginLeft: 8,
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text3)",
          }}
        >
          Click column header to sort
        </span>
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
              <th className={sortClass("t1_skill")} onClick={() => onSort("t1_skill")}>
                Trailing 1yr Skill
              </th>
              <th className={sortClass("t3_skill")} onClick={() => onSort("t3_skill")}>
                Trailing 3yr Skill
              </th>
              <th className={sortClass("t5_skill")} onClick={() => onSort("t5_skill")}>
                Trailing 5yr Skill
              </th>
              <th className={sortClass("si_skill")} onClick={() => onSort("si_skill")}>
                Since Inception Skill
              </th>
              <th
                className={sortClass("ns_z")}
                onClick={() => onSort("ns_z")}
                title="Normalized Skill Z-score: annualized since-inception skill, z-scored against same-window peers"
              >
                Norm Skill (Z)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const detailHref = `/manager-detail?tab=${encodeURIComponent(tab)}&manager=${encodeURIComponent(m.name)}`;
              const zTitle =
                m.ns_z != null
                  ? `${m.ns_n_obs ?? "?"} mo · ${m.ns_n_peers ?? "?"} peers (${m.ns_adj_method ?? ""})`
                  : "Insufficient history";
              return (
                <tr key={m.name}>
                  <td style={{ fontWeight: 500 }}>
                    <Link href={detailHref} style={{ color: "var(--accent)" }}>
                      {m.name}
                    </Link>
                  </td>
                  <td className={cn("mono", skillColor(m.t1_skill))}>
                    {fmtPctFromDecimal(m.t1_skill)}
                  </td>
                  <td className={cn("mono", skillColor(m.t3_skill))}>
                    {fmtPctFromDecimal(m.t3_skill)}
                  </td>
                  <td className={cn("mono", skillColor(m.t5_skill))}>
                    {fmtPctFromDecimal(m.t5_skill)}
                  </td>
                  <td className={cn("mono", skillColor(m.si_skill))}>
                    {fmtPctFromDecimal(m.si_skill)}
                  </td>
                  <td className={cn("mono", skillColor(m.ns_z))} title={zTitle}>
                    {fmtSignedNumber(m.ns_z)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
