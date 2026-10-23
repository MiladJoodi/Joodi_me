"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Cell,
  LabelList,
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
  CHART_SERIES_B,
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Brush Bar Chart — locked gallery chrome (navy × orange); type-required
 * Recharts `Brush` range over a longer bipolar series + zero reference.
 * Metric header scrubber tracks the active category in the brush window.
 * Installs to: components/charts/brush-bar-chart.tsx
 */

export type BrushBarPoint = {
  /** Category label (e.g. day index). */
  name: string
  online: number
  store: number
}

export type BrushBarChartProps = {
  title?: string
  subtitle?: string
  data?: BrushBarPoint[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (dim others, update metric). Default on. */
  scrub?: boolean
  /** Initial brush window length (categories). Default 12. */
  brushWindow?: number
}

const NARROW_MQ = "(max-width: 639px)"
const BAR_MS = 200
const BAR_GAP = 8
const BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0]
const DEFAULT_BRUSH_WINDOW = 12
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

/** Long bipolar demo series (English labels). */
const DEMO_DATA: BrushBarPoint[] = [
  { name: "1", online: 456, store: 300 },
  { name: "2", online: 230, store: -145 },
  { name: "3", online: 345, store: -100 },
  { name: "4", online: 450, store: -8 },
  { name: "5", online: 321, store: 100 },
  { name: "6", online: 235, store: 9 },
  { name: "7", online: 267, store: 53 },
  { name: "8", online: -378, store: 252 },
  { name: "9", online: -210, store: 79 },
  { name: "10", online: -23, store: 294 },
  { name: "11", online: 45, store: 43 },
  { name: "12", online: 90, store: -74 },
  { name: "13", online: 130, store: -71 },
  { name: "14", online: 11, store: -117 },
  { name: "15", online: 107, store: -186 },
  { name: "16", online: 926, store: -16 },
  { name: "17", online: 653, store: -125 },
  { name: "18", online: 366, store: 222 },
  { name: "19", online: 486, store: 372 },
  { name: "20", online: 512, store: 182 },
  { name: "21", online: 302, store: 164 },
  { name: "22", online: 425, store: 316 },
  { name: "23", online: 467, store: 131 },
  { name: "24", online: -190, store: 291 },
  { name: "25", online: 194, store: -47 },
  { name: "26", online: 371, store: -415 },
  { name: "27", online: 376, store: -182 },
  { name: "28", online: 295, store: -93 },
  { name: "29", online: 322, store: -99 },
  { name: "30", online: 246, store: -52 },
  { name: "31", online: 33, store: 154 },
  { name: "32", online: 354, store: 205 },
  { name: "33", online: 258, store: 70 },
  { name: "34", online: 359, store: -25 },
  { name: "35", online: 192, store: -59 },
  { name: "36", online: 464, store: -63 },
  { name: "37", online: -2, store: -91 },
  { name: "38", online: 154, store: -66 },
  { name: "39", online: 186, store: -50 },
]

const chartConfig = {
  online: {
    label: "Online",
    color: CHART_SERIES_A,
  },
  store: {
    label: "Store",
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

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function niceAbsMax(values: number[]) {
  const raw = Math.max(...values.map((v) => Math.abs(v)), 1)
  const step = raw <= 400 ? 100 : raw <= 800 ? 200 : 250
  return Math.ceil(raw / step) * step
}

function BrushBarChart({
  title = "Channel volume",
  subtitle = "Online vs store — drag the brush to zoom the range.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
  brushWindow = DEFAULT_BRUSH_WINDOW,
}: BrushBarChartProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const lastGlobal = Math.max(0, data.length - 1)
  const initialStart = Math.max(0, data.length - brushWindow)
  const [brushRange, setBrushRange] = React.useState({
    startIndex: initialStart,
    endIndex: lastGlobal,
  })
  const [dataTrack, setDataTrack] = React.useState({
    data,
    lastGlobal,
    brushWindow,
  })
  if (
    dataTrack.data !== data ||
    dataTrack.lastGlobal !== lastGlobal ||
    dataTrack.brushWindow !== brushWindow
  ) {
    setDataTrack({ data, lastGlobal, brushWindow })
    setBrushRange({
      startIndex: Math.max(0, data.length - brushWindow),
      endIndex: lastGlobal,
    })
  }

  const startIndex = Math.min(
    brushRange.startIndex,
    brushRange.endIndex,
    lastGlobal
  )
  const endIndex = Math.min(
    Math.max(brushRange.startIndex, brushRange.endIndex),
    lastGlobal
  )
  const idleIndex = endIndex

  const [activeIndex, setActiveIndex] = React.useState(idleIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [idleTrack, setIdleTrack] = React.useState(idleIndex)
  if (idleTrack !== idleIndex) {
    setIdleTrack(idleIndex)
    // Use scrubbing state (not scrubbingRef) — refs must not be read during render.
    if (!scrubbing) setActiveIndex(idleIndex)
  }

  const liveIndex = scrub ? activeIndex : idleIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[idleIndex]
  const previous =
    liveIndex > startIndex ? data[liveIndex - 1] : null
  const total = active ? active.online + active.store : 0
  const prevTotal = previous
    ? previous.online + previous.store
    : null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / Math.abs(prevTotal)) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const categoryLabel = active ? `Day ${active.name}` : ""

  const barSize = narrow ? 18 : 22
  const categoryGap = narrow ? "12%" : "16%"
  const domainMax = React.useMemo(
    () =>
      niceAbsMax(data.flatMap((row) => [row.online, row.store])),
    [data]
  )

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      const sum = point.online + point.store
      liveRef.current.textContent = `Day ${point.name}: ${formatNumber(sum, locale)}`
    },
    [data, locale]
  )

  const moveActive = React.useCallback(
    (next: number, fromKeyboard = false) => {
      const clamped = Math.min(endIndex, Math.max(startIndex, next))
      setActiveIndex(clamped)
      if (fromKeyboard) announce(clamped)
    },
    [announce, endIndex, startIndex]
  )

  const indexFromClientX = React.useCallback(
    (clientX: number) => {
      const el = chartAreaRef.current
      const span = endIndex - startIndex + 1
      if (!el || span <= 0) return idleIndex
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return idleIndex
      let ratio = (clientX - rect.left) / rect.width
      if (plotRtl) ratio = 1 - ratio
      ratio = Math.min(1, Math.max(0, ratio))
      return Math.min(
        endIndex,
        startIndex + Math.floor(ratio * span)
      )
    },
    [endIndex, idleIndex, plotRtl, startIndex]
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
      // Brush slices the plot — tooltip index is relative to the window.
      const local = Number(chartState.activeTooltipIndex)
      if (!Number.isFinite(local)) return
      const idx = startIndex + local
      if (idx < startIndex || idx > endIndex) return
      scrubbingRef.current = true
      setScrubbing(true)
      setActiveIndex(idx)
    },
    [endIndex, scrub, startIndex]
  )

  const onChartMouseLeave = React.useCallback(() => {
    if (!scrub) return
    scrubbingRef.current = false
    setScrubbing(false)
    setActiveIndex(idleIndex)
  }, [idleIndex, scrub])

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
      setActiveIndex(idleIndex)
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
  }, [idleIndex, indexFromClientX, scrub])

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
          moveActive(startIndex, true)
          break
        case "End":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(endIndex, true)
          break
        case "Escape":
          event.preventDefault()
          scrubbingRef.current = false
          setScrubbing(false)
          moveActive(idleIndex, true)
          break
        default:
          break
      }
    },
    [
      activeIndex,
      endIndex,
      idleIndex,
      moveActive,
      plotRtl,
      scrub,
      startIndex,
    ]
  )

  const onBrushChange = React.useCallback(
    (range: { startIndex?: number; endIndex?: number } | null) => {
      if (!range) return
      const nextStart = Math.min(
        lastGlobal,
        Math.max(0, range.startIndex ?? 0)
      )
      const nextEnd = Math.min(
        lastGlobal,
        Math.max(0, range.endIndex ?? lastGlobal)
      )
      setBrushRange({
        startIndex: Math.min(nextStart, nextEnd),
        endIndex: Math.max(nextStart, nextEnd),
      })
    },
    [lastGlobal]
  )

  const totalLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      width?: string | number
      height?: string | number
      index?: number
      payload?: BrushBarPoint
    }) => {
      if (!liveScrubbing) return null
      const x = Number(props.x) || 0
      const y = Number(props.y) || 0
      const width = Number(props.width) || 0
      const height = Number(props.height) || 0
      const local = props.index ?? 0
      const index = startIndex + local
      const payload = props.payload
      if (index !== liveIndex) return null
      const point = payload ?? data[index]
      if (!point) return null
      const sum = point.online + point.store
      const pairCenterX = x + width / 2 - (width + BAR_GAP) / 2
      const tipY =
        sum >= 0
          ? Math.min(y, y + (height < 0 ? height : 0)) - 10
          : y + Math.abs(height) + 14

      return (
        <text
          x={pairCenterX}
          y={tipY}
          textAnchor="middle"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {formatNumber(sum, locale)}
        </text>
      )
    },
    [data, liveIndex, liveScrubbing, locale, startIndex]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous`
    return `Brush bar chart, ${title}, ${categoryLabel} ${formatNumber(total, locale)}${deltaText}`
  }, [active, categoryLabel, deltaPct, deltaUp, locale, title, total])

  const cellOpacity = (index: number) =>
    liveScrubbing && index !== liveIndex ? 0.4 : 1

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
          <p className="text-xs text-muted-foreground">
            {categoryLabel}
            <span className="text-muted-foreground/80">
              {` · window ${startIndex + 1}–${endIndex + 1} of ${data.length}`}
            </span>
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
                setActiveIndex(idleIndex)
              }
            : undefined
        }
        className="touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={chartConfig}
          className={cn(
            chartBarContainerClassName,
            "h-72 max-w-none sm:h-80",
            "[&_.recharts-brush-slide]:cursor-grab [&_.recharts-brush-slide]:active:cursor-grabbing",
            "[&_.recharts-brush-traveller]:cursor-ew-resize"
          )}
        >
          <BarChart
            accessibilityLayer
            data={data}
            barCategoryGap={categoryGap}
            barGap={narrow ? 4 : BAR_GAP}
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
              dataKey="name"
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={8}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
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
              tickFormatter={(value: number) =>
                formatCompact(value, locale)
              }
              className="tabular-nums"
            />
            <ReferenceLine
              y={0}
              stroke="var(--border)"
              strokeOpacity={0.8}
            />
            <ChartTooltip
              cursor={BAR_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent className="rounded-xl border-border/60 shadow-sm" />
              }
            />
            <Brush
              dataKey="name"
              height={28}
              stroke="var(--chart-1)"
              fill="color-mix(in oklab, var(--muted) 80%, transparent)"
              travellerWidth={8}
              startIndex={startIndex}
              endIndex={endIndex}
              onChange={onBrushChange}
              tickFormatter={(value: string) => value}
            />
            <Bar
              dataKey="online"
              fill="var(--color-online)"
              radius={BAR_RADIUS}
              maxBarSize={barSize}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : BAR_MS}
              animationEasing="ease-out"
            >
              {data.slice(startIndex, endIndex + 1).map((_, local) => (
                <Cell
                  key={`online-${startIndex + local}`}
                  fillOpacity={cellOpacity(startIndex + local)}
                />
              ))}
            </Bar>
            <Bar
              dataKey="store"
              fill="var(--color-store)"
              radius={BAR_RADIUS}
              maxBarSize={barSize}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : BAR_MS}
              animationEasing="ease-out"
            >
              {data.slice(startIndex, endIndex + 1).map((_, local) => (
                <Cell
                  key={`store-${startIndex + local}`}
                  fillOpacity={cellOpacity(startIndex + local)}
                />
              ))}
              {scrub ? (
                <LabelList dataKey="store" content={totalLabel} />
              ) : null}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.online.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-2)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.store.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Online</th>
            <th>Store</th>
            <th>Net</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.online}</td>
              <td>{row.store}</td>
              <td>{row.online + row.store}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function BrushBarChartDemo(props: BrushBarChartProps) {
  return <BrushBarChart {...props} />
}

export { BrushBarChart }
