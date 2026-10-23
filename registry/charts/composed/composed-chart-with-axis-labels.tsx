"use client"

import * as React from "react"
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
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
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Composed Chart With Axis Labels — locked gallery chrome (navy × orange × amber).
 * Dual Y-axes: Area(revenue)+Bar(cost) on money; Line(margin %) on pct.
 * Axis labels are type-required (chart-local); metric scrubber; RTL-aware.
 * Installs to: components/charts/composed-chart-with-axis-labels.tsx
 */

export type ComposedChartWithAxisLabelsPoint = {
  /** ISO date (YYYY-MM-DD) preferred; short labels also accepted. */
  month: string
  revenue: number
  cost: number
  /** Margin percent 0–100. */
  margin: number
}

export type ComposedChartWithAxisLabelsProps = {
  title?: string
  subtitle?: string
  data?: ComposedChartWithAxisLabelsPoint[]
  className?: string
  /** First column + Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const ANIM_MS = 200
const BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0]
const CHART_SERIES_C = "var(--chart-3)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const DEMO_DATA: ComposedChartWithAxisLabelsPoint[] = [
  { month: "2026-01-01", revenue: 42, cost: 28, margin: 33 },
  { month: "2026-02-01", revenue: 48, cost: 31, margin: 35 },
  { month: "2026-03-01", revenue: 45, cost: 30, margin: 33 },
  { month: "2026-04-01", revenue: 52, cost: 34, margin: 35 },
  { month: "2026-05-01", revenue: 49, cost: 33, margin: 33 },
  { month: "2026-06-01", revenue: 58, cost: 36, margin: 38 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: CHART_SERIES_A,
  },
  cost: {
    label: "Cost",
    color: CHART_SERIES_B,
  },
  margin: {
    label: "Margin %",
    color: CHART_SERIES_C,
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

function ComposedChartWithAxisLabels({
  title = "Revenue, Cost & Margin – H1 2026",
  subtitle = "Dual-axis composed chart with labeled axes.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: ComposedChartWithAxisLabelsProps) {
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
  const total = active?.revenue ?? 0
  const prevTotal = previous?.revenue ?? null
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
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${formatFullMonthYear(point.month, locale)}: revenue ${formatNumber(point.revenue, locale)}, margin ${point.margin}%`
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

  const marginDot = React.useCallback(
    (props: { cx?: number; cy?: number; index?: number }) => {
      const { cx, cy, index = 0 } = props
      if (cx == null || cy == null) return null
      const dimmed = liveScrubbing && index !== liveIndex
      return (
        <circle
          cx={cx}
          cy={cy}
          r={3.5}
          fill="var(--color-margin)"
          stroke="var(--background)"
          strokeWidth={2}
          opacity={dimmed ? 0.4 : 1}
        />
      )
    },
    [liveIndex, liveScrubbing]
  )

  const totalLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      index?: number
      payload?: ComposedChartWithAxisLabelsPoint
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
          y={y - 14}
          textAnchor="middle"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {formatNumber(point.revenue, locale)}
        </text>
      )
    },
    [data, liveIndex, liveScrubbing, locale]
  )

  const moneyMax = React.useMemo(() => {
    const raw = Math.max(
      ...data.flatMap((row) => [row.revenue, row.cost]),
      1
    )
    const step = raw <= 40 ? 10 : raw <= 80 ? 20 : 25
    return Math.ceil(raw / step) * step
  }, [data])

  const seriesOpacity = liveScrubbing ? 0.85 : 1

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs last month`
    return `Composed axis labels, ${title}, ${monthLabel} ${formatNumber(total, locale)}${deltaText}`
  }, [active, deltaPct, deltaUp, locale, monthLabel, title, total])

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
        className="touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={chartConfig}
          className={cn(chartBarContainerClassName, "max-w-none")}
        >
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={
              narrow
                ? {
                    top: 28,
                    right: plotRtl ? 8 : 12,
                    left: plotRtl ? 12 : 8,
                    bottom: 28,
                  }
                : { top: 32, right: 16, left: 12, bottom: 32 }
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
              tickMargin={8}
              minTickGap={4}
              interval={0}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: string) =>
                formatAxisMonth(value, locale)
              }
              label={{
                value: "Month",
                position: "insideBottom",
                offset: -18,
                style: {
                  fontSize: 11,
                  fill: "var(--muted-foreground)",
                  fontFamily: "var(--font-sans)",
                },
              }}
            />
            <YAxis
              yAxisId="money"
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 40 : 48}
              domain={[0, moneyMax]}
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
              label={{
                value: "USD (M)",
                angle: plotRtl ? 90 : -90,
                position: plotRtl ? "insideRight" : "insideLeft",
                offset: 8,
                style: {
                  fontSize: 11,
                  fill: "var(--muted-foreground)",
                  fontFamily: "var(--font-sans)",
                },
              }}
            />
            <YAxis
              yAxisId="pct"
              orientation={plotRtl ? "left" : "right"}
              width={narrow ? 36 : 40}
              domain={[0, 50]}
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: number) => `${value}%`}
              className="tabular-nums"
            />
            <ChartTooltip
              cursor={COMPOSED_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  formatter={(value, name) => {
                    if (value == null) return null
                    const key = String(name)
                    if (key === "margin") {
                      return (
                        <span className="font-medium tabular-nums text-foreground">
                          {Number(value)}%
                        </span>
                      )
                    }
                    return (
                      <span className="font-medium tabular-nums text-foreground">
                        {formatNumber(Number(value), locale)}
                      </span>
                    )
                  }}
                />
              }
            />
            <Area
              yAxisId="money"
              type="monotone"
              dataKey="revenue"
              name="revenue"
              fill="var(--color-revenue)"
              stroke="var(--color-revenue)"
              fillOpacity={liveScrubbing ? 0.12 : 0.16}
              strokeOpacity={seriesOpacity}
              strokeWidth={1.5}
              dot={false}
              activeDot={false}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : ANIM_MS}
              animationEasing="ease-out"
            >
              {scrub ? (
                <LabelList dataKey="revenue" content={totalLabel} />
              ) : null}
            </Area>
            <Bar
              yAxisId="money"
              dataKey="cost"
              name="cost"
              fill="var(--color-cost)"
              radius={BAR_RADIUS}
              maxBarSize={narrow ? 20 : 24}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : ANIM_MS}
              animationEasing="ease-out"
            >
              {data.map((row, index) => (
                <Cell
                  key={row.month}
                  fillOpacity={
                    liveScrubbing && index !== liveIndex ? 0.4 : 1
                  }
                />
              ))}
            </Bar>
            <Line
              yAxisId="pct"
              type="monotone"
              dataKey="margin"
              name="margin"
              stroke="var(--color-margin)"
              strokeWidth={2}
              strokeOpacity={seriesOpacity}
              dot={marginDot}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "var(--background)",
                fill: "var(--color-margin)",
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
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.revenue.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-2)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.cost.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-3)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.margin.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Revenue</th>
            <th>Cost</th>
            <th>Margin %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{formatFullMonthYear(row.month, locale)}</td>
              <td>{row.revenue}</td>
              <td>{row.cost}</td>
              <td>{row.margin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function ComposedChartWithAxisLabelsDemo(props: ComposedChartWithAxisLabelsProps) {
  return <ComposedChartWithAxisLabels {...props} />
}

export { ComposedChartWithAxisLabels }
