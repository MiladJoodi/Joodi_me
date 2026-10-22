/**
 * WinkUI direction primitives.
 *
 * Direction is inherited from the nearest ancestor `dir` (usually `<html>`).
 * Components must NOT hardcode `dir="ltr"` / `dir="rtl"` unless they create an
 * intentional isolated island. Prefer logical CSS (ms/me, ps/pe, start/end).
 */

export type Direction = "ltr" | "rtl"

export const DEFAULT_DIRECTION: Direction = "ltr"

export function isDirection(value: unknown): value is Direction {
  return value === "ltr" || value === "rtl"
}

export function normalizeDirection(
  value: string | null | undefined,
  fallback: Direction = DEFAULT_DIRECTION
): Direction {
  if (value === "rtl" || value === "ltr") return value
  return fallback
}

export function isRtl(dir: Direction) {
  return dir === "rtl"
}

export function getOppositeDirection(dir: Direction): Direction {
  return dir === "rtl" ? "ltr" : "rtl"
}

/** Sheet / drawer side that opens from the inline-start edge. */
export function getStartSide(dir: Direction): "left" | "right" {
  return dir === "rtl" ? "right" : "left"
}

/** Sheet / drawer side that opens from the inline-end edge. */
export function getEndSide(dir: Direction): "left" | "right" {
  return dir === "rtl" ? "left" : "right"
}

/**
 * Read computed direction from an element (or documentElement).
 * Safe for SSR when `el` is undefined — returns DEFAULT_DIRECTION.
 */
export function readElementDirection(
  el?: Element | null,
  fallback: Direction = DEFAULT_DIRECTION
): Direction {
  if (!el || typeof window === "undefined") return fallback
  const raw = getComputedStyle(el).direction
  return normalizeDirection(raw, fallback)
}
