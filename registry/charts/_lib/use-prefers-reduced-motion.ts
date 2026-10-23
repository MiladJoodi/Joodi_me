"use client"

import * as React from "react"

const REDUCE_MQ = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(REDUCE_MQ)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getSnapshot() {
  return window.matchMedia(REDUCE_MQ).matches
}

function getServerSnapshot() {
  return false
}

/**
 * Reduced-motion preference via `useSyncExternalStore` so the first client
 * paint respects the preference (no flash of a long entrance then cut).
 */
export function usePrefersReducedMotion() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
