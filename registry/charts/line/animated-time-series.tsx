"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
 * Animated Time Series — locked gallery chrome (navy × orange).
 * Type-required sliding circular window over a longer dual-series year.
 * Metric header scrubber; pauses auto-advance while scrubbing / reduced-motion.
 * Installs to: components/charts/animated-time-series.tsx
 */

export type AnimatedTimeSeriesPoint = {
  /** ISO date (YYYY-MM-DD). */
  month: string
  desktop: number
  mobile: number
}

export type AnimatedTimeSeriesProps = {
  title?: string
  subtitle?: string
  /** Full series; a sliding window of `windowSize` is shown. */
  data?: AnimatedTimeSeriesPoint[]
  windowSize?: number
  /** Auto-advance interval in ms. Ignored when scrubbing or reduced-motion. */
  tickMs?: number
  className?: string
  plotDir?: "ltr" | "rtl"
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const LINE_MS = 800
const DEFAULT_WINDOW = 6
const DEFAULT_TICK_MS = 800
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

/** Stable English year (12 months) — circular window slides over this. */
const DEMO_SERIES: AnimatedTimeSeriesPoint[] = [
  { month: "2026-01-01", desktop: 300, mobile: 600 },
  { month: "2026-02-01", desktop: 295, mobile: 520 },
  { month: "2026-03-01", desktop: 130, mobile: 450 },
  { month: "2026-04-01", desktop: 220, mobile: 680 },
  { month: "2026-05-01", desktop: 145, mobile: 783 },
  { month: "2026-06-01", desktop: 190, mobile: 660 },
  { month: "2026-07-01", desktop: 250, mobile: 710 },
  { month: "2026-08-01", desktop: 280, mobile: 640 },
  { month: "2026-09-01", desktop: 210, mobile: 590 },
  { month: "2026-10-01", desktop: 260, mobile: 720 },
  { month: "2026-11-01", desktop: 310, mobile: 690 },
  { month: "2026-12-01", desktop: 340, mobile: 750 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: CHART_SERIES_A,
  },
  mobile: {
    label: "Mobile",
    color: CHART_SERIES_B,
  },
} satisfies ChartConfig

const LINE_TOOLTIP_CURSOR = {
  stroke: "color-mix(in oklab, var(--foreground) 18%, transparent)",
  strokeWidth: 1,
} as const

type WindowRow = AnimatedTimeSeriesPoint & { _key: string }

function getCircularWindow(
  series: AnimatedTimeSeriesPoint[],
  windowStart: number,
  windowSize: number
): WindowRow[] {
  const n = series.length
  if (n === 0) return []
  return Array.from({ length: Math.min(windowSize, n) }, (_, index) => {
    const row = series[(windowStart + index) % n]!
    return { ...row, _key: `${windowStart}-${index}-${row.month}` }
  })
}

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

function AnimatedTimeSeries({
  title = "Website Traffic by Device – Live Window",
  subtitle = "Sliding six-month window over a full year.",
  data = DEMO_SERIES,
  windowSize = DEFAULT_WINDOW,
  tickMs = DEFAULT_TICK_MS,
  className,
  plotDir,
  scrub = true,
}: AnimatedTimeSeriesProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const seriesLen = data.length
  const [windowStart, setWindowStart] = React.useState(0)
  const windowData = React.useMemo(
    () => getCircularWindow(data, windowStart, windowSize),
    [data, windowSize, windowStart]
  )

  const lastIndex = Math.max(0, windowData.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [windowTrack, setWindowTrack] = React.useState({
    windowStart,
    lastIndex,
  })
  if (
    windowTrack.windowStart !== windowStart ||
    windowTrack.lastIndex !== lastIndex
  ) {
    setWindowTrack({ windowStart, lastIndex })
    setActiveIndex(lastIndex)
  }

  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = windowData[liveIndex] ?? windowData[lastIndex]
  const previous = liveIndex > 0 ? windowData[liveIndex - 1] : null
  const total = active ? active.desktop + active.mobile : 0
  const prevTotal = previous
    ? previous.desktop + previous.mobile
    : null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const monthLabel = active
    ? formatFullMonthYear(active.month, locale)
    : ""

  // Auto-advance — pause while scrubbing or when reduced-motion.
  React.useEffect(() => {
    if (reducedMotion || scrubbing || seriesLen === 0) return
    const id = window.setInterval(() => {
      setWindowStart((s) => (s + 1) % seriesLen)
    }, tickMs)
    return () => window.clearInterval(id)
  }, [reducedMotion, scrubbing, seriesLen, tickMs])

  const announce = React.useCallback(
    (index: number) => {
      const point = windowData[index]
      if (!point || !liveRef.current) return
      const sum = point.desktop + point.mobile
      liveRef.current.textContent = `${formatFullMonthYear(point.month, locale)}: ${formatNumber(sum, locale)}`
    },
    [locale, windowData]
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
      if (!el || windowData.length === 0) return lastIndex
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return lastIndex
      let ratio = (clientX - rect.left) / rect.width
      if (plotRtl) ratio = 1 - ratio
      ratio = Math.min(1, Math.max(0, ratio))
      return Math.min(lastIndex, Math.floor(ratio * windowData.length))
    },
    [lastIndex, plotRtl, windowData.length]
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

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous`
    return `Animated time series, ${title}, ${monthLabel} ${formatNumber(total, locale)}${deltaText}`
  }, [active, deltaPct, deltaUp, locale, monthLabel, title, total])

  const lineOpacity = liveScrubbing ? 0.85 : 1

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
                  vs previous
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
          <LineChart
            accessibilityLayer
            data={windowData}
            margin={
              narrow
                ? {
                    top: 16,
                    right: plotRtl ? 4 : 8,
                    left: plotRtl ? 8 : 4,
                    bottom: 4,
                  }
                : { top: 20, right: 12, left: 4, bottom: 8 }
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
              allowDataOverflow
              tickLine={false}
              axisLine={false}
              tickMargin={10}
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
              domain={[0, 1000]}
              ticks={[0, 250, 500, 750, 1000]}
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
              cursor={LINE_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent className="rounded-xl border-border/60 shadow-sm" />
              }
            />
            <Line
              type="monotone"
              dataKey="desktop"
              name="desktop"
              stroke="var(--color-desktop)"
              strokeWidth={2.25}
              strokeOpacity={lineOpacity}
              dot={false}
              isAnimationActive={!reducedMotion}
              animationDuration={reducedMotion ? 0 : LINE_MS}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="mobile"
              name="mobile"
              stroke="var(--color-mobile)"
              strokeWidth={2.75}
              strokeOpacity={lineOpacity}
              dot={false}
              isAnimationActive={!reducedMotion}
              animationDuration={reducedMotion ? 0 : LINE_MS}
              animationEasing="ease-out"
            />
          </LineChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.desktop.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-2)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.mobile.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Desktop</th>
            <th>Mobile</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{formatFullMonthYear(row.month, locale)}</td>
              <td>{row.desktop}</td>
              <td>{row.mobile}</td>
              <td>{row.desktop + row.mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function AnimatedTimeSeriesDemo(
  props: AnimatedTimeSeriesProps
) {
  return <AnimatedTimeSeries {...props} />
}

export { AnimatedTimeSeries }
