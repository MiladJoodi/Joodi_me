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
        "inline-flex rounded-md border border-border/80 p-0.5 text-[12px] font-medium",
        className
      )}
    >
      {(["ltr", "rtl"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onValueChange(option)}
          className={cn(
            "cursor-pointer rounded-[5px] px-2.5 py-1 uppercase transition-colors",
            value === option
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={value === option}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
