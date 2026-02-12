export function formatNumber(value) {
  if (value == null) return "\u2014";
  return value.toLocaleString("en-US");
}

export function formatSpec(value, unit, type) {
  if (value == null) return "\u2014";
  if (type === "boolean") return value ? "\u2705" : "\u274C";
  if (type === "text") return String(value);
  return `${formatNumber(value)} ${unit}`.trim();
}

export function formatRange(min, max, unit) {
  if (min == null && max == null) return "\u2014";
  if (min === max) return `${formatNumber(min)} ${unit}`.trim();
  return `${formatNumber(min)} \u2013 ${formatNumber(max)} ${unit}`.trim();
}

export function percentOf(value, max) {
  if (!max || !value) return 0;
  return Math.round((value / max) * 100);
}
