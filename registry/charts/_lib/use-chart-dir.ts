"use client"

import * as React from "react"

export type ChartDir = "ltr" | "rtl"

/**
 * Reads writing direction from the nearest ancestor `[dir]` (not self).
 * Works after `sonojs add` — no docs DirectionProvider required.
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
      const host =
        el.parentElement?.closest("[dir]") ?? document.documentElement
      setDir(host.getAttribute("dir") === "rtl" ? "rtl" : "ltr")
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
