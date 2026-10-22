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

export function readElementDirection(
  el?: Element | null,
  fallback: Direction = DEFAULT_DIRECTION
): Direction {
  if (!el || typeof window === "undefined") return fallback
  const raw = getComputedStyle(el).direction
  return normalizeDirection(raw, fallback)
}
