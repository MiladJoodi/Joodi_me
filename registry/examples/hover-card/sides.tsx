"use client"

import { Button } from "@sonojs/ui/components/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@sonojs/ui/components/hover-card"

const sides = ["top", "right", "bottom", "left"] as const

export function HoverCardSides() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {sides.map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side={side} className="w-56">
            <p className="text-sm text-muted-foreground">
              Opens on the <span className="font-medium text-foreground">{side}</span>{" "}
              edge. Prefer <code className="text-xs">align=&quot;start&quot;</code>{" "}
              when layout must follow writing direction.
            </p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}
