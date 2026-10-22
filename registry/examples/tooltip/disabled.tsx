"use client"

import { Button } from "@sonojs/ui/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@sonojs/ui/components/tooltip"

export function TooltipDisabled() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Disabled buttons still need a wrapper to receive hover.</p>
      </TooltipContent>
    </Tooltip>
  )
}
