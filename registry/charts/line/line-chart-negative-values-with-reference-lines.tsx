"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
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
  chartLineContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Line Chart Negative Values With Reference Lines — locked gallery chrome.
 * Numeric X/Y path crossing the origin; type-required zero ReferenceLines.
 * Metric header scrubber; RTL-aware axes.
 * Installs to: components/charts/line-chart-negative-values-with-reference-lines.tsx
 */

export type NegativeValuesReferencePoint = {
  x: number
  y: number
}

export type LineChartNegativeValuesWithReferenceLinesProps = {
  title?: string
  subtitle?: string
  data?: NegativeValuesReferencePoint[]
  className?: string
  /** Plot / axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard point scrub (update metric). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const LINE_MS = 200
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const DEMO_DATA: NegativeValuesReferencePoint[] = [
  { x: -50, y: -50 },
  { x: 0, y: 0 },
  { x: 50, y: 50 },
  { x: 100, y: 100 },
  { x: 150, y: 150 },
  { x: 200, y: 200 },
  { x: 250, y: 250 },
  { x: 350, y: 350 },
  { x: 400, y: 400 },
  { x: 450, y: 450 },
  { x: 500, y: 500 },
]

const chartConfig = {
  y: {
    label: "Y",
    color: CHART_SERIES_A,
  },
} satisfies ChartConfig

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

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function LineChartNegativeValuesWithReferenceLines({
  title = "Cartesian Path – Origin Cross",
  subtitle = "Negative values with zero reference lines on both axes.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: LineChartNegativeValuesWithReferenceLinesProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const minX = React.useMemo(
    () => Math.min(...data.map((d) => d.x)),
    [data]
  )
  const minY = React.useMemo(
    () => Math.min(...data.map((d) => d.y)),
    [data]
  )

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
  const total = active ? active.y : 0
  const prevTotal = previous ? previous.y : null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / Math.abs(prevTotal)) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const pointLabel = active
    ? `(${formatNumber(active.x, locale)}, ${formatNumber(active.y, locale)})`
    : ""

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `x ${formatNumber(point.x, locale)}, y ${formatNumber(point.y, locale)}`
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
      setActiveIndex(Math.min(lastIndex, Math.max(0, idx)))
    },
    [lastIndex, scrub]
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
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs prior point`
    return `Negative values line chart, ${title}, ${pointLabel}${deltaText}`
  }, [active, deltaPct, deltaUp, pointLabel, title])

  const makeDot = React.useCallback(
    (radius: number) =>
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
            fill="var(--color-y)"
            stroke="var(--background)"
            strokeWidth={2}
            opacity={dimmed ? 0.4 : 1}
          />
        )
      },
    [liveIndex, liveScrubbing]
  )

  const seriesDot = React.useMemo(() => makeDot(3.5), [makeDot])

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
                  vs prior point
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{pointLabel}</p>
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
            margin={
              narrow
                ? {
                    top: 16,
                    right: plotRtl ? 8 : 12,
                    left: plotRtl ? 12 : 8,
                    bottom: 8,
                  }
                : { top: 20, right: 16, left: 12, bottom: 12 }
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
            <YAxis
              dataKey="y"
              type="number"
              domain={["auto", "auto"]}
              allowDataOverflow
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 40 : 48}
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
            <XAxis
              dataKey="x"
              type="number"
              domain={["auto", "auto"]}
              allowDataOverflow
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: number) =>
                formatCompact(value, locale)
              }
              className="tabular-nums"
            />
            {minY < 0 ? (
              <ReferenceLine
                y={0}
                stroke="var(--foreground)"
                strokeWidth={1.5}
                strokeOpacity={0.45}
              />
            ) : null}
            {minX < 0 ? (
              <ReferenceLine
                x={0}
                stroke="var(--foreground)"
                strokeWidth={1.5}
                strokeOpacity={0.45}
              />
            ) : null}
            <ChartTooltip
              cursor={LINE_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as
                      | NegativeValuesReferencePoint
                      | undefined
                    if (!row) return null
                    return (
                      <span className="text-muted-foreground">
                        x {formatNumber(row.x, locale)}
                      </span>
                    )
                  }}
                  formatter={(value) => (
                    <div className="flex w-full flex-1 items-center justify-between gap-6">
                      <span className="text-muted-foreground">Y</span>
                      <span className="font-medium tabular-nums">
                        {formatNumber(Number(value), locale)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Line
              type="monotone"
              data={data}
              dataKey="y"
              name="y"
              stroke="var(--color-y)"
              strokeWidth={2.5}
              strokeOpacity={liveScrubbing ? 0.85 : 1}
              dot={seriesDot}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "var(--background)",
                fill: "var(--color-y)",
              }}
              isAnimationActive={!reducedMotion && !liveScrubbing}
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
          <span className="text-foreground">{chartConfig.y.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-px w-3 shrink-0 bg-foreground/45"
            aria-hidden
          />
          <span className="text-foreground">Zero</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={`${row.x}-${row.y}`}>
              <td>{row.x}</td>
              <td>{row.y}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function LineChartNegativeValuesWithReferenceLinesDemo(
  props: LineChartNegativeValuesWithReferenceLinesProps
) {
  return <LineChartNegativeValuesWithReferenceLines {...props} />
}

export { LineChartNegativeValuesWithReferenceLines }
