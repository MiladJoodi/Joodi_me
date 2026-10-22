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

const paragraphs = Array.from({ length: 8 }, (_, i) => i)

export function DialogScrollable() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Scrollable Content</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scrollable content</DialogTitle>
          <DialogDescription>
            Long body text scrolls while the header stays in view.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-1 max-h-[min(50vh,20rem)] overflow-y-auto px-1">
          {paragraphs.map((i) => (
            <p key={i} className="mb-4 text-sm leading-relaxed last:mb-0">
              Dialogs keep the overlay inert and focused. Use a nested scroll
              region for policies, release notes, or any copy that does not fit
              the default panel height. Keyboard focus remains trapped until
              the dialog closes.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
