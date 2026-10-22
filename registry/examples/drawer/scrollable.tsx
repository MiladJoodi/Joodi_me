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

const paragraphs = Array.from({ length: 12 }, (_, i) => i)

export function DrawerScrollable() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Scrollable Content</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Terms of service</DrawerTitle>
          <DrawerDescription>
            Scroll the body while the footer actions stay in view.
          </DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[min(50vh,20rem)] overflow-y-auto px-4">
          {paragraphs.map((i) => (
            <p key={i} className="mb-4 text-sm leading-relaxed last:mb-0">
              Drawers keep focus trapped until dismissed. Use a nested scroll
              region for long policies or help text so the panel height stays
              within the viewport on small screens.
            </p>
          ))}
        </div>
        <DrawerFooter>
          <Button>Accept</Button>
          <DrawerClose asChild>
            <Button variant="outline">Decline</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
