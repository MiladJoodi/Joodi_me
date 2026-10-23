"use client"

import * as React from "react"

export type ChartDir = "ltr" | "rtl"

/**
 * Reads writing direction from the nearest `[dir]` ancestor (or `<html>`).
 * No docs-site DirectionProvider required — works after `sonojs add`.
 */
export function useChartDir(): {
  dir: ChartDir
  ref: React.RefObject<HTMLDivElement | null>
} {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [dir, setDir] = React.useState<ChartDir>("ltr")

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const read = () => {
      const host = el.closest("[dir]")
      setDir(host?.getAttribute("dir") === "rtl" ? "rtl" : "ltr")
    }

    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
      subtree: true,
    })
    return () => obs.disconnect()
  }, [])

  return { dir, ref }
}
