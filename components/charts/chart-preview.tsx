"use client"

import * as React from "react"

import {
  DirectionProvider,
  DirectionToggle,
} from "@/components/direction"
import type { Direction } from "@/lib/direction"
import { cn } from "@/lib/utils"

/**
 * Wide charts stage with LTR default + RTL layout toggle.
 * Does not change demo locale/data — English demos stay English.
 */
export function ChartPreview({
  children,
  fullWidth = false,
  title = "Preview",
  className,
}: {
  children: React.ReactNode
  /** Stretch like FarsiUI interactive / fullWidth demos */
  fullWidth?: boolean
  title?: string
  className?: string
}) {
  const [dir, setDir] = React.useState<Direction>("ltr")

  return (
    <div className={cn("w-full min-w-0 space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-h3">{title}</h2>
        <DirectionToggle value={dir} onValueChange={setDir} />
      </div>
      <DirectionProvider
        dir={dir}
        className={cn(
          // Center the demo so max-width charts don't stick to inline-start when dir flips.
          "flex w-full min-w-0 max-w-none justify-center rounded-xl border border-border/80 bg-background p-4 md:p-6",
          fullWidth && "md:p-8"
        )}
      >
        {children}
      </DirectionProvider>
    </div>
  )
}
