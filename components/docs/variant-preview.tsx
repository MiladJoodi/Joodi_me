"use client"

import * as React from "react"

import {
  DirectionProvider,
  DirectionToggle,
} from "@/components/direction"
import type { Direction } from "@/lib/direction"
import { cn } from "@/lib/utils"
import { getRegistryExample } from "@/registry/index"

export type VariantExample = {
  name: string
  title: string
}

export function ComponentVariantPreview({
  examples,
  className,
}: {
  examples: VariantExample[]
  className?: string
}) {
  const [active, setActive] = React.useState(examples[0]?.name ?? "")
  const [dir, setDir] = React.useState<Direction>("ltr")
  const example = getRegistryExample(active)
  const Preview = example?.component

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/80",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 bg-muted/30 p-2">
        <div className="flex flex-wrap gap-1">
          {examples.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActive(item.name)}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-colors",
                active === item.name
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {item.title}
            </button>
          ))}
        </div>
        <DirectionToggle value={dir} onValueChange={setDir} />
      </div>
      <DirectionProvider
        dir={dir}
        className="flex min-h-32 items-center justify-center bg-background p-8"
      >
        {Preview ? <Preview /> : null}
      </DirectionProvider>
    </div>
  )
}
