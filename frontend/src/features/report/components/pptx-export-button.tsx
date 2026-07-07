"use client";

import { useState } from "react";

import { exportPortfolioPptx } from "../api/export-pptx";

type Props = {
  clientName: string | null;
  benchmarkName?: string | null;
};

export function PptxExportButton({ clientName, benchmarkName }: Props) {
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    if (!clientName) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const result = await exportPortfolioPptx({
        clientName,
        benchmarkName,
        onProgress: setLabel,
      });
      setNote(
        result.skipped.length
          ? `Exported ${result.filename} (skipped: ${result.skipped.join(", ")})`
          : `Exported ${result.filename}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "PowerPoint export failed.");
    } finally {
      setBusy(false);
      setLabel(null);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        disabled={!clientName || busy}
        onClick={() => void handleExport()}
        title={
          clientName
            ? "Screenshot the report panels and download a branded PowerPoint deck"
            : "Select a client first"
        }
      >
        {busy ? (label ?? "Working…") : "Export PowerPoint"}
      </button>
      {note && (
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginLeft: 8 }}>
          {note}
        </span>
      )}
      {error && (
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--red)", marginLeft: 8 }}>
          {error}
        </span>
      )}
    </>
  );
}
