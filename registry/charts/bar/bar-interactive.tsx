"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
 * Bar Interactive — locked gallery chrome + chart-local series toggle.
 * Switch Store / Online totals; single-series daily bars follow the active key.
 * Installs to: components/charts/bar-interactive.tsx
 */

export type BarInteractivePoint = {
  date: string
  store: number
  online: number
}

export type BarInteractiveSeries = "store" | "online"

export type BarInteractiveProps = {
  title?: string
  subtitle?: string
  data?: BarInteractivePoint[]
  className?: string
  /** Category axis direction. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard day scrub (dim others, update metric). Default on. */
  scrub?: boolean
  /** Initial series. Default `"store"`. */
  defaultSeries?: BarInteractiveSeries
}

const NARROW_MQ = "(max-width: 639px)"
const BAR_MS = 200
const BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0]
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const SERIES_KEYS: BarInteractiveSeries[] = ["store", "online"]

/** Daily Store × Online traffic — Apr–Jun 2024 (from FarsiUI interactive demo). */
const DEMO_DATA: BarInteractivePoint[] = [
  { date: "2024-04-01", store: 222, online: 150 },
  { date: "2024-04-02", store: 97, online: 180 },
  { date: "2024-04-03", store: 167, online: 120 },
  { date: "2024-04-04", store: 242, online: 260 },
  { date: "2024-04-05", store: 373, online: 290 },
  { date: "2024-04-06", store: 301, online: 340 },
  { date: "2024-04-07", store: 245, online: 180 },
  { date: "2024-04-08", store: 409, online: 320 },
  { date: "2024-04-09", store: 59, online: 110 },
  { date: "2024-04-10", store: 261, online: 190 },
  { date: "2024-04-11", store: 327, online: 350 },
  { date: "2024-04-12", store: 292, online: 210 },
  { date: "2024-04-13", store: 342, online: 380 },
  { date: "2024-04-14", store: 137, online: 220 },
  { date: "2024-04-15", store: 120, online: 170 },
  { date: "2024-04-16", store: 138, online: 190 },
  { date: "2024-04-17", store: 446, online: 360 },
  { date: "2024-04-18", store: 364, online: 410 },
  { date: "2024-04-19", store: 243, online: 180 },
  { date: "2024-04-20", store: 89, online: 150 },
  { date: "2024-04-21", store: 137, online: 200 },
  { date: "2024-04-22", store: 224, online: 170 },
  { date: "2024-04-23", store: 138, online: 230 },
  { date: "2024-04-24", store: 387, online: 290 },
  { date: "2024-04-25", store: 215, online: 250 },
  { date: "2024-04-26", store: 75, online: 130 },
  { date: "2024-04-27", store: 383, online: 420 },
  { date: "2024-04-28", store: 122, online: 180 },
  { date: "2024-04-29", store: 315, online: 240 },
  { date: "2024-04-30", store: 454, online: 380 },
  { date: "2024-05-01", store: 165, online: 220 },
  { date: "2024-05-02", store: 293, online: 310 },
  { date: "2024-05-03", store: 247, online: 190 },
  { date: "2024-05-04", store: 385, online: 420 },
  { date: "2024-05-05", store: 481, online: 390 },
  { date: "2024-05-06", store: 498, online: 520 },
  { date: "2024-05-07", store: 388, online: 300 },
  { date: "2024-05-08", store: 149, online: 210 },
  { date: "2024-05-09", store: 227, online: 180 },
  { date: "2024-05-10", store: 293, online: 330 },
  { date: "2024-05-11", store: 335, online: 270 },
  { date: "2024-05-12", store: 197, online: 240 },
  { date: "2024-05-13", store: 197, online: 160 },
  { date: "2024-05-14", store: 448, online: 490 },
  { date: "2024-05-15", store: 473, online: 380 },
  { date: "2024-05-16", store: 338, online: 400 },
  { date: "2024-05-17", store: 499, online: 420 },
  { date: "2024-05-18", store: 315, online: 350 },
  { date: "2024-05-19", store: 235, online: 180 },
  { date: "2024-05-20", store: 177, online: 230 },
  { date: "2024-05-21", store: 82, online: 140 },
  { date: "2024-05-22", store: 81, online: 120 },
  { date: "2024-05-23", store: 252, online: 290 },
  { date: "2024-05-24", store: 294, online: 220 },
  { date: "2024-05-25", store: 201, online: 250 },
  { date: "2024-05-26", store: 213, online: 170 },
  { date: "2024-05-27", store: 420, online: 460 },
  { date: "2024-05-28", store: 233, online: 190 },
  { date: "2024-05-29", store: 78, online: 130 },
  { date: "2024-05-30", store: 340, online: 280 },
  { date: "2024-05-31", store: 178, online: 230 },
  { date: "2024-06-01", store: 178, online: 200 },
  { date: "2024-06-02", store: 470, online: 410 },
  { date: "2024-06-03", store: 103, online: 160 },
  { date: "2024-06-04", store: 439, online: 380 },
  { date: "2024-06-05", store: 88, online: 140 },
  { date: "2024-06-06", store: 294, online: 250 },
  { date: "2024-06-07", store: 323, online: 370 },
  { date: "2024-06-08", store: 385, online: 320 },
  { date: "2024-06-09", store: 438, online: 480 },
  { date: "2024-06-10", store: 155, online: 200 },
  { date: "2024-06-11", store: 92, online: 150 },
  { date: "2024-06-12", store: 492, online: 420 },
  { date: "2024-06-13", store: 81, online: 130 },
  { date: "2024-06-14", store: 426, online: 380 },
  { date: "2024-06-15", store: 307, online: 350 },
  { date: "2024-06-16", store: 371, online: 310 },
  { date: "2024-06-17", store: 475, online: 520 },
  { date: "2024-06-18", store: 107, online: 170 },
  { date: "2024-06-19", store: 341, online: 290 },
  { date: "2024-06-20", store: 408, online: 450 },
  { date: "2024-06-21", store: 169, online: 210 },
  { date: "2024-06-22", store: 317, online: 270 },
  { date: "2024-06-23", store: 480, online: 530 },
  { date: "2024-06-24", store: 132, online: 180 },
  { date: "2024-06-25", store: 141, online: 190 },
  { date: "2024-06-26", store: 434, online: 380 },
  { date: "2024-06-27", store: 448, online: 490 },
  { date: "2024-06-28", store: 149, online: 200 },
  { date: "2024-06-29", store: 103, online: 160 },
  { date: "2024-06-30", store: 446, online: 400 },
]

const chartConfig = {
  views: {
    label: "Views",
  },
  store: {
    label: "Store",
    color: CHART_SERIES_A,
  },
  online: {
    label: "Online",
    color: CHART_SERIES_B,
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

function formatAxisDay(date: string, locale: string) {
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(d)
}

function formatFullDate(date: string, locale: string) {
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
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

function BarInteractive({
  title = "Daily Views – Store vs Online",
  subtitle = "Toggle a series, then scrub any day.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
  defaultSeries = "store",
}: BarInteractiveProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const [activeSeries, setActiveSeries] =
    React.useState<BarInteractiveSeries>(defaultSeries)

  const lastIndex = Math.max(0, data.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({ data, lastIndex })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data, lastIndex })
    setActiveIndex(lastIndex)
  }

  const periodTotals = React.useMemo(
    () => ({
      store: data.reduce((acc, row) => acc + row.store, 0),
      online: data.reduce((acc, row) => acc + row.online, 0),
    }),
    [data]
  )

  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[lastIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const value = active ? active[activeSeries] : 0
  const prevValue = previous ? previous[activeSeries] : null
  const deltaPct =
    prevValue != null && prevValue !== 0
      ? ((value - prevValue) / prevValue) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const dayLabel = active ? formatFullDate(active.date, locale) : ""

  const domainMax = React.useMemo(() => {
    const raw = Math.max(
      ...data.map((row) => Math.max(row.store, row.online)),
      1
    )
    const step = raw <= 400 ? 100 : raw <= 800 ? 100 : 200
    return Math.ceil(raw / step) * step
  }, [data])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${formatFullDate(point.date, locale)} ${chartConfig[activeSeries].label}: ${formatNumber(point[activeSeries], locale)}`
    },
    [activeSeries, data, locale]
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

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous day`
    return `Interactive bar chart, ${title}, ${chartConfig[activeSeries].label}, ${dayLabel} ${formatNumber(value, locale)}${deltaText}`
  }, [
    active,
    activeSeries,
    dayLabel,
    deltaPct,
    deltaUp,
    locale,
    title,
    value,
  ])

  const cellOpacity = (index: number) =>
    liveScrubbing && index !== liveIndex ? 0.4 : 1

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[960px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
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
              {formatNumber(value, locale)}
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
                  vs previous day
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {dayLabel}
            <span className="text-muted-foreground/80">
              {" "}
              · {chartConfig[activeSeries].label}
            </span>
          </p>
        </div>
      </header>

      {/* Series toggle — chart-local interactive control */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-border sm:flex-row">
        {SERIES_KEYS.map((key) => {
          const active = activeSeries === key
          return (
            <button
              key={key}
              type="button"
              data-active={active}
              onClick={() => setActiveSeries(key)}
              className={cn(
                "relative z-10 flex flex-1 cursor-pointer flex-col justify-center gap-1 px-6 py-4 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-8 sm:py-5",
                "border-b border-border last:border-b-0 sm:border-b-0 sm:border-e sm:last:border-e-0",
                active ? "bg-muted/50" : "hover:bg-muted/30"
              )}
              aria-pressed={active}
            >
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: chartConfig[key].color }}
                  aria-hidden
                />
                {chartConfig[key].label}
              </span>
              <span className="text-lg font-bold leading-none tracking-tight text-foreground sm:text-2xl">
                {formatNumber(periodTotals[key], locale)}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Period total
              </span>
            </button>
          )
        })}
      </div>

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
            chartBarContainerClassName,
            "aspect-auto h-[250px] max-w-none sm:h-[280px]"
          )}
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={
              narrow
                ? {
                    top: 12,
                    right: plotRtl ? 4 : 8,
                    left: plotRtl ? 8 : 4,
                    bottom: 4,
                  }
                : {
                    top: 16,
                    right: plotRtl ? 4 : 12,
                    left: plotRtl ? 12 : 4,
                    bottom: 8,
                  }
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
              dataKey="date"
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: string) =>
                formatAxisDay(value, locale)
              }
            />
            <YAxis
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 32 : 40}
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
            <ChartTooltip
              cursor={BAR_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="w-[10rem] rounded-xl border-border/60 shadow-sm"
                  nameKey="views"
                  labelFormatter={(value) =>
                    formatFullDate(String(value), locale)
                  }
                />
              }
            />
            <Bar
              dataKey={activeSeries}
              fill={`var(--color-${activeSeries})`}
              radius={BAR_RADIUS}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : BAR_MS}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell
                  key={`${activeSeries}-${index}`}
                  fillOpacity={cellOpacity(index)}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Store</th>
            <th>Online</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.date}>
              <td>{formatFullDate(row.date, locale)}</td>
              <td>{row.store}</td>
              <td>{row.online}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function BarInteractiveDemo(
  props: BarInteractiveProps
) {
  return <BarInteractive {...props} />
}

export { BarInteractive }
