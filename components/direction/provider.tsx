"use client"

import * as React from "react"

import {
  DirectionContextProvider,
  useDirection,
} from "@/hooks/use-direction"
import {
  DEFAULT_DIRECTION,
  type Direction,
  normalizeDirection,
} from "@/lib/direction"
import { cn } from "@/lib/utils"

export type DirectionProviderProps = {
  /** Explicit direction for this subtree. Omit to inherit from parent/`<html>`. */
  dir?: Direction
  className?: string
  children: React.ReactNode
  /** Render as a different element (default: `div`). */
  asChild?: boolean
}

/**
 * Scopes writing direction for descendants.
 * Sets the DOM `dir` attribute so CSS logical properties and native widgets inherit.
 *
 * @example
 * <DirectionProvider dir="rtl">
 *   <LoginForm />
 * </DirectionProvider>
 */
export function DirectionProvider({
  dir: dirProp,
  className,
  children,
}: DirectionProviderProps) {
  const inherited = useDirection()
  const dir = normalizeDirection(dirProp ?? inherited.dir, DEFAULT_DIRECTION)

  return (
    <DirectionContextProvider dir={dir}>
      <div dir={dir} data-orientation={dir} className={cn(className)}>
        {children}
      </div>
    </DirectionContextProvider>
  )
}

export { useDirection }

/** Toggle control for docs / playgrounds — does not replace site chrome direction. */
export function DirectionToggle({
  value,
  onValueChange,
  className,
}: {
  value: Direction
  onValueChange: (dir: Direction) => void
  className?: string
}) {
  return (
    <div
      role="group"
      aria-label="Writing direction"
      className={cn(
        "inline-flex h-8 items-center rounded-md border border-border/80 bg-background p-0.5 text-[11px] font-medium text-muted-foreground",
        className
      )}
    >
      {(["ltr", "rtl"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onValueChange(option)}
          className={cn(
            "inline-flex h-7 cursor-pointer items-center rounded-sm px-2 uppercase tracking-wide transition-colors",
            value === option
              ? "bg-muted text-foreground"
              : "hover:text-foreground"
          )}
          aria-pressed={value === option}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
