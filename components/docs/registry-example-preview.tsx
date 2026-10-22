"use client"

import * as React from "react"
import type { ComponentType } from "react"

import { loadExample } from "@/registry/example-loaders"

/** Loads a registry example by name. Mounts after paint to keep SSR/client HTML aligned. */
export function RegistryExamplePreview({ name }: { name: string }) {
  const [Component, setComponent] = React.useState<ComponentType | null>(null)
  const [missing, setMissing] = React.useState(false)

  React.useEffect(() => {
    let alive = true
    setComponent(null)
    setMissing(false)

    const loader = loadExample(name)
    if (!loader) {
      setMissing(true)
      return
    }

    void loader()
      .then((mod) => {
        if (!alive) return
        setComponent(() => mod.default)
      })
      .catch(() => {
        if (alive) setMissing(true)
      })

    return () => {
      alive = false
    }
  }, [name])

  if (missing) return null
  if (!Component) {
    return <div className="min-h-32" aria-hidden />
  }

  return <Component />
}
