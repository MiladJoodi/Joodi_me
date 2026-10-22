"use client"

import * as React from "react"
import { CodeIcon, EyeIcon } from "lucide-react"

import { CodePanel } from "@/components/docs/code-panel"
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
  /** Consumer-facing source for this variant (shown in Code tab). */
  code?: string
  /** Pre-highlighted HTML from `highlightCode` on the server. */
  codeHtml?: string
}

type ViewMode = "preview" | "code"

export function ComponentVariantPreview({
  examples,
  className,
}: {
  examples: VariantExample[]
  className?: string
}) {
  const [active, setActive] = React.useState(examples[0]?.name ?? "")
  const [dir, setDir] = React.useState<Direction>("ltr")
  const [view, setView] = React.useState<ViewMode>("preview")
  const example = getRegistryExample(active)
  const Preview = example?.component
  const meta = examples.find((item) => item.name === active)
  const hasCode = Boolean(meta?.code && meta?.codeHtml)

  React.useEffect(() => {
    if (!hasCode && view === "code") setView("preview")
  }, [hasCode, view])

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
        <div className="flex flex-wrap items-center gap-1.5">
          {view === "preview" ? (
            <DirectionToggle value={dir} onValueChange={setDir} />
          ) : null}
          {hasCode ? (
            <div className="inline-flex h-8 items-center rounded-md border border-border/80 bg-background p-0.5">
              {(
                [
                  { id: "preview", label: "Preview", Icon: EyeIcon },
                  { id: "code", label: "Code", Icon: CodeIcon },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setView(tab.id)}
                  aria-label={tab.label}
                  title={tab.label}
                  className={cn(
                    "inline-flex size-7 cursor-pointer items-center justify-center rounded-sm transition-colors",
                    view === tab.id
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.Icon className="size-3.5" aria-hidden />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {view === "preview" ? (
        <DirectionProvider
          dir={dir}
          className="flex min-h-32 items-center justify-center bg-background p-8"
        >
          {Preview ? <Preview /> : null}
        </DirectionProvider>
      ) : meta?.code && meta?.codeHtml ? (
        <CodePanel
          title={`${meta.title}.tsx`}
          code={meta.code}
          html={meta.codeHtml}
        />
      ) : null}
    </div>
  )
}
