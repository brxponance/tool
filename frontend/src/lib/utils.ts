export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatPercent(value: number | null | undefined, digits = 1) {
  if (value == null || Number.isNaN(value)) {
    return "--";
  }
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatSignedPercent(value: number | null | undefined, digits = 1) {
  if (value == null || Number.isNaN(value)) {
    return "--";
  }
  const scaled = value * 100;
  const sign = scaled >= 0 ? "+" : "";
  return `${sign}${scaled.toFixed(digits)}%`;
}

export function formatNumber(value: number | null | undefined, digits = 2) {
  if (value == null || Number.isNaN(value)) {
    return "--";
  }
  return value.toFixed(digits);
}

// Full-dollar formatting with thousands separators, e.g. 2500000000 ->
// "$2,500,000,000". Client AUM is entered in raw dollars in column C of the
// weights workbook, so it is displayed at full precision rather than abbreviated.
export function formatDollars(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) {
    return "--";
  }
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

// Compact dollar form for tight cells, e.g. 2500000000 -> "$2.50B".
export function formatDollarsCompact(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) {
    return "--";
  }
  const abs = Math.abs(value);
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${Math.round(value)}`;
}

export function formatDateLabel(value: string | null | undefined) {
  if (!value) {
    return "--";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}