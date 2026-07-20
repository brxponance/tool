"use client";

import { useEffect, useRef, useState } from "react";

type PresetSaveModalProps = {
  open: boolean;
  onClose(): void;
  onSubmit(input: { name: string; createdBy: string | null }): Promise<void>;
};

/**
 * Name-a-preset dialog. Mirrors ClientManageModal's look/behavior (backdrop,
 * Escape to close, Enter to submit, inline error) so preset-saving matches the
 * rest of the app instead of a native window.prompt.
 */
export function PresetSaveModal({ open, onClose, onSubmit }: PresetSaveModalProps) {
  const [name, setName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setName("");
    setCreatedBy("");
    setError(null);
    setSubmitting(false);
    const id = window.setTimeout(() => nameRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

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

  async function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Preset name is required.");
      nameRef.current?.focus();
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name: trimmed, createdBy: createdBy.trim() || null });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the preset.");
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
            Save Preset
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
          <p
            className="mb-4 font-mono"
            style={{ color: "var(--text3)", fontSize: 11, lineHeight: 1.5 }}
          >
            Saves the current portfolio&rsquo;s proposed weights and style overrides as a
            named scenario. The numbers recompute live whenever you load it.
          </p>

          <label
            className="mb-1 block font-mono text-[10px] uppercase tracking-[0.06em]"
            style={{ color: "var(--text3)" }}
          >
            Preset name
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
            placeholder="e.g. Q2 rebalance idea"
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
            Your name <span style={{ textTransform: "none" }}>(optional)</span>
          </label>
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !submitting) {
                e.preventDefault();
                void handleSubmit();
              }
            }}
            placeholder="e.g. Bryan"
            className="block w-full rounded-[3px] border font-mono outline-none"
            style={{
              background: "var(--surface2)",
              borderColor: "var(--border2)",
              color: "var(--text)",
              fontSize: 12,
              minHeight: 38,
              padding: "9px 12px",
            }}
          />

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
            {submitting ? "Saving..." : "Save preset"}
          </button>
        </div>
      </div>
    </div>
  );
}
