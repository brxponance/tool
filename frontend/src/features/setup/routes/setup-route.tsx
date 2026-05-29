"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { backendJson } from "@/lib/backend";
import { useSetupSnapshot } from "../hooks/use-setup-snapshot";
import type { BackendStatus } from "../types";

type ProgressSnapshot = {
  messages: string[];
  running: boolean;
  done: boolean;
  error: string | null;
  progress_current: number;
  progress_total: number;
  progress_phase: string;
  progress_pct: number | null;
};

type UploadWarning = {
  type: string;
  missing_count?: number;
  message?: string;
};

type UploadResponse = {
  status: string;
  message?: string;
  warnings?: Record<string, UploadWarning>;
  recognised_tabs?: string[];
};

type RunResponse = {
  status: string;
  message?: string;
};

type AllManagersResponse = {
  managers: Array<{ tab: string }>;
};

type FeedbackState = {
  tone: "success" | "warning" | "error";
  text: string;
};

type UploadSlot = {
  key:
    | "manager_returns"
    | "factor_returns"
    | "weights"
    | "risk_summary"
    | "security_risk"
    | "exposures"
    | "universe_returns";
  endpoint: string;
  field: string;
  label: string;
  hint: string;
  icon: string;
};

const UPLOAD_SLOTS: UploadSlot[] = [
  {
    key: "manager_returns",
    endpoint: "upload",
    field: "manager_returns",
    label: "Manager Returns",
    hint: "XPO_Buy_List format",
    icon: "📊",
  },
  {
    key: "factor_returns",
    endpoint: "upload",
    field: "factor_returns",
    label: "Factor Returns",
    hint: "PC_Tool_Factor_Returns format",
    icon: "📈",
  },
  {
    key: "weights",
    endpoint: "upload",
    field: "weights",
    label: "Portfolio Weights",
    hint: "Optional",
    icon: "⚖️",
  },
  {
    key: "risk_summary",
    endpoint: "upload_risk",
    field: "risk_summary",
    label: "FactSet Risk Summary",
    hint: "Manager-level active exposures (legacy)",
    icon: "📉",
  },
  {
    key: "security_risk",
    endpoint: "upload_security_risk",
    field: "security_risk",
    label: "FactSet Security-Level Risk",
    hint: "Stock-level DNA — enables regional breakdown",
    icon: "🔬",
  },
  {
    key: "exposures",
    endpoint: "upload_exposures",
    field: "exposures",
    label: "FactSet Exposures",
    hint: "Optional — portfolio characteristic exposures",
    icon: "📊",
  },
  {
    key: "universe_returns",
    endpoint: "upload_universe_consolidated",
    field: "universe_returns",
    label: "Universe Returns",
    hint: "Optional — one file, sheets: US LC / ISC / EAFE / Global",
    icon: "🌐",
  },
];

function hasStagedFile(status: BackendStatus | undefined, key: UploadSlot["key"]) {
  if (!status) {
    return false;
  }

  if (key === "risk_summary") {
    return status.has_risk || Boolean(status.files[key]);
  }

  if (key === "security_risk") {
    return status.has_security_risk || Boolean(status.files[key]);
  }

  if (key === "exposures") {
    return status.has_exposures || Boolean(status.files[key]);
  }

  if (key === "universe_returns") {
    return status.has_universe || status.universe_files_staged.length > 0;
  }

  return Boolean(status.files[key]);
}

function fileLabel(status: BackendStatus | undefined, key: UploadSlot["key"]) {
  if (!status) {
    return "";
  }

  if (key === "exposures" && status.has_exposures && status.exposures_benchmark) {
    return `${status.exposures_benchmark} — ${status.exposures_managers.length} managers loaded`;
  }

  if (key === "universe_returns") {
    if (status.has_universe && status.universe_tabs.length) {
      return `${status.universe_tabs.length} peer group${status.universe_tabs.length === 1 ? "" : "s"} cached: ${status.universe_tabs.join(", ")}`;
    }

    if (status.universe_files_staged.length) {
      const staged = status.universe_files_staged.map((value) =>
        value === "__all__" ? "consolidated" : value,
      );
      return `${staged.length} file${staged.length === 1 ? "" : "s"} staged: ${staged.join(", ")}`;
    }

    return "";
  }

  const value = status.files[key];
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return "multiple files staged";
  }

  return "";
}

function universeNote(status: BackendStatus | undefined) {
  if (!status) {
    return "";
  }

  if (status.has_universe && status.universe_tabs.length) {
    return "✓ Universe data loaded from cache";
  }

  if (status.universe_files_staged.length) {
    return "Files staged — click Run Universe Clones to compute.";
  }

  return "";
}

function uploadWarningMessage(warning: UploadWarning | undefined) {
  if (!warning) {
    return null;
  }

  if (warning.type === "missing_factors" && warning.missing_count) {
    return `${warning.missing_count} expected factor${warning.missing_count === 1 ? " is" : "s are"} missing from the uploaded factor file.`;
  }

  if (warning.type === "sniff_error" && warning.message) {
    return `Could not validate the factor file: ${warning.message}`;
  }

  return null;
}

export function SetupRoute() {
  const { data, loading, error, reload } = useSetupSnapshot();
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressSnapshot | null>(null);
  const [dragKey, setDragKey] = useState<UploadSlot["key"] | null>(null);
  const [managerCounts, setManagerCounts] = useState<Record<string, number>>({});
  const pollTimerRef = useRef<number | null>(null);

  const status = data?.status;
  const requiredUploadsReady = Boolean(status?.files.manager_returns && status?.files.factor_returns);
  const universeReady = Boolean(status?.files.factor_returns) && Boolean(status?.universe_files_staged.length);
  const reloadInputsVisible = Boolean(
    status?.has_results && (status.has_weights || status.has_risk || status.has_exposures),
  );
  const progressVisible = Boolean(progress?.running || progress?.done || progress?.error || progress?.messages.length);

  const resultsSummary = useMemo(() => {
    const entries = Object.entries(managerCounts).sort((left, right) => left[0].localeCompare(right[0]));
    const total = entries.reduce((sum, [, count]) => sum + count, 0);
    return { entries, total };
  }, [managerCounts]);

  function stopPolling() {
    if (pollTimerRef.current !== null) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }

  async function refreshManagerSummary(hasResults: boolean) {
    if (!hasResults) {
      setManagerCounts({});
      return;
    }

    try {
      const response = await backendJson<AllManagersResponse>("all_managers");
      const nextCounts: Record<string, number> = {};

      response.managers.forEach((manager) => {
        nextCounts[manager.tab] = (nextCounts[manager.tab] ?? 0) + 1;
      });

      setManagerCounts(nextCounts);
    } catch {
      setManagerCounts({});
    }
  }

  async function refreshProgress() {
    try {
      const next = await backendJson<ProgressSnapshot>("progress");
      setProgress(next);

      if (!next.running) {
        stopPolling();
        await reload(false);
        await refreshManagerSummary(Boolean(data?.status.has_results || next.done));

        if (next.error) {
          setFeedback({ tone: "error", text: next.error.split("\n")[0] });
        } else if (next.done) {
          setFeedback({ tone: "success", text: "Clone run completed." });
        }
      }
    } catch (progressError) {
      stopPolling();
      setFeedback({
        tone: "error",
        text:
          progressError instanceof Error
            ? progressError.message
            : "Unable to read backend progress.",
      });
    }
  }

  function startPolling() {
    stopPolling();
    pollTimerRef.current = window.setInterval(() => {
      void refreshProgress();
    }, 1000);
  }

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function syncManagerSummary() {
      if (!status?.has_results) {
        if (!cancelled) {
          setManagerCounts({});
        }
        return;
      }

      try {
        const response = await backendJson<AllManagersResponse>("all_managers");
        if (cancelled) {
          return;
        }

        const nextCounts: Record<string, number> = {};
        response.managers.forEach((manager) => {
          nextCounts[manager.tab] = (nextCounts[manager.tab] ?? 0) + 1;
        });
        setManagerCounts(nextCounts);
      } catch {
        if (!cancelled) {
          setManagerCounts({});
        }
      }
    }

    void syncManagerSummary();

    return () => {
      cancelled = true;
    };
  }, [status?.has_results]);

  async function handleUpload(slot: UploadSlot, file: File) {
    const formData = new FormData();
    formData.append(slot.field, file);

    try {
      setBusyAction(slot.key);
      setFeedback(null);

      const response = await backendJson<UploadResponse>(slot.endpoint, {
        method: "POST",
        body: formData,
      });

      const warningText = uploadWarningMessage(response.warnings?.[slot.field]);
      if (warningText) {
        setFeedback({ tone: "warning", text: warningText });
      } else if (response.status === "staged") {
        const recognised = response.recognised_tabs?.length
          ? ` (${response.recognised_tabs.join(", ")})`
          : "";
        setFeedback({
          tone: "success",
          text: response.message ?? `Universe file staged${recognised}.`,
        });
      } else {
        setFeedback({
          tone: "success",
          text: response.message ?? `${slot.label} uploaded successfully.`,
        });
      }

      await reload(false);
    } catch (uploadError) {
      setFeedback({
        tone: "error",
        text:
          uploadError instanceof Error
            ? uploadError.message
            : `Unable to upload ${slot.label}.`,
      });
    } finally {
      setBusyAction(null);
      setDragKey(null);
    }
  }

  async function handleRun(endpoint: "run" | "run_universe") {
    try {
      setBusyAction(endpoint);
      setFeedback(null);

      const response = await backendJson<RunResponse>(endpoint, {
        method: "POST",
      });

      if (response.status !== "started") {
        throw new Error(response.message ?? "The backend did not start the requested run.");
      }

      setProgress({
        messages: [endpoint === "run" ? "Starting buy-list clone run..." : "Starting universe clone run..."],
        running: true,
        done: false,
        error: null,
        progress_current: 0,
        progress_total: 0,
        progress_phase:
          endpoint === "run" ? "Starting buy-list clone run..." : "Starting universe clone run...",
        progress_pct: null,
      });
      startPolling();
      await refreshProgress();
    } catch (runError) {
      setFeedback({
        tone: "error",
        text:
          runError instanceof Error
            ? runError.message
            : "Unable to start the backend run.",
      });
    } finally {
      setBusyAction(null);
    }
  }

  async function handleSimpleAction(
    endpoint: "clear_cache" | "reload_inputs" | "reset_universe",
    successMessage: string,
  ) {
    try {
      setBusyAction(endpoint);
      setFeedback(null);
      await backendJson(endpoint, { method: "POST" });
      setProgress(null);
      await reload(false);
      await refreshManagerSummary(Boolean(status?.has_results && endpoint !== "clear_cache"));
      setFeedback({ tone: "success", text: successMessage });
    } catch (actionError) {
      setFeedback({
        tone: "error",
        text:
          actionError instanceof Error
            ? actionError.message
            : "The backend action failed.",
      });
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div id="page-setup">
      {status?.has_results ? (
        <div className="cached-banner">
          ✓ Results loaded from last run — no need to recompute.
          <button
            type="button"
            className="btn btn-danger btn-sm ml-auto"
            onClick={() => void handleSimpleAction("clear_cache", "Saved cache cleared.")}
            disabled={busyAction !== null || Boolean(progress?.running)}
          >
            Clear &amp; Reset
          </button>
        </div>
      ) : null}

      {status?.clone_stale ? (
        <div
          className="mb-16"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(255,171,0,.35)",
            borderRadius: 3,
            background: "rgba(255,171,0,.1)",
            padding: "10px 14px",
            color: "var(--amber)",
            fontFamily: "var(--mono)",
            fontSize: 11,
          }}
        >
          ⚠ Uploaded files have changed since the last clone run — clone results may be out of date. Click <strong>Run Buy List Clones</strong> to update.
        </div>
      ) : null}

      {feedback ? (
        <div
          className={`alert ${
            feedback.tone === "success"
              ? "alert-success"
              : feedback.tone === "warning"
                ? "alert-warn"
                : "alert-error"
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      {error ? <div className="alert alert-error">{error}</div> : null}

      <div className="panel mb-16">
        <div className="panel-header">
          <span className="panel-title">Data Upload</span>
        </div>
        <div className="panel-body">
          <div className="upload-grid">
            {UPLOAD_SLOTS.map((slot) => {
              const note = slot.key === "universe_returns" ? universeNote(status) : "";
              const hasFile = hasStagedFile(status, slot.key);

              return (
                <label
                  key={slot.key}
                  className={`upload-zone${hasFile ? " has-file" : ""}${dragKey === slot.key ? " drag" : ""}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragKey(slot.key);
                  }}
                  onDragLeave={() => {
                    setDragKey((current) => (current === slot.key ? null : current));
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const file = event.dataTransfer.files[0];
                    if (file) {
                      void handleUpload(slot, file);
                    }
                  }}
                >
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void handleUpload(slot, file);
                      }
                      event.currentTarget.value = "";
                    }}
                    disabled={busyAction !== null || Boolean(progress?.running)}
                  />
                  <div className="upload-icon">{slot.icon}</div>
                  <div className="upload-label">{slot.label}</div>
                  <div className="upload-hint">{slot.hint}</div>
                  <div className="upload-fname">{fileLabel(status, slot.key)}</div>
                  {note ? (
                    <div className={`upload-note${note.startsWith("Files staged") ? " warn" : ""}`}>
                      {note}
                    </div>
                  ) : null}
                </label>
              );
            })}
          </div>

          <div className="flex gap-8 items-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => void handleRun("run")}
              disabled={!requiredUploadsReady || busyAction !== null || Boolean(progress?.running)}
            >
              Run Buy List Clones
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => void handleRun("run_universe")}
              disabled={!universeReady || busyAction !== null || Boolean(progress?.running)}
            >
              Run Universe Clones
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => void handleSimpleAction("reset_universe", "Universe clone results cleared.")}
              disabled={busyAction !== null || Boolean(progress?.running)}
            >
              Reset Universe
            </button>
            {reloadInputsVisible ? (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => void handleSimpleAction("reload_inputs", "Inputs reloaded.")}
                disabled={busyAction !== null || Boolean(progress?.running)}
              >
                Reload Inputs
              </button>
            ) : null}
            <div
              style={{
                color: "var(--text3)",
                fontFamily: "var(--mono)",
                fontSize: 10,
              }}
            >
              {requiredUploadsReady
                ? "Ready — expect ~2 minutes"
                : "Upload manager returns + factor returns to enable"}
            </div>
          </div>

          {progressVisible ? (
            <div style={{ marginTop: 12 }}>
              <div className="progress-bar-wrap">
                <div
                  className={`progress-bar${progress?.running ? " running" : ""}${progress?.error ? " error" : ""}`}
                  style={{ width: `${progress?.progress_pct ?? (progress?.running ? 35 : progress?.done ? 100 : 0)}%` }}
                />
              </div>
              <div className="progress-meta">
                <span className="phase">{progress?.progress_phase || "Starting..."}</span>
                <span>
                  {progress?.progress_total
                    ? `${progress.progress_current.toLocaleString()} / ${progress.progress_total.toLocaleString()} managers`
                    : ""}
                </span>
                <span className="pct">
                  {progress?.progress_pct != null ? `${progress.progress_pct.toFixed(1)}%` : ""}
                </span>
              </div>
              <div className="progress-log">
                {(progress?.messages ?? []).map((message, index) => (
                  <div key={`${message}-${index}`} className="line">
                    {message}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {status?.has_results ? (
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Results Summary</span>
          </div>
          <div className="panel-body">
            {loading && !resultsSummary.total ? (
              <div style={{ color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 11 }}>
                Loading cached results summary...
              </div>
            ) : (
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {resultsSummary.entries.map(([tab, count]) => (
                  <div key={tab} className="badge badge-blue">
                    {tab}: {count}
                  </div>
                ))}
                <div className="badge badge-green">Total: {resultsSummary.total}</div>
                {data?.clients.length ? (
                  <div className="badge badge-blue">Clients: {data.clients.length}</div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}