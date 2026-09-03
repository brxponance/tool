import { BACKEND_PROXY_BASE } from "@/lib/constants";

// Editable Word rebalance memo. Unlike the PPTX deck — which is screenshots of
// every panel — the memo is real editable text assembled server-side from the
// loaded FactSet/qualitative files. The ONLY thing captured from the DOM is the
// market-cycle chart, because it has no tabular equivalent.
// Chart-only node (no panel border/title/benchmark caption and no placement
// table); the full section id remains as a fallback for stale bundles.
const MARKET_CYCLE_NODE_ID = "market-cycle-chart-only";
const MARKET_CYCLE_FALLBACK_ID = "market-cycle-section";

export type DocxManagerInput = {
  matched_name: string;
  weight_file_name?: string;
  tab?: string;
  current_weight: number;
  proposed_weight: number;
};

async function captureMarketCycle(): Promise<string | null> {
  const el =
    document.getElementById(MARKET_CYCLE_NODE_ID) ??
    document.getElementById(MARKET_CYCLE_FALLBACK_ID);
  if (!el) return null;
  try {
    // Lazy-import so html2canvas stays out of the Portfolio route bundle.
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
    });
    return canvas.toDataURL("image/png");
  } catch {
    // A failed capture just omits the chart — the memo still builds.
    return null;
  }
}

// POST the portfolio to /export_portfolio_docx and download the .docx.
// onProgress reports the two phases so the button can show what it's doing.
export async function exportPortfolioDocx(params: {
  clientName: string;
  managers: DocxManagerInput[];
  includeMarketCycle?: boolean;
  onProgress?: (label: string) => void;
}): Promise<{ filename: string }> {
  const { clientName, managers, includeMarketCycle = true, onProgress } = params;

  let marketCycle: string | null = null;
  if (includeMarketCycle) {
    onProgress?.("Capturing market cycle…");
    marketCycle = await captureMarketCycle();
  }

  onProgress?.("Building memo…");
  const response = await fetch(`${BACKEND_PROXY_BASE}/export_portfolio_docx`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      client_name: clientName,
      managers,
      images: marketCycle ? { market_cycle: marketCycle } : {},
    }),
  });

  if (!response.ok) {
    let message = `Memo export failed with status ${response.status}.`;
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
  const safeClient = clientName.replace(/[^A-Za-z0-9_-]/g, "_") || "Portfolio";
  const filename = match?.[1] ?? `${safeClient}_Rebalance_Memo.docx`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  return { filename };
}
