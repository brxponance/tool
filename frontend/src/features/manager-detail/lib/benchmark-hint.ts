// Per-tab benchmark hint passed to the FactSet risk/exposures backends.
// Port of the reference UI's mgrBenchmarkHint() (clone_tool/static/index.html).
// Strings are FactSet-style and get fuzzy-matched to actual file column
// names server-side. xUS-named managers on EAFE/ACWI re-route to the ACWI
// ex-US benchmark; ISC and USSC stay on their tab default since their
// underlying indices are already correct.

// Manual benchmark overrides for managers whose firm name doesn't reflect
// the strategy (e.g., "Evolution Global" is actually international small cap).
// Add entries here when the name-based inference below produces the wrong
// benchmark. Wins over both peer-tab routing and name-based inference.
export const MGR_BENCHMARK_OVERRIDES: Record<string, string> = {
  "Evolution Global": "MSCI EAFE Small Cap",
};

export function mgrBenchmarkHint(name: string, tab: string): string | null {
  if (MGR_BENCHMARK_OVERRIDES[name]) return MGR_BENCHMARK_OVERRIDES[name];
  const lower = (name || "").toLowerCase();
  // "Non-US" / "Non US" treated as ACWI ex-US alongside the xUS markers.
  const isXus = /xus|acwixus|acwi ex|ex us|ex-us|non[ -]us/.test(lower);
  // Placeholder managers don't carry a peer tab — infer one from the name
  // so the FactSet panels still pick a sensible benchmark.
  let resolvedTab: string | null = tab;
  if (tab === "Placeholder") resolvedTab = inferTabFromName(name);
  if (isXus && resolvedTab !== "ISC" && resolvedTab !== "USSC") {
    return "MSCI ACWI ex US";
  }
  switch (resolvedTab) {
    case "EAFE":
      return "MSCI EAFE";
    case "ACWI":
      return "MSCI ACWI";
    case "ISC":
      return "MSCI ACWI ex US Small Cap";
    case "EM":
      return "MSCI EM";
    case "US":
      return "Russell 1000";
    case "USSC":
      return "Russell 2000";
    default:
      return null;
  }
}

// Best-effort tab inference from a manager name. Mirrors data_loader.infer_tab
// for the placeholder code path where the backend hasn't classified the
// manager into a peer tab. Returns null when no marker is found, which
// callers should treat as "no benchmark hint" (backend uses file default).
export function inferTabFromName(name: string): string | null {
  const u = (name || "").toUpperCase();
  const isSmall = / SC\b| SMALL\b|SMALLCAP|SMALL CAP/.test(u);
  const isXus = /XUS|ACWIXUS|ACWI EX|EX US|EX-US|NON[ -]US/.test(u);
  if (/ ISC\b/.test(u)) return "ISC";
  if (isSmall && (isXus || /(EAFE|ACWI|GLOBAL|WORLD|DEVELOPED|\bDM\b)/.test(u))) {
    return "ISC";
  }
  if (isSmall && /( EM\b|EMERGING)/.test(u)) return "EM";
  if (isXus) return "EAFE"; // mgrBenchmarkHint will then re-route to ACWI_xUS
  if (/EAFE/.test(u)) return "EAFE";
  if (/(ACWI|GLOBAL|WORLD)/.test(u)) return "ACWI";
  if (/( EM\b|^EM\b|EMERGING)/.test(u)) return "EM";
  // "Developed Markets" / "Dev Mkt" / "DM" — institutional shorthand
  // typically means developed ex-US in this context. Defaults to EAFE.
  if (/DEVELOPED|DEV MKT|\bDM\b/.test(u)) return "EAFE";
  if (isSmall && /( US\b|^US\b|U\.S\.)/.test(u)) return "USSC";
  if (/( US\b|^US\b|U\.S\.)/.test(u)) return "US";
  return null;
}
