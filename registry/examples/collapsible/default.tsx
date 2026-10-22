"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@sonojs/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@sonojs/ui/components/collapsible"
import { cn } from "@sonojs/ui/lib/utils"

const visible = [
  "Deployed v2.4.1 to production",
  "Merged PR #842 — fix checkout tax",
]

const hidden = [
  "Rotated staging API keys",
  "Updated webhook endpoint",
  "Synced billing seats (+3)",
]

export function CollapsibleDefault() {
  const [open, setOpen] = React.useState(false)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-sm space-y-2"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">Recent activity</p>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            {open ? "Show less" : `Show ${hidden.length} more`}
            <ChevronDownIcon
              className={cn(
                "size-4 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
      </div>

      <ul className="space-y-1.5">
        {visible.map((item) => (
          <li
            key={item}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            {item}
          </li>
        ))}
      </ul>

      <CollapsibleContent>
        <ul className="mt-1.5 space-y-1.5">
          {hidden.map((item) => (
            <li
              key={item}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
