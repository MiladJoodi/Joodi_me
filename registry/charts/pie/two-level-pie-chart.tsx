"use client"

import * as React from "react"
import { Cell, Pie, PieChart as RechartsPieChart } from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { useChartDir } from "../_lib/use-chart-dir"
import { usePrefersReducedMotion } from "../_lib/use-prefers-reduced-motion"

/**
 * Two Level Pie Chart — locked gallery chrome adapted for nested pies.
 * Inner = regions; outer = channels. Slice scrub updates the metric header.
 * Tokens: `--chart-1…5`. Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/two-level-pie-chart.tsx
 */

export type TwoLevelPieSlice = {
  name: string
  value: number
}

export type TwoLevelPieChartProps = {
  title?: string
  subtitle?: string
  /** Inner ring (regions). */
  innerData?: TwoLevelPieSlice[]
  /** Outer ring (channels). */
  outerData?: TwoLevelPieSlice[]
  className?: string
  /** Slice order / start angle. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / keyboard slice scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const PIE_MS = 200

const SERIES_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

/** Inner ring — regional sales share. */
const DEMO_INNER: TwoLevelPieSlice[] = [
  { name: "west", value: 400 },
  { name: "midwest", value: 300 },
  { name: "south", value: 300 },
  { name: "northeast", value: 200 },
]

/** Outer ring — channel mix nested around regions. */
const DEMO_OUTER: TwoLevelPieSlice[] = [
  { name: "store", value: 100 },
  { name: "online", value: 300 },
  { name: "card", value: 100 },
  { name: "cash", value: 80 },
  { name: "gateway", value: 40 },
  { name: "wallet", value: 30 },
  { name: "delivery", value: 50 },
  { name: "pickup", value: 100 },
  { name: "orders", value: 200 },
  { name: "other", value: 150 },
  { name: "branchWest", value: 50 },
]

const SLICE_LABELS: Record<string, string> = {
  west: "West",
  midwest: "Midwest",
  south: "South",
  northeast: "Northeast",
  store: "Store",
  online: "Online",
  card: "Card",
  cash: "Cash",
  gateway: "Gateway",
  wallet: "Wallet",
  delivery: "Delivery",
  pickup: "Pickup",
  orders: "Orders",
  other: "Other",
  branchWest: "West branch",
}

function seriesColor(index: number) {
  return SERIES_VARS[index % SERIES_VARS.length]!
}

function buildConfig(
  inner: TwoLevelPieSlice[],
  outer: TwoLevelPieSlice[]
): ChartConfig {
  const config: ChartConfig = {
    value: { label: "Sales" },
  }
  ;[...inner, ...outer].forEach((slice, index) => {
    if (config[slice.name]) return
    config[slice.name] = {
      label: SLICE_LABELS[slice.name] ?? slice.name,
      color: seriesColor(index),
    }
  })
  return config
}

function withFills(slices: TwoLevelPieSlice[]) {
  return slices.map((slice) => ({
    ...slice,
    fill: `var(--color-${slice.name})`,
  }))
}

function sumValues(slices: TwoLevelPieSlice[]) {
  return slices.reduce((acc, slice) => acc + slice.value, 0)
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function formatPct(value: number) {
  return `${value.toFixed(1)}%`
}

type ActiveRing = "inner" | "outer"

const chartPieContainerClassName =
  "mx-auto aspect-square h-auto w-full max-w-[500px] max-h-[min(80vh,500px)] overflow-visible font-sans text-xs tabular-nums [&_.recharts-surface]:overflow-visible"

function TwoLevelPieChart({
  title = "Sales by region & channel",
  subtitle = "Inner regions · outer channels — nested share.",
  innerData = DEMO_INNER,
  outerData = DEMO_OUTER,
  className,
  plotDir,
  scrub = true,
}: TwoLevelPieChartProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const reducedMotion = usePrefersReducedMotion()
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const locale = "en"

  const chartConfig = React.useMemo(
    () => buildConfig(innerData, outerData),
    [innerData, outerData]
  )
  const innerPlot = React.useMemo(() => withFills(innerData), [innerData])
  const outerPlot = React.useMemo(() => withFills(outerData), [outerData])

  const outerTotal = sumValues(outerData)
  const innerTotal = sumValues(innerData)
  const idleTotal = outerTotal || innerTotal

  const outerLast = Math.max(0, outerData.length - 1)
  const [activeRing, setActiveRing] = React.useState<ActiveRing>("outer")
  const [activeIndex, setActiveIndex] = React.useState(outerLast)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({
    outerData,
    outerLast,
  })
  if (dataTrack.outerData !== outerData || dataTrack.outerLast !== outerLast) {
    setDataTrack({ outerData, outerLast })
    setActiveRing("outer")
    setActiveIndex(outerLast)
    setScrubbing(false)
  }

  const liveScrubbing = scrub && scrubbing
  const liveRing = liveScrubbing ? activeRing : "outer"
  const liveIndex = liveScrubbing
    ? activeIndex
    : liveRing === "outer"
      ? outerLast
      : Math.max(0, innerData.length - 1)
  const liveSlices = liveRing === "inner" ? innerData : outerData
  const liveSlice = liveSlices[liveIndex] ?? liveSlices[liveSlices.length - 1]
  const ringTotal = sumValues(liveSlices)
  const metricValue = liveScrubbing && liveSlice ? liveSlice.value : idleTotal
  const sharePct =
    liveScrubbing && liveSlice && ringTotal > 0
      ? (liveSlice.value / ringTotal) * 100
      : null
  const sliceLabel = liveSlice
    ? (SLICE_LABELS[liveSlice.name] ?? liveSlice.name)
    : ""
  const caption = liveScrubbing
    ? `${liveRing === "inner" ? "Region" : "Channel"} · ${sliceLabel}`
    : "All channels"

  const startAngle = plotRtl ? -270 : 90
  const endAngle = plotRtl ? 90 : -270

  const announce = React.useCallback(
    (ring: ActiveRing, index: number) => {
      if (!liveRef.current) return
      const slices = ring === "inner" ? innerData : outerData
      const slice = slices[index]
      if (!slice) return
      const label = SLICE_LABELS[slice.name] ?? slice.name
      const total = sumValues(slices)
      const pct = total > 0 ? (slice.value / total) * 100 : 0
      liveRef.current.textContent = `${ring === "inner" ? "Region" : "Channel"} ${label}: ${formatNumber(slice.value, locale)} (${formatPct(pct)})`
    },
    [innerData, locale, outerData]
  )

  const activate = React.useCallback(
    (ring: ActiveRing, index: number, fromKeyboard = false) => {
      const slices = ring === "inner" ? innerData : outerData
      if (slices.length === 0) return
      const clamped = Math.min(slices.length - 1, Math.max(0, index))
      setActiveRing(ring)
      setActiveIndex(clamped)
      setScrubbing(true)
      if (fromKeyboard) announce(ring, clamped)
    },
    [announce, innerData, outerData]
  )

  const clearScrub = React.useCallback(() => {
    setScrubbing(false)
    setActiveRing("outer")
    setActiveIndex(outerLast)
  }, [outerLast])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrub) return
      const reverse = plotRtl
      const ring = liveScrubbing ? activeRing : "outer"
      const slices = ring === "inner" ? innerData : outerData
      const last = Math.max(0, slices.length - 1)
      const idx = liveScrubbing ? activeIndex : last

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          activate(ring, idx + (reverse ? 1 : -1), true)
          break
        case "ArrowRight":
          event.preventDefault()
          activate(ring, idx + (reverse ? -1 : 1), true)
          break
        case "ArrowUp":
          event.preventDefault()
          activate(
            "inner",
            Math.min(idx, Math.max(0, innerData.length - 1)),
            true
          )
          break
        case "ArrowDown":
          event.preventDefault()
          activate("outer", Math.min(idx, outerLast), true)
          break
        case "Home":
          event.preventDefault()
          activate(ring, reverse ? last : 0, true)
          break
        case "End":
          event.preventDefault()
          activate(ring, reverse ? 0 : last, true)
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
      activeRing,
      clearScrub,
      innerData.length,
      liveScrubbing,
      outerData,
      outerLast,
      plotRtl,
      scrub,
    ]
  )

  const cellOpacity = (ring: ActiveRing, index: number) => {
    if (!liveScrubbing) return 1
    if (ring !== liveRing) return 0.35
    return index === liveIndex ? 1 : 0.4
  }

  const ariaLabel = React.useMemo(() => {
    if (!liveScrubbing || !liveSlice) {
      return `Pie chart, ${title}, total ${formatNumber(idleTotal, locale)}`
    }
    const pct =
      ringTotal > 0 ? formatPct((liveSlice.value / ringTotal) * 100) : ""
    return `Pie chart, ${title}, ${caption} ${formatNumber(liveSlice.value, locale)} ${pct}`
  }, [
    caption,
    idleTotal,
    liveScrubbing,
    liveSlice,
    locale,
    ringTotal,
    title,
  ])

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
                <span className="font-normal">of ring</span>
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
            <Pie
              data={innerPlot}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="50%"
              startAngle={startAngle}
              endAngle={endAngle}
              stroke="var(--background)"
              strokeWidth={2}
              isAnimationActive={!reducedMotion}
              animationDuration={PIE_MS}
              onMouseEnter={
                scrub ? (_, index) => activate("inner", index) : undefined
              }
              onMouseLeave={scrub ? clearScrub : undefined}
            >
              {innerPlot.map((slice, index) => (
                <Cell
                  key={`inner-${slice.name}`}
                  fill={slice.fill}
                  fillOpacity={cellOpacity("inner", index)}
                  className="outline-none transition-[fill-opacity] duration-200 ease-out"
                  style={{ cursor: scrub ? "pointer" : undefined }}
                />
              ))}
            </Pie>
            <Pie
              data={outerPlot}
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
              isAnimationActive={!reducedMotion}
              animationDuration={PIE_MS}
              onMouseEnter={
                scrub ? (_, index) => activate("outer", index) : undefined
              }
              onMouseLeave={scrub ? clearScrub : undefined}
            >
              {outerPlot.map((slice, index) => (
                <Cell
                  key={`outer-${slice.name}`}
                  fill={slice.fill}
                  fillOpacity={cellOpacity("outer", index)}
                  className="outline-none transition-[fill-opacity] duration-200 ease-out"
                  style={{ cursor: scrub ? "pointer" : undefined }}
                />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="name"
                  formatter={(value) => formatNumber(Number(value), locale)}
                />
              }
            />
          </RechartsPieChart>
        </ChartContainer>
      </div>

      <ul className="mx-auto flex max-w-[500px] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {innerData.map((slice, index) => (
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
            <th scope="col">Ring</th>
            <th scope="col">Name</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {innerData.map((slice) => (
            <tr key={`a11y-inner-${slice.name}`}>
              <td>Region</td>
              <td>{SLICE_LABELS[slice.name] ?? slice.name}</td>
              <td>{slice.value}</td>
            </tr>
          ))}
          {outerData.map((slice) => (
            <tr key={`a11y-outer-${slice.name}`}>
              <td>Channel</td>
              <td>{SLICE_LABELS[slice.name] ?? slice.name}</td>
              <td>{slice.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TwoLevelPieChartDemo(props: TwoLevelPieChartProps) {
  return <TwoLevelPieChart {...props} />
}

export { TwoLevelPieChart }
