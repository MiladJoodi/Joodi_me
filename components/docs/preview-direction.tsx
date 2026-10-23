"use client"

import * as React from "react"

import type { Direction } from "@/lib/direction"

/**
 * Docs-only: scoped DirectionProvider islands do not wrap the root Toaster
 * (portaled under body). Preview chrome publishes dir here so Sonner flips.
 */
const PreviewDirectionContext = React.createContext<Direction | null>(null)

const PreviewDirectionSetContext = React.createContext<
  ((dir: Direction | null) => void) | null
>(null)

export function PreviewDirectionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [dir, setDir] = React.useState<Direction | null>(null)

  return (
    <PreviewDirectionSetContext.Provider value={setDir}>
      <PreviewDirectionContext.Provider value={dir}>
        {children}
      </PreviewDirectionContext.Provider>
    </PreviewDirectionSetContext.Provider>
  )
}

/** Active docs-preview writing direction, or null when none is registered. */
export function usePreviewDirection(): Direction | null {
  return React.useContext(PreviewDirectionContext)
}

/**
 * Registers the current preview `dir` while mounted (VariantPreview).
 * Clears on unmount so the root Toaster falls back to document direction.
 */
export function useRegisterPreviewDirection(dir: Direction, enabled: boolean) {
  const setDir = React.useContext(PreviewDirectionSetContext)

  React.useEffect(() => {
    if (!enabled || !setDir) return
    setDir(dir)
    return () => setDir(null)
  }, [dir, enabled, setDir])
}
