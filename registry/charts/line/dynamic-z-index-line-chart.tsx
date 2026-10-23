"use client"

import * as React from "react"
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
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
 * Dynamic Z Index Line Chart — locked gallery chrome (navy × orange × amber).
 * Three monotone lines; HTML legend hover dims that series and raises its z-index.
 * Metric header scrubber; RTL-aware axes.
 * Installs to: components/charts/dynamic-z-index-line-chart.tsx
 */

export type DynamicZIndexPoint = {
  /** ISO date (YYYY-MM-DD) preferred; short labels also accepted. */
  month: string
  desktop: number
  mobile: number
  orders: number
}

export type SeriesKey = "desktop" | "mobile" | "orders"

export type DynamicZIndexLineChartProps = {
  title?: string
  subtitle?: string
  data?: DynamicZIndexPoint[]
  className?: string
  /** First column + Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const LINE_MS = 200
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

/** Third series accent — type-required for z-index demo, not a dual-palette invent. */
const CHART_SERIES_C = "var(--chart-3)"

const SERIES_KEYS: SeriesKey[] = ["desktop", "mobile", "orders"]

const DEFAULT_OPACITY: Record<SeriesKey, number> = {
  desktop: 1,
  mobile: 1,
  orders: 1,
}

const DEMO_BASE = [
  { month: "2026-01-01", desktop: 300, mobile: 600 },
  { month: "2026-02-01", desktop: 295, mobile: 520 },
  { month: "2026-03-01", desktop: 130, mobile: 450 },
  { month: "2026-04-01", desktop: 220, mobile: 680 },
  { month: "2026-05-01", desktop: 145, mobile: 783 },
  { month: "2026-06-01", desktop: 190, mobile: 660 },
] as const

const DEMO_DATA: DynamicZIndexPoint[] = DEMO_BASE.map((row) => ({
  ...row,
  orders: Math.round((row.desktop + row.mobile) * 0.18),
}))

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: CHART_SERIES_A,
  },
  mobile: {
    label: "Mobile",
    color: CHART_SERIES_B,
  },
  orders: {
    label: "Orders",
    color: CHART_SERIES_C,
  },
} satisfies ChartConfig

const SERIES_SWATCH: Record<SeriesKey, string> = {
  desktop: "var(--chart-1)",
  mobile: "var(--chart-2)",
  orders: "var(--chart-3)",
}

const LINE_STROKE_WIDTH: Record<SeriesKey, number> = {
  desktop: 2.75,
  mobile: 2.25,
  orders: 2.25,
}

const LINE_TOOLTIP_CURSOR = {
  stroke: "color-mix(in oklab, var(--foreground) 18%, transparent)",
  strokeWidth: 1,
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

function monthTotal(row: DynamicZIndexPoint) {
  return row.desktop + row.mobile + row.orders
}

function DynamicZIndexLineChart({
  title = "Website Traffic by Device – H1 2026",
  subtitle = "Hover a legend item to raise that series above the others.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: DynamicZIndexLineChartProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const [opacity, setOpacity] =
    React.useState<Record<SeriesKey, number>>(DEFAULT_OPACITY)
  const [activeKey, setActiveKey] = React.useState<SeriesKey | null>(null)

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
  const total = active ? monthTotal(active) : 0
  const prevTotal = previous ? monthTotal(previous) : null
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
      liveRef.current.textContent = `${formatFullMonthYear(point.month, locale)}: ${formatNumber(monthTotal(point), locale)}`
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

  const onLegendEnter = React.useCallback((key: SeriesKey) => {
    setOpacity((prev) => ({ ...prev, [key]: 0.45 }))
    setActiveKey(key)
  }, [])

  const onLegendLeave = React.useCallback((key: SeriesKey) => {
    setOpacity((prev) => ({ ...prev, [key]: 1 }))
    setActiveKey(null)
  }, [])

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
    (colorVar: string, radius: number, seriesOpacity: number) =>
      function SeriesDot(props: {
        cx?: number
        cy?: number
        index?: number
      }) {
        const { cx, cy, index = 0 } = props
        if (cx == null || cy == null) return null
        const dimmed = liveScrubbing && index !== liveIndex
        return (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill={colorVar}
            stroke="var(--background)"
            strokeWidth={2}
            opacity={dimmed ? 0.4 * seriesOpacity : seriesOpacity}
          />
        )
      },
    [liveIndex, liveScrubbing]
  )

  const desktopDot = React.useMemo(
    () => makeDot("var(--color-desktop)", 3, opacity.desktop),
    [makeDot, opacity.desktop]
  )
  const mobileDot = React.useMemo(
    () => makeDot("var(--color-mobile)", 3.5, opacity.mobile),
    [makeDot, opacity.mobile]
  )
  const ordersDot = React.useMemo(
    () => makeDot("var(--color-orders)", 3, opacity.orders),
    [makeDot, opacity.orders]
  )

  const dots: Record<SeriesKey, typeof desktopDot> = {
    desktop: desktopDot,
    mobile: mobileDot,
    orders: ordersDot,
  }

  const totalLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      index?: number
      payload?: DynamicZIndexPoint
    }) => {
      if (!liveScrubbing) return null
      const x = Number(props.x) || 0
      const y = Number(props.y) || 0
      const index = props.index ?? 0
      if (index !== liveIndex) return null
      const point = props.payload ?? data[index]
      if (!point) return null
      const sum = monthTotal(point)
      const peak = Math.max(point.desktop, point.mobile, point.orders)
      const lift =
        point.mobile !== peak
          ? Math.max(18, ((peak - point.mobile) / 800) * 180)
          : 14

      return (
        <text
          x={x}
          y={y - lift}
          textAnchor="middle"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {formatNumber(sum, locale)}
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
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs last month`
    return `Line chart, ${title}, ${monthLabel} ${formatNumber(total, locale)}${deltaText}`
  }, [active, deltaPct, deltaUp, locale, monthLabel, title, total])

  /** Draw raised series last so z-index + paint order both win. */
  const drawOrder = React.useMemo(() => {
    if (!activeKey) return SERIES_KEYS
    return [
      ...SERIES_KEYS.filter((k) => k !== activeKey),
      activeKey,
    ]
  }, [activeKey])

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
          className={cn(chartLineContainerClassName, "max-w-none")}
        >
          <LineChart
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
              tickFormatter={(value: string) =>
                formatAxisMonth(value, locale)
              }
            />
            <YAxis
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 36 : 44}
              domain={[0, 800]}
              ticks={[0, 200, 400, 600, 800]}
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
            {drawOrder.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={`var(--color-${key})`}
                strokeWidth={LINE_STROKE_WIDTH[key]}
                strokeOpacity={opacity[key]}
                zIndex={activeKey === key ? 10 : undefined}
                dot={dots[key]}
                activeDot={{
                  r: key === "mobile" ? 6 : 5,
                  strokeWidth: 2,
                  stroke: "var(--background)",
                  fill: `var(--color-${key})`,
                }}
                isAnimationActive={!reducedMotion && !liveScrubbing}
                animationDuration={reducedMotion ? 0 : LINE_MS}
                animationEasing="ease-out"
              >
                {scrub && key === "mobile" ? (
                  <LabelList dataKey="mobile" content={totalLabel} />
                ) : null}
              </Line>
            ))}
          </LineChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground sm:gap-x-6">
        {SERIES_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring",
              activeKey && activeKey !== key && "opacity-50"
            )}
            onMouseEnter={() => onLegendEnter(key)}
            onMouseLeave={() => onLegendLeave(key)}
            onFocus={() => onLegendEnter(key)}
            onBlur={() => onLegendLeave(key)}
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: SERIES_SWATCH[key] }}
              aria-hidden
            />
            <span className="text-foreground">{chartConfig[key].label}</span>
          </button>
        ))}
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
            <th>Orders</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{formatFullMonthYear(row.month, locale)}</td>
              <td>{row.desktop}</td>
              <td>{row.mobile}</td>
              <td>{row.orders}</td>
              <td>{monthTotal(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function DynamicZIndexLineChartDemo(
  props: DynamicZIndexLineChartProps
) {
  return <DynamicZIndexLineChart {...props} />
}

export { DynamicZIndexLineChart }
