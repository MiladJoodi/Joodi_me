"use client"

import { Button } from "@sonojs/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@sonojs/ui/components/dialog"

const paragraphs = Array.from({ length: 10 }, (_, i) => i)

export function DialogStickyFooter() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sticky Footer</Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(85vh,36rem)] flex-col gap-0 p-0"
      >
        <DialogHeader className="shrink-0 border-b px-6 py-4 text-start">
          <DialogTitle>Sticky footer</DialogTitle>
          <DialogDescription>
            Actions stay pinned while the middle section scrolls.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {paragraphs.map((i) => (
            <p key={i} className="mb-4 text-sm leading-relaxed last:mb-0">
              Keep primary actions visible for long confirmations and reading
              flows. The footer band sits below the scroll area so Save /
              Cancel never leave the viewport.
            </p>
          ))}
        </div>
        <DialogFooter className="shrink-0 border-t bg-muted/40 px-6 py-4 sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
