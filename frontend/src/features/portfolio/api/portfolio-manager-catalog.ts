import { backendJson } from "@/lib/backend";

import type {
  PortfolioManagerCatalogResponse,
  PortfolioManagerDetailResponse,
} from "../types";

export async function getPortfolioManagerCatalog() {
  return backendJson<PortfolioManagerCatalogResponse>("all_managers");
}

export async function getPortfolioManagerDetail(tab: string, manager: string) {
  return backendJson<PortfolioManagerDetailResponse>(
    `manager_detail/${encodeURIComponent(tab)}/${encodeURIComponent(manager)}`,
  );
}