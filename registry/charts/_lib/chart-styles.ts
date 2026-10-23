/**
 * Shared gallery chart chrome.
 *
 * Dual-series default: --chart-1 (primary blue) × --chart-2 (teal).
 * --chart-3…5 are semantic-only companions (amber / indigo / rose) —
 * not a third default bar series.
 */

export const CHART_SERIES_A = "var(--chart-1)"
export const CHART_SERIES_B = "var(--chart-2)"

/** Dual series + semantic extras (3+ for up/alert/accent data only). */
export const CHART_BAR_COLORS = [
  "#2563EB", // chart-1 primary blue
  "#0D9488", // chart-2 teal
  "#F59E0B", // chart-3 semantic amber
  "#6366F1", // chart-4 semantic indigo
  "#E11D48", // chart-5 semantic rose
] as const

/** Faint horizontal grid — sits behind bars, never competes with series. */
export const chartDashedGridClassName =
  "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/40 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50"

/**
 * Bar stage — responsive height on the 4px scale; min-w-0 so flex parents
 * cannot clip axis ticks; overflow visible for edge labels.
 */
export const chartContainerClassName =
  "aspect-auto h-56 w-full min-w-0 max-w-[640px] overflow-visible font-sans text-xs sm:h-64 [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-surface]:overflow-visible"

/** Soft hover on bar rects — opacity only, no glow filters. */
export const chartBarHoverClassName =
  "[&_.recharts-bar-rectangle]:transition-[opacity] [&_.recharts-bar-rectangle]:duration-150 [&_.recharts-bar-rectangle]:ease-out [&_.recharts-active-bar]:opacity-90"

/** Bar demos — faint grid + quiet hover. */
export const chartBarContainerClassName = [
  chartContainerClassName,
  chartDashedGridClassName,
  chartBarHoverClassName,
].join(" ")
