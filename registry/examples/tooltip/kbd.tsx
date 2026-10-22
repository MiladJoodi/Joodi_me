"use client"

import { Button } from "@sonojs/ui/components/button"
import { Kbd, KbdGroup } from "@sonojs/ui/components/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@sonojs/ui/components/tooltip"

export function TooltipKbd() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Save</Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2">
        <span>Save</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  )
}
