"use client"

import { Button } from "@sonojs/ui/components/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@sonojs/ui/components/sheet"
import type { EdgeSide } from "@sonojs/ui/lib/direction"

const sides: { side: EdgeSide; label: string }[] = [
  { side: "top", label: "Top" },
  { side: "bottom", label: "Bottom" },
  { side: "start", label: "Start" },
  { side: "end", label: "End" },
]

export function SheetSides() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {sides.map(({ side, label }) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{label}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>{label} sheet</SheetTitle>
              <SheetDescription>
                {side === "start" || side === "end"
                  ? `Opens from the inline-${side} edge. Toggle LTR/RTL in the preview — the panel and slide animation follow writing direction.`
                  : `Opens from the ${side} edge.`}
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
