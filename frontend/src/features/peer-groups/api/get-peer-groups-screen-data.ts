import { backendJson } from "@/lib/backend";

import type { AllManagersResponse, PeerGroupsResponse } from "../types";

export async function getManagerIndex() {
  return backendJson<AllManagersResponse>("all_managers");
}

export async function getPeerGroupSummary(tab: string) {
  return backendJson<PeerGroupsResponse>(`peer_skill_summary/${encodeURIComponent(tab)}`);
}