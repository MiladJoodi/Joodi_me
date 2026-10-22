"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"

import {
  DirectionProvider,
  DirectionToggle,
} from "@/components/direction"
import type { Direction } from "@/lib/direction"
import { Button } from "@sonojs/ui/components/button"
import { Input } from "@sonojs/ui/components/input"
import { Label } from "@sonojs/ui/components/label"

export function DirectionTryIt() {
  const [dir, setDir] = React.useState<Direction>("ltr")

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-h3">Try it</h2>
          <p className="text-sm text-muted-foreground">
            Use the toggle to switch LTR and RTL. The same components update
            automatically.
          </p>
        </div>
        <DirectionToggle value={dir} onValueChange={setDir} />
      </div>
      <DirectionProvider
        dir={dir}
        className="overflow-hidden rounded-xl border border-border/80 bg-background p-6"
      >
        <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="dir-demo-email">Email</Label>
            <Input
              id="dir-demo-email"
              type="email"
              placeholder="name@example.com"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button className="flex-1 cursor-pointer">Continue</Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next"
              className="cursor-pointer"
            >
              <ChevronRightIcon className="icon-dir size-4" />
            </Button>
          </div>
        </div>
      </DirectionProvider>
    </section>
  )
}
