"use client"

import * as React from "react"
import type { MouseEvent, TouchEvent } from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  getRelativeCoordinate,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { generateMockData } from "../_lib/chart-mock-data"
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
 * Area Chart With Custom Events — locked gallery chrome + **neon** (chart-local).
 * Step area + chart-root handlers via `getRelativeCoordinate`; live event panel.
 * Metric header scrubber; RTL-aware axes.
 * Installs to: components/charts/area-chart-with-custom-events.tsx
 */

export type AreaChartWithCustomEventsPoint = {
  /** Category label (e.g. week index). */
  label: string
  value: number
}

export type AreaChartWithCustomEventsProps = {
  title?: string
  subtitle?: string
  data?: AreaChartWithCustomEventsPoint[]
  className?: string
  /** First column + Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (update metric). Default on. */
  scrub?: boolean
  /** Seed for mock series when `data` is omitted (matches Recharts docs). */
  seed?: number
}

type ChartPointerEvent = MouseEvent<SVGGraphicsElement> | TouchEvent<SVGGraphicsElement>

type EventKind =
  | "click"
  | "dblclick"
  | "enter"
  | "move"
  | "leave"
  | "down"
  | "up"
  | "contextmenu"
  | "touchstart"
  | "touchmove"
  | "touchend"

type LastEvent = {
  kind: EventKind
  x: number
  y: number
  at: number
}

const AREA_MS = 200
const MOCK_SEED = 456
const MOCK_LENGTH = 20
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const EVENT_LABELS: Record<EventKind, string> = {
  click: "Click",
  dblclick: "Double click",
  enter: "Mouse enter",
  move: "Mouse move",
  leave: "Mouse leave",
  down: "Mouse down",
  up: "Mouse up",
  contextmenu: "Context menu",
  touchstart: "Touch start",
  touchmove: "Touch move",
  touchend: "Touch end",
}

const AREA_TOOLTIP_CURSOR = {
  stroke: "color-mix(in oklab, var(--foreground) 18%, transparent)",
  strokeWidth: 1,
} as const

function buildDemoData(seed: number): AreaChartWithCustomEventsPoint[] {
  return generateMockData(MOCK_LENGTH, seed).map((row, i) => ({
    label: `W${i + 1}`,
    value: Math.round(row.x),
  }))
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

type ChartRelativePointer = { relativeX: number; relativeY: number }

function firstPointer(
  coord: ChartRelativePointer | ChartRelativePointer[]
): ChartRelativePointer {
  return Array.isArray(coord)
    ? (coord[0] ?? { relativeX: 0, relativeY: 0 })
    : coord
}

function AreaChartWithCustomEvents({
  title = "Signal Events – 20 Weeks",
  subtitle = "Step area with chart-root pointer events (coordinates relative to the plot).",
  data: dataProp,
  className,
  plotDir,
  scrub = true,
  seed = MOCK_SEED,
}: AreaChartWithCustomEventsProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const neon = useMarketNeon()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const moveRafRef = React.useRef<number | null>(null)
  const locale = "en"
  const uid = React.useId().replace(/:/g, "")
  const gradId = `areaCustomEvents-${uid}`

  const color = neon ? MARKET_UP : CHART_SERIES_A
  const glow = neon ? chartNeonGlowProps(color) : null
  const fillStart = neon ? 0.32 : 0.4
  const fillEnd = neon ? 0 : 0.05

  const chartConfig = {
    value: {
      label: "Signal",
      color,
    },
  } satisfies ChartConfig

  const data = React.useMemo(
    () => dataProp ?? buildDemoData(seed),
    [dataProp, seed]
  )

  const lastIndex = Math.max(0, data.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [lastEvent, setLastEvent] = React.useState<LastEvent | null>(null)
  const [dataTrack, setDataTrack] = React.useState({ data, lastIndex })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data, lastIndex })
    setActiveIndex(lastIndex)
  }

  React.useEffect(() => {
    return () => {
      if (moveRafRef.current != null) {
        cancelAnimationFrame(moveRafRef.current)
      }
    }
  }, [])

  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[lastIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const value = active?.value ?? 0
  const prevValue = previous?.value ?? null
  const deltaPct =
    prevValue != null && prevValue !== 0
      ? ((value - prevValue) / prevValue) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const weekLabel = active?.label ?? ""

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${point.label}: ${formatNumber(point.value, locale)}`
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

  const recordEvent = React.useCallback(
    (kind: EventKind, event: ChartPointerEvent, throttleMove = false) => {
      const pointer = firstPointer(getRelativeCoordinate(event as never))
      const next: LastEvent = {
        kind,
        x: Math.round(pointer.relativeX),
        y: Math.round(pointer.relativeY),
        at: Date.now(),
      }

      if (throttleMove && kind === "move") {
        if (moveRafRef.current != null) return
        moveRafRef.current = requestAnimationFrame(() => {
          moveRafRef.current = null
          setLastEvent(next)
        })
        return
      }

      setLastEvent(next)
    },
    []
  )

  const scrubFromChartState = React.useCallback(
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

  const onChartMouseLeave = React.useCallback(
    (
      _chartState: { activeTooltipIndex?: number | string | null },
      event: MouseEvent<SVGGraphicsElement>
    ) => {
      recordEvent("leave", event)
      if (!scrub) return
      scrubbingRef.current = false
      setScrubbing(false)
      setActiveIndex(lastIndex)
    },
    [lastIndex, recordEvent, scrub]
  )

  React.useEffect(() => {
    const el = chartAreaRef.current
    if (!el || !scrub) return

    const onStart = (e: globalThis.TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      scrubbingRef.current = true
      setScrubbing(true)
      setActiveIndex(indexFromClientX(t.clientX))
    }

    const onMove = (e: globalThis.TouchEvent) => {
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
    (props: { cx?: number; cy?: number; index?: number }) => {
      const { cx, cy, index = 0 } = props
      if (cx == null || cy == null) return null
      const dimmed = liveScrubbing && index !== liveIndex
      return (
        <circle
          cx={cx}
          cy={cy}
          r={2.5}
          fill="var(--color-value)"
          stroke="var(--background)"
          strokeWidth={1.5}
          opacity={dimmed ? 0.35 : 1}
        />
      )
    },
    [liveIndex, liveScrubbing]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous`
    return `Area chart with custom events, ${title}, ${weekLabel} ${formatNumber(value, locale)}${deltaText}`
  }, [active, deltaPct, deltaUp, locale, title, value, weekLabel])

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
                  vs previous
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{weekLabel}</p>
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
        className="touch-pan-y cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
            onClick={(_d, event) => recordEvent("click", event)}
            onDoubleClick={(_d, event) => recordEvent("dblclick", event)}
            onMouseEnter={(_d, event) => recordEvent("enter", event)}
            onMouseMove={(chartState, event) => {
              recordEvent("move", event, true)
              scrubFromChartState(chartState)
            }}
            onMouseLeave={onChartMouseLeave}
            onMouseDown={(_d, event) => recordEvent("down", event)}
            onMouseUp={(_d, event) => recordEvent("up", event)}
            onContextMenu={(_d, event) => {
              event.preventDefault()
              recordEvent("contextmenu", event)
            }}
            onTouchStart={(_d, event) => recordEvent("touchstart", event)}
            onTouchMove={(_d, event) => recordEvent("touchmove", event, true)}
            onTouchEnd={(_d, event) => recordEvent("touchend", event)}
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
              dataKey="label"
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={narrow ? 8 : 4}
              interval="preserveStartEnd"
              tick={{
                fontSize: 11,
                fill: AXIS_TICK_FILL,
              }}
            />
            <YAxis
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 36 : 44}
              domain={[0, 300]}
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
              type="step"
              dataKey="value"
              name="value"
              stroke={color}
              strokeWidth={glow?.strokeWidth ?? 2.25}
              strokeOpacity={seriesOpacity}
              fill={`url(#${gradId})`}
              fillOpacity={neon ? 1 : seriesOpacity}
              dot={scrubDot}
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
            />
          </RechartsAreaChart>
        </ChartContainer>
      </div>

      <div
        className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground"
        aria-live="polite"
      >
        {lastEvent ? (
          <p className="tabular-nums">
            <span className="font-medium text-foreground">
              {EVENT_LABELS[lastEvent.kind]}
            </span>
            <span className="mx-1.5 text-border">·</span>
            <span>
              ({lastEvent.x}, {lastEvent.y})
            </span>
            <span className="ms-2 text-[11px] opacity-80">
              relative to plot
            </span>
          </p>
        ) : (
          <p>Interact with the chart to see pointer events.</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.value.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Week</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function AreaChartWithCustomEventsDemo(
  props: AreaChartWithCustomEventsProps
) {
  return <AreaChartWithCustomEvents {...props} />
}

export { AreaChartWithCustomEvents }
