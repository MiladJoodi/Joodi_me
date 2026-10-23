/**
 * Shared gallery chart chrome — **LOCKED** with `simple-bar-chart`.
 *
 * Dual-series palette:
 * --chart-1 navy `#1E3A8A` (dark: `#3B82F6`) ×
 * --chart-2 orange `#EA580C` (dark: `#F97316`).
 * --chart-3…5 are semantic-only companions — not a third default series.
 *
 * Tokens: `app/globals.css` + `styles/vega-tokens.css` (+ registry cssVars).
 * Do not invent a second dual-series pair.
 */

export const CHART_SERIES_A = "var(--chart-1)"
export const CHART_SERIES_B = "var(--chart-2)"

/** Dual series + semantic extras (3+ for up/alert/accent data only). */
export const CHART_BAR_COLORS = [
  "#1E3A8A", // chart-1 navy
  "#EA580C", // chart-2 orange
  "#F59E0B", // chart-3 semantic amber
  "#6366F1", // chart-4 semantic indigo
  "#E11D48", // chart-5 semantic rose
] as const

/** Quiet dashed horizontal grid (~40% border — sits behind bars). */
export const chartDashedGridClassName =
  "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/40 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/40"

/**
 * Bar stage — h-64 / sm:h-72, max 640px; overflow for active total label.
 */
export const chartContainerClassName =
  "aspect-auto h-64 w-full min-w-0 max-w-[640px] overflow-visible font-sans text-xs tabular-nums sm:h-72 [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-surface]:overflow-visible"

/** Quiet opacity transition on bar rects. */
export const chartBarHoverClassName =
  "[&_.recharts-bar-rectangle]:transition-[opacity] [&_.recharts-bar-rectangle]:duration-200 [&_.recharts-bar-rectangle]:ease-out"

/** Grouped bar demos — faint grid + quiet hover. */
export const chartBarContainerClassName = [
  chartContainerClassName,
  chartDashedGridClassName,
  chartBarHoverClassName,
].join(" ")

/** Line demos — same stage + dashed grid (no bar-rect hover). */
export const chartLineContainerClassName = [
  chartContainerClassName,
  chartDashedGridClassName,
].join(" ")

/** Area demos — same stage + dashed grid as line. */
export const chartAreaContainerClassName = chartLineContainerClassName

/** Neon market triad — prefer CSS vars (see `vega-tokens` / globals). */
export const MARKET_UP = "var(--chart-up)"
export const MARKET_DOWN = "var(--chart-down)"
export const MARKET_MUTE = "var(--chart-mute)"

/** Shared area/spark gradient stops under the stroke line. */
export function chartAreaGradientStops(
  color: string,
  opts?: { startOpacity?: number; endOpacity?: number }
) {
  const startOpacity = opts?.startOpacity ?? 0.28
  const endOpacity = opts?.endOpacity ?? 0
  return [
    { offset: "0%", stopColor: color, stopOpacity: startOpacity },
    { offset: "100%", stopColor: color, stopOpacity: endOpacity },
  ] as const
}

/** Stroke weight matching market-card neon glow lines. */
export const CHART_NEON_STROKE_WIDTH = 2.25

/**
 * Soft neon edge — set on Recharts Area/Line.
 * Call sites pass this when `useMarketNeon()` is true (always on for install).
 */
export function chartNeonGlowProps(color: string) {
  return {
    strokeWidth: CHART_NEON_STROKE_WIDTH,
    style: { ["--chart-glow" as string]: color },
    className:
      "[&_.recharts-area-curve]:[filter:drop-shadow(0_0_6px_var(--chart-glow))] [&_.recharts-line-curve]:[filter:drop-shadow(0_0_6px_var(--chart-glow))]",
  } as const
}

/** ChartContainer must not clip the bloom. */
export const chartNeonOverflowClassName =
  "overflow-visible [&_.recharts-surface]:overflow-visible [&_.recharts-wrapper]:overflow-visible"

/**
 * Vertical (`layout="vertical"`) line demos — portrait stage for month rows
 * + value ticks (max 460px). Explicit `h-72`/`sm:h-80` required —
 * ResponsiveContainer collapses without a concrete height on ChartContainer.
 */
export const chartVerticalLineContainerClassName = [
  "aspect-auto h-64 w-full min-w-0 max-w-[460px] overflow-visible font-sans text-xs tabular-nums sm:h-72",
  "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-surface]:overflow-visible",
  chartDashedGridClassName,
].join(" ")
