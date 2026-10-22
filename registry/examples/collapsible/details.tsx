"use client"

import * as React from "react"
import { ChevronsUpDownIcon } from "lucide-react"

import { Button } from "@sonojs/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@sonojs/ui/components/collapsible"

export function CollapsibleDetails() {
  const [open, setOpen] = React.useState(false)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="flex w-full max-w-[350px] flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-4 px-4">
        <h4 className="text-sm font-semibold text-foreground">Order #4189</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronsUpDownIcon />
            <span className="sr-only">Toggle details</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border px-4 py-2 text-sm">
        <span className="text-muted-foreground">Status</span>
        <span className="font-medium text-foreground">Shipped</span>
      </div>

      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border border-border px-4 py-2 text-sm">
          <p className="font-medium text-foreground">Shipping address</p>
          <p className="text-muted-foreground">100 Market St, San Francisco</p>
        </div>
        <div className="rounded-md border border-border px-4 py-2 text-sm">
          <p className="font-medium text-foreground">Items</p>
          <p className="text-muted-foreground">2× Studio Headphones</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
