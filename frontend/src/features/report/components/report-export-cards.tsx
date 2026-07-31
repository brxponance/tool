"use client";

import { useState } from "react";

import { BACKEND_PROXY_BASE } from "@/lib/constants";

import { PPTX_CAPTURE_TARGETS } from "../api/export-pptx";

// The three server-side report downloads, mirroring the reference tool's
// Reports tab. Two are plain GETs (the backend builds the workbook from loaded
// state); the PDF needs the on-screen report captured first, because it's an
// image-per-page assembly of what's rendered.

// Sub-asset-class sections offered by /export_returns_xlsx.
const RETURN_SECTIONS = [
  { code: "EAFE", label: "EAFE" },
  { code: "ACWI", label: "Global" },
  { code: "ISC", label: "ISC" },
  { code: "EM", label: "EM" },
  { code: "US", label: "US" },
  { code: "USSC", label: "US SC" },
] as const;

async function downloadFrom(url: string, fallbackName: string) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    let message = `Download failed with status ${response.status}.`;
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload?.error) message = payload.error;
    } catch {
      // non-JSON error body — keep the generic message
    }
    throw new Error(message);
  }
  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = /filename="?([^"]+)"?/.exec(disposition);
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = match?.[1] ?? fallbackName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

function Card({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="panel"
      style={{ flex: "1 1 300px", minWidth: 280, display: "flex", flexDirection: "column" }}
    >
      <div className="panel-header">
        <span className="panel-title">{title}</span>
      </div>
      <div
        className="panel-body"
        style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text3)",
            lineHeight: 1.5,
          }}
        >
          {blurb}
        </div>
        {children}
      </div>
    </div>
  );
}

export function ReportExportCards({ client }: { client: string | null }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<Set<string>>(
    () => new Set(RETURN_SECTIONS.map((s) => s.code)),
  );

  function toggleSection(code: string) {
    setSections((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  async function guard(label: string, fn: () => Promise<void>) {
    setError(null);
    setBusy(label);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setBusy(null);
    }
  }

  // Capture the rendered report panels and POST them to /export_report_pdf.
  async function downloadPdf() {
    const html2canvas = (await import("html2canvas")).default;
    const images: string[] = [];
    for (const target of PPTX_CAPTURE_TARGETS) {
      const el = document.getElementById(target.id);
      if (!el) continue;
      try {
        const canvas = await html2canvas(el, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false,
          useCORS: true,
        });
        images.push(canvas.toDataURL("image/png"));
      } catch {
        // a failed capture just drops that page
      }
    }
    if (!images.length) {
      throw new Error(
        "Nothing to capture — select a client and let the report finish rendering.",
      );
    }
    const response = await fetch(`${BACKEND_PROXY_BASE}/export_report_pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ images, meta: { client_name: client } }),
    });
    if (!response.ok) {
      let message = `PDF export failed with status ${response.status}.`;
      try {
        const payload = (await response.json()) as { error?: string };
        if (payload?.error) message = payload.error;
      } catch {
        /* keep generic */
      }
      throw new Error(message);
    }
    const blob = await response.blob();
    const disposition = response.headers.get("content-disposition") ?? "";
    const match = /filename="?([^"]+)"?/.exec(disposition);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = match?.[1] ?? "Quarterly_Portfolio_Report.pdf";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  const allSections = sections.size === RETURN_SECTIONS.length;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "stretch" }}>
        <Card
          title="Quarterly Portfolio Report"
          blurb="The report below, captured page by page and assembled as a PDF. Select a client and let it finish rendering first — sections without loaded source files are captured as shown."
        >
          <div style={{ marginTop: "auto" }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!client || busy !== null}
              onClick={() => void guard("Capturing…", downloadPdf)}
            >
              {busy === "Capturing…" ? "Capturing…" : "Download PDF"}
            </button>
          </div>
        </Card>

        <Card
          title="Dispersion Report"
          blurb="Backtested monthly return streams for every client portfolio (current weights, monthly rebalance, 5-year minimum with clone backfill), plus per-month cross-client dispersion stats — as an Excel workbook."
        >
          <div style={{ marginTop: "auto" }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={busy !== null}
              onClick={() =>
                void guard("Building…", () =>
                  downloadFrom(
                    `${BACKEND_PROXY_BASE}/export_dispersion_xlsx`,
                    "Dispersion_Report.xlsx",
                  ),
                )
              }
            >
              {busy === "Building…" ? "Building…" : "Download Excel"}
            </button>
          </div>
        </Card>

        <Card
          title="Returns Download"
          blurb="Buy-list manager monthly returns and their full-factor clone returns, grouped by sub-asset class — two matching tabs (Manager Returns, Clone Returns) that line up row-for-row and column-for-column."
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button
              type="button"
              className={`btn btn-sm ${allSections ? "btn-primary" : "btn-outline"}`}
              style={{ fontSize: 10 }}
              onClick={() =>
                setSections(
                  allSections ? new Set() : new Set(RETURN_SECTIONS.map((s) => s.code)),
                )
              }
            >
              All
            </button>
            {RETURN_SECTIONS.map((s) => {
              const on = sections.has(s.code);
              return (
                <button
                  key={s.code}
                  type="button"
                  className={`btn btn-sm ${on ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: 10 }}
                  onClick={() => toggleSection(s.code)}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: "auto" }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={busy !== null || sections.size === 0}
              onClick={() =>
                void guard("Building…", () => {
                  // Omit the param entirely when everything is selected — the
                  // backend defaults to all present sections.
                  const qs = allSections
                    ? ""
                    : `?sections=${encodeURIComponent(
                        RETURN_SECTIONS.filter((s) => sections.has(s.code))
                          .map((s) => s.code)
                          .join(","),
                      )}`;
                  return downloadFrom(
                    `${BACKEND_PROXY_BASE}/export_returns_xlsx${qs}`,
                    "Buy_List_Returns.xlsx",
                  );
                })
              }
            >
              Download Excel
            </button>
            {sections.size === 0 ? (
              <span
                style={{
                  marginLeft: 8,
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--text3)",
                }}
              >
                Pick at least one section.
              </span>
            ) : null}
          </div>
        </Card>
      </div>

      {error ? (
        <div className="alert alert-error" style={{ marginTop: 10 }}>
          {error}
        </div>
      ) : null}
    </div>
  );
}
