"use client"

import * as React from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
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
  chartLineContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Target Price Chart — locked gallery chrome (navy × orange).
 * Consensus range Area + price Line + dashed analyst target; metric scrubber.
 * Installs to: components/charts/target-price-chart.tsx
 */

export type TargetPriceChartPoint = {
  /** ISO date (YYYY-MM-DD) preferred; short labels also accepted. */
  month: string
  price: number
  target: number
  /** Consensus [low, high]. */
  range: [number, number]
}

export type TargetPriceChartProps = {
  title?: string
  subtitle?: string
  data?: TargetPriceChartPoint[]
  className?: string
  /** First column + Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const ANIM_MS = 200
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const DEMO_DATA: TargetPriceChartPoint[] = [
  { month: "2026-01-01", price: 312, target: 380, range: [290, 420] },
  { month: "2026-02-01", price: 328, target: 385, range: [300, 430] },
  { month: "2026-03-01", price: 341, target: 390, range: [310, 440] },
  { month: "2026-04-01", price: 355, target: 400, range: [320, 450] },
  { month: "2026-05-01", price: 348, target: 405, range: [325, 455] },
  { month: "2026-06-01", price: 372, target: 415, range: [340, 470] },
  { month: "2026-07-01", price: 389, target: 425, range: [350, 480] },
  { month: "2026-08-01", price: 401, target: 430, range: [360, 490] },
  { month: "2026-09-01", price: 396, target: 435, range: [365, 495] },
  { month: "2026-10-01", price: 412, target: 445, range: [380, 510] },
  { month: "2026-11-01", price: 428, target: 455, range: [390, 520] },
  { month: "2026-12-01", price: 441, target: 460, range: [400, 530] },
]

const chartConfig = {
  range: {
    label: "Consensus range",
    color: CHART_SERIES_A,
  },
  price: {
    label: "Price",
    color: CHART_SERIES_A,
  },
  target: {
    label: "Analyst target",
    color: CHART_SERIES_B,
  },
} satisfies ChartConfig

const COMPOSED_TOOLTIP_CURSOR = {
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
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function TargetPriceChart({
  title = "Share Price vs Analyst Target",
  subtitle = "Price, consensus range, and dashed target.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: TargetPriceChartProps) {
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

  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[lastIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const total = active?.price ?? 0
  const prevTotal = previous?.price ?? null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const monthLabel = active
    ? formatFullMonthYear(active.month, locale)
    : ""
  const vsTarget =
    active != null ? active.price - active.target : null

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      const gap = point.price - point.target
      liveRef.current.textContent = `${formatFullMonthYear(point.month, locale)}: price ${formatNumber(point.price, locale)}, target ${formatNumber(point.target, locale)}, ${gap >= 0 ? "above" : "below"} target by ${formatNumber(Math.abs(gap), locale)}`
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

  const scrubLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      index?: number
      value?: unknown
    }) => {
      if (!liveScrubbing) return null
      const x = Number(props.x) || 0
      const y = Number(props.y) || 0
      const index = props.index ?? 0
      if (index !== liveIndex) return null
      const value = Number(props.value)
      if (!Number.isFinite(value)) return null

      return (
        <text
          x={x}
          y={y - 14}
          textAnchor="middle"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {formatNumber(value, locale)}
        </text>
      )
    },
    [liveIndex, liveScrubbing, locale]
  )

  const yDomain = React.useMemo(() => {
    const lows = data.map((r) => Math.min(r.price, r.target, r.range[0]))
    const highs = data.map((r) => Math.max(r.price, r.target, r.range[1]))
    const min = Math.min(...lows)
    const max = Math.max(...highs)
    const pad = Math.max(20, (max - min) * 0.08)
    const lo = Math.floor((min - pad) / 20) * 20
    const hi = Math.ceil((max + pad) / 20) * 20
    return [lo, hi] as [number, number]
  }, [data])

  const seriesOpacity = liveScrubbing ? 0.85 : 1

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs last month`
    const gapText =
      vsTarget == null
        ? ""
        : `, ${vsTarget >= 0 ? "above" : "below"} target by ${formatNumber(Math.abs(vsTarget), locale)}`
    return `Target price chart, ${title}, ${monthLabel} price ${formatNumber(total, locale)}${deltaText}${gapText}`
  }, [
    active,
    deltaPct,
    deltaUp,
    locale,
    monthLabel,
    title,
    total,
    vsTarget,
  ])

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
            {active != null && vsTarget != null ? (
              <span>
                {" · "}
                target {formatNumber(active.target, locale)} ·{" "}
                {vsTarget >= 0 ? "+" : "−"}
                {formatNumber(Math.abs(vsTarget), locale)} vs target
              </span>
            ) : null}
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
          className={cn(chartLineContainerClassName, "max-w-none")}
        >
          <ComposedChart
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
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="var(--border)"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="month"
              scale="band"
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={narrow ? 8 : 4}
              interval={narrow ? "preserveStartEnd" : 0}
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
              domain={yDomain}
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
            <ChartTooltip
              cursor={COMPOSED_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  formatter={(value, name) => {
                    const key = String(name)
                    if (key === "range") {
                      const range = value as [number, number] | undefined
                      if (!Array.isArray(range) || range.length < 2) {
                        return null
                      }
                      return (
                        <span className="font-medium tabular-nums text-foreground">
                          {formatNumber(range[0], locale)}–
                          {formatNumber(range[1], locale)}
                        </span>
                      )
                    }
                    if (
                      (key === "price" || key === "target") &&
                      value != null
                    ) {
                      return (
                        <span className="font-medium tabular-nums text-foreground">
                          {formatNumber(Number(value), locale)}
                        </span>
                      )
                    }
                    return null
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="range"
              name="range"
              stroke="none"
              fill="var(--color-range)"
              fillOpacity={liveScrubbing ? 0.1 : 0.14}
              connectNulls
              dot={false}
              activeDot={false}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : ANIM_MS}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="price"
              name="price"
              stroke="var(--color-price)"
              strokeWidth={2}
              strokeOpacity={seriesOpacity}
              connectNulls
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "var(--background)",
                fill: "var(--color-price)",
              }}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : ANIM_MS}
              animationEasing="ease-out"
            >
              {scrub ? (
                <LabelList dataKey="price" content={scrubLabel} />
              ) : null}
            </Line>
            <Line
              type="monotone"
              dataKey="target"
              name="target"
              stroke="var(--color-target)"
              strokeWidth={2}
              strokeDasharray="5 4"
              strokeOpacity={seriesOpacity}
              connectNulls
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: "var(--background)",
                fill: "var(--color-target)",
              }}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : ANIM_MS}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-sm opacity-70"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.range.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.price.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-px w-3 shrink-0 border-t-2 border-dashed"
            style={{ borderColor: "var(--chart-2)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.target.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Price</th>
            <th>Target</th>
            <th>Range low</th>
            <th>Range high</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{formatFullMonthYear(row.month, locale)}</td>
              <td>{row.price}</td>
              <td>{row.target}</td>
              <td>{row.range[0]}</td>
              <td>{row.range[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function TargetPriceChartDemo(props: TargetPriceChartProps) {
  return <TargetPriceChart {...props} />
}

export { TargetPriceChart }
