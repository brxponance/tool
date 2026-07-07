"use client";

import { useEffect, useRef, useState } from "react";

export type ClientManageMode = "add" | "rename";

type ClientManageModalProps = {
  open: boolean;
  mode: ClientManageMode;
  // Prefill values (rename mode).
  initialName?: string;
  initialBenchmark?: string;
  // Canonical benchmark labels (from the backend) for the strict dropdown.
  benchmarkOptions: string[];
  onClose(): void;
  onSubmit(input: { name: string; benchmark: string | null }): Promise<void>;
};

/**
 * Add / rename a client. Both actions share one form (name + optional
 * benchmark); `mode` only changes the labels and which endpoint the parent
 * calls in onSubmit.
 */
export function ClientManageModal({
  open,
  mode,
  initialName = "",
  initialBenchmark = "",
  benchmarkOptions,
  onClose,
  onSubmit,
}: ClientManageModalProps) {
  const [name, setName] = useState(initialName);
  const [benchmark, setBenchmark] = useState(initialBenchmark);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  // Reset the form whenever the modal (re)opens.
  useEffect(() => {
    if (!open) {
      return;
    }
    setName(initialName);
    setBenchmark(initialBenchmark);
    setError(null);
    setSubmitting(false);
    const id = window.setTimeout(() => nameRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open, initialName, initialBenchmark]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const title = mode === "add" ? "Add Client" : "Rename Client";

  // Strict list from the backend, but always keep the client's current
  // benchmark selectable — a seeded value with slightly different spelling
  // (e.g. "MSCI ACWI ex US") must not silently vanish when renaming.
  const benchmarkChoices =
    benchmark && !benchmarkOptions.includes(benchmark)
      ? [benchmark, ...benchmarkOptions]
      : benchmarkOptions;

  async function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Client name is required.");
      nameRef.current?.focus();
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name: trimmed, benchmark: benchmark.trim() || null });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the client.");
    } finally {
      setSubmitting(false);
    }
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
          maxWidth: 460,
          overflow: "hidden",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-center justify-between border-b"
          style={{
            background:
              "linear-gradient(180deg, rgba(244, 246, 249, 0.75) 0%, rgba(255, 255, 255, 1) 100%)",
            borderColor: "var(--border)",
            padding: "14px 16px",
          }}
        >
          <span
            className="font-mono text-xs font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text)" }}
          >
            {title}
          </span>
          <button
            type="button"
            className="border-none bg-transparent p-0 font-mono text-[10px] uppercase tracking-[0.06em]"
            style={{ color: "var(--accent)", lineHeight: 1, padding: "2px 0 2px 8px" }}
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>

        <div style={{ padding: "16px" }}>
          <label
            className="mb-1 block font-mono text-[10px] uppercase tracking-[0.06em]"
            style={{ color: "var(--text3)" }}
          >
            Client name
          </label>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !submitting) {
                e.preventDefault();
                void handleSubmit();
              }
            }}
            placeholder="e.g. Acme Pension Plan"
            className="mb-4 block w-full rounded-[3px] border font-mono outline-none"
            style={{
              background: "var(--surface2)",
              borderColor: "var(--border2)",
              color: "var(--text)",
              fontSize: 12,
              minHeight: 38,
              padding: "9px 12px",
            }}
          />

          <label
            className="mb-1 block font-mono text-[10px] uppercase tracking-[0.06em]"
            style={{ color: "var(--text3)" }}
          >
            Benchmark <span style={{ textTransform: "none" }}>(optional)</span>
          </label>
          <select
            value={benchmark}
            onChange={(e) => setBenchmark(e.target.value)}
            className="block w-full rounded-[3px] border font-mono outline-none"
            style={{
              background: "var(--surface2)",
              borderColor: "var(--border2)",
              color: "var(--text)",
              fontSize: 12,
              minHeight: 38,
              padding: "9px 12px",
            }}
          >
            <option value="">— None —</option>
            {benchmarkChoices.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {error ? (
            <div
              className="mt-3 rounded-[3px] border px-3 py-2 text-sm"
              style={{
                borderColor: "rgba(192, 57, 43, 0.25)",
                background: "rgba(192, 57, 43, 0.08)",
                color: "var(--danger, #c0392b)",
              }}
            >
              {error}
            </div>
          ) : null}
        </div>

        <div
          className="flex items-center justify-end gap-2 border-t"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(244, 246, 249, 0.85) 100%)",
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
            disabled={submitting}
            style={{ minWidth: 82 }}
            onClick={() => void handleSubmit()}
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
