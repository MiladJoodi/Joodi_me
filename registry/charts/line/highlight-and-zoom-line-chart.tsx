"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  XAxis,
  YAxis,
  type MouseHandlerDataParam,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
 * Highlight And Zoom Line Chart — locked gallery chrome (navy × orange).
 * Drag a range to zoom; dual Y-axes (Cost × Impressions). RTL-aware.
 * Installs to: components/charts/highlight-and-zoom-line-chart.tsx
 */

export type HighlightZoomPoint = {
  /** Campaign day index (1-based). */
  name: number
  cost: number
  impression: number
}

export type HighlightAndZoomLineChartProps = {
  title?: string
  subtitle?: string
  data?: HighlightZoomPoint[]
  className?: string
  /** Axis sides + X domain direction. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
}

const NARROW_MQ = "(max-width: 639px)"
const LINE_MS = 300
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const AXIS_COST_FILL =
  "color-mix(in oklab, var(--chart-1) 72%, var(--foreground))"
const AXIS_IMPRESSION_FILL =
  "color-mix(in oklab, var(--chart-2) 72%, var(--foreground))"

const DEMO_DATA: HighlightZoomPoint[] = [
  { name: 1, cost: 4.11, impression: 100 },
  { name: 2, cost: 2.39, impression: 120 },
  { name: 3, cost: 1.37, impression: 150 },
  { name: 4, cost: 1.16, impression: 180 },
  { name: 5, cost: 2.29, impression: 200 },
  { name: 6, cost: 3, impression: 499 },
  { name: 7, cost: 0.53, impression: 50 },
  { name: 8, cost: 2.52, impression: 100 },
  { name: 9, cost: 1.79, impression: 200 },
  { name: 10, cost: 2.94, impression: 222 },
  { name: 11, cost: 4.3, impression: 210 },
  { name: 12, cost: 4.41, impression: 300 },
  { name: 13, cost: 2.1, impression: 50 },
  { name: 14, cost: 8, impression: 190 },
  { name: 15, cost: 0, impression: 300 },
  { name: 16, cost: 9, impression: 400 },
  { name: 17, cost: 3, impression: 200 },
  { name: 18, cost: 2, impression: 50 },
  { name: 19, cost: 3, impression: 100 },
  { name: 20, cost: 7, impression: 100 },
]

type ZoomState = {
  left: string | number
  right: string | number
  refAreaLeft: string | number | undefined
  refAreaRight: string | number | undefined
  top: string | number
  bottom: string | number
  top2: string | number
  bottom2: string | number
}

type AxisDomain = [string | number, string | number]

const INITIAL_ZOOM: ZoomState = {
  left: "dataMin",
  right: "dataMax",
  refAreaLeft: undefined,
  refAreaRight: undefined,
  top: "dataMax+1",
  bottom: "dataMin-1",
  top2: "dataMax+20",
  bottom2: "dataMin-20",
}

const chartConfig = {
  cost: {
    label: "Cost",
    color: CHART_SERIES_A,
  },
  impression: {
    label: "Impressions",
    color: CHART_SERIES_B,
  },
} satisfies ChartConfig

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
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value)
}

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function getAxisYDomain(
  data: HighlightZoomPoint[],
  from: string | number | undefined,
  to: string | number | undefined,
  ref: keyof Pick<HighlightZoomPoint, "cost" | "impression">,
  offset: number
): AxisDomain {
  if (from == null || to == null) {
    return [INITIAL_ZOOM.bottom, INITIAL_ZOOM.top]
  }
  const refData = data.slice(Number(from) - 1, Number(to))
  const first = refData[0]
  if (!first) return [INITIAL_ZOOM.bottom, INITIAL_ZOOM.top]

  let bottom = first[ref]
  let top = first[ref]
  for (const d of refData) {
    if (d[ref] > top) top = d[ref]
    if (d[ref] < bottom) bottom = d[ref]
  }
  return [(bottom | 0) - offset, (top | 0) + offset]
}

function visibleSlice(
  data: HighlightZoomPoint[],
  left: string | number,
  right: string | number
) {
  if (left === "dataMin" || right === "dataMax") return data
  const a = Number(left)
  const b = Number(right)
  if (!Number.isFinite(a) || !Number.isFinite(b)) return data
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  return data.filter((d) => d.name >= lo && d.name <= hi)
}

function HighlightAndZoomLineChart({
  title = "Campaign Cost vs Impressions",
  subtitle = "Drag across the chart to zoom into a day range.",
  data = DEMO_DATA,
  className,
  plotDir,
}: HighlightAndZoomLineChartProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const locale = "en"

  const [zoom, setZoom] = React.useState<ZoomState>(INITIAL_ZOOM)
  const [dataTrack, setDataTrack] = React.useState(data)
  if (dataTrack !== data) {
    setDataTrack(data)
    setZoom(INITIAL_ZOOM)
  }

  const {
    left,
    right,
    refAreaLeft,
    refAreaRight,
    top,
    bottom,
    top2,
    bottom2,
  } = zoom

  const isZoomed =
    left !== INITIAL_ZOOM.left || right !== INITIAL_ZOOM.right

  const slice = React.useMemo(
    () => visibleSlice(data, left, right),
    [data, left, right]
  )
  const avgCost =
    slice.length === 0
      ? 0
      : slice.reduce((sum, d) => sum + d.cost, 0) / slice.length
  const totalImpressions = slice.reduce((sum, d) => sum + d.impression, 0)

  const rangeLabel = isZoomed
    ? `Days ${Math.min(Number(left), Number(right))}–${Math.max(Number(left), Number(right))}`
    : `Days 1–${data.length}`

  const applyZoom = React.useCallback(() => {
    setZoom((prev) => {
      let { refAreaLeft: a, refAreaRight: b } = prev
      if (a === b || b == null || a == null) {
        return {
          ...prev,
          refAreaLeft: undefined,
          refAreaRight: undefined,
        }
      }
      if (a > b) [a, b] = [b, a]

      const [nextBottom, nextTop] = getAxisYDomain(data, a, b, "cost", 1)
      const [nextBottom2, nextTop2] = getAxisYDomain(
        data,
        a,
        b,
        "impression",
        50
      )

      return {
        ...prev,
        refAreaLeft: undefined,
        refAreaRight: undefined,
        left: a,
        right: b,
        bottom: nextBottom,
        top: nextTop,
        bottom2: nextBottom2,
        top2: nextTop2,
      }
    })
  }, [data])

  const zoomOut = React.useCallback(() => {
    setZoom(INITIAL_ZOOM)
  }, [])

  const onMouseDown = React.useCallback((e: MouseHandlerDataParam) => {
    if (e.activeLabel == null) return
    setZoom((prev) => ({ ...prev, refAreaLeft: e.activeLabel }))
  }, [])

  const onMouseMove = React.useCallback((e: MouseHandlerDataParam) => {
    setZoom((prev) => {
      if (!prev.refAreaLeft || e.activeLabel == null) return prev
      return { ...prev, refAreaRight: e.activeLabel }
    })
  }, [])

  const costSide = plotRtl ? "right" : "left"
  const impressionSide = plotRtl ? "left" : "right"
  const axisWidth = narrow ? 40 : 52

  const ariaLabel = `${title}, ${rangeLabel}, average cost ${formatNumber(avgCost, locale)}, impressions ${formatNumber(totalImpressions, locale)}`

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

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <p
                className="text-[2rem] font-semibold leading-9 tracking-tight text-foreground"
                aria-hidden
              >
                {formatNumber(avgCost, locale)}
              </p>
              <span className="text-xs text-muted-foreground">
                avg cost · {formatCompact(totalImpressions, locale)}{" "}
                impressions
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{rangeLabel}</p>
          </div>

          <button
            type="button"
            disabled={!isZoomed}
            onClick={zoomOut}
            className="cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Zoom out
          </button>
        </div>
      </header>

      <div
        dir="ltr"
        role="img"
        aria-label={ariaLabel}
        className="select-none rounded-lg"
        style={{ userSelect: "none" }}
      >
        <ChartContainer
          config={chartConfig}
          className={cn(
            chartLineContainerClassName,
            "max-w-none overflow-hidden [&_.recharts-surface]:overflow-hidden"
          )}
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={
              narrow
                ? { top: 8, right: 8, left: 8, bottom: 28 }
                : { top: 12, right: 12, left: 12, bottom: 36 }
            }
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={applyZoom}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="var(--border)"
              strokeOpacity={0.4}
            />
            <ChartLegend
              verticalAlign="top"
              content={<ChartLegendContent className="pb-3 pt-0" />}
            />
            <XAxis
              allowDataOverflow
              dataKey="name"
              domain={[left, right]}
              type="number"
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={28}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              label={{
                value: "Campaign day",
                position: "insideBottom",
                offset: -22,
                style: {
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  fill: AXIS_TICK_FILL,
                },
              }}
            />
            <YAxis
              yAxisId="1"
              allowDataOverflow
              domain={[bottom, top]}
              type="number"
              orientation={costSide}
              width={axisWidth}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fill: AXIS_COST_FILL,
              }}
              tickFormatter={(v: number) => formatCompact(v, locale)}
              className="tabular-nums"
              label={{
                value: "Cost",
                angle: -90,
                position: costSide === "right" ? "insideRight" : "insideLeft",
                offset: 0,
                style: {
                  textAnchor: "middle",
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  fill: AXIS_COST_FILL,
                },
              }}
            />
            <YAxis
              yAxisId="2"
              allowDataOverflow
              domain={[bottom2, top2]}
              type="number"
              orientation={impressionSide}
              width={axisWidth}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fill: AXIS_IMPRESSION_FILL,
              }}
              tickFormatter={(v: number) => formatCompact(v, locale)}
              className="tabular-nums"
              label={{
                value: "Impressions",
                angle: -90,
                position:
                  impressionSide === "right" ? "insideRight" : "insideLeft",
                offset: 0,
                style: {
                  textAnchor: "middle",
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  fill: AXIS_IMPRESSION_FILL,
                },
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent className="rounded-xl border-border/60 shadow-sm" />
              }
            />
            <Line
              yAxisId="1"
              type="monotone"
              dataKey="cost"
              name="cost"
              stroke="var(--color-cost)"
              strokeWidth={2.75}
              animationDuration={reducedMotion ? 0 : LINE_MS}
              isAnimationActive={!reducedMotion}
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "var(--background)",
                fill: "var(--color-cost)",
              }}
            />
            <Line
              yAxisId="2"
              type="monotone"
              dataKey="impression"
              name="impression"
              stroke="var(--color-impression)"
              strokeWidth={2.25}
              animationDuration={reducedMotion ? 0 : LINE_MS}
              isAnimationActive={!reducedMotion}
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "var(--background)",
                fill: "var(--color-impression)",
              }}
            />
            {refAreaLeft != null && refAreaRight != null ? (
              <ReferenceArea
                yAxisId="1"
                x1={refAreaLeft}
                x2={refAreaRight}
                stroke="var(--primary)"
                strokeOpacity={0.55}
                strokeWidth={1}
                fill="var(--primary)"
                fillOpacity={0.18}
              />
            ) : null}
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
          <span className="text-foreground">{chartConfig.cost.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-2)" }}
            aria-hidden
          />
          <span className="text-foreground">
            {chartConfig.impression.label}
          </span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Cost</th>
            <th>Impressions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.cost}</td>
              <td>{row.impression}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function HighlightAndZoomLineChartDemo(
  props: HighlightAndZoomLineChartProps
) {
  return <HighlightAndZoomLineChart {...props} />
}

export { HighlightAndZoomLineChart }
