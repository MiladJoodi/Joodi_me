"use client"

import * as React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  Brush,
  CartesianGrid,
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
  MARKET_DOWN,
  MARKET_UP,
  chartAreaGradientStops,
  chartDashedGridClassName,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"
import { useMarketNeon } from "../_lib/use-market-neon"
import { useNarrowViewport } from "../_lib/use-narrow-viewport"
import { usePrefersReducedMotion } from "../_lib/use-prefers-reduced-motion"

/**
 * Synchronized Area Chart — locked gallery chrome + **neon** (chart-local).
 * Three syncId area panels: Desktop, Mobile + Brush, Total.
 * Metric header scrubber; RTL-aware axes.
 * Installs to: components/charts/synchronized-area-chart.tsx
 */

export type SynchronizedAreaPoint = {
  /** ISO date (YYYY-MM-DD) preferred; short labels also accepted. */
  month: string
  desktop: number
  mobile: number
}

export type SynchronizedAreaChartProps = {
  title?: string
  subtitle?: string
  data?: SynchronizedAreaPoint[]
  className?: string
  /** First column + Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (update metric). Default on. */
  scrub?: boolean
}

const AREA_MS = 200
const SYNC_ID = "sono-area-sync"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

/** Short stage per sync panel — room for three stacked charts. */
const syncPanelClassName = [
  "aspect-auto h-36 w-full min-w-0 max-w-none overflow-visible font-sans text-xs tabular-nums sm:h-40",
  "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-surface]:overflow-visible",
  chartDashedGridClassName,
].join(" ")

const DEMO_DATA: SynchronizedAreaPoint[] = [
  { month: "2026-01-01", desktop: 300, mobile: 600 },
  { month: "2026-02-01", desktop: 295, mobile: 520 },
  { month: "2026-03-01", desktop: 130, mobile: 450 },
  { month: "2026-04-01", desktop: 220, mobile: 680 },
  { month: "2026-05-01", desktop: 145, mobile: 783 },
  { month: "2026-06-01", desktop: 190, mobile: 660 },
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

type PlotRow = SynchronizedAreaPoint & { total: number }

function SynchronizedAreaChart({
  title = "Website Traffic by Device – H1 2026",
  subtitle = "Three synced area panels — Desktop, Mobile + brush, and Total.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: SynchronizedAreaChartProps) {
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
  const gradDesktop = `syncAreaDesktop-${uid}`
  const gradMobile = `syncAreaMobile-${uid}`
  const gradTotal = `syncAreaTotal-${uid}`

  const colorDesktop = neon ? MARKET_UP : CHART_SERIES_A
  const colorMobile = neon ? MARKET_DOWN : CHART_SERIES_B
  const colorTotal = "var(--chart-3)"
  const glowDesktop = neon ? chartNeonGlowProps(colorDesktop) : null
  const glowMobile = neon ? chartNeonGlowProps(colorMobile) : null
  const glowTotal = neon ? chartNeonGlowProps(colorTotal) : null
  const fillStart = neon ? 0.32 : 0.4
  const fillEnd = neon ? 0 : 0.05

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: colorDesktop,
    },
    mobile: {
      label: "Mobile",
      color: colorMobile,
    },
    total: {
      label: "Total",
      color: colorTotal,
    },
  } satisfies ChartConfig

  const plotData = React.useMemo<PlotRow[]>(
    () =>
      data.map((row) => ({
        ...row,
        total: row.desktop + row.mobile,
      })),
    [data]
  )

  const lastIndex = Math.max(0, plotData.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [brushRange, setBrushRange] = React.useState({
    startIndex: 0,
    endIndex: lastIndex,
  })
  const [dataTrack, setDataTrack] = React.useState({
    data,
    lastIndex,
  })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data, lastIndex })
    setActiveIndex(lastIndex)
    setBrushRange({ startIndex: 0, endIndex: lastIndex })
  }

  const { startIndex, endIndex } = brushRange
  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = plotData[liveIndex] ?? plotData[lastIndex]
  const previous = liveIndex > 0 ? plotData[liveIndex - 1] : null
  const total = active ? active.total : 0
  const prevTotal = previous ? previous.total : null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const monthLabel = active
    ? formatFullMonthYear(active.month, locale)
    : ""

  const announce = React.useCallback(
    (index: number) => {
      const point = plotData[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${formatFullMonthYear(point.month, locale)}: ${formatNumber(point.total, locale)}`
    },
    [locale, plotData]
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
      if (!el || plotData.length === 0) return lastIndex
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return lastIndex
      let ratio = (clientX - rect.left) / rect.width
      if (plotRtl) ratio = 1 - ratio
      ratio = Math.min(1, Math.max(0, ratio))
      const windowLen = Math.max(1, endIndex - startIndex + 1)
      const local = Math.min(windowLen - 1, Math.floor(ratio * windowLen))
      return Math.min(lastIndex, startIndex + local)
    },
    [endIndex, lastIndex, plotData.length, plotRtl, startIndex]
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
      const local = Number(chartState.activeTooltipIndex)
      if (!Number.isFinite(local)) return
      // Brush slices the plot — tooltip index is relative to the window.
      const idx = Math.min(lastIndex, Math.max(0, startIndex + local))
      scrubbingRef.current = true
      setScrubbing(true)
      setActiveIndex(idx)
    },
    [lastIndex, scrub, startIndex]
  )

  const onChartMouseLeave = React.useCallback(() => {
    if (!scrub) return
    scrubbingRef.current = false
    setScrubbing(false)
    setActiveIndex(lastIndex)
  }, [lastIndex, scrub])

  const onBrushChange = React.useCallback(
    (range: { startIndex?: number; endIndex?: number } | null) => {
      if (!range) return
      const nextStart = Math.min(
        lastIndex,
        Math.max(0, range.startIndex ?? 0)
      )
      const nextEnd = Math.min(
        lastIndex,
        Math.max(0, range.endIndex ?? lastIndex)
      )
      setBrushRange({
        startIndex: Math.min(nextStart, nextEnd),
        endIndex: Math.max(nextStart, nextEnd),
      })
    },
    [lastIndex]
  )

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
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs last month`
    return `Synchronized area chart, ${title}, ${monthLabel} ${formatNumber(total, locale)}${deltaText}`
  }, [active, deltaPct, deltaUp, locale, monthLabel, title, total])

  const margin = narrow
    ? {
        top: 12,
        right: plotRtl ? 4 : 8,
        left: plotRtl ? 8 : 4,
        bottom: 0,
      }
    : { top: 14, right: 12, left: 4, bottom: 0 }

  const yAxis = (
    <YAxis
      orientation={plotRtl ? "right" : "left"}
      width={narrow ? 36 : 44}
      domain={[0, 1000]}
      ticks={[0, 250, 500, 750, 1000]}
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      tick={{
        fontSize: 11,
        fill: AXIS_TICK_FILL,
      }}
      tickFormatter={(value: number) => formatCompact(value, locale)}
      className="tabular-nums"
    />
  )

  const xAxis = (
    <XAxis
      dataKey="month"
      reversed={plotRtl}
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      minTickGap={4}
      interval={0}
      tick={{
        fontSize: 11,
        fill: AXIS_TICK_FILL,
      }}
      tickFormatter={(value: string) => formatAxisMonth(value, locale)}
    />
  )

  const tooltip = (
    <ChartTooltip
      cursor={AREA_TOOLTIP_CURSOR}
      content={
        <ChartTooltipContent className="rounded-xl border-border/60 shadow-sm" />
      }
    />
  )

  const seriesOpacity = liveScrubbing ? 0.85 : 1

  const grid = (
    <CartesianGrid
      vertical={false}
      strokeDasharray="4 4"
      stroke="var(--border)"
      strokeOpacity={0.4}
    />
  )

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
        className="flex touch-pan-y flex-col gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={chartConfig}
          className={cn(syncPanelClassName, neon && chartNeonOverflowClassName)}
        >
          <RechartsAreaChart
            accessibilityLayer
            data={plotData}
            syncId={SYNC_ID}
            margin={margin}
            onMouseMove={scrub ? onChartMouseMove : undefined}
            onMouseLeave={scrub ? onChartMouseLeave : undefined}
          >
            <defs>
              <linearGradient id={gradDesktop} x1="0" y1="0" x2="0" y2="1">
                {chartAreaGradientStops(colorDesktop, {
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
            {grid}
            {xAxis}
            {yAxis}
            {tooltip}
            <Area
              type="monotone"
              dataKey="desktop"
              name="desktop"
              stroke={colorDesktop}
              strokeWidth={glowDesktop?.strokeWidth ?? 2.25}
              strokeOpacity={seriesOpacity}
              fill={`url(#${gradDesktop})`}
              fillOpacity={neon ? 1 : seriesOpacity}
              dot={false}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : AREA_MS}
              animationEasing="ease-out"
              style={glowDesktop?.style}

              className={glowDesktop?.className}
            />
          </RechartsAreaChart>
        </ChartContainer>

        <ChartContainer
          config={chartConfig}
          className={cn(
            syncPanelClassName,
            "sm:h-48",
            neon && chartNeonOverflowClassName
          )}
        >
          <RechartsAreaChart
            accessibilityLayer
            data={plotData}
            syncId={SYNC_ID}
            margin={{ ...margin, bottom: 4 }}
            onMouseMove={scrub ? onChartMouseMove : undefined}
            onMouseLeave={scrub ? onChartMouseLeave : undefined}
          >
            <defs>
              <linearGradient id={gradMobile} x1="0" y1="0" x2="0" y2="1">
                {chartAreaGradientStops(colorMobile, {
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
            {grid}
            {xAxis}
            {yAxis}
            {tooltip}
            <Area
              type="monotone"
              dataKey="mobile"
              name="mobile"
              stroke={colorMobile}
              strokeWidth={glowMobile?.strokeWidth ?? 2.25}
              strokeOpacity={seriesOpacity}
              fill={`url(#${gradMobile})`}
              fillOpacity={neon ? 1 : seriesOpacity}
              dot={false}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : AREA_MS}
              animationEasing="ease-out"
              style={glowMobile?.style}

              className={glowMobile?.className}
            />
            <Brush
              dataKey="month"
              height={24}
              stroke={colorDesktop}
              fill="color-mix(in oklab, var(--muted) 80%, transparent)"
              travellerWidth={8}
              startIndex={startIndex}
              endIndex={endIndex}
              onChange={onBrushChange}
              tickFormatter={(value: string) =>
                formatAxisMonth(value, locale)
              }
            />
          </RechartsAreaChart>
        </ChartContainer>

        <ChartContainer
          config={chartConfig}
          className={cn(syncPanelClassName, neon && chartNeonOverflowClassName)}
        >
          <RechartsAreaChart
            accessibilityLayer
            data={plotData}
            syncId={SYNC_ID}
            margin={margin}
            onMouseMove={scrub ? onChartMouseMove : undefined}
            onMouseLeave={scrub ? onChartMouseLeave : undefined}
          >
            <defs>
              <linearGradient id={gradTotal} x1="0" y1="0" x2="0" y2="1">
                {chartAreaGradientStops(colorTotal, {
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
            {grid}
            {xAxis}
            {yAxis}
            {tooltip}
            <Area
              type="monotone"
              dataKey="total"
              name="total"
              stroke={colorTotal}
              strokeWidth={glowTotal?.strokeWidth ?? 2}
              strokeOpacity={seriesOpacity}
              fill={`url(#${gradTotal})`}
              fillOpacity={neon ? 1 : seriesOpacity}
              dot={false}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : AREA_MS}
              animationEasing="ease-out"
              style={glowTotal?.style}

              className={glowTotal?.className}
            />
          </RechartsAreaChart>
        </ChartContainer>
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        Bottom panel: Desktop + Mobile total
      </p>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: colorDesktop }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.desktop.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: colorMobile }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.mobile.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: colorTotal }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.total.label}</span>
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
          {plotData.map((row) => (
            <tr key={row.month}>
              <td>{formatFullMonthYear(row.month, locale)}</td>
              <td>{row.desktop}</td>
              <td>{row.mobile}</td>
              <td>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function SynchronizedAreaChartDemo(
  props: SynchronizedAreaChartProps
) {
  return <SynchronizedAreaChart {...props} />
}

export { SynchronizedAreaChart }
