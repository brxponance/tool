"use client";

import { useEffect, useRef, useState } from "react";

import { backendJson } from "@/lib/backend";

type ProgressPayload = {
  running: boolean;
  done: boolean;
  error: string | null;
  messages: string[];
  progress_current: number;
  progress_total: number;
  progress_phase: string;
  progress_pct: number | null;
  progress_sub_current?: number;
  progress_sub_total?: number;
  progress_sub_pct?: number | null;
};

type Tone = "running" | "done" | "error";

type Snapshot = {
  tone: Tone;
  phase: string;
  pct: number | null;        // overall (cloning) progress
  subPct: number | null;     // per-phase sub-progress when relevant
  subCurrent: number;
  subTotal: number;
  current: number;
  total: number;
  messages: string[];
  error: string | null;
  busy: boolean;
};

const POLL_MS_RUNNING = 1500;
const POLL_MS_IDLE = 5000;
const DONE_AUTO_HIDE_MS = 8000;

export function RunProgressOverlay() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastRunningRef = useRef(false);
  const hideTimerRef = useRef<number | null>(null);
  // Track recent log/counter activity so we can flag a "busy but counter
  // idle" state — that happens during phases like "Computing normalized
  // skill" which don't emit [done/total] markers.
  const lastPctRef = useRef<number | null>(null);
  const lastPctChangedAtRef = useRef<number>(0);
  const lastLastMessageRef = useRef<string>("");
  const lastMessageChangedAtRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;

    async function poll() {
      try {
        const data = await backendJson<ProgressPayload>("progress");
        if (cancelled) return;

        const now = Date.now();
        const lastMsg = data.messages[data.messages.length - 1] ?? "";
        if (lastMsg !== lastLastMessageRef.current) {
          lastLastMessageRef.current = lastMsg;
          lastMessageChangedAtRef.current = now;
        }
        if (data.progress_pct !== lastPctRef.current) {
          lastPctRef.current = data.progress_pct;
          lastPctChangedAtRef.current = now;
        }
        const counterIdleMs = now - lastPctChangedAtRef.current;
        const logFreshMs = now - lastMessageChangedAtRef.current;
        const busy = data.running && counterIdleMs > 2500 && logFreshMs < 8000;

        if (data.running) {
          lastRunningRef.current = true;
          if (hideTimerRef.current != null) {
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
          }
          setHidden(false);
          setSnapshot({
            tone: "running",
            phase: data.progress_phase || "Running...",
            pct: data.progress_pct,
            subPct: data.progress_sub_pct ?? null,
            subCurrent: data.progress_sub_current ?? 0,
            subTotal: data.progress_sub_total ?? 0,
            current: data.progress_current,
            total: data.progress_total,
            messages: data.messages,
            error: null,
            busy,
          });
        } else if (data.error) {
          setSnapshot({
            tone: "error",
            phase: "Run failed",
            pct: null,
            subPct: null,
            subCurrent: 0,
            subTotal: 0,
            current: 0,
            total: 0,
            messages: data.messages,
            error: data.error,
            busy: false,
          });
          setHidden(false);
        } else if (lastRunningRef.current) {
          // Run just finished — show "Done" briefly then auto-hide.
          lastRunningRef.current = false;
          setSnapshot({
            tone: "done",
            phase: "Run complete",
            pct: 100,
            subPct: null,
            subCurrent: 0,
            subTotal: 0,
            current: data.progress_total || 0,
            total: data.progress_total || 0,
            messages: data.messages,
            error: null,
            busy: false,
          });
          if (hideTimerRef.current != null) {
            window.clearTimeout(hideTimerRef.current);
          }
          hideTimerRef.current = window.setTimeout(() => {
            setHidden(true);
            setSnapshot(null);
          }, DONE_AUTO_HIDE_MS);
        }
      } catch {
        // Backend offline — drop overlay quietly.
        if (!cancelled && !lastRunningRef.current) {
          setSnapshot(null);
        }
      } finally {
        if (!cancelled) {
          const delay = lastRunningRef.current ? POLL_MS_RUNNING : POLL_MS_IDLE;
          timer = window.setTimeout(poll, delay);
        }
      }
    }

    void poll();
    return () => {
      cancelled = true;
      if (timer != null) window.clearTimeout(timer);
      if (hideTimerRef.current != null) window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!snapshot || hidden) return null;

  const hasSub = snapshot.subPct != null && snapshot.subTotal > 0;
  const overallPctText =
    snapshot.pct != null
      ? `${Math.min(100, Math.max(0, snapshot.pct)).toFixed(0)}%`
      : snapshot.total
        ? `${snapshot.current} / ${snapshot.total}`
        : "Working...";
  const subPctText = hasSub
    ? `${Math.min(100, Math.max(0, snapshot.subPct ?? 0)).toFixed(0)}%`
    : null;

  // Headline percentage: prefer sub-progress when active so the user
  // sees movement during phases that don't tick the global counter.
  const headlinePct = hasSub ? subPctText : overallPctText;

  const overallWidth =
    snapshot.pct != null
      ? `${Math.min(100, Math.max(0, snapshot.pct))}%`
      : undefined;
  const subWidth = hasSub
    ? `${Math.min(100, Math.max(0, snapshot.subPct ?? 0))}%`
    : undefined;

  return (
    <div className={`run-overlay run-overlay-${snapshot.tone}`}>
      <div className="run-overlay-head">
        <span className={`run-overlay-dot run-overlay-dot-${snapshot.tone}`} />
        <span className="run-overlay-phase">{snapshot.phase}</span>
        <span className="run-overlay-pct">
          {snapshot.busy && !hasSub ? "working..." : headlinePct}
        </span>
        <button
          type="button"
          className="run-overlay-toggle"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand run progress" : "Collapse run progress"}
        >
          {collapsed ? "+" : "\u2013"}
        </button>
        {snapshot.tone !== "running" && (
          <button
            type="button"
            className="run-overlay-toggle"
            onClick={() => {
              setHidden(true);
              setSnapshot(null);
            }}
            aria-label="Dismiss"
          >
            {"\u00D7"}
          </button>
        )}
      </div>

      <div className="run-overlay-bar">
        {snapshot.pct != null ? (
          <div className="run-overlay-bar-fill" style={{ width: overallWidth }} />
        ) : (
          <div className="run-overlay-bar-indet" />
        )}
        {snapshot.busy && !hasSub && snapshot.pct != null && (
          <div className="run-overlay-bar-shimmer" />
        )}
      </div>

      {hasSub && (
        <div
          className="run-overlay-bar run-overlay-bar-sub"
          title={`${snapshot.subCurrent} / ${snapshot.subTotal}`}
        >
          <div
            className="run-overlay-bar-fill run-overlay-bar-fill-sub"
            style={{ width: subWidth }}
          />
        </div>
      )}

      {!collapsed && (
        <div className="run-overlay-log">
          {snapshot.error ? (
            <div className="run-overlay-error">{snapshot.error}</div>
          ) : snapshot.messages.length ? (
            snapshot.messages.slice(-6).map((line, idx) => (
              <div key={`${idx}-${line}`} className="run-overlay-line">
                {line}
              </div>
            ))
          ) : (
            <div className="run-overlay-line run-overlay-line-muted">
              Waiting for first progress message...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
