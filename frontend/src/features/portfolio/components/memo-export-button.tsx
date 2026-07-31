"use client";

import { useState } from "react";

import { exportPortfolioDocx } from "@/features/report/api/export-docx";

import type { PortfolioManager } from "../types";

type Props = {
  client: string | null;
  managers: PortfolioManager[];
  disabled?: boolean;
};

// "Print Memo Report" — generates the editable Word rebalance memo for the
// on-screen portfolio. Lives on the Portfolio tab (not the Report tab) because
// it reads the live manager list and proposed weights, so whatever is on screen
// is what lands in the memo.
export function MemoExportButton({ client, managers, disabled }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ready = Boolean(client) && managers.length > 0;

  async function run() {
    if (!client || !ready) return;
    setError(null);
    setBusy("Working…");
    try {
      await exportPortfolioDocx({
        clientName: client,
        managers: managers.map((m) => ({
          matched_name: m.matched_name,
          weight_file_name: m.weight_file_name,
          tab: m.tab,
          current_weight: m.current_weight ?? 0,
          proposed_weight: m.proposed_weight ?? 0,
        })),
        onProgress: (label) => setBusy(label),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build the memo.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        disabled={!ready || disabled || busy !== null}
        onClick={() => void run()}
        title="Generate an editable Word (.docx) rebalance memo for this portfolio"
      >
        {busy ?? "Print Memo Report"}
      </button>
      {error ? (
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--danger, #c0392b)",
          }}
        >
          {error}
        </span>
      ) : null}
    </>
  );
}
