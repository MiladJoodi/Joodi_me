"use client"

import * as React from "react"
import type { ComponentType } from "react"

import {
  ensureExample,
  getCachedExample,
} from "@/components/docs/example-component-cache"

/**
 * Loads a registry example by name.
 * Module cache + page prefetch avoid empty→content height jumps on tab switches.
 */
export function RegistryExamplePreview({ name }: { name: string }) {
  const [Component, setComponent] = React.useState<ComponentType | null>(
    () => getCachedExample(name) ?? null
  )
  const [missing, setMissing] = React.useState(false)

  React.useEffect(() => {
    let alive = true
    const cached = getCachedExample(name)
    if (cached) {
      setComponent(() => cached)
      setMissing(false)
      return
    }

    // Not cached yet — clear. Parent preview frame keeps minHeight so CLS stays low.
    setComponent(null)
    setMissing(false)

    void ensureExample(name).then((Comp) => {
      if (!alive) return
      if (!Comp) {
        setMissing(true)
        setComponent(null)
        return
      }
      setComponent(() => Comp)
    })

    return () => {
      alive = false
    }
  }, [name])

  if (missing) return null
  if (!Component) {
    return <div className="min-h-32 w-full" aria-hidden />
  }

  return <Component />
}
