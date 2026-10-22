"use client"

import * as React from "react"
import type { ComponentType } from "react"

import { loadExample } from "@/registry/example-loaders"

type CacheEntry =
  | { status: "loading"; promise: Promise<void> }
  | { status: "ready"; Component: ComponentType }
  | { status: "missing" }

const cache = new Map<string, CacheEntry>()

function readExample(name: string): CacheEntry {
  const hit = cache.get(name)
  if (hit) return hit

  const loader = loadExample(name)
  if (!loader) {
    const missing = { status: "missing" as const }
    cache.set(name, missing)
    return missing
  }

  const entry: CacheEntry = {
    status: "loading",
    promise: loader()
      .then((mod) => {
        cache.set(name, { status: "ready", Component: mod.default })
      })
      .catch(() => {
        cache.set(name, { status: "missing" })
      }),
  }
  cache.set(name, entry)
  return entry
}

/**
 * Loads a single registry example by name via dynamic import().
 * Unknown names render nothing (no throw).
 */
export function RegistryExamplePreview({ name }: { name: string }) {
  const entry = readExample(name)
  const [, setTick] = React.useState(0)

  React.useEffect(() => {
    if (entry.status !== "loading") return
    let alive = true
    void entry.promise.then(() => {
      if (alive) setTick((n) => n + 1)
    })
    return () => {
      alive = false
    }
  }, [name, entry])

  if (entry.status === "missing") return null
  if (entry.status === "loading") {
    return <div className="min-h-32" aria-hidden />
  }

  const Comp = entry.Component
  return <Comp />
}
