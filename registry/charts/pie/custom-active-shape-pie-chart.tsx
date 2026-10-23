"use client"

import * as React from "react"
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  Sector,
  type PieSectorDataItem,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"

import { useChartDir } from "../_lib/use-chart-dir"
import { usePrefersReducedMotion } from "../_lib/use-prefers-reduced-motion"

/**
 * Custom Active Shape Pie Chart — donut with expanded active sector + callout.
 * Tooltip suppressed (callout carries detail); locked metric scrub chrome.
 * Tokens: `--chart-1…4`. Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/custom-active-shape-pie-chart.tsx
 */

export type CustomActiveShapePieSlice = {
  name: string
  value: number
}

export type CustomActiveShapePieChartProps = {
  title?: string
  subtitle?: string
  data?: CustomActiveShapePieSlice[]
  className?: string
  /** Slice order. Omit to follow page `dir` (angles stay geometric). */
  plotDir?: "ltr" | "rtl"
  /** Hover / keyboard slice scrub. Default on. */
  scrub?: boolean
  /** Idle featured index when not scrubbing. Default 0. */
  defaultActiveIndex?: number
}

const PIE_MS = 200
const RADIAN = Math.PI / 180

const SERIES_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
] as const

const DEMO_DATA: CustomActiveShapePieSlice[] = [
  { name: "west", value: 400 },
  { name: "midwest", value: 300 },
  { name: "south", value: 100 },
  { name: "northeast", value: 200 },
]

const SLICE_LABELS: Record<string, string> = {
  west: "West",
  midwest: "Midwest",
  south: "South",
  northeast: "Northeast",
}

function seriesColor(index: number) {
  return SERIES_VARS[index % SERIES_VARS.length]!
}

function buildConfig(data: CustomActiveShapePieSlice[]): ChartConfig {
  const config: ChartConfig = {
    value: { label: "Sales" },
  }
  data.forEach((slice, index) => {
    config[slice.name] = {
      label: SLICE_LABELS[slice.name] ?? slice.name,
      color: seriesColor(index),
    }
  })
  return config
}

function withFills(slices: CustomActiveShapePieSlice[]) {
  return slices.map((slice) => ({
    ...slice,
    fill: `var(--color-${slice.name})`,
  }))
}

function sumValues(slices: CustomActiveShapePieSlice[]) {
  return slices.reduce((acc, slice) => acc + slice.value, 0)
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function formatPct(value: number) {
  return `${Math.round(value)}%`
}

const chartPieContainerClassName =
  "mx-auto aspect-square h-auto w-full max-w-[500px] max-h-[min(80vh,500px)] overflow-visible font-sans text-xs tabular-nums [&_.recharts-surface]:overflow-visible"

function renderActiveShape(
  props: PieSectorDataItem,
  locale: string,
  labels: Record<string, string>
) {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props

  const angle = midAngle ?? 0
  const sin = Math.sin(-RADIAN * angle)
  const cos = Math.cos(-RADIAN * angle)
  const or = outerRadius ?? 0
  const centerX = cx ?? 0
  const centerY = cy ?? 0
  const onRight = cos >= 0
  const side = onRight ? 1 : -1

  const sx = centerX + (or + 12) * cos
  const sy = centerY + (or + 12) * sin
  const mx = centerX + (or + 36) * cos
  const my = centerY + (or + 36) * sin
  const ex = mx + side * 18
  const ey = my
  const textX = ex + side * 10
  const textAnchor = onRight ? "start" : "end"
  const key = String(payload?.name ?? "")
  const label = labels[key] ?? payload?.name

  return (
    <g>
      <text
        x={centerX}
        y={centerY}
        dy={5}
        textAnchor="middle"
        fill={fill}
        style={{
          fontFamily: "var(--font-sono-sans), var(--font-sans)",
          fontSize: 14,
          letterSpacing: 0,
        }}
      >
        {String(label ?? "")}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={or + 6}
        outerRadius={or + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        strokeWidth={1.25}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2.5} fill={fill} stroke="none" />
      <g style={{ direction: "ltr" }}>
        <text
          x={textX}
          y={ey}
          dy={-6}
          textAnchor={textAnchor}
          fill="var(--foreground)"
          style={{
            fontFamily: "var(--font-sono-sans), var(--font-sans)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0,
          }}
        >
          {formatNumber(Number(value), locale)}
        </text>
        <text
          x={textX}
          y={ey}
          dy={12}
          textAnchor={textAnchor}
          fill="var(--muted-foreground)"
          style={{
            fontFamily: "var(--font-sono-sans), var(--font-sans)",
            fontSize: 11,
            letterSpacing: 0,
          }}
        >
          {formatPct((percent ?? 0) * 100)}
        </text>
      </g>
    </g>
  )
}

function CustomActiveShapePieChart({
  title = "Sales by region",
  subtitle = "Active sector expands with a callout — hover or use arrow keys.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
  defaultActiveIndex = 0,
}: CustomActiveShapePieChartProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const reducedMotion = usePrefersReducedMotion()
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const locale = "en"

  const chartConfig = React.useMemo(() => buildConfig(data), [data])
  const plotData = React.useMemo(() => withFills(data), [data])
  const total = sumValues(data)
  const lastIndex = Math.max(0, data.length - 1)
  const featuredIndex = Math.min(
    Math.max(0, defaultActiveIndex),
    lastIndex
  )

  const [activeIndex, setActiveIndex] = React.useState(featuredIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({
    data,
    featuredIndex,
  })
  if (
    dataTrack.data !== data ||
    dataTrack.featuredIndex !== featuredIndex
  ) {
    setDataTrack({ data, featuredIndex })
    setActiveIndex(featuredIndex)
    setScrubbing(false)
  }

  const liveScrubbing = scrub && scrubbing
  const liveIndex = liveScrubbing ? activeIndex : featuredIndex
  const liveSlice = data[liveIndex] ?? data[featuredIndex]
  const metricValue = liveSlice?.value ?? total
  const sharePct =
    liveSlice && total > 0 ? (liveSlice.value / total) * 100 : null
  const caption = liveSlice
    ? (SLICE_LABELS[liveSlice.name] ?? liveSlice.name)
    : "—"

  const startAngle = plotRtl ? -270 : 90
  const endAngle = plotRtl ? 90 : -270

  const announce = React.useCallback(
    (index: number) => {
      if (!liveRef.current) return
      const slice = data[index]
      if (!slice) return
      const label = SLICE_LABELS[slice.name] ?? slice.name
      const pct = total > 0 ? (slice.value / total) * 100 : 0
      liveRef.current.textContent = `${label}: ${formatNumber(slice.value, locale)} (${formatPct(pct)})`
    },
    [data, locale, total]
  )

  const activate = React.useCallback(
    (index: number, fromKeyboard = false) => {
      if (data.length === 0) return
      const clamped = Math.min(lastIndex, Math.max(0, index))
      setActiveIndex(clamped)
      setScrubbing(true)
      if (fromKeyboard) announce(clamped)
    },
    [announce, data.length, lastIndex]
  )

  const clearScrub = React.useCallback(() => {
    setScrubbing(false)
    setActiveIndex(featuredIndex)
  }, [featuredIndex])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrub) return
      const reverse = plotRtl
      const idx = liveScrubbing ? activeIndex : featuredIndex

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          activate(idx + (reverse ? 1 : -1), true)
          break
        case "ArrowRight":
          event.preventDefault()
          activate(idx + (reverse ? -1 : 1), true)
          break
        case "Home":
          event.preventDefault()
          activate(reverse ? lastIndex : 0, true)
          break
        case "End":
          event.preventDefault()
          activate(reverse ? 0 : lastIndex, true)
          break
        case "Escape":
          event.preventDefault()
          clearScrub()
          break
        default:
          break
      }
    },
    [
      activate,
      activeIndex,
      clearScrub,
      featuredIndex,
      lastIndex,
      liveScrubbing,
      plotRtl,
      scrub,
    ]
  )

  const activeShape = React.useCallback(
    (props: PieSectorDataItem) =>
      renderActiveShape(props, locale, SLICE_LABELS),
    [locale]
  )

  const cellOpacity = (index: number) => {
    if (!liveScrubbing) return index === liveIndex ? 1 : 0.85
    return index === liveIndex ? 1 : 0.4
  }

  const ariaLabel = React.useMemo(() => {
    if (!liveSlice) return `Pie chart, ${title}`
    const pct = total > 0 ? formatPct((liveSlice.value / total) * 100) : ""
    return `Pie chart, ${title}, ${caption} ${formatNumber(liveSlice.value, locale)} ${pct}`
  }, [caption, liveSlice, locale, title, total])

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
              {formatNumber(metricValue, locale)}
            </p>
            {sharePct != null ? (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground"
                style={{
                  backgroundColor:
                    "color-mix(in oklab, var(--foreground) 8%, transparent)",
                }}
              >
                {formatPct(sharePct)}
                <span className="font-normal">of total</span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{caption}</p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div
        dir="ltr"
        role="img"
        aria-label={ariaLabel}
        tabIndex={scrub ? 0 : undefined}
        onKeyDown={scrub ? onKeyDown : undefined}
        onBlur={scrub ? clearScrub : undefined}
        className="touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={chartConfig}
          className={cn(chartPieContainerClassName, "max-w-none")}
        >
          <RechartsPieChart
            accessibilityLayer
            margin={{ top: 56, right: 136, bottom: 28, left: 136 }}
          >
            <Pie
              data={plotData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              startAngle={startAngle}
              endAngle={endAngle}
              stroke="var(--background)"
              strokeWidth={2}
              activeIndex={liveIndex}
              activeShape={activeShape}
              isAnimationActive={!reducedMotion}
              animationDuration={PIE_MS}
              onMouseEnter={
                scrub ? (_, index) => activate(index) : undefined
              }
              onMouseLeave={scrub ? clearScrub : undefined}
            >
              {plotData.map((slice, index) => (
                <Cell
                  key={slice.name}
                  fill={slice.fill}
                  fillOpacity={cellOpacity(index)}
                  className="outline-none transition-[fill-opacity] duration-200 ease-out"
                  style={{ cursor: scrub ? "pointer" : undefined }}
                />
              ))}
            </Pie>
            {/* Callout replaces tooltip body. */}
            <ChartTooltip content={() => null} />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </RechartsPieChart>
        </ChartContainer>
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((slice) => (
            <tr key={`a11y-${slice.name}`}>
              <td>{SLICE_LABELS[slice.name] ?? slice.name}</td>
              <td>{slice.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function CustomActiveShapePieChartDemo(
  props: CustomActiveShapePieChartProps
) {
  return <CustomActiveShapePieChart {...props} />
}

export { CustomActiveShapePieChart }
