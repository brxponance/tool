// Quarterly Review — house content that is authored each quarter rather than
// computed: internal guidelines, macro views, and the illustrative stress
// assumptions. EXAMPLE CONTENT (2026-09-09) until it is stored per quarter.
//
// Everything in the report that reads "guideline", "house view" or
// "illustrative" is driven from here, so the numbers can be changed in one
// place while the layout is being agreed.

export type GuidelineKind =
  | "max_country" // largest single-country weight
  | "max_sector"
  | "max_industry"
  | "max_manager" // largest single-manager weight
  | "max_product_share" // client $ / strategy AUM, per manager
  | "min_dwbe_share"; // % of firms majority diverse / woman owned

export type InternalGuideline = {
  kind: GuidelineKind;
  label: string;
  // Limits are in the unit the check reports: portfolio % for weights,
  // % of product AUM for max_product_share, % of firms for min_dwbe_share.
  limit: number;
  warn: number; // "near limit" threshold
  scope: "Firm" | "Client preference";
  note: string;
};

export const INTERNAL_GUIDELINES: InternalGuideline[] = [
  { kind: "max_country", label: "Single country", limit: 35, warn: 30, scope: "Firm",
    note: "Largest single-country weight in the portfolio (Cash excluded)." },
  { kind: "max_sector", label: "Single sector", limit: 30, warn: 26, scope: "Firm",
    note: "Largest GICS sector weight." },
  { kind: "max_industry", label: "Single industry", limit: 15, warn: 12, scope: "Firm",
    note: "Largest GICS industry weight." },
  { kind: "max_manager", label: "Single manager", limit: 35, warn: 30, scope: "Firm",
    note: "Largest single-manager allocation." },
  { kind: "max_product_share", label: "Client share of product AUM", limit: 25, warn: 20, scope: "Client preference",
    note: "Client dollars in a strategy ÷ that strategy's total AUM (qualitative workbook)." },
  { kind: "min_dwbe_share", label: "Majority-DWBE firms", limit: 50, warn: 60, scope: "Client preference",
    note: "Share of firms held that are ≥50% diverse / woman owned. Minimum, not maximum." },
];

// ── Macro views (next two years) ─────────────────────────────────────────
// Two layers, on purpose: short thesis bullets carry the reasoning; the view
// vector is what the client pages test the portfolios against.
export const MACRO_HORIZON = "Two-year view · Q3 2026";

export const MACRO_THEMES: string[] = [
  "Rate cuts broaden the rally beyond US mega-cap technology; non-US small cap and value re-rate.",
  "Japan corporate-governance reform keeps compounding: buybacks, cross-shareholding unwinds, and rising ROE.",
  "European industrials and software face margin pressure from a stronger euro and slower China capex.",
  "Emerging markets ex-China benefit from supply-chain relocation (India, Mexico, ASEAN) while China stays a tactical, not strategic, allocation.",
  "Quality is expensive; we prefer to source quality through profitability, not low volatility.",
];

export type ViewDirection = "OW" | "UW" | "N";
export type MacroView = {
  dimension: "Region" | "Country" | "Sector" | "Industry" | "Factor";
  bucket: string; // must match the exposure row label (or FactSet factor name)
  view: ViewDirection;
  conviction: 1 | 2 | 3;
  rationale: string;
};

export const MACRO_VIEWS: MacroView[] = [
  { dimension: "Country", bucket: "Japan", view: "OW", conviction: 3,
    rationale: "Governance reform, weak yen tailwind for exporters, domestic reflation." },
  { dimension: "Region", bucket: "Europe Core", view: "UW", conviction: 2,
    rationale: "Earnings downgrades in industrials and software; strong euro." },
  { dimension: "Country", bucket: "United Kingdom", view: "OW", conviction: 1,
    rationale: "Cheap, high dividend, defensive sector mix." },
  { dimension: "Region", bucket: "Pacific Rim", view: "OW", conviction: 2,
    rationale: "Japan plus Australia resources exposure." },
  { dimension: "Sector", bucket: "Information Technology", view: "UW", conviction: 2,
    rationale: "Valuation; prefer hardware supply chain (Japan) over European software." },
  { dimension: "Sector", bucket: "Industrials", view: "N", conviction: 1,
    rationale: "Mixed: defence and electrification positive, autos and capital goods negative." },
  { dimension: "Sector", bucket: "Financials", view: "OW", conviction: 2,
    rationale: "Steeper curves outside the US; Japanese banks." },
  { dimension: "Factor", bucket: "Profitability", view: "OW", conviction: 2,
    rationale: "Preferred route to quality." },
  { dimension: "Factor", bucket: "Volatility", view: "UW", conviction: 1,
    rationale: "Low-volatility quality is crowded and expensive." },
];

// ── Example exposure risks ──────────────────────────────────────────────
// Shown on a client's risk page when the exposures workbook carries no
// sector / industry data (true for every client today), so the layout can
// be agreed. Written the way a real row should read: the bucket where the
// bet actually sits, not just the country.
export type ExampleExposureRisk = {
  label: string; // "United States — Information Technology"
  kind: "Country" | "Region" | "Sector" | "Industry";
  portfolio: number; // %
  benchmark: number; // %
  detail: string; // what the bet really is
  drivers: { name: string; contribution: number }[]; // pp
};

export const EXAMPLE_EXPOSURE_RISKS: ExampleExposureRisk[] = [
  { label: "United States — Information Technology", kind: "Country",
    portfolio: 3.2, benchmark: 9.8,
    detail: "The US underweight (−8.1 pp) is really a tech underweight: −6.6 pp in IT, of which −4.9 pp is semiconductors.",
    drivers: [{ name: "Mac Alpha", contribution: 2.1 }, { name: "Hillsdale EAFE Small Cap", contribution: 1.1 }] },
  { label: "Europe Core — Software & Services", kind: "Region",
    portfolio: 6.9, benchmark: 2.6,
    detail: "European software overweight concentrated in two managers; +4.3 pp of the +5.0 pp Europe Core overweight.",
    drivers: [{ name: "Bayard", contribution: 2.4 }, { name: "Osmosis", contribution: 1.9 }] },
  { label: "Japan — Technology Hardware & Equipment", kind: "Country",
    portfolio: 1.8, benchmark: 4.9,
    detail: "Japan is near-benchmark overall (−2.6 pp) but −3.1 pp in tech hardware, offset by +2.0 pp in industrials.",
    drivers: [{ name: "CastleArk EAFE SC", contribution: 1.2 }, { name: "Ballina", contribution: 0.6 }] },
];

// ── Illustrative stress assumptions ─────────────────────────────────────
// Used to put every active bet on one scale. Deliberately simple: a
// relative move applied to the active weight (weights) or to the active
// exposure (FactSet factors). Not a risk model — a ranking device.
export const STRESS_ASSUMPTIONS = {
  // 10 % relative move in a country / sector / industry bucket
  bucketShockPct: 10,
  // 3 % return per unit of active FactSet exposure (≈ one-sigma factor move)
  factorShockPctPerUnit: 3,
};
