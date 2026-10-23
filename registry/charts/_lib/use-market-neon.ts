"use client"

/**
 * Neon market glow for installable area/stock charts.
 *
 * Always on — docs and `sonojs add` consumers both get `--chart-up` /
 * `--chart-down` + stroke bloom. No `style-*` body class required.
 *
 * Kept as a hook so call sites stay uniform and we can add an opt-out later
 * without rewriting every chart.
 */
export function useMarketNeon() {
  return true
}
