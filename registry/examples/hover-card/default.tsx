"use client"

import { CalendarIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@sonojs/ui/components/avatar"
import { Button } from "@sonojs/ui/components/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@sonojs/ui/components/hover-card"

export function HoverCardDefault() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="px-0">
          @sonojs
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <h4 className="text-sm font-semibold">@sonojs</h4>
            <p className="text-sm text-muted-foreground">
              Design system and copy-source UI components for React.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
              <CalendarIcon className="size-3.5 shrink-0" />
              <span>Joined December 2024</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
