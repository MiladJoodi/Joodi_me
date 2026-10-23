"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  CHART_SERIES_A,
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Bar Chart With Customized Event — locked gallery chrome + click selection.
 * Click (or scrub) a month → chips + detail panel stay in sync; average reference line.
 * Installs to: components/charts/bar-chart-with-customized-event.tsx
 */

export type CustomizedEventBarPoint = {
  /** ISO date (YYYY-MM-DD) preferred; short labels also accepted. */
  month: string
  sales: number
  orders: number
}

export type BarChartWithCustomizedEventProps = {
  title?: string
  subtitle?: string
  data?: CustomizedEventBarPoint[]
  className?: string
  /** Category axis direction. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover also updates the selected month (click / chips always work). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const BAR_MS = 200
const BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0]
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const IDLE_FILL =
  "color-mix(in oklab, var(--muted-foreground) 28%, transparent)"

const DEMO_DATA: CustomizedEventBarPoint[] = [
  { month: "2026-01-01", sales: 420_000, orders: 1860 },
  { month: "2026-02-01", sales: 310_000, orders: 1420 },
  { month: "2026-03-01", sales: 280_000, orders: 1290 },
  { month: "2026-04-01", sales: 360_000, orders: 1610 },
  { month: "2026-05-01", sales: 240_000, orders: 1110 },
  { month: "2026-06-01", sales: 390_000, orders: 1740 },
  { month: "2026-07-01", sales: 450_000, orders: 1980 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: CHART_SERIES_A,
  },
} satisfies ChartConfig

function useNarrowViewport() {
  const [narrow, setNarrow] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(NARROW_MQ)
    const onChange = () => setNarrow(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return narrow
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return reduced
}

function parseMonthDate(month: string): Date | null {
  if (/^\d{4}-\d{2}/.test(month)) {
    const iso = month.length === 7 ? `${month}-01` : month.slice(0, 10)
    const d = new Date(`${iso}T00:00:00`)
    return Number.isNaN(d.getTime()) ? null : d
  }
  return null
}

function formatAxisMonth(month: string, locale: string) {
  const d = parseMonthDate(month)
  if (!d) return month
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(d)
}

function formatFullMonthYear(month: string, locale: string) {
  const d = parseMonthDate(month)
  if (!d) return month
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(d)
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

function DeltaLine({
  label,
  value,
}: {
  label: string
  value: number | null
}) {
  if (value == null) {
    return (
      <p className="text-xs text-muted-foreground">
        {label}: —
      </p>
    )
  }
  const up = value >= 0
  return (
    <p className="text-xs">
      <span className="text-muted-foreground">{label}: </span>
      <span
        className="font-medium tabular-nums"
        style={{
          color: up ? "var(--chart-up)" : "var(--destructive)",
        }}
      >
        {up ? "+" : "−"}
        {Math.abs(value).toFixed(1)}%
      </span>
    </p>
  )
}

function BarChartWithCustomizedEvent({
  title = "Monthly Sales – Select a Bar",
  subtitle = "Click a month to open the detail panel.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: BarChartWithCustomizedEventProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const locale = "en"

  const lastIndex = Math.max(0, data.length - 1)
  const [selected, setSelected] = React.useState(lastIndex)
  const [dataTrack, setDataTrack] = React.useState({ data, lastIndex })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data, lastIndex })
    setSelected(lastIndex)
  }

  const average = React.useMemo(
    () => data.reduce((sum, row) => sum + row.sales, 0) / Math.max(data.length, 1),
    [data]
  )
  const periodTotal = React.useMemo(
    () => data.reduce((sum, row) => sum + row.sales, 0),
    [data]
  )

  const row = data[selected] ?? data[lastIndex]
  const prev = selected > 0 ? data[selected - 1] : null
  const sales = row?.sales ?? 0
  const orders = row?.orders ?? 0
  const salesDelta = prev ? pctChange(sales, prev.sales) : null
  const ordersDelta = prev ? pctChange(orders, prev.orders) : null
  const avgBasket = orders > 0 ? sales / orders : 0
  const vsAverage = pctChange(sales, average)
  const share = periodTotal > 0 ? (sales / periodTotal) * 100 : 0
  const monthLabel = row ? formatFullMonthYear(row.month, locale) : ""
  const shortMonth = row ? formatAxisMonth(row.month, locale) : ""

  const domainMax = React.useMemo(() => {
    const raw = Math.max(...data.map((r) => r.sales), average, 1)
    const step = raw <= 400_000 ? 100_000 : raw <= 800_000 ? 200_000 : 250_000
    return Math.ceil(raw / step) * step
  }, [average, data])

  const selectMonth = React.useCallback(
    (index: number, announce = false) => {
      const clamped = Math.min(lastIndex, Math.max(0, index))
      setSelected(clamped)
      if (announce && liveRef.current) {
        const point = data[clamped]
        if (point) {
          liveRef.current.textContent = `${formatFullMonthYear(point.month, locale)}: ${formatCurrency(point.sales, locale)}`
        }
      }
    },
    [data, lastIndex, locale]
  )

  const step = React.useCallback(
    (delta: number) => {
      selectMonth(selected + delta, true)
    },
    [selectMonth, selected]
  )

  const indexFromClientX = React.useCallback(
    (clientX: number) => {
      const el = chartAreaRef.current
      if (!el || data.length === 0) return lastIndex
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return lastIndex
      let ratio = (clientX - rect.left) / rect.width
      if (plotRtl) ratio = 1 - ratio
      ratio = Math.min(1, Math.max(0, ratio))
      return Math.min(lastIndex, Math.floor(ratio * data.length))
    },
    [data.length, lastIndex, plotRtl]
  )

  const onChartMouseMove = React.useCallback(
    (chartState: { activeTooltipIndex?: number | string | null }) => {
      if (!scrub) return
      if (
        chartState?.activeTooltipIndex === undefined ||
        chartState.activeTooltipIndex === null
      ) {
        return
      }
      const idx = Number(chartState.activeTooltipIndex)
      if (!Number.isFinite(idx)) return
      selectMonth(idx)
    },
    [scrub, selectMonth]
  )

  React.useEffect(() => {
    const el = chartAreaRef.current
    if (!el || !scrub) return

    const onMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      e.preventDefault()
      selectMonth(indexFromClientX(t.clientX))
    }

    el.addEventListener("touchmove", onMove, { passive: false })
    return () => {
      el.removeEventListener("touchmove", onMove)
    }
  }, [indexFromClientX, scrub, selectMonth])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const reverse = plotRtl
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          selectMonth(selected + (reverse ? 1 : -1), true)
          break
        case "ArrowRight":
          event.preventDefault()
          selectMonth(selected + (reverse ? -1 : 1), true)
          break
        case "Home":
          event.preventDefault()
          selectMonth(reverse ? lastIndex : 0, true)
          break
        case "End":
          event.preventDefault()
          selectMonth(reverse ? 0 : lastIndex, true)
          break
        default:
          break
      }
    },
    [lastIndex, plotRtl, selectMonth, selected]
  )

  const ariaLabel = React.useMemo(() => {
    if (!row) return title
    return `Bar chart with selection, ${title}, ${monthLabel} ${formatCurrency(sales, locale)}`
  }, [locale, monthLabel, row, sales, title])

  const deltaPct = salesDelta
  const deltaUp = deltaPct != null && deltaPct >= 0

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[720px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
        className
      )}
    >
      <header className="flex flex-col gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <p
              className="text-[2rem] font-semibold leading-9 tracking-tight text-foreground"
              aria-hidden
            >
              {formatCurrency(sales, locale)}
            </p>
            {deltaPct != null ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
                  deltaUp ? "text-[var(--chart-up)]" : "text-destructive"
                )}
                style={{
                  backgroundColor: deltaUp
                    ? "color-mix(in oklab, var(--chart-up) 12%, transparent)"
                    : "color-mix(in oklab, var(--destructive) 12%, transparent)",
                }}
              >
                <span aria-hidden>{deltaUp ? "▲" : "▼"}</span>
                {Math.abs(deltaPct).toFixed(1)}%
                <span className="font-normal text-muted-foreground">
                  vs last month
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{monthLabel}</p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div
        ref={chartAreaRef}
        dir="ltr"
        role="img"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="cursor-pointer touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={chartConfig}
          className={cn(
            chartBarContainerClassName,
            "aspect-[1.65] h-auto max-w-none sm:h-auto"
          )}
        >
          <BarChart
            accessibilityLayer
            data={data}
            barCategoryGap={narrow ? "16%" : "18%"}
            margin={
              narrow
                ? { top: 12, right: 8, left: 4, bottom: 4 }
                : { top: 16, right: 12, left: 4, bottom: 8 }
            }
            onMouseMove={scrub ? onChartMouseMove : undefined}
            style={{ cursor: "pointer" }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="var(--border)"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="month"
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={0}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: string) =>
                formatAxisMonth(value, locale)
              }
            />
            <YAxis
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 36 : 44}
              domain={[0, domainMax]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(v: number) => formatCompact(v, locale)}
              className="tabular-nums"
            />
            <ReferenceLine
              y={average}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              strokeOpacity={0.55}
            />
            <Bar
              dataKey="sales"
              radius={BAR_RADIUS}
              maxBarSize={narrow ? 28 : 36}
              isAnimationActive={!reducedMotion}
              animationDuration={reducedMotion ? 0 : BAR_MS}
              animationEasing="ease-out"
              onClick={(_item, index) => {
                selectMonth(index, true)
              }}
              className="cursor-pointer"
            >
              {data.map((_, index) => {
                const isSelected = selected === index
                return (
                  <Cell
                    key={`sales-${index}`}
                    fill={isSelected ? "var(--color-sales)" : IDLE_FILL}
                    fillOpacity={isSelected ? 1 : 0.85}
                    style={{
                      cursor: "pointer",
                      transition: reducedMotion
                        ? undefined
                        : "fill-opacity 0.15s ease, fill 0.15s ease",
                    }}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      {/* Month chips — synced with bar click */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {data.map((item, index) => {
          const active = index === selected
          return (
            <button
              key={item.month}
              type="button"
              onClick={() => selectMonth(index, true)}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1 text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-foreground text-background"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {formatAxisMonth(item.month, locale)}
            </button>
          )
        })}
      </div>

      {/* Selection detail panel — chart-local customized event surface */}
      <div className="grid gap-3 rounded-xl border border-border bg-background px-4 py-3 sm:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Month report</p>
              <p className="text-base font-semibold text-foreground">
                {shortMonth}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={selected <= 0}
                className="cursor-pointer rounded-md border border-border px-2 py-1 text-xs text-muted-foreground enabled:hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous month"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={selected >= lastIndex}
                className="cursor-pointer rounded-md border border-border px-2 py-1 text-xs text-muted-foreground enabled:hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next month"
              >
                Next
              </button>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
            <div>
              <dt className="text-[11px] text-muted-foreground">Sales</dt>
              <dd className="text-sm font-medium text-foreground tabular-nums">
                {formatCurrency(sales, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">Orders</dt>
              <dd className="text-sm font-medium text-foreground tabular-nums">
                {formatNumber(orders, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">Avg basket</dt>
              <dd className="text-sm font-medium text-foreground tabular-nums">
                {formatCurrency(avgBasket, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">Share of total</dt>
              <dd className="text-sm font-medium text-foreground tabular-nums">
                {share.toFixed(1)}%
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col justify-center gap-2 border-t border-border pt-3 sm:min-w-[9.5rem] sm:border-t-0 sm:border-s sm:ps-4 sm:pt-0">
          <DeltaLine
            label={
              prev
                ? `vs ${formatAxisMonth(prev.month, locale)}`
                : "First month in range"
            }
            value={salesDelta}
          />
          <DeltaLine label="vs period average" value={vsAverage} />
          {ordersDelta != null ? (
            <DeltaLine label="Orders change" value={ordersDelta} />
          ) : null}
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Dashed line = period average sales
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.sales.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Sales</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.month}>
              <td>{formatFullMonthYear(item.month, locale)}</td>
              <td>{item.sales}</td>
              <td>{item.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function BarChartWithCustomizedEventDemo(
  props: BarChartWithCustomizedEventProps
) {
  return <BarChartWithCustomizedEvent {...props} />
}

export { BarChartWithCustomizedEvent }
