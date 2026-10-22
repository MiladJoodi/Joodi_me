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

export function getStartSide(dir: Direction): "left" | "right" {
  return dir === "rtl" ? "right" : "left"
}

export function getEndSide(dir: Direction): "left" | "right" {
  return dir === "rtl" ? "left" : "right"
}

/** Edges accepted by Drawer / Sheet (logical + physical). */
export type EdgeSide = "top" | "bottom" | "left" | "right" | "start" | "end"

/** Physical edges Vaul / positioned overlays understand. */
export type PhysicalEdgeSide = "top" | "bottom" | "left" | "right"

/**
 * Resolve logical `start` / `end` to physical `left` / `right` for libraries
 * that only understand physical sides (e.g. Vaul drawer `direction`).
 * Pass `left` / `right` through unchanged when you need a fixed physical edge.
 */
export function resolveEdgeSide(
  side: EdgeSide | undefined,
  dir: Direction,
  fallback: PhysicalEdgeSide = "bottom"
): PhysicalEdgeSide {
  const value = side ?? fallback
  if (value === "start") return getStartSide(dir)
  if (value === "end") return getEndSide(dir)
  return value
}

export function readElementDirection(
  el?: Element | null,
  fallback: Direction = DEFAULT_DIRECTION
): Direction {
  if (!el || typeof window === "undefined") return fallback
  const raw = getComputedStyle(el).direction
  return normalizeDirection(raw, fallback)
}
