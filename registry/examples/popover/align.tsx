"use client"

import { Button } from "@sonojs/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@sonojs/ui/components/popover"

export function PopoverAlign() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {(["start", "center", "end"] as const).map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="capitalize">
              {align}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align={align}>
            <PopoverHeader>
              <PopoverTitle>Align {align}</PopoverTitle>
              <PopoverDescription>
                Prefer <code className="font-mono text-xs">align=&quot;start&quot;</code>{" "}
                with writing direction.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
