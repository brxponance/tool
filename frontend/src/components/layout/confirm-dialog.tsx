"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ConfirmOptions = {
  // Uppercase label shown in the dialog header.
  title?: string;
  // The main question / warning body. Plain text.
  message: string;
  // Label for the confirm button (e.g. "Delete", "Save").
  confirmLabel?: string;
  // Label for the dismiss button.
  cancelLabel?: string;
  // Styles the confirm button as destructive (red) when true.
  danger?: boolean;
};

type PendingConfirm = ConfirmOptions & {
  resolve: (value: boolean) => void;
};

/**
 * Promise-based confirmation dialog that mirrors the app's modal look
 * (PresetSaveModal / ClientManageModal) instead of a native window.confirm.
 *
 * Usage:
 *   const { confirm, dialog } = useConfirm();
 *   ...
 *   onClick={async () => {
 *     if (await confirm({ message: "Delete this?", danger: true })) {
 *       doIt();
 *     }
 *   }}
 *   ...
 *   return <>{content}{dialog}</>;
 */
export function useConfirm() {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve });
    });
  }, []);

  const settle = useCallback(
    (value: boolean) => {
      setPending((current) => {
        current?.resolve(value);
        return null;
      });
    },
    [],
  );

  const dialog = (
    <ConfirmDialog
      options={pending}
      onConfirm={() => settle(true)}
      onCancel={() => settle(false)}
    />
  );

  return { confirm, dialog };
}

type ConfirmDialogProps = {
  options: ConfirmOptions | null;
  onConfirm(): void;
  onCancel(): void;
};

function ConfirmDialog({ options, onConfirm, onCancel }: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const open = options !== null;

  // Focus the confirm button and wire Escape/Enter while open.
  useEffect(() => {
    if (!open) {
      return;
    }
    const id = window.setTimeout(() => confirmRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter") {
        onConfirm();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onCancel, onConfirm]);

  if (!options) {
    return null;
  }

  const {
    title = "Please confirm",
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    danger = false,
  } = options;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full rounded-[4px] border bg-white"
        style={{
          borderColor: "var(--border2)",
          boxShadow: "0 24px 72px rgba(16, 38, 61, 0.28)",
          display: "flex",
          flexDirection: "column",
          maxWidth: 440,
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
            onClick={onCancel}
          >
            ✕ Close
          </button>
        </div>

        <div style={{ padding: "16px" }}>
          <p
            className="font-mono"
            style={{ color: "var(--text)", fontSize: 12, lineHeight: 1.55, margin: 0 }}
          >
            {message}
          </p>
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
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className={danger ? "btn btn-danger btn-sm" : "btn btn-primary btn-sm"}
            style={
              danger
                ? {
                    minWidth: 82,
                    color: "#fff",
                    background: "var(--danger, #c0392b)",
                    borderColor: "var(--danger, #c0392b)",
                  }
                : { minWidth: 82 }
            }
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
