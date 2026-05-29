// Formatters ported verbatim from the legacy report so the report tab's
// number formatting (signs, percent precision, color classes) matches the
// PDF exactly. The unicode minus (−) preserved on negatives is important
// for visual fidelity — it's wider and matches the table grid.

export function rptFmtPct1(v: number | null | undefined): string {
  if (v == null || Number.isNaN(v)) return "--";
  return `${(v * 100).toFixed(1)}%`;
}

// Active weight in percentage points, signed.
export function rptFmtPp(v: number | null | undefined): string {
  if (v == null || Number.isNaN(v)) return "--";
  const pp = v * 100;
  const sign = pp >= 0 ? "+" : "−";
  return `${sign}${Math.abs(pp).toFixed(1)} pp`;
}

export function rptFmtSigned(v: number | null | undefined, digits = 2): string {
  if (v == null || Number.isNaN(v)) return "--";
  const sign = v >= 0 ? "+" : "−";
  return `${sign}${Math.abs(v).toFixed(digits)}`;
}

// Decimal return → signed percent, e.g. 0.0234 → "+2.34%".
export function rptFmtRet(v: number | null | undefined, digits = 2): string {
  if (v == null || Number.isNaN(v)) return "--";
  const pct = v * 100;
  const sign = pct >= 0 ? "+" : "−";
  return `${sign}${Math.abs(pct).toFixed(digits)}%`;
}

// Sign-based color class. Convention here (matching legacy):
//   value > 0 → val-pos (red, used for value tilt / overweights)
//   value < 0 → val-neg (green, used for growth tilt / underweights)
//   zero/null → empty
// Override at the call site for skill (positive = green) — that uses the
// separate `skill-pos` / `skill-neg` classes.
export function rptValCls(v: number | null | undefined): string {
  if (v == null || Number.isNaN(v)) return "";
  if (v > 0) return "val-pos";
  if (v < 0) return "val-neg";
  return "val-neu";
}
