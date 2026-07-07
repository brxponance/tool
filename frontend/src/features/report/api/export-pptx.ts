import { BACKEND_PROXY_BASE } from "@/lib/constants";

// The five capture surfaces the backend deck expects, keyed by the DOM id we
// tag on each report panel and the payload key build_portfolio_pptx reads.
export const PPTX_CAPTURE_TARGETS = [
  { id: "rpt-capture-portfolio-managers", key: "portfolio_managers" },
  { id: "rpt-capture-vg-positioning", key: "vg_positioning" },
  { id: "rpt-capture-factset-risk", key: "factset_risk" },
  { id: "rpt-capture-mcr", key: "mcr" },
  { id: "rpt-capture-market-cycle", key: "market_cycle" },
] as const;

export type PptxImages = Record<string, string | null>;

async function captureNode(id: string): Promise<string | null> {
  const el = document.getElementById(id);
  if (!el) return null;
  // Lazy-import so html2canvas is only pulled in when the user actually
  // exports — keeps it out of the initial route bundle.
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    logging: false,
    useCORS: true,
  });
  return canvas.toDataURL("image/png");
}

export type PptxExportResult = {
  filename: string;
  skipped: string[];
};

// Capture the on-screen report panels, POST them to /export_portfolio_pptx,
// and trigger a browser download of the returned .pptx. onProgress reports
// each capture step so the button can show "Capturing 2/5…".
export async function exportPortfolioPptx(params: {
  clientName: string;
  benchmarkName?: string | null;
  onProgress?: (label: string) => void;
}): Promise<PptxExportResult> {
  const { clientName, benchmarkName, onProgress } = params;

  const images: PptxImages = {};
  let step = 0;
  for (const target of PPTX_CAPTURE_TARGETS) {
    step += 1;
    onProgress?.(`Capturing ${step}/${PPTX_CAPTURE_TARGETS.length}…`);
    try {
      images[target.key] = await captureNode(target.id);
    } catch {
      images[target.key] = null; // a failed capture just skips that slide
    }
  }

  onProgress?.("Generating PPTX…");
  const response = await fetch(`${BACKEND_PROXY_BASE}/export_portfolio_pptx`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      client_name: clientName,
      benchmark_name: benchmarkName ?? null,
      images,
    }),
  });

  if (!response.ok) {
    let message = `Export failed with status ${response.status}.`;
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload?.error) message = payload.error;
    } catch {
      // non-JSON error body — keep the generic message
    }
    throw new Error(message);
  }

  const blob = await response.blob();

  // Parse the filename from Content-Disposition (the proxy now forwards it),
  // falling back to a client-derived name.
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = /filename="?([^"]+)"?/.exec(disposition);
  const safeClient = clientName.replace(/[^A-Za-z0-9_-]/g, "_") || "Portfolio";
  const filename = match?.[1] ?? `${safeClient}_Memo_Report.pptx`;

  const skippedHeader = response.headers.get("x-skipped-slides") ?? "";
  const skipped = skippedHeader
    ? skippedHeader.split(";").map((s) => s.trim()).filter(Boolean)
    : [];

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  return { filename, skipped };
}
