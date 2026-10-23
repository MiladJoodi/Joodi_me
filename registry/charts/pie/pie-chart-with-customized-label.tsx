"use client"

import * as React from "react"
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  type PieLabelRenderProps,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { pieSliceTooltip } from "../_lib/pie-tooltip"
import { useChartDir } from "../_lib/use-chart-dir"
import { usePrefersReducedMotion } from "../_lib/use-prefers-reduced-motion"

/**
 * Pie Chart With Customized Label — full pie with mid-slice % labels.
 * On-fill ink `#ffffff` (PORT); locked metric scrub chrome.
 * Tokens: `--chart-1…4`. Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/pie-chart-with-customized-label.tsx
 */

export type PieChartWithCustomizedLabelSlice = {
  name: string
  value: number
}

export type PieChartWithCustomizedLabelProps = {
  title?: string
  subtitle?: string
  data?: PieChartWithCustomizedLabelSlice[]
  className?: string
  /** Slice order / start angle. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / keyboard slice scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const RADIAN = Math.PI / 180

const SERIES_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
] as const

const DEMO_DATA: PieChartWithCustomizedLabelSlice[] = [
  { name: "west", value: 400 },
  { name: "midwest", value: 300 },
  { name: "south", value: 300 },
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

function buildConfig(data: PieChartWithCustomizedLabelSlice[]): ChartConfig {
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

function withFills(slices: PieChartWithCustomizedLabelSlice[]) {
  return slices.map((slice) => ({
    ...slice,
    fill: `var(--color-${slice.name})`,
  }))
}

function sumValues(slices: PieChartWithCustomizedLabelSlice[]) {
  return slices.reduce((acc, slice) => acc + slice.value, 0)
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function formatPct(value: number) {
  return `${Math.round(value)}%`
}

function renderCustomizedLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null
  }
  const radius =
    Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5
  const ncx = Number(cx)
  const ncy = Number(cy)
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN)
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
      style={{
        fontFamily: "var(--font-sono-sans), var(--font-sans)",
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {formatPct((percent ?? 0) * 100)}
    </text>
  )
}

const chartPieContainerClassName =
  "mx-auto aspect-square h-auto w-full max-w-[380px] max-h-[min(70vh,380px)] overflow-visible font-sans text-xs tabular-nums [&_.recharts-surface]:overflow-visible"

function PieChartWithCustomizedLabel({
  title = "Sales by region",
  subtitle = "Full pie with mid-slice percent labels.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: PieChartWithCustomizedLabelProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const reducedMotion = usePrefersReducedMotion()
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const locale = "en"

  const chartConfig = React.useMemo(() => buildConfig(data), [data])
  const plotData = React.useMemo(() => withFills(data), [data])
  const total = sumValues(data)
  const lastIndex = Math.max(0, data.length - 1)

  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({ data, lastIndex })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data, lastIndex })
    setActiveIndex(lastIndex)
    setScrubbing(false)
  }

  const liveScrubbing = scrub && scrubbing
  const liveIndex = liveScrubbing ? activeIndex : lastIndex
  const liveSlice = data[liveIndex] ?? data[lastIndex]
  const metricValue = liveScrubbing && liveSlice ? liveSlice.value : total
  const sharePct =
    liveScrubbing && liveSlice && total > 0
      ? (liveSlice.value / total) * 100
      : null
  const caption =
    liveScrubbing && liveSlice
      ? (SLICE_LABELS[liveSlice.name] ?? liveSlice.name)
      : "All slices"

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
    setActiveIndex(lastIndex)
  }, [lastIndex])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrub) return
      const reverse = plotRtl
      const idx = liveScrubbing ? activeIndex : lastIndex

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
      lastIndex,
      liveScrubbing,
      plotRtl,
      scrub,
    ]
  )

  const cellOpacity = (index: number) => {
    if (!liveScrubbing) return 1
    return index === liveIndex ? 1 : 0.45
  }

  const ariaLabel = React.useMemo(() => {
    if (!liveScrubbing || !liveSlice) {
      return `Pie chart, ${title}, total ${formatNumber(total, locale)}`
    }
    const pct = total > 0 ? formatPct((liveSlice.value / total) * 100) : ""
    return `Pie chart, ${title}, ${caption} ${formatNumber(liveSlice.value, locale)} ${pct}`
  }, [caption, liveScrubbing, liveSlice, locale, title, total])

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
          <RechartsPieChart accessibilityLayer>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  nameKey="name"
                  hideLabel
                  formatter={(value, _name, item) =>
                    pieSliceTooltip(value, item, {
                      locale,
                      config: chartConfig,
                      nameKey: "name",
                    })
                  }
                />
              }
            />
            <Pie
              data={plotData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              startAngle={startAngle}
              endAngle={endAngle}
              stroke="var(--background)"
              strokeWidth={2}
              labelLine={false}
              label={renderCustomizedLabel}
              // Always-on on-fill labels — skip enter animation to avoid blink.
              isAnimationActive={false}
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
                  className={cn(
                    "outline-none",
                    !reducedMotion &&
                      "transition-[fill-opacity] duration-200 ease-out"
                  )}
                  style={{ cursor: scrub ? "pointer" : undefined }}
                />
              ))}
            </Pie>
          </RechartsPieChart>
        </ChartContainer>
      </div>

      <ul className="mx-auto flex max-w-[380px] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {data.map((slice, index) => (
          <li key={slice.name} className="inline-flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: seriesColor(index) }}
              aria-hidden
            />
            <span>{SLICE_LABELS[slice.name] ?? slice.name}</span>
          </li>
        ))}
      </ul>

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

export default function PieChartWithCustomizedLabelDemo(
  props: PieChartWithCustomizedLabelProps
) {
  return <PieChartWithCustomizedLabel {...props} />
}

export { PieChartWithCustomizedLabel }
