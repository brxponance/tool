import { backendJson } from "@/lib/backend";

import type {
  ManagerDetailScreenData,
  ManagerDirectoryResponse,
  ManagerRecommendationsResponse,
  ManagerRawDetail,
  ManagerSkillSummary,
  PeriodReturnSeries,
} from "../types";

function emptyPeriodSeries(): PeriodReturnSeries {
  return { qtd: null, ytd: null, t1: null, t3: null, t5: null, si: null };
}

// Placeholder managers (< 3 years of returns) have no clone and no entry in
// /manager_detail, /manager_skill_summary, or /manager_recommendations.
// Mirror the reference UI: synthesise a stub so the page still renders — the
// FactSet risk + exposures panels work directly off upload data and don't
// need clone_results.
function placeholderScreenData(
  tab: string,
  manager: string,
): ManagerDetailScreenData {
  return {
    raw: {
      r2_full: null,
      ns_z: null,
      style_buckets: {},
      betas_full: {},
    },
    summary: {
      name: manager,
      tab,
      is_placeholder: true,
      benchmark_name: null,
      skill_periods: {},
      cumulative_skill: [],
      dates: [],
      period_returns: {
        mgr: emptyPeriodSeries(),
        clone: emptyPeriodSeries(),
        bench: emptyPeriodSeries(),
      },
      betas_full: {},
      style_buckets: {},
      r2_full: null,
    },
    recommendations: {
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
    },
  };
}

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
  if (tab === "Placeholder") {
    logManagerDetailApi("placeholder manager — synthesising stub payload", {
      manager,
      tab,
    });
    return placeholderScreenData(tab, manager);
  }

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