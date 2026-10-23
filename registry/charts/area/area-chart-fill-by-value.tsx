"use client"

import * as React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
  useChartHeight,
  useYAxisScale,
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
  MARKET_DOWN,
  MARKET_UP,
  chartAreaContainerClassName,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"
import { useMarketNeon } from "../_lib/use-market-neon"
import { useNarrowViewport } from "../_lib/use-narrow-viewport"
import { usePrefersReducedMotion } from "../_lib/use-prefers-reduced-motion"

/**
 * Area Chart Fill By Value — locked gallery chrome + **neon** (chart-local).
 * Single monotone area; fill splits at y=0 via userSpaceOnUse gradient.
 * Metric header scrubber; RTL-aware axes.
 * Installs to: components/charts/area-chart-fill-by-value.tsx
 */

export type AreaChartFillByValuePoint = {
  /** ISO date (YYYY-MM-DD) preferred; short labels also accepted. */
  month: string
  value: number
}

export type AreaChartFillByValueProps = {
  title?: string
  subtitle?: string
  data?: AreaChartFillByValuePoint[]
  className?: string
  /** First column + Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (update metric). Default on. */
  scrub?: boolean
}

const AREA_MS = 200
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const DEMO_DATA: AreaChartFillByValuePoint[] = [
  { month: "2026-01-01", value: 4000 },
  { month: "2026-02-01", value: 3000 },
  { month: "2026-03-01", value: -1000 },
  { month: "2026-04-01", value: 500 },
  { month: "2026-05-01", value: -2000 },
  { month: "2026-06-01", value: -250 },
  { month: "2026-07-01", value: 3490 },
]

const AREA_TOOLTIP_CURSOR = {
  stroke: "color-mix(in oklab, var(--foreground) 18%, transparent)",
  strokeWidth: 1,
} as const

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

function formatSigned(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { signDisplay: "exceptZero" }).format(
    Math.round(value)
  )
}

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
  }).format(value)
}

/** Split fill at y=0 — must render inside the AreaChart tree. */
function SplitFillGradient({
  gradId,
  up,
  down,
}: {
  gradId: string
  up: string
  down: string
}) {
  const scale = useYAxisScale()
  const height = useChartHeight()
  const scaledZero = scale?.(0)
  if (scaledZero == null || height == null) return null
  const ratio = scaledZero / height

  return (
    <defs>
      <linearGradient
        id={gradId}
        x1="0"
        x2="0"
        y1="0"
        y2={height}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor={up} stopOpacity={1} />
        <stop offset={`${ratio}`} stopColor={up} stopOpacity={0.15} />
        <stop offset={`${ratio}`} stopColor={down} stopOpacity={0.15} />
        <stop offset="1" stopColor={down} stopOpacity={1} />
      </linearGradient>
    </defs>
  )
}

function AreaChartFillByValue({
  title = "Net Sessions Change – H1–Jul 2026",
  subtitle = "Area fill splits at zero — navy above, orange below.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: AreaChartFillByValueProps) {
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
  const gradId = `areaFillByValue-${uid}`

  const colorUp = neon ? MARKET_UP : CHART_SERIES_A
  const colorDown = neon ? MARKET_DOWN : CHART_SERIES_B
  const glow = neon ? chartNeonGlowProps(colorUp) : null

  const chartConfig = {
    value: {
      label: "Net change",
      color: colorUp,
    },
    positive: {
      label: "Above zero",
      color: colorUp,
    },
    negative: {
      label: "Below zero",
      color: colorDown,
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
  const value = active?.value ?? 0
  const prevValue = previous?.value ?? null
  const isGain = value >= 0
  const deltaPct =
    prevValue != null && prevValue !== 0
      ? ((value - prevValue) / Math.abs(prevValue)) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const monthLabel = active
    ? formatFullMonthYear(active.month, locale)
    : ""

  const domainMax = React.useMemo(() => {
    let peak = 0
    for (const row of data) {
      peak = Math.max(peak, Math.abs(row.value))
    }
    const padded = Math.ceil(peak * 1.05)
    const step = padded <= 1000 ? 500 : 1000
    return Math.max(step, Math.ceil(padded / step) * step)
  }, [data])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${formatFullMonthYear(point.month, locale)}: ${formatSigned(point.value, locale)}`
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

  const scrubDot = React.useCallback(
    (props: {
      cx?: number
      cy?: number
      index?: number
      payload?: AreaChartFillByValuePoint
    }) => {
      const { cx, cy, index = 0, payload } = props
      if (cx == null || cy == null) return null
      if (!liveScrubbing || index !== liveIndex) return null
      const point = payload ?? data[index]
      const fill =
        (point?.value ?? 0) >= 0
          ? "var(--color-positive)"
          : "var(--color-negative)"
      return (
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill={fill}
          stroke="var(--background)"
          strokeWidth={2}
        />
      )
    },
    [data, liveIndex, liveScrubbing]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous`
    return `Area chart fill by value, ${title}, ${monthLabel} ${formatSigned(value, locale)}${deltaText}`
  }, [active, deltaPct, deltaUp, locale, monthLabel, title, value])

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
              className={cn(
                "text-[2rem] font-semibold leading-9 tracking-tight",
                isGain ? "text-foreground" : "text-destructive"
              )}
              aria-hidden
            >
              {formatSigned(value, locale)}
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
              tickFormatter={(v: string) => formatAxisMonth(v, locale)}
            />
            <YAxis
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 40 : 48}
              domain={[-domainMax, domainMax]}
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
            <ReferenceLine y={0} stroke="var(--border)" strokeOpacity={0.8} />
            <ChartTooltip
              cursor={AREA_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  formatter={(v) => (
                    <span className="font-medium tabular-nums text-foreground">
                      {formatSigned(Number(v), locale)}
                    </span>
                  )}
                />
              }
            />
            <SplitFillGradient
              gradId={gradId}
              up={colorUp}
              down={colorDown}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="value"
              stroke={neon ? colorUp : "var(--foreground)"}
              strokeWidth={glow?.strokeWidth ?? 2}
              strokeOpacity={seriesOpacity}
              fill={`url(#${gradId})`}
              fillOpacity={neon ? 1 : seriesOpacity}
              dot={scrubDot}
              activeDot={false}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : AREA_MS}
              animationEasing="ease-out"
              style={glow?.style}
              className={glow?.className}
            />
          </RechartsAreaChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: colorUp }}
            aria-hidden
          />
          <span className="text-foreground">
            {chartConfig.positive.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: colorDown }}
            aria-hidden
          />
          <span className="text-foreground">
            {chartConfig.negative.label}
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
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{formatFullMonthYear(row.month, locale)}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function AreaChartFillByValueDemo(
  props: AreaChartFillByValueProps
) {
  return <AreaChartFillByValue {...props} />
}

export { AreaChartFillByValue }
