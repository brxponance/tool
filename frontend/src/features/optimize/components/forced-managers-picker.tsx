"use client";

import { useMemo, useState } from "react";

import type {
  ForcedManagerInput,
  OptimizerCandidate,
  PeerGroup,
} from "../types";

type Props = {
  peerGroup: PeerGroup;
  candidates: OptimizerCandidate[];
  candidatesLoading: boolean;
  candidatesError: string | null;
  forced: ForcedManagerInput[];
  onAdd: (fm: ForcedManagerInput) => void;
  onUpdate: (index: number, partial: Partial<ForcedManagerInput>) => void;
  onRemove: (index: number) => void;
};

const tableHeader: React.CSSProperties = {
  textAlign: "left",
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--text3)",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  padding: "6px 8px",
  borderBottom: "1px solid var(--border)",
};

const tableCell: React.CSSProperties = {
  padding: "6px 8px",
  fontFamily: "var(--mono)",
  fontSize: 12,
  color: "var(--text)",
  borderBottom: "1px solid var(--border)",
};

export function ForcedManagersPicker({
  peerGroup,
  candidates,
  candidatesLoading,
  candidatesError,
  forced,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  const [query, setQuery] = useState("");
  const [pendingWeightPct, setPendingWeightPct] = useState("");
  const [pendingKind, setPendingKind] = useState<"pinned" | "required">("pinned");

  const forcedKeys = useMemo(
    () => new Set(forced.map((f) => `${f.tab}::${f.name}`)),
    [forced],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Show top 30 by ns_z descending in the active peer group, then others
      const sorted = [...candidates].sort((a, b) => {
        if (a.tab !== peerGroup && b.tab === peerGroup) return 1;
        if (a.tab === peerGroup && b.tab !== peerGroup) return -1;
        const aZ = a.ns_z ?? -Infinity;
        const bZ = b.ns_z ?? -Infinity;
        return bZ - aZ;
      });
      return sorted.slice(0, 30);
    }
    return candidates
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 30);
  }, [candidates, query, peerGroup]);

  function handleAdd(cand: OptimizerCandidate) {
    const weight =
      pendingKind === "pinned"
        ? Math.max(0, Number(pendingWeightPct) / 100)
        : 0;
    onAdd({ name: cand.name, tab: cand.tab, weight: weight > 0 ? weight : null });
    setPendingWeightPct("");
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text3)",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Forced managers
        </span>
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            maxWidth: 280,
            padding: "4px 8px",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            fontFamily: "var(--mono)",
            fontSize: 12,
          }}
        />
        <label
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text2)",
          }}
        >
          <input
            type="radio"
            name="kind"
            checked={pendingKind === "pinned"}
            onChange={() => setPendingKind("pinned")}
          />{" "}
          Pin weight
        </label>
        <label
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text2)",
          }}
        >
          <input
            type="radio"
            name="kind"
            checked={pendingKind === "required"}
            onChange={() => setPendingKind("required")}
          />{" "}
          Require only
        </label>
        {pendingKind === "pinned" && (
          <input
            type="number"
            step="0.5"
            min="0"
            max="100"
            placeholder="weight %"
            value={pendingWeightPct}
            onChange={(e) => setPendingWeightPct(e.target.value)}
            style={{
              width: 90,
              padding: "4px 6px",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontFamily: "var(--mono)",
              fontSize: 12,
            }}
          />
        )}
      </div>

      {/* Picker list */}
      <div
        style={{
          maxHeight: 220,
          overflowY: "auto",
          border: "1px solid var(--border)",
        }}
      >
        {candidatesLoading && (
          <div
            style={{
              padding: 12,
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--text3)",
            }}
          >
            Loading candidates...
          </div>
        )}
        {candidatesError && (
          <div
            style={{
              padding: 12,
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--red)",
            }}
          >
            {candidatesError}
          </div>
        )}
        {!candidatesLoading && !candidatesError && filtered.length === 0 && (
          <div
            style={{
              padding: 12,
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--text3)",
            }}
          >
            No candidates match.
          </div>
        )}
        {!candidatesLoading &&
          !candidatesError &&
          filtered.map((c) => {
            const key = `${c.tab}::${c.name}`;
            const alreadyForced = forcedKeys.has(key);
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 10px",
                  borderBottom: "1px solid var(--border)",
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: alreadyForced ? "var(--text3)" : "var(--text)",
                }}
              >
                <span>
                  {c.name}{" "}
                  <span style={{ color: "var(--text3)" }}>· {c.tab}</span>
                  {c.ns_z != null && (
                    <span style={{ color: "var(--text3)" }}>
                      {" "}· ns_z {c.ns_z.toFixed(2)}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={alreadyForced}
                  onClick={() => handleAdd(c)}
                >
                  {alreadyForced ? "Added" : "Add"}
                </button>
              </div>
            );
          })}
      </div>

      {/* Selected forced managers */}
      {forced.length > 0 && (
        <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={tableHeader}>Manager</th>
              <th style={tableHeader}>Tab</th>
              <th style={tableHeader}>Kind</th>
              <th style={tableHeader}>Weight (%)</th>
              <th style={tableHeader}>{""}</th>
            </tr>
          </thead>
          <tbody>
            {forced.map((m, i) => {
              const kind: "pinned" | "required" =
                m.weight != null && m.weight > 0 ? "pinned" : "required";
              return (
                <tr key={`${m.tab}::${m.name}`}>
                  <td style={tableCell}>{m.name}</td>
                  <td style={tableCell}>{m.tab}</td>
                  <td style={tableCell}>{kind}</td>
                  <td style={tableCell}>
                    {kind === "pinned" ? (
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        value={
                          m.weight != null ? Math.round(m.weight * 1000) / 10 : 0
                        }
                        onChange={(e) =>
                          onUpdate(i, {
                            weight: Math.max(0, Number(e.target.value) / 100),
                          })
                        }
                        style={{
                          width: 80,
                          padding: "2px 4px",
                          background: "var(--surface2)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          fontFamily: "var(--mono)",
                          fontSize: 12,
                        }}
                      />
                    ) : (
                      <span style={{ color: "var(--text3)" }}>(optimizer)</span>
                    )}
                  </td>
                  <td style={tableCell}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => onRemove(i)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
