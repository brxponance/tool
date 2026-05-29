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