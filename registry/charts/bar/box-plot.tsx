"use client"

import * as React from "react"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  DefaultZIndexes,
  ErrorBar,
  LabelList,
  Rectangle,
  Scatter,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  CHART_SERIES_A,
  CHART_SERIES_B,
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Box Plot — locked gallery chrome (navy × orange) + chart-local box geometry.
 * IQR box + median line + whiskers + outliers; metric header scrubber.
 * Installs to: components/charts/box-plot.tsx
 */

export type BoxPlotPoint = {
  category: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

export type BoxPlotOutlier = {
  category: string
  value: number
}

export type BoxPlotProps = {
  title?: string
  subtitle?: string
  data?: BoxPlotPoint[]
  outliers?: BoxPlotOutlier[]
  className?: string
  /** Category axis direction. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
/** Light ink on `--chart-1` box fill — `foreground` is black in light and unreadable. */
const ON_BOX_LABEL_FILL = "#ffffff"
const Y_DOMAIN: [number, number] = [0, 20]

/** Class scores 0–20 — each column is score spread for one subject. */
const DEMO_DATA: BoxPlotPoint[] = [
  { category: "Math", min: 8, q1: 12, median: 15, q3: 17, max: 19 },
  { category: "Physics", min: 6, q1: 10, median: 13, q3: 16, max: 18 },
  { category: "Chemistry", min: 9, q1: 13, median: 16, q3: 18, max: 20 },
  { category: "Language", min: 7, q1: 11, median: 14, q3: 17, max: 20 },
]

const DEMO_OUTLIERS: BoxPlotOutlier[] = [
  { category: "Math", value: 3 },
  { category: "Physics", value: 2 },
  { category: "Chemistry", value: 4 },
  { category: "Language", value: 1 },
]

const chartConfig = {
  box: {
    label: "Interquartile range",
    color: CHART_SERIES_A,
  },
  outlier: {
    label: "Outlier",
    color: CHART_SERIES_B,
  },
} satisfies ChartConfig

const boxDataKey = (entry: BoxPlotPoint): [number, number] => [
  entry.q1,
  entry.q3,
]

const whiskerDataKey = (entry: BoxPlotPoint): [number, number] => [
  entry.q3 - entry.min,
  entry.max - entry.q3,
]

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
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(value)
}

function BoxShape(
  props: BarShapeProps & {
    payload?: BoxPlotPoint
    fillOpacity?: number
  }
) {
  const entry = props.payload
  if (!entry) return null

  const x = Number(props.x) || 0
  const y = Number(props.y) || 0
  const width = Number(props.width) || 0
  const height = Number(props.height) || 0
  const opacity = props.fillOpacity ?? 1
  const quartileRange = entry.q3 - entry.q1
  const medianOffset =
    quartileRange === 0
      ? height / 2
      : ((entry.q3 - entry.median) / quartileRange) * height
  const medianY = y + medianOffset

  return (
    <g opacity={opacity}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill="var(--color-box)"
        radius={3}
      />
      <line
        x1={x}
        x2={x + width}
        y1={medianY}
        y2={medianY}
        stroke={ON_BOX_LABEL_FILL}
        strokeWidth={2.5}
      />
    </g>
  )
}

function BoxPlotTooltip({
  active,
  payload,
  locale,
  dir,
}: {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: BoxPlotPoint }>
  locale: string
  /** Page/preview writing direction — plot island is LTR. */
  dir: "ltr" | "rtl"
}) {
  if (!(active && payload?.length)) return null
  const entry = payload[0]?.payload
  if (!entry?.category || entry.median == null) return null

  const rows = [
    { label: "Min", value: entry.min },
    { label: "Q1", value: entry.q1 },
    { label: "Median", value: entry.median },
    { label: "Q3", value: entry.q3 },
    { label: "Max", value: entry.max },
  ]

  return (
    <div
      dir={dir}
      className="pointer-events-none min-w-[10.5rem] rounded-xl border border-border/60 bg-background px-3 py-2.5 text-xs shadow-sm font-sans"
    >
      <p className="mb-2 font-medium text-foreground">{entry.category}</p>
      <ul className="space-y-1">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium text-foreground tabular-nums">
              {formatNumber(row.value, locale)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BoxPlot({
  title = "Class Score Spread – 0 to 20",
  subtitle = "IQR box, median, whiskers, and outliers by subject.",
  data = DEMO_DATA,
  outliers = DEMO_OUTLIERS,
  className,
  plotDir,
  scrub = true,
}: BoxPlotProps) {
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
  const median = active?.median ?? 0
  const prevMedian = previous?.median ?? null
  const deltaPct =
    prevMedian != null && prevMedian !== 0
      ? ((median - prevMedian) / prevMedian) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const categoryLabel = active?.category ?? ""

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${point.category}: median ${formatNumber(point.median, locale)}`
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
          moveActive(0, true)
          break
        case "End":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(lastIndex, true)
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

  const medianLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      width?: string | number
      height?: string | number
      index?: number
    }) => {
      const entry = data[props.index ?? -1]
      if (!entry) return null
      const index = props.index ?? 0
      const dimmed = liveScrubbing && index !== liveIndex

      const x = Number(props.x) + Number(props.width) / 2
      const h = Number(props.height)
      const quartileRange = entry.q3 - entry.q1
      const medianOffset =
        quartileRange === 0
          ? h / 2
          : ((entry.q3 - entry.median) / quartileRange) * h
      const y = Number(props.y) + medianOffset - 8

      return (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          fill={ON_BOX_LABEL_FILL}
          style={{
            fontSize: 11,
            fontWeight: 600,
            opacity: dimmed ? 0.4 : 1,
            transition: reducedMotion ? undefined : "opacity 0.2s ease-out",
          }}
          className="tabular-nums"
        >
          Median {formatNumber(entry.median, locale)}
        </text>
      )
    },
    [data, liveIndex, liveScrubbing, locale, reducedMotion]
  )

  const boxShape = React.useCallback(
    (props: BarShapeProps) => {
      const index = (props as { index?: number }).index ?? 0
      const fillOpacity =
        liveScrubbing && index !== liveIndex ? 0.4 : 1
      return <BoxShape {...props} fillOpacity={fillOpacity} />
    },
    [liveIndex, liveScrubbing]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous subject`
    return `Box plot, ${title}, ${categoryLabel} median ${formatNumber(median, locale)}${deltaText}`
  }, [active, categoryLabel, deltaPct, deltaUp, locale, median, title])

  const activeCategory = active?.category

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[700px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
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
              {formatNumber(median, locale)}
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
                  vs previous subject
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {categoryLabel}
            <span className="text-muted-foreground/80"> · median</span>
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
            "aspect-[1.55] h-auto max-w-none sm:h-auto"
          )}
        >
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={
              narrow
                ? { top: 28, right: 8, left: 4, bottom: 4 }
                : { top: 28, right: 12, left: 4, bottom: 8 }
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
              dataKey="category"
              type="category"
              allowDuplicatedCategory={false}
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
            />
            <YAxis
              orientation={plotRtl ? "right" : "left"}
              domain={Y_DOMAIN}
              width={narrow ? 32 : 36}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(v: number) => formatNumber(v, locale)}
              className="tabular-nums"
            />
            <Bar
              dataKey={boxDataKey}
              shape={boxShape}
              fillOpacity={1}
              isAnimationActive={false}
            >
              <LabelList content={medianLabel} />
              <ErrorBar
                dataKey={whiskerDataKey}
                width={14}
                stroke="var(--muted-foreground)"
                strokeWidth={1.5}
                zIndex={DefaultZIndexes.bar - 1}
              />
            </Bar>
            <Scatter
              data={outliers}
              dataKey="value"
              fill="var(--color-outlier)"
              stroke="none"
              r={4}
              isAnimationActive={false}
              shape={(props: {
                cx?: number
                cy?: number
                payload?: BoxPlotOutlier
              }) => {
                const dim =
                  liveScrubbing &&
                  activeCategory != null &&
                  props.payload?.category !== activeCategory
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill="var(--color-outlier)"
                    opacity={dim ? 0.4 : 1}
                  />
                )
              }}
            />
            <ChartTooltip
              cursor={{
                fill: "color-mix(in oklab, var(--foreground) 5%, transparent)",
              }}
              content={<BoxPlotTooltip locale={locale} dir={dir} />}
            />
          </ComposedChart>
        </ChartContainer>
      </div>

      <ul className="mx-auto flex max-w-[26rem] flex-col gap-1.5 text-xs leading-relaxed text-muted-foreground sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-2">
        <li className="inline-flex items-center gap-2">
          <span
            className="h-3 w-5 shrink-0 rounded-sm"
            style={{ background: "var(--chart-1)" }}
            aria-hidden
          />
          <span>
            <span className="text-foreground">Box</span> = interquartile range
            (most scores)
          </span>
        </li>
        <li className="inline-flex items-center gap-2">
          <span className="h-0.5 w-5 shrink-0 bg-foreground" aria-hidden />
          <span>
            <span className="text-foreground">Line</span> = median
          </span>
        </li>
        <li className="inline-flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: "var(--chart-2)" }}
            aria-hidden
          />
          <span>
            <span className="text-foreground">Dot</span> = outlier
          </span>
        </li>
      </ul>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Category</th>
            <th>Min</th>
            <th>Q1</th>
            <th>Median</th>
            <th>Q3</th>
            <th>Max</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.category}>
              <td>{row.category}</td>
              <td>{row.min}</td>
              <td>{row.q1}</td>
              <td>{row.median}</td>
              <td>{row.q3}</td>
              <td>{row.max}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function BoxPlotDemo(props: BoxPlotProps) {
  return <BoxPlot {...props} />
}

export { BoxPlot }
