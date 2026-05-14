// DGA Design System — Green palette only (SA primary colors)
export const DGA_CHART_COLORS = [
  "#25935F", // SA 500 — Main brand color
  "#54C08A", // SA 400 — Interactive elements
  "#88D8AD", // SA 300 — Secondary accent
  "#1B8354", // SA 600 — Hover states
  "#B8EACB", // SA 200 — Light accent
  "#166A45", // SA 700 — Active states
  "#DFF6E7", // SA 100 — Light background
  "#14573A", // SA 800 — Dark accent
  "#104631", // SA 900 — Dark text
  "#092A1E", // SA 950 — Darkest shade
] as const;

export type DGAChartColor = (typeof DGA_CHART_COLORS)[number];

export function getChartColor(index: number): string {
  return DGA_CHART_COLORS[index % DGA_CHART_COLORS.length];
}
