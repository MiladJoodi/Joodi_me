"use client"

import { Button } from "@sonojs/ui/components/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@sonojs/ui/components/hover-card"

export function HoverCardDelays() {
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button variant="outline">Hover (fast)</Button>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-64">
        <p className="text-sm text-muted-foreground">
          Opens after{" "}
          <code className="text-xs text-foreground">openDelay={"{100}"}</code>{" "}
          ms and closes after{" "}
          <code className="text-xs text-foreground">closeDelay={"{200}"}</code>{" "}
          ms.
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}
