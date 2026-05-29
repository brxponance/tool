import { backendJson } from "@/lib/backend";

import type { ReportPayload } from "../types";

export async function getReportPayload(client: string) {
  return backendJson<ReportPayload>(
    `portfolio_report/${encodeURIComponent(client)}`,
  );
}
