import { backendJson } from "@/lib/backend";

import type {
  ManagerDetailScreenData,
  ManagerDirectoryResponse,
  ManagerRecommendationsResponse,
  ManagerRawDetail,
  ManagerSkillSummary,
} from "../types";

function logManagerDetailApi(message: string, payload?: Record<string, unknown>) {
  if (payload) {
    console.info("[manager-detail][api]", message, payload);
    return;
  }

  console.info("[manager-detail][api]", message);
}

export async function getManagerDirectory() {
  logManagerDetailApi("requesting directory");
  return backendJson<ManagerDirectoryResponse>("all_managers");
}

export async function getManagerDetailScreenData(
  tab: string,
  manager: string,
): Promise<ManagerDetailScreenData> {
  const encodedTab = encodeURIComponent(tab);
  const encodedManager = encodeURIComponent(manager);

  logManagerDetailApi("requesting detail payload", {
    manager,
    tab,
  });

  const [raw, summary, recommendations] = await Promise.all([
    backendJson<ManagerRawDetail>(`manager_detail/${encodedTab}/${encodedManager}`),
    backendJson<ManagerSkillSummary>(
      `manager_skill_summary/${encodedTab}/${encodedManager}`,
    ),
    backendJson<ManagerRecommendationsResponse>(
      `manager_recommendations/${encodedTab}/${encodedManager}`,
    ).catch((error) => {
      console.warn("[manager-detail][api] recommendation request failed; using empty fallback", {
        manager,
        tab,
        error,
      });

      return {
        reference: {
          name: manager,
          tab,
          ns_z: null,
          vol_36m: null,
          downside_dev_36m: null,
        },
        closest_matches: [],
        skill_upgrades: [],
        lower_risk_matches: [],
        scope: "same_tab_only",
      };
    }),
  ]);

  logManagerDetailApi("detail payload resolved", {
    manager,
    tab,
    benchmark: summary.benchmark_name,
    recommendationCount: recommendations.closest_matches.length,
  });

  return { raw, summary, recommendations };
}