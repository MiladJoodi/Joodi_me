"use client"

import { Button } from "@sonojs/ui/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@sonojs/ui/components/drawer"
import type { EdgeSide } from "@sonojs/ui/lib/direction"

const sides: { direction: EdgeSide; label: string }[] = [
  { direction: "top", label: "Top" },
  { direction: "bottom", label: "Bottom" },
  { direction: "start", label: "Start" },
  { direction: "end", label: "End" },
]

export function DrawerSides() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {sides.map(({ direction, label }) => (
        <Drawer key={direction} direction={direction}>
          <DrawerTrigger asChild>
            <Button variant="outline">{label}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{label} drawer</DrawerTitle>
              <DrawerDescription>
                {direction === "start" || direction === "end"
                  ? `Opens from the inline-${direction} edge. Toggle LTR/RTL in the preview — the panel and animation follow writing direction.`
                  : `Opens from the ${direction} edge.`}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  )
}
