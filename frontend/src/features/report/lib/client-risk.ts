// Computed risk / guideline views for one client report. Pure functions over
// data the report hook already fetches (portfolio-level exposures, FactSet
// active exposures, per-manager exposures, the diverse-ownership rollup, the
// /portfolio managers) so they can be unit-tested and reused by the combined
// quarterly review.

import type {
  DiverseOwnershipResponse,
  PortfolioExposureRow,
  PortfolioExposuresResponse,
  PortfolioManager,
  RiskExposuresResponse,
} from "@/features/portfolio/types";

import type { ExposuresPack } from "../hooks/use-report-screen";
import {
  EXAMPLE_EXPOSURE_RISKS,
  INTERNAL_GUIDELINES,
  MACRO_VIEWS,
  STRESS_ASSUMPTIONS,
  type InternalGuideline,
  type MacroView,
} from "./quarterly-review-content";
import type { ReportMockQtrRow } from "./report-mock";

// Per-manager exposure rows for one grouping: manager name → rows with
// `current` = that manager's own exposure (%), fetched by sending the manager
// alone at weight 1.
export type ManagerExposureMap = Record<string, PortfolioExposureRow[]>;
export type ManagerExposuresPack = {
  Country: ManagerExposureMap;
  Sector: ManagerExposureMap;
  Industry: ManagerExposureMap;
};

export type Driver = { name: string; contribution: number }; // pp of portfolio weight

const NON_BUCKETS = new Set(["Cash", "Unclassified"]);

function usableRows(data: PortfolioExposuresResponse | null): PortfolioExposureRow[] {
  return (data?.rows ?? []).filter(
    (r) => !NON_BUCKETS.has(r.label) && !r.insufficient_data,
  );
}

// Managers driving `label` in a grouping: weight × own exposure, largest first.
export function driversFor(
  label: string,
  managers: PortfolioManager[],
  perManager: ManagerExposureMap | undefined,
  limit = 3,
): Driver[] {
  if (!perManager) return [];
  const out: Driver[] = [];
  for (const m of managers) {
    const rows = perManager[m.matched_name];
    if (!rows) continue;
    const row = rows.find((r) => r.label === label);
    if (!row) continue;
    const contribution = (m.current_weight || 0) * (row.current || 0);
    if (contribution > 0.05) out.push({ name: m.matched_name, contribution });
  }
  return out.sort((a, b) => b.contribution - a.contribution).slice(0, limit);
}

// ── Guideline compliance ────────────────────────────────────────────────
export type GuidelineStatus = "ok" | "near" | "breach" | "na";
export type GuidelineCheck = {
  guideline: InternalGuideline;
  value: number | null; // in the guideline's unit
  subject: string | null; // the bucket / manager the value refers to
  status: GuidelineStatus;
  drivers: Driver[];
};

function maxRow(rows: PortfolioExposureRow[]): PortfolioExposureRow | null {
  return rows.reduce<PortfolioExposureRow | null>(
    (best, r) => (best == null || r.current > best.current ? r : best),
    null,
  );
}

function statusForMax(value: number | null, g: InternalGuideline): GuidelineStatus {
  if (value == null) return "na";
  if (value >= g.limit) return "breach";
  if (value >= g.warn) return "near";
  return "ok";
}

export function guidelineChecks(input: {
  exposures: ExposuresPack;
  managerExposures: ManagerExposuresPack;
  managers: PortfolioManager[];
  diverse: DiverseOwnershipResponse | null;
}): GuidelineCheck[] {
  const { exposures, managerExposures, managers, diverse } = input;
  const held = managers.filter((m) => (m.current_weight || 0) > 0);

  return INTERNAL_GUIDELINES.map((g) => {
    switch (g.kind) {
      case "max_country":
      case "max_sector":
      case "max_industry": {
        const grouping =
          g.kind === "max_country" ? "Country" : g.kind === "max_sector" ? "Sector" : "Industry";
        const row = maxRow(usableRows(exposures[grouping]));
        const value = row ? row.current : null;
        return {
          guideline: g,
          value,
          subject: row?.label ?? null,
          status: statusForMax(value, g),
          drivers: row ? driversFor(row.label, held, managerExposures[grouping]) : [],
        };
      }
      case "max_manager": {
        const top = held.reduce<PortfolioManager | null>(
          (b, m) => (b == null || m.current_weight > b.current_weight ? m : b),
          null,
        );
        const value = top ? top.current_weight * 100 : null;
        return {
          guideline: g,
          value,
          subject: top?.matched_name ?? null,
          status: statusForMax(value, g),
          drivers: top ? [{ name: top.matched_name, contribution: value! }] : [],
        };
      }
      case "max_product_share": {
        let best: { m: PortfolioManager; share: number } | null = null;
        for (const m of held) {
          if (m.aum_current == null || !m.q_strategy_aum) continue;
          const share = (100 * m.aum_current) / m.q_strategy_aum;
          if (!best || share > best.share) best = { m, share };
        }
        return {
          guideline: g,
          value: best?.share ?? null,
          subject: best?.m.matched_name ?? null,
          status: statusForMax(best?.share ?? null, g),
          drivers: best ? [{ name: best.m.matched_name, contribution: best.share }] : [],
        };
      }
      case "min_dwbe_share": {
        const cur = diverse?.has_data ? diverse.current : undefined;
        const value = cur && cur.n_firms > 0 ? cur.ratio_pct : null;
        let status: GuidelineStatus = "na";
        if (value != null) {
          status = value < g.limit ? "breach" : value < g.warn ? "near" : "ok";
        }
        return {
          guideline: g,
          value,
          subject: cur ? `${cur.n_diverse} of ${cur.n_firms} firms` : null,
          status,
          drivers: [],
        };
      }
    }
  });
}

// ── Top active risks with an illustrative stress ────────────────────────
export type ActiveRisk = {
  kind: "Region" | "Country" | "Sector" | "Industry" | "Factor";
  label: string;
  portfolio: number | null; // % (weights) or exposure (factor)
  benchmark: number | null;
  active: number; // pp or exposure units
  impactBps: number; // illustrative, always positive
  drivers: Driver[];
  // Where the bet really sits ("US underweight is a tech underweight").
  detail?: string;
  // True when the row is example content (no sector data for this client).
  example?: boolean;
};

export type ActiveRiskSet = {
  factors: ActiveRisk[];
  exposures: ActiveRisk[];
  exposuresAreExample: boolean;
};

const bucketImpact = (activePp: number) =>
  Math.abs(activePp) * STRESS_ASSUMPTIONS.bucketShockPct;

// Exposure bets with the sector they actually sit in, from a Country ×
// Sector nested response: each child row is "<country> — <sector>" and the
// detail says how much of the country bet that sector explains.
function nestedExposureRisks(
  nested: PortfolioExposuresResponse | null | undefined,
  held: PortfolioManager[],
  managerExposures: ManagerExposuresPack,
): ActiveRisk[] {
  const out: ActiveRisk[] = [];
  for (const parent of usableRows(nested ?? null)) {
    const parentActive = parent.delta_current ?? parent.current - parent.benchmark;
    for (const child of parent.children ?? []) {
      if (NON_BUCKETS.has(child.label) || child.insufficient_data) continue;
      const active = child.delta_current ?? child.current - child.benchmark;
      if (Math.abs(active) < 0.5) continue;
      const share = parentActive ? Math.min(100, Math.round((100 * active) / parentActive)) : null;
      const sameSign = parentActive !== 0 && Math.sign(active) === Math.sign(parentActive);
      const detail =
        sameSign && share != null && share >= 40
          ? `${parent.label} is ${parentActive > 0 ? "over" : "under"}weight ${Math.abs(parentActive).toFixed(1)} pp; ${child.label} accounts for ${share}% of it.`
          : `${parent.label} is ${parentActive > 0 ? "over" : "under"}weight ${Math.abs(parentActive).toFixed(1)} pp overall; this ${child.label} bet runs the other way.`;
      out.push({
        kind: "Country",
        label: `${parent.label} — ${child.label}`,
        portfolio: child.current,
        benchmark: child.benchmark,
        active,
        impactBps: bucketImpact(active),
        drivers: driversFor(parent.label, held, managerExposures.Country),
        detail,
      });
    }
  }
  return out.sort((a, b) => b.impactBps - a.impactBps);
}

// Three FactSet factor bets + three exposure bets, each family ranked by
// illustrative impact. Exposure bets use the Country × Sector breakdown when
// the client has sector data; otherwise example rows (flagged) so the layout
// still reads correctly.
export function topActiveRisks(input: {
  exposures: ExposuresPack;
  riskExposures: RiskExposuresResponse | null;
  managerExposures: ManagerExposuresPack;
  managers: PortfolioManager[];
  perFamily?: number;
}): ActiveRiskSet {
  const { exposures, riskExposures, managerExposures, managers, perFamily = 3 } = input;
  const held = managers.filter((m) => (m.current_weight || 0) > 0);

  // Factors
  const factors: ActiveRisk[] = [];
  if (riskExposures?.factors?.length) {
    for (const f of riskExposures.factors) {
      const v = riskExposures.current?.[f];
      if (v == null || Math.abs(v) < 0.15) continue;
      factors.push({
        kind: "Factor",
        label: f,
        portfolio: null,
        benchmark: null,
        active: v,
        impactBps: Math.abs(v) * STRESS_ASSUMPTIONS.factorShockPctPerUnit * 100,
        drivers: [],
      });
    }
  }
  factors.sort((a, b) => b.impactBps - a.impactBps);

  // Exposures — detailed (Country × Sector) when sector data exists.
  const hasSectorData = usableRows(exposures.Sector).length > 0;
  let exposureRisks: ActiveRisk[] = [];
  let exposuresAreExample = false;
  if (hasSectorData) {
    exposureRisks = nestedExposureRisks(exposures.CountrySector, held, managerExposures);
    if (!exposureRisks.length) exposureRisks = flatExposureRisks(exposures, held, managerExposures);
  } else {
    exposuresAreExample = true;
    exposureRisks = EXAMPLE_EXPOSURE_RISKS.map((e) => ({
      kind: e.kind,
      label: e.label,
      portfolio: e.portfolio,
      benchmark: e.benchmark,
      active: e.portfolio - e.benchmark,
      impactBps: bucketImpact(e.portfolio - e.benchmark),
      drivers: e.drivers,
      detail: e.detail,
      example: true,
    }));
  }

  return {
    factors: factors.slice(0, perFamily),
    exposures: exposureRisks.slice(0, perFamily),
    exposuresAreExample,
  };
}

// Top-level country / region / sector / industry bets (no sector detail).
function flatExposureRisks(
  exposures: ExposuresPack,
  held: PortfolioManager[],
  managerExposures: ManagerExposuresPack,
): ActiveRisk[] {
  const out: ActiveRisk[] = [];

  // Region rows that are really a single country (United Kingdom, Japan,
  // Canada…) also appear under Country, where per-manager drivers exist —
  // keep the Country version only.
  const countryLabels = new Set(usableRows(exposures.Country).map((r) => r.label));
  (["Region", "Country", "Sector", "Industry"] as const).forEach((kind) => {
    for (const r of usableRows(exposures[kind])) {
      if (kind === "Region" && countryLabels.has(r.label)) continue;
      const active = r.delta_current ?? r.current - r.benchmark;
      if (Math.abs(active) < 0.5) continue;
      out.push({
        kind,
        label: r.label,
        portfolio: r.current,
        benchmark: r.benchmark,
        active,
        impactBps: bucketImpact(active),
        // Region has no per-manager fetch; Country/Sector/Industry do.
        drivers: kind === "Region" ? [] : driversFor(r.label, held, managerExposures[kind]),
      });
    }
  });
  return out.sort((a, b) => b.impactBps - a.impactBps);
}

// ── Worst quarters vs benchmark (historical stress) ─────────────────────
export type WorstQuarter = { qtr: string; port: number; bmk: number; excess: number };

export function worstQuarters(rows: ReportMockQtrRow[], limit = 5): WorstQuarter[] {
  return rows
    .map((r) => ({ qtr: r.qtr, port: r.port, bmk: r.bmk, excess: r.port - r.bmk }))
    .sort((a, b) => a.excess - b.excess)
    .slice(0, limit);
}

// ── Positioning vs house views ──────────────────────────────────────────
export type Alignment = "aligned" | "against" | "neutral" | "na";
export type HouseViewCheck = {
  view: MacroView;
  active: number | null;
  alignment: Alignment;
};

export function houseViewAlignment(input: {
  exposures: ExposuresPack;
  riskExposures: RiskExposuresResponse | null;
}): HouseViewCheck[] {
  const { exposures, riskExposures } = input;
  return MACRO_VIEWS.map((view) => {
    let active: number | null = null;
    if (view.dimension === "Factor") {
      active = riskExposures?.current?.[view.bucket] ?? null;
    } else {
      const rows = exposures[view.dimension]?.rows ?? [];
      const row = rows.find((r) => r.label.toLowerCase() === view.bucket.toLowerCase());
      active = row ? (row.delta_current ?? row.current - row.benchmark) : null;
    }
    let alignment: Alignment = "na";
    if (active != null) {
      const dead = view.dimension === "Factor" ? 0.1 : 0.5;
      if (view.view === "N") alignment = Math.abs(active) <= dead ? "aligned" : "against";
      else if (Math.abs(active) <= dead) alignment = "neutral";
      else alignment = (active > 0) === (view.view === "OW") ? "aligned" : "against";
    }
    return { view, active, alignment };
  });
}
