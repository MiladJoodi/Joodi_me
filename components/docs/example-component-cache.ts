import type { ComponentType } from "react"

import { loadExample } from "@/registry/example-loaders"

const cache = new Map<string, ComponentType>()
const inflight = new Map<string, Promise<ComponentType | null>>()

/** Sync hit after a successful load (avoids empty → content jump on revisit). */
export function getCachedExample(name: string): ComponentType | undefined {
  return cache.get(name)
}

/** Load (or reuse in-flight) an example module; caches the default export. */
export function ensureExample(name: string): Promise<ComponentType | null> {
  const hit = cache.get(name)
  if (hit) return Promise.resolve(hit)

  const pending = inflight.get(name)
  if (pending) return pending

  const loader = loadExample(name)
  if (!loader) {
    return Promise.resolve(null)
  }

  const task = loader()
    .then((mod) => {
      const Comp = mod.default
      cache.set(name, Comp)
      inflight.delete(name)
      return Comp
    })
    .catch(() => {
      inflight.delete(name)
      return null
    })

  inflight.set(name, task)
  return task
}

/** Warm the cache for every example on a docs page (same folder chunks). */
export function prefetchExamples(names: string[]) {
  for (const name of names) {
    if (!name || cache.has(name) || inflight.has(name)) continue
    void ensureExample(name)
  }
}
