"use client";

import { cn } from "@/lib/utils";

import { PEER_GROUPS, type PeerGroup } from "../types";

type Props = {
  value: PeerGroup;
  onChange: (group: PeerGroup) => void;
};

export function PeerGroupSelector({ value, onChange }: Props) {
  return (
    <div className="peer-selector-row" style={{ alignItems: "center", gap: 8 }}>
      <span className="peer-selector-label">Peer Group</span>
      {PEER_GROUPS.map((group) => (
        <button
          key={group}
          type="button"
          className={cn("peer-btn", value === group && "active")}
          onClick={() => onChange(group)}
        >
          {group === "USSC" ? "US SC" : group}
        </button>
      ))}
    </div>
  );
}
