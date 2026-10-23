"use client"

import * as React from "react"
import { CodeIcon, EyeIcon } from "lucide-react"

import { CodePanel } from "@/components/docs/code-panel"
import { InstallNeedsHint } from "@/components/docs/install-needs-hint"
import { useRegisterPreviewDirection } from "@/components/docs/preview-direction"
import {
  DirectionProvider,
  DirectionToggle,
} from "@/components/direction"
import type { Direction } from "@/lib/direction"
import { prefetchExamples } from "@/components/docs/example-component-cache"
import { RegistryExamplePreview } from "@/components/docs/registry-example-preview"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type VariantExample = {
  name: string
  title: string
  /**
   * One short line above the preview (outside the player chrome).
   * Prefer naming the prop/API in backticks, e.g. Use `size="sm"` for …
   */
  description?: string
  /** Consumer-facing source for this variant (shown in Code tab). */
  code?: string
  /** Pre-highlighted HTML from `highlightCode` on the server. */
  codeHtml?: string
  /**
   * Extra registry items this example needs (not required by the main
   * component). Shown as “This example also needs” under the Code tab only.
   */
  requires?: string[]
  /**
   * Extra npm packages this example needs beyond the main component
   * (e.g. lucide-react). Same footer bar on the Code tab; command uses `npm i …`.
   */
  npmRequires?: string[]
}

type ViewMode = "preview" | "code"

/** Renders `` `code` `` spans inside a plain description string. */
function DescriptionText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={i}
              className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em] text-foreground"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}

function ExampleLead({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-h4 tracking-tight text-foreground">{title}</h3>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          <DescriptionText text={description} />
        </p>
      ) : null}
    </div>
  )
}

export function ComponentVariantPreview({
  examples,
  className,
  showDirection = true,
  allowOverflow = false,
}: {
  examples: VariantExample[]
  className?: string
  /** Hide LTR/RTL when the preview has no directional layout (e.g. code). */
  showDirection?: boolean
  /**
   * Let popovers / menus paint outside the frame (no overflow clip).
   * Use for Navigation Menu and similar non-portaled overlays.
   */
  allowOverflow?: boolean
}) {
  const [active, setActive] = React.useState(examples[0]?.name ?? "")
  const [dir, setDir] = React.useState<Direction>("ltr")
  const [view, setView] = React.useState<ViewMode>("preview")
  const [frameMinHeight, setFrameMinHeight] = React.useState<number | undefined>()
  const frameRef = React.useRef<HTMLDivElement>(null)
  const meta = examples.find((item) => item.name === active)
  const hasCode = Boolean(meta?.code && meta?.codeHtml)
  const requires = meta?.requires?.filter(Boolean) ?? []
  const npmRequires = meta?.npmRequires?.filter(Boolean) ?? []
  const effectiveView: ViewMode = hasCode ? view : "preview"

  // Warm every variant on this page so Preview tab switches stay height-stable.
  React.useEffect(() => {
    prefetchExamples(examples.map((item) => item.name))
  }, [examples])

  // Lock the preview frame to the tallest measured height so load/swap does not jump.
  React.useEffect(() => {
    if (effectiveView !== "preview") return
    const el = frameRef.current
    if (!el || typeof ResizeObserver === "undefined") return

    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect.height
      if (!h) return
      setFrameMinHeight((prev) =>
        prev == null ? h : Math.max(prev, h)
      )
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [effectiveView, active])

  // Root Toaster sits outside this island — publish dir so Sonner RTL matches.
  useRegisterPreviewDirection(
    dir,
    showDirection && effectiveView === "preview"
  )

  const previewFrameClass = cn(
    "flex min-h-32 items-center justify-center bg-background p-8",
    allowOverflow &&
      "relative z-20 min-h-[28rem] items-start justify-center overflow-visible pt-10 pb-16"
  )
  const previewFrameStyle =
    frameMinHeight != null && !allowOverflow
      ? { minHeight: frameMinHeight }
      : undefined

  return (
    <div className={cn("space-y-3", className)}>
      {meta ? (
        <ExampleLead title={meta.title} description={meta.description} />
      ) : null}

      <div
        className={cn(
          "rounded-xl border border-border/80",
          allowOverflow
            ? "relative z-20 overflow-visible"
            : "overflow-hidden"
        )}
      >
        <div className="flex items-start gap-2 rounded-t-xl border-b border-border/80 bg-muted/30 p-2">
          <div className="flex min-w-0 flex-1 flex-wrap gap-1">
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
          <div className="flex shrink-0 items-center gap-1.5 self-start">
            {effectiveView === "preview" && showDirection ? (
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
                  <Tooltip key={tab.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setView(tab.id)}
                        aria-label={tab.label}
                        className={cn(
                          "inline-flex size-7 cursor-pointer items-center justify-center rounded-sm transition-colors",
                          effectiveView === tab.id
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <tab.Icon className="size-3.5" aria-hidden />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">{tab.label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {effectiveView === "preview" ? (
          <div
            ref={frameRef}
            className={previewFrameClass}
            style={previewFrameStyle}
          >
            {showDirection ? (
              <DirectionProvider dir={dir} className="contents">
                {active ? <RegistryExamplePreview name={active} /> : null}
              </DirectionProvider>
            ) : active ? (
              <RegistryExamplePreview name={active} />
            ) : null}
          </div>
        ) : meta?.code && meta?.codeHtml ? (
          <>
            <CodePanel
              title={`${meta.title}.tsx`}
              code={meta.code}
              html={meta.codeHtml}
            />
            <InstallNeedsHint registry={requires} npm={npmRequires} />
          </>
        ) : null}
      </div>
    </div>
  )
}
