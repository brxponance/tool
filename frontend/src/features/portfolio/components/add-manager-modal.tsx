"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { formatNumber, formatPercent } from "@/lib/utils";

import type {
  PortfolioManager,
  PortfolioManagerCatalogItem,
} from "../types";

type AddManagerModalProps = {
  existingManagers: PortfolioManager[];
  loading: boolean;
  managers: PortfolioManagerCatalogItem[];
  managerCatalogError: string | null;
  onAdd(manager: PortfolioManagerCatalogItem): Promise<void>;
  onClose(): void;
  open: boolean;
};

export function AddManagerModal({
  existingManagers,
  loading,
  managers,
  managerCatalogError,
  onAdd,
  onClose,
  open,
}: AddManagerModalProps) {
  const [search, setSearch] = useState("");
  // Multi-select: keys of every manager the user has ticked to add.
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSearch("");
    setSelectedKeys(new Set());
    setSubmitError(null);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  const existingKeys = useMemo(
    () =>
      new Set(
        existingManagers.map((manager) => `${manager.tab}::${manager.matched_name}`),
      ),
    [existingManagers],
  );
  const query = deferredSearch.trim().toLowerCase();
  const filteredManagers = managers.filter((manager) => {
    if (!query) {
      return true;
    }

    return (
      manager.name.toLowerCase().includes(query) ||
      manager.tab.toLowerCase().includes(query)
    );
  });

  // Managers currently visible and not already in the portfolio — the pool the
  // "select all" toggle operates on.
  const selectableVisible = filteredManagers.filter(
    (manager) => !existingKeys.has(`${manager.tab}::${manager.name}`),
  );
  const allVisibleSelected =
    selectableVisible.length > 0 &&
    selectableVisible.every((manager) =>
      selectedKeys.has(`${manager.tab}::${manager.name}`),
    );

  const toggleKey = (managerKey: string) => {
    setSubmitError(null);
    setSelectedKeys((current) => {
      const next = new Set(current);
      if (next.has(managerKey)) {
        next.delete(managerKey);
      } else {
        next.add(managerKey);
      }
      return next;
    });
  };

  const toggleAllVisible = () => {
    setSubmitError(null);
    setSelectedKeys((current) => {
      const next = new Set(current);
      if (allVisibleSelected) {
        selectableVisible.forEach((manager) =>
          next.delete(`${manager.tab}::${manager.name}`),
        );
      } else {
        selectableVisible.forEach((manager) =>
          next.add(`${manager.tab}::${manager.name}`),
        );
      }
      return next;
    });
  };

  if (!open) {
    return null;
  }

  const selectedCount = selectedKeys.size;

  async function handleAdd() {
    if (selectedKeys.size === 0) {
      setSubmitError("Select at least one manager first.");
      return;
    }

    // Resolve the picked keys back to catalog items across the full list (not
    // just the filtered view, so a manager stays queued even if the search
    // changed before submitting).
    const picks = managers.filter((manager) =>
      selectedKeys.has(`${manager.tab}::${manager.name}`),
    );

    setSubmitting(true);
    setSubmitError(null);

    const failures: string[] = [];
    for (const manager of picks) {
      try {
        await onAdd(manager);
      } catch (error) {
        failures.push(
          `${manager.name}: ${error instanceof Error ? error.message : "could not be added"}`,
        );
      }
    }

    setSubmitting(false);

    if (failures.length) {
      setSubmitError(
        `${picks.length - failures.length} added. Failed: ${failures.join("; ")}`,
      );
      // Keep only the failed ones selected so the user can retry.
      setSelectedKeys(
        new Set(
          picks
            .filter((manager) =>
              failures.some((f) => f.startsWith(`${manager.name}:`)),
            )
            .map((manager) => `${manager.tab}::${manager.name}`),
        ),
      );
      return;
    }

    onClose();
  }

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full rounded-[4px] border bg-white"
        style={{
          borderColor: "var(--border2)",
          boxShadow: "0 24px 72px rgba(16, 38, 61, 0.28)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
          maxWidth: 560,
          overflow: "hidden",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-center justify-between border-b px-4 py-[14px]"
          style={{
            background: "linear-gradient(180deg, rgba(244, 246, 249, 0.75) 0%, rgba(255, 255, 255, 1) 100%)",
            borderColor: "var(--border)",
            padding: "14px 16px",
          }}
        >
          <span
            className="font-mono text-xs font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text)" }}
          >
            Add Manager To Portfolio
          </span>
          <button
            type="button"
            className="border-none bg-transparent p-0 font-mono text-[10px] uppercase tracking-[0.06em]"
            style={{
              color: "var(--accent)",
              lineHeight: 1,
              padding: "2px 0 2px 8px",
            }}
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            padding: "14px 16px 16px",
          }}
        >
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && selectedCount > 0 && !submitting && !loading) {
                event.preventDefault();
                void handleAdd();
              }
            }}
            placeholder="Search managers..."
            className="block w-full rounded-[3px] border font-mono outline-none"
            style={{
              boxShadow: "inset 0 1px 1px rgba(16, 38, 61, 0.04)",
              background: "var(--surface2)",
              borderColor: "var(--border2)",
              color: "var(--text)",
              fontSize: 12,
              minHeight: 38,
              lineHeight: 1.35,
              marginBottom: 10,
              padding: "9px 12px",
            }}
          />

          {/* Selection summary + select-all toggle */}
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: 10 }}
          >
            <span
              className="font-mono text-[10px] uppercase tracking-[0.06em]"
              style={{ color: selectedCount ? "var(--accent)" : "var(--text3)" }}
            >
              {selectedCount ? `${selectedCount} selected` : "Select one or more"}
            </span>
            <button
              type="button"
              className="border-none bg-transparent p-0 font-mono text-[10px] uppercase tracking-[0.06em]"
              style={{
                color: selectableVisible.length ? "var(--accent)" : "var(--text3)",
                cursor: selectableVisible.length ? "pointer" : "default",
              }}
              disabled={!selectableVisible.length}
              onClick={toggleAllVisible}
            >
              {allVisibleSelected ? "Clear all" : "Select all shown"}
            </button>
          </div>

          {managerCatalogError ? (
            <div className="mb-3 rounded-[3px] border border-danger/25 bg-danger/8 px-3 py-3 text-sm text-danger">
              {managerCatalogError}
            </div>
          ) : null}

          {submitError ? (
            <div className="mb-3 rounded-[3px] border border-danger/25 bg-danger/8 px-3 py-3 text-sm text-danger">
              {submitError}
            </div>
          ) : null}

          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              padding: 8,
            }}
          >
            {loading ? (
              <div className="py-10 text-center font-mono text-xs text-muted-foreground">
                Loading manager catalog...
              </div>
            ) : !filteredManagers.length ? (
              <div className="py-10 text-center font-mono text-xs text-muted-foreground">
                No managers match that search.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 4 }}>
                {filteredManagers.map((manager) => {
                  const managerKey = `${manager.tab}::${manager.name}`;
                  const selected = selectedKeys.has(managerKey);
                  const alreadyAdded = existingKeys.has(managerKey);

                  return (
                    <button
                      key={managerKey}
                      type="button"
                      disabled={alreadyAdded}
                      aria-pressed={selected}
                      className="border-none text-left transition"
                      style={{
                        alignItems: "flex-start",
                        background: selected
                          ? "rgba(0, 119, 204, 0.12)"
                          : "transparent",
                        borderRadius: 4,
                        boxShadow: selected
                          ? "inset 0 0 0 2px var(--accent, #0077cc)"
                          : "inset 0 0 0 1px transparent",
                        cursor: alreadyAdded ? "not-allowed" : "pointer",
                        display: "flex",
                        gap: 12,
                        justifyContent: "space-between",
                        opacity: alreadyAdded ? 0.58 : 1,
                        padding: "11px 12px",
                        width: "100%",
                      }}
                      onClick={() => {
                        if (alreadyAdded) {
                          return;
                        }
                        toggleKey(managerKey);
                      }}
                    >
                      <div style={{ display: "flex", gap: 10, minWidth: 0, alignItems: "flex-start" }}>
                        {/* Checkbox indicator */}
                        <span
                          aria-hidden
                          style={{
                            flexShrink: 0,
                            marginTop: 1,
                            width: 16,
                            height: 16,
                            borderRadius: 3,
                            border: `1.5px solid ${selected ? "var(--accent, #0077cc)" : "var(--border2)"}`,
                            background: selected ? "var(--accent, #0077cc)" : "transparent",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            lineHeight: 1,
                          }}
                        >
                          {selected ? "✓" : ""}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div
                            className="text-xs"
                            style={{
                              color: "var(--text)",
                              fontWeight: selected ? 600 : 500,
                              lineHeight: 1.35,
                              marginBottom: 4,
                            }}
                          >
                            {manager.name}
                          </div>
                          <div
                            className="font-mono text-[10px]"
                            style={{
                              color: "var(--text3)",
                              lineHeight: 1.45,
                            }}
                          >
                            {manager.tab} · R² {manager.r2_full == null ? "--" : `${formatNumber(manager.r2_full * 100, 1)}%`}
                            {alreadyAdded ? " · already in portfolio" : ""}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          flexShrink: 0,
                          textAlign: "right",
                        }}
                      >
                        <div
                          className="font-mono text-[10px]"
                          style={{
                            color: "var(--text3)",
                            lineHeight: 1.45,
                          }}
                        >
                          V-G: {formatPercent(manager.vg_full ?? 0)}
                        </div>
                        {manager.ns_z != null ? (
                          <div
                            className="font-mono text-[10px]"
                            style={{
                              color: "var(--text3)",
                              lineHeight: 1.45,
                            }}
                          >
                            NS: {manager.ns_z >= 0 ? "+" : ""}{formatNumber(manager.ns_z, 2)}
                          </div>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div
          className="flex items-center justify-end gap-2 border-t px-4 py-3"
          style={{
            background: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(244, 246, 249, 0.85) 100%)",
            borderColor: "var(--border)",
            padding: "12px 16px",
          }}
        >
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ minWidth: 62 }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={submitting || loading || selectedCount === 0}
            style={{ minWidth: 82 }}
            onClick={() => void handleAdd()}
          >
            {submitting
              ? "Adding..."
              : selectedCount > 1
                ? `Add ${selectedCount} At 0%`
                : "Add At 0%"}
          </button>
        </div>
      </div>
    </div>
  );
}
