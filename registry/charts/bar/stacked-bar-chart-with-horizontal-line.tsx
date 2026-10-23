"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  CHART_SERIES_A,
  CHART_SERIES_B,
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Stacked Bar Chart With Horizontal Line — locked gallery chrome
 * (navy × orange + chart-3 third stack); type-required dashed target
 * `ReferenceLine`. Metric header scrubber.
 * Installs to: components/charts/stacked-bar-chart-with-horizontal-line.tsx
 */

export type StackedBarWithHorizontalLinePoint = {
  month: string
  online: number
  store: number
  wholesale: number
}

export type StackedBarChartWithHorizontalLineProps = {
  title?: string
  subtitle?: string
  data?: StackedBarWithHorizontalLinePoint[]
  /** Horizontal target line value. Default 18. */
  target?: number
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const BAR_MS = 200
const DEFAULT_TARGET = 18
const TOP_RADIUS: [number, number, number, number] = [8, 8, 0, 0]
const FLAT_RADIUS: [number, number, number, number] = [0, 0, 0, 0]
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const CHART_SERIES_C = "var(--chart-3)"

const DEMO_DATA: StackedBarWithHorizontalLinePoint[] = [
  { month: "2026-01-01", online: 6.2, store: 4.8, wholesale: 3.1 },
  { month: "2026-02-01", online: 7.4, store: 5.1, wholesale: 4.2 },
  { month: "2026-03-01", online: 5.8, store: 6.4, wholesale: 3.6 },
  { month: "2026-04-01", online: 8.1, store: 5.6, wholesale: 4.8 },
  { month: "2026-05-01", online: 6.9, store: 4.2, wholesale: 3.4 },
  { month: "2026-06-01", online: 9.2, store: 6.8, wholesale: 5.1 },
  { month: "2026-07-01", online: 7.6, store: 5.9, wholesale: 4.4 },
]

const chartConfig = {
  online: {
    label: "Online",
    color: CHART_SERIES_A,
  },
  store: {
    label: "Store",
    color: CHART_SERIES_B,
  },
  wholesale: {
    label: "Wholesale",
    color: CHART_SERIES_C,
  },
} satisfies ChartConfig

const BAR_TOOLTIP_CURSOR = {
  fill: "color-mix(in oklab, var(--foreground) 5%, transparent)",
} as const

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
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(value)
}

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function rowTotal(row: StackedBarWithHorizontalLinePoint) {
  return row.online + row.store + row.wholesale
}

function TargetLabel({
  viewBox,
  target,
  locale,
  plotRtl,
}: {
  viewBox?: { x?: number; y?: number; width?: number }
  target: number
  locale: string
  plotRtl: boolean
}) {
  const vb = viewBox
  const width = Number(vb?.width ?? 0)
  const x = plotRtl
    ? Number(vb?.x ?? 0) + 4
    : Number(vb?.x ?? 0) + width - 4
  const y = Number(vb?.y ?? 0) - 8

  return (
    <text
      x={x}
      y={y}
      textAnchor={plotRtl ? "start" : "end"}
      fill={AXIS_TICK_FILL}
      style={{ fontSize: 11, fontWeight: 500 }}
      className="tabular-nums"
    >
      Target {formatNumber(target, locale)}
    </text>
  )
}

function StackedBarChartWithHorizontalLine({
  title = "Channel sales vs target",
  subtitle = "Online + Store + Wholesale with a monthly target line.",
  data = DEMO_DATA,
  target = DEFAULT_TARGET,
  className,
  plotDir,
  scrub = true,
}: StackedBarChartWithHorizontalLineProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const lastIndex = Math.max(0, data.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({ data, lastIndex })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data, lastIndex })
    setActiveIndex(lastIndex)
  }

  const barSize = narrow ? 28 : 36
  const categoryGap = narrow ? "18%" : "22%"
  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[lastIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const total = active ? rowTotal(active) : 0
  const prevTotal = previous ? rowTotal(previous) : null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const vsTarget = total - target
  const hitTarget = vsTarget >= 0
  const monthLabel = active
    ? formatFullMonthYear(active.month, locale)
    : ""

  const domainMax = React.useMemo(() => {
    const peak = Math.max(...data.map(rowTotal), target)
    return Math.ceil(peak / 6) * 6
  }, [data, target])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      const sum = rowTotal(point)
      const gap = sum - target
      liveRef.current.textContent = `${formatFullMonthYear(point.month, locale)}: ${formatNumber(sum, locale)}, ${gap >= 0 ? "above" : "below"} target by ${formatNumber(Math.abs(gap), locale)}`
    },
    [data, locale, target]
  )

  const moveActive = React.useCallback(
    (next: number, fromKeyboard = false) => {
      const clamped = Math.min(lastIndex, Math.max(0, next))
      setActiveIndex(clamped)
      if (fromKeyboard) announce(clamped)
    },
    [announce, lastIndex]
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
      scrubbingRef.current = true
      setScrubbing(true)
      setActiveIndex(idx)
    },
    [scrub]
  )

  const onChartMouseLeave = React.useCallback(() => {
    if (!scrub) return
    scrubbingRef.current = false
    setScrubbing(false)
    setActiveIndex(lastIndex)
  }, [lastIndex, scrub])

  React.useEffect(() => {
    const el = chartAreaRef.current
    if (!el || !scrub) return

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      scrubbingRef.current = true
      setScrubbing(true)
      setActiveIndex(indexFromClientX(t.clientX))
    }

    const onMove = (e: TouchEvent) => {
      if (!scrubbingRef.current) return
      const t = e.touches[0]
      if (!t) return
      e.preventDefault()
      setActiveIndex(indexFromClientX(t.clientX))
    }

    const onEnd = () => {
      scrubbingRef.current = false
      setScrubbing(false)
      setActiveIndex(lastIndex)
    }

    el.addEventListener("touchstart", onStart, { passive: true })
    el.addEventListener("touchmove", onMove, { passive: false })
    el.addEventListener("touchend", onEnd)
    el.addEventListener("touchcancel", onEnd)
    return () => {
      el.removeEventListener("touchstart", onStart)
      el.removeEventListener("touchmove", onMove)
      el.removeEventListener("touchend", onEnd)
      el.removeEventListener("touchcancel", onEnd)
    }
  }, [indexFromClientX, lastIndex, scrub])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrub) return
      const reverse = plotRtl
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(activeIndex + (reverse ? 1 : -1), true)
          break
        case "ArrowRight":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(activeIndex + (reverse ? -1 : 1), true)
          break
        case "Home":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(0, true)
          break
        case "End":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(lastIndex, true)
          break
        case "Escape":
          event.preventDefault()
          scrubbingRef.current = false
          setScrubbing(false)
          moveActive(lastIndex, true)
          break
        default:
          break
      }
    },
    [activeIndex, lastIndex, moveActive, plotRtl, scrub]
  )

  const totalLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      width?: string | number
      index?: number
      payload?: StackedBarWithHorizontalLinePoint
    }) => {
      if (!liveScrubbing) return null
      const x = Number(props.x) || 0
      const y = Number(props.y) || 0
      const width = Number(props.width) || 0
      const index = props.index ?? 0
      if (index !== liveIndex) return null
      const point = props.payload ?? data[index]
      if (!point) return null

      return (
        <text
          x={x + width / 2}
          y={y - 10}
          textAnchor="middle"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {formatNumber(rowTotal(point), locale)}
        </text>
      )
    },
    [data, liveIndex, liveScrubbing, locale]
  )

  const targetLineLabel = React.useCallback(
    (props: { viewBox?: { x?: number; y?: number; width?: number } }) => (
      <TargetLabel
        {...props}
        target={target}
        locale={locale}
        plotRtl={plotRtl}
      />
    ),
    [locale, plotRtl, target]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs last month`
    const targetText = `, ${hitTarget ? "above" : "below"} target ${formatNumber(target, locale)}`
    return `Stacked bar with target line, ${title}, ${monthLabel} ${formatNumber(total, locale)}${targetText}${deltaText}`
  }, [
    active,
    deltaPct,
    deltaUp,
    hitTarget,
    locale,
    monthLabel,
    target,
    title,
    total,
  ])

  const cellOpacity = (index: number) =>
    liveScrubbing && index !== liveIndex ? 0.4 : 1

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[640px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
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
              {formatNumber(total, locale)}
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
          <p className="text-xs text-muted-foreground">
            {monthLabel}
            <span
              className={cn(
                "ms-1.5 font-medium",
                hitTarget ? "text-[var(--chart-up)]" : "text-destructive"
              )}
            >
              {hitTarget ? "+" : "−"}
              {formatNumber(Math.abs(vsTarget), locale)} vs target{" "}
              {formatNumber(target, locale)}
            </span>
          </p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div
        ref={chartAreaRef}
        dir="ltr"
        role="img"
        aria-label={ariaLabel}
        tabIndex={scrub ? 0 : undefined}
        onKeyDown={scrub ? onKeyDown : undefined}
        onBlur={
          scrub
            ? () => {
                scrubbingRef.current = false
                setScrubbing(false)
                setActiveIndex(lastIndex)
              }
            : undefined
        }
        className="touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={chartConfig}
          className={cn(chartBarContainerClassName, "max-w-none")}
        >
          <BarChart
            accessibilityLayer
            data={data}
            barCategoryGap={categoryGap}
            margin={
              narrow
                ? {
                    top: 28,
                    right: plotRtl ? 4 : 8,
                    left: plotRtl ? 8 : 4,
                    bottom: 4,
                  }
                : { top: 32, right: 12, left: 4, bottom: 8 }
            }
            onMouseMove={scrub ? onChartMouseMove : undefined}
            onMouseLeave={scrub ? onChartMouseLeave : undefined}
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
              tickMargin={12}
              minTickGap={4}
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
              tickFormatter={(value: number) =>
                formatCompact(value, locale)
              }
              className="tabular-nums"
            />
            <ReferenceLine
              y={target}
              stroke="var(--muted-foreground)"
              strokeWidth={1}
              strokeDasharray="4 4"
              strokeOpacity={0.85}
              label={targetLineLabel}
            />
            <ChartTooltip
              cursor={BAR_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent className="rounded-xl border-border/60 shadow-sm" />
              }
            />
            <Bar
              dataKey="online"
              stackId="sales"
              fill="var(--color-online)"
              radius={FLAT_RADIUS}
              maxBarSize={barSize}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : BAR_MS}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell
                  key={`online-${index}`}
                  fillOpacity={cellOpacity(index)}
                />
              ))}
            </Bar>
            <Bar
              dataKey="store"
              stackId="sales"
              fill="var(--color-store)"
              radius={FLAT_RADIUS}
              maxBarSize={barSize}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : BAR_MS}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell
                  key={`store-${index}`}
                  fillOpacity={cellOpacity(index)}
                />
              ))}
            </Bar>
            <Bar
              dataKey="wholesale"
              stackId="sales"
              fill="var(--color-wholesale)"
              radius={TOP_RADIUS}
              maxBarSize={barSize}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : BAR_MS}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell
                  key={`wholesale-${index}`}
                  fillOpacity={cellOpacity(index)}
                />
              ))}
              {scrub ? (
                <LabelList dataKey="wholesale" content={totalLabel} />
              ) : null}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.online.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-2)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.store.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-3)" }}
            aria-hidden
          />
          <span className="text-foreground">
            {chartConfig.wholesale.label}
          </span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} Target {target}.
        </caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Online</th>
            <th>Store</th>
            <th>Wholesale</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{formatFullMonthYear(row.month, locale)}</td>
              <td>{row.online}</td>
              <td>{row.store}</td>
              <td>{row.wholesale}</td>
              <td>{rowTotal(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function StackedBarChartWithHorizontalLineDemo(
  props: StackedBarChartWithHorizontalLineProps
) {
  return <StackedBarChartWithHorizontalLine {...props} />
}

export { StackedBarChartWithHorizontalLine }
