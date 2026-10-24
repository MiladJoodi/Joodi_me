"use client"

import { cn } from "@/lib/utils"

type TreemapTooltipPayloadItem = {
  name?: unknown
  value?: unknown
  color?: string
  payload?: Record<string, unknown>
}

/**
 * Treemap tooltip — reads Recharts computed `value` (parents) or leaf `size`.
 * ChartTooltipContent's formatter path misses parents when `dataKey="size"`.
 * Pass `dir` from `useChartDir()` so chrome follows page direction (plot is LTR).
 */
export function TreemapTooltipContent({
  active,
  payload,
  className,
  locale = "en",
  dir = "ltr",
  formatValue,
  formatName,
}: {
  active?: boolean
  payload?: ReadonlyArray<TreemapTooltipPayloadItem>
  className?: string
  locale?: string
  dir?: "ltr" | "rtl"
  /** Override number formatting (e.g. append " KB"). */
  formatValue?: (value: number, locale: string) => string
  /** Map raw node name → display label. */
  formatName?: (name: string) => string
}) {
  if (!active || !payload?.length) return null

  const item = payload[0]
  const raw = item?.payload
  const rawName = String(raw?.name ?? item?.name ?? "")
  const name = formatName ? formatName(rawName) : rawName
  const num = Number(raw?.value ?? raw?.size ?? item?.value)
  if (!rawName || !Number.isFinite(num)) return null

  const color =
    (typeof raw?.fill === "string" ? raw.fill : undefined) ?? item?.color
  const display =
    formatValue?.(num, locale) ??
    new Intl.NumberFormat(locale).format(Math.round(num))

  return (
    <div
      dir={dir}
      className={cn(
        "pointer-events-none grid min-w-[9rem] items-start gap-1.5 rounded-md border border-border bg-background px-2.5 py-2 text-xs shadow-sm",
        className
      )}
    >
      <div className="flex w-full items-center gap-2">
        {color ? (
          <span
            className="size-2.5 shrink-0 rounded-[2px]"
            style={{ background: color }}
            aria-hidden
          />
        ) : null}
        <div className="flex flex-1 items-center justify-between gap-4 leading-none">
          <span className="text-muted-foreground">{name}</span>
          <span className="font-medium tabular-nums text-foreground">
            {display}
          </span>
        </div>
      </div>
    </div>
  )
}
