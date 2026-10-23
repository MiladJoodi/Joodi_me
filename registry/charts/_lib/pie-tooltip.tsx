import type { ReactNode } from "react"

type SliceConfig = Record<string, { label?: ReactNode } | undefined>

/** Shared pie tooltip row — color swatch + slice label + en Intl value. */
export function pieTooltipRow({
  value,
  label,
  locale,
  color,
}: {
  value: number | string
  label: ReactNode
  locale: string
  color?: string
}) {
  return (
    <div className="flex w-full min-w-[8rem] items-center gap-2">
      {color ? (
        <span
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ background: color }}
          aria-hidden
        />
      ) : null}
      <div className="flex flex-1 items-center justify-between gap-4 leading-none">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums text-foreground">
          {new Intl.NumberFormat(locale).format(Math.round(Number(value)))}
        </span>
      </div>
    </div>
  )
}

type PayloadLike = {
  name?: unknown
  color?: string
  dataKey?: unknown
  payload?: Record<string, unknown>
}

/** Resolve slice label/color from chart config + payload `nameKey`. */
export function pieSliceTooltip(
  value: unknown,
  item: PayloadLike,
  {
    locale,
    config,
    nameKey,
  }: {
    locale: string
    config: SliceConfig
    nameKey: string
  }
) {
  const payload = item.payload
  const key = String(payload?.[nameKey] ?? item.name ?? "")
  const label = config[key]?.label ?? key
  const color =
    (typeof payload?.fill === "string" ? payload.fill : undefined) ??
    item.color
  return pieTooltipRow({
    value: Number(value),
    label,
    locale,
    color,
  })
}
