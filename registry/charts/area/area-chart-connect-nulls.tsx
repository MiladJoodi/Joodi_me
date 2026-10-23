"use client"

import * as React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  LabelList,
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
 * Area Chart Connect Nulls — locked gallery chrome + **neon** (chart-local).
 * Two stacked monotone areas: gap at nulls vs `connectNulls` bridge.
 * Installs to: components/charts/area-chart-connect-nulls.tsx
 */

export type AreaConnectNullsPoint = {
  /** ISO date (YYYY-MM-DD) preferred; short labels also accepted. */
  month: string
  /** Omit or `null` to leave a gap (bridged when `connectNulls`). */
  desktop?: number | null
}

export type AreaChartConnectNullsProps = {
  title?: string
  subtitle?: string
  data?: AreaConnectNullsPoint[]
  className?: string
  /** First column + Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const AREA_MS = 200
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

/** April intentionally missing — gap vs connectNulls comparison. */
const DEMO_DATA: AreaConnectNullsPoint[] = [
  { month: "2026-01-01", desktop: 186 },
  { month: "2026-02-01", desktop: 305 },
  { month: "2026-03-01", desktop: 237 },
  { month: "2026-04-01" },
  { month: "2026-05-01", desktop: 209 },
  { month: "2026-06-01", desktop: 214 },
  { month: "2026-07-01", desktop: 260 },
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

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function pointValue(point: AreaConnectNullsPoint | undefined) {
  if (!point || point.desktop == null) return null
  return point.desktop
}

function AreaChartConnectNulls({
  title = "Website Traffic – H1 2026",
  subtitle = "Desktop sessions with a missing April value.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: AreaChartConnectNullsProps) {
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

  const color = neon ? MARKET_UP : CHART_SERIES_A
  const glow = neon ? chartNeonGlowProps(color) : null
  const fillStart = neon ? 0.32 : 0.4
  const fillEnd = neon ? 0 : 0.05

  const chartConfig = {
    desktop: {
      label: "Desktop",
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
  const value = pointValue(active)
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const prevValue = pointValue(previous ?? undefined)
  const deltaPct =
    value != null && prevValue != null && prevValue !== 0
      ? ((value - prevValue) / prevValue) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const monthLabel = active
    ? formatFullMonthYear(active.month, locale)
    : ""

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      const v = pointValue(point)
      liveRef.current.textContent =
        v == null
          ? `${formatFullMonthYear(point.month, locale)}: no data`
          : `${formatFullMonthYear(point.month, locale)}: ${formatNumber(v, locale)}`
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

  const makeDot = React.useCallback(
    (colorVar: string, radius: number) =>
      function SeriesDot(props: {
        cx?: number
        cy?: number
        index?: number
      }) {
        const { cx, cy, index = 0 } = props
        if (cx == null || cy == null) return null
        if (pointValue(data[index]) == null) return null
        const dimmed = liveScrubbing && index !== liveIndex
        return (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill={colorVar}
            stroke="var(--background)"
            strokeWidth={2}
            opacity={dimmed ? 0.4 : 1}
          />
        )
      },
    [data, liveIndex, liveScrubbing]
  )

  const desktopDot = React.useMemo(
    () => makeDot("var(--color-desktop)", 3),
    [makeDot]
  )

  const valueLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      index?: number
      payload?: AreaConnectNullsPoint
    }) => {
      if (!liveScrubbing) return null
      const x = Number(props.x) || 0
      const y = Number(props.y) || 0
      const index = props.index ?? 0
      if (index !== liveIndex) return null
      const point = props.payload ?? data[index]
      const v = pointValue(point)
      if (v == null) return null

      return (
        <text
          x={x}
          y={y - 14}
          textAnchor="middle"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {formatNumber(v, locale)}
        </text>
      )
    },
    [data, liveIndex, liveScrubbing, locale]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    if (value == null) {
      return `Area chart connect nulls, ${title}, ${monthLabel}, no data`
    }
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs last month`
    return `Area chart connect nulls, ${title}, ${monthLabel} ${formatNumber(value, locale)}${deltaText}`
  }, [active, deltaPct, deltaUp, locale, monthLabel, title, value])

  const seriesOpacity = liveScrubbing ? 0.85 : 1

  const plotMargins = narrow
    ? {
        top: 28,
        right: plotRtl ? 4 : 8,
        left: plotRtl ? 8 : 4,
        bottom: 4,
      }
    : { top: 32, right: 12, left: 4, bottom: 8 }

  const renderPlot = (connectNulls: boolean) => {
    const gradId = `connectNulls-${connectNulls ? "c" : "g"}-${uid}`
    return (
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
          margin={plotMargins}
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
            tickFormatter={(v: string) => formatAxisMonth(v, locale)}
          />
          <YAxis
            orientation={plotRtl ? "right" : "left"}
            width={narrow ? 36 : 44}
            domain={[0, 350]}
            ticks={[0, 100, 200, 300]}
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
          <ChartTooltip
            cursor={AREA_TOOLTIP_CURSOR}
            content={
              <ChartTooltipContent className="rounded-xl border-border/60 shadow-sm" />
            }
          />
          <Area
            type="monotone"
            dataKey="desktop"
            name="desktop"
            connectNulls={connectNulls}
            stroke={color}
            strokeWidth={glow?.strokeWidth ?? 2.5}
            strokeOpacity={seriesOpacity}
            fill={`url(#${gradId})`}
            fillOpacity={neon ? 1 : seriesOpacity}
            dot={desktopDot}
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
              <LabelList dataKey="desktop" content={valueLabel} />
            ) : null}
          </Area>
        </RechartsAreaChart>
      </ChartContainer>
    )
  }

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
              {value == null ? "—" : formatNumber(value, locale)}
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
        className="flex flex-col gap-4 touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-5"
      >
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Gap at nulls</p>
          {renderPlot(false)}
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Connect nulls</p>
          {renderPlot(true)}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.desktop.label}</span>
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
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{formatFullMonthYear(row.month, locale)}</td>
              <td>{row.desktop == null ? "—" : row.desktop}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function AreaChartConnectNullsDemo(
  props: AreaChartConnectNullsProps
) {
  return <AreaChartConnectNulls {...props} />
}

export { AreaChartConnectNulls }
