"use client"

import { Button } from "@sonojs/ui/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@sonojs/ui/components/tooltip"

const sides = ["top", "right", "bottom", "left"] as const

export function TooltipSide() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {sides.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            <p>Side {side}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
