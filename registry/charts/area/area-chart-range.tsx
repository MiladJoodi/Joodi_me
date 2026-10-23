"use client"

import * as React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
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
  MARKET_UP,
  chartAreaContainerClassName,
  chartAreaGradientStops,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"
import { useMarketNeon } from "../_lib/use-market-neon"
import { useNarrowViewport } from "../_lib/use-narrow-viewport"
import { usePrefersReducedMotion } from "../_lib/use-prefers-reduced-motion"

/**
 * Area Chart Range — locked gallery chrome + **neon** (chart-local); type-required ranged area
 * (`[low, high]` band per category). Single series `--chart-1`. Metric tracks high.
 * Installs to: components/charts/area-chart-range.tsx
 */

export type AreaChartRangePoint = {
  month: string
  /** `[low, high]` temperature (or any numeric range). */
  temperature: [number, number]
}

export type AreaChartRangeProps = {
  title?: string
  subtitle?: string
  data?: AreaChartRangePoint[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const AREA_MS = 200
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const DEMO_DATA: AreaChartRangePoint[] = [
  { month: "Jan", temperature: [-1, 10] },
  { month: "Feb", temperature: [2, 15] },
  { month: "Mar", temperature: [3, 12] },
  { month: "Apr", temperature: [4, 12] },
  { month: "May", temperature: [12, 16] },
  { month: "Jun", temperature: [5, 16] },
  { month: "Jul", temperature: [3, 12] },
  { month: "Aug", temperature: [0, 8] },
  { month: "Sep", temperature: [-3, 5] },
]

const AREA_TOOLTIP_CURSOR = {
  stroke: "color-mix(in oklab, var(--foreground) 18%, transparent)",
  strokeWidth: 1,
} as const

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function formatTemp(value: number, locale: string) {
  return `${new Intl.NumberFormat(locale).format(value)}°`
}

function rangeLow(point: AreaChartRangePoint) {
  return Math.min(point.temperature[0], point.temperature[1])
}

function rangeHigh(point: AreaChartRangePoint) {
  return Math.max(point.temperature[0], point.temperature[1])
}

function rangeSpan(point: AreaChartRangePoint) {
  return rangeHigh(point) - rangeLow(point)
}

function formatRange(point: AreaChartRangePoint, locale: string) {
  return `${formatTemp(rangeLow(point), locale)} – ${formatTemp(rangeHigh(point), locale)}`
}

function AreaChartRange({
  title = "Monthly temperature range",
  subtitle = "Low–high (°C) band per month.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: AreaChartRangeProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const neon = useMarketNeon()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"
  const uid = React.useId().replace(/:/g, "")
  const gradId = `rangeTemp-${uid}`

  const color = neon ? MARKET_UP : CHART_SERIES_A
  const glow = neon ? chartNeonGlowProps(color) : null
  const fillStart = neon ? 0.32 : 0.4
  const fillEnd = neon ? 0 : 0.12

  const chartConfig = {
    temperature: {
      label: "Temperature",
      color,
    },
  } satisfies ChartConfig

  const lastIndex = Math.max(0, data.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({ data, lastIndex })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data, lastIndex })
    setActiveIndex(lastIndex)
  }

  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[lastIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const total = active ? rangeHigh(active) : 0
  const prevTotal = previous ? rangeHigh(previous) : null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / Math.abs(prevTotal)) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const monthLabel = active?.month ?? ""
  const rangeLabel = active ? formatRange(active, locale) : ""
  const spanLabel = active
    ? `span ${formatTemp(rangeSpan(active), locale)}`
    : ""

  const yDomain = React.useMemo(() => {
    const lows = data.map(rangeLow)
    const highs = data.map(rangeHigh)
    const min = Math.min(...lows, 0)
    const max = Math.max(...highs, 0)
    const pad = 2
    return [Math.floor(min) - pad, Math.ceil(max) + pad] as [number, number]
  }, [data])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${point.month}: ${formatRange(point, locale)}`
    },
    [data, locale]
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
          moveActive(reverse ? lastIndex : 0, true)
          break
        case "End":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(reverse ? 0 : lastIndex, true)
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
      index?: number
      payload?: AreaChartRangePoint
    }) => {
      if (!liveScrubbing) return null
      const x = Number(props.x) || 0
      const y = Number(props.y) || 0
      const index = props.index ?? 0
      if (index !== liveIndex) return null
      const point = props.payload ?? data[index]
      if (!point) return null

      return (
        <text
          x={x}
          y={y - 12}
          textAnchor="middle"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {formatRange(point, locale)}
        </text>
      )
    },
    [data, liveIndex, liveScrubbing, locale]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, high ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous`
    return `Range area chart, ${title}, ${monthLabel} ${rangeLabel}${deltaText}`
  }, [active, deltaPct, deltaUp, monthLabel, rangeLabel, title])

  const seriesOpacity = liveScrubbing ? 0.85 : 1

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
              {formatTemp(Math.round(total * 10) / 10, locale)}
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
                  vs previous high
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {monthLabel}
            {rangeLabel ? ` · ${rangeLabel}` : null}
            {spanLabel ? ` · ${spanLabel}` : null}
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
          className={cn(
            chartAreaContainerClassName,
            "max-w-none",
            neon && chartNeonOverflowClassName
          )}
        >
          <RechartsAreaChart
            accessibilityLayer
            data={data}
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
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                {chartAreaGradientStops(color, {
                  startOpacity: fillStart,
                  endOpacity: fillEnd,
                }).map((s) => (
                  <stop
                    key={s.offset}
                    offset={s.offset}
                    stopColor={s.stopColor}
                    stopOpacity={s.stopOpacity}
                  />
                ))}
              </linearGradient>
            </defs>
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
            />
            <YAxis
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 36 : 44}
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: number) => formatNumber(value, locale)}
              className="tabular-nums"
            />
            <ReferenceLine y={0} stroke="var(--border)" strokeOpacity={0.8} />
            <ChartTooltip
              cursor={AREA_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  formatter={(value) => {
                    if (Array.isArray(value)) {
                      const low = Math.min(Number(value[0]), Number(value[1]))
                      const high = Math.max(Number(value[0]), Number(value[1]))
                      return (
                        <span className="font-medium tabular-nums text-foreground">
                          {formatTemp(low, locale)} – {formatTemp(high, locale)}
                        </span>
                      )
                    }
                    return (
                      <span className="font-medium tabular-nums text-foreground">
                        {formatTemp(Number(value), locale)}
                      </span>
                    )
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="temperature"
              name="temperature"
              stroke={color}
              strokeWidth={glow?.strokeWidth ?? 2.25}
              strokeOpacity={seriesOpacity}
              fill={`url(#${gradId})`}
              fillOpacity={neon ? 1 : seriesOpacity}
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "var(--background)",
                fill: color,
              }}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : AREA_MS}
              animationEasing="ease-out"
              style={glow?.style}
              className={glow?.className}
            >
              {scrub ? (
                <LabelList dataKey="temperature" content={totalLabel} />
              ) : null}
            </Area>
          </RechartsAreaChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <span className="text-foreground">
            {chartConfig.temperature.label}
          </span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Low</th>
            <th>High</th>
            <th>Span</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>{rangeLow(row)}</td>
              <td>{rangeHigh(row)}</td>
              <td>{rangeSpan(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function AreaChartRangeDemo(props: AreaChartRangeProps) {
  return <AreaChartRange {...props} />
}

export { AreaChartRange }
