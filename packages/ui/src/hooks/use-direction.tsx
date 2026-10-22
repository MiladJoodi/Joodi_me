"use client"

import * as React from "react"

import {
  DEFAULT_DIRECTION,
  type Direction,
  isRtl,
  normalizeDirection,
  readElementDirection,
} from "@sonojs/ui/lib/direction"

const DirectionContext = React.createContext<Direction | null>(null)

export function DirectionContextProvider({
  dir,
  children,
}: {
  dir: Direction
  children: React.ReactNode
}) {
  return (
    <DirectionContext.Provider value={dir}>{children}</DirectionContext.Provider>
  )
}

/**
 * Writing direction for the current React subtree (works across portals).
 * Priority: nearest DirectionContextProvider → `<html dir>` → default.
 */
export function useDirection(): {
  dir: Direction
  isRtl: boolean
} {
  const fromContext = React.useContext(DirectionContext)
  const [inherited, setInherited] = React.useState<Direction>(DEFAULT_DIRECTION)

  React.useLayoutEffect(() => {
    if (fromContext) {
      setInherited(fromContext)
      return
    }
    setInherited(readElementDirection(document.documentElement))
  }, [fromContext])

  const dir = fromContext ?? inherited

  return {
    dir,
    isRtl: isRtl(dir),
  }
}

export function useDocumentDirection(): Direction {
  const [dir, setDir] = React.useState<Direction>(DEFAULT_DIRECTION)

  React.useEffect(() => {
    const root = document.documentElement
    const sync = () =>
      setDir(normalizeDirection(root.getAttribute("dir"), DEFAULT_DIRECTION))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ["dir"] })
    return () => observer.disconnect()
  }, [])

  return dir
}

export { DirectionContext }
