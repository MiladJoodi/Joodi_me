import type { ComponentType } from "react"

/**
 * Ported gallery/classic demos for `/charts/view/[id]`.
 * Add an entry when a catalog id flips to `ported`.
 */
export const chartDemoLoaders: Record<
  string,
  () => Promise<{ default: ComponentType } | Record<string, ComponentType> >
> = {
  "simple-bar-chart": () => import("./simple-bar-chart"),
}

export function getChartDemoLoader(id: string) {
  return chartDemoLoaders[id]
}
