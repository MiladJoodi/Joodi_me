"use client"

import * as React from "react"

const NARROW_MQ = "(max-width: 639px)"

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(NARROW_MQ)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getSnapshot() {
  return window.matchMedia(NARROW_MQ).matches
}

function getServerSnapshot() {
  return false
}

/**
 * Viewport narrow flag via `useSyncExternalStore` so the first client paint
 * matches the media query (no false→true remount mid Recharts entrance).
 */
export function useNarrowViewport() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
