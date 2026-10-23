"use client"

import * as React from "react"
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  XAxis,
  YAxis,
  type AxisInterval,
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
  CHART_SERIES_B,
  chartLineContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Line Chart Axis Interval — locked gallery chrome (navy × orange).
 * Stacked demos of Recharts `interval` presets (plus dense `interval={1}`).
 * Installs to: components/charts/line-chart-axis-interval.tsx
 */

export type AxisIntervalPoint = {
  /** Category index label (1-based string). */
  index: string
  desktop: number
  mobile: number
}

export type LineChartAxisIntervalProps = {
  title?: string
  subtitle?: string
  className?: string
  /** Y-axis side + X reverse. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Seed for dense mock series (default matches FarsiUI demo). */
  seed?: number
}

const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const MOCK_SEED = 22813

const INTERVALS: AxisInterval[] = [
  "preserveStart",
  "preserveEnd",
  "preserveStartEnd",
  "equidistantPreserveStart",
  1,
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: CHART_SERIES_A,
  },
  mobile: {
    label: "Mobile",
    color: CHART_SERIES_B,
  },
} satisfies ChartConfig

const LINE_TOOLTIP_CURSOR = {
  stroke: "color-mix(in oklab, var(--foreground) 18%, transparent)",
  strokeWidth: 1,
} as const

function intervalLabel(interval: AxisInterval) {
  if (typeof interval === "number") return `Interval: ${interval}`
  const map: Record<string, string> = {
    preserveStart: "Preserve start",
    preserveEnd: "Preserve end",
    preserveStartEnd: "Preserve start & end",
    equidistantPreserveStart: "Equidistant, preserve start",
  }
  return map[String(interval)] ?? String(interval)
}

function buildSeries(length: number, seed: number): AxisIntervalPoint[] {
  return generateMockData(length, seed).map((row, i) => ({
    index: String(i + 1),
    desktop: Math.round(row.x),
    mobile: Math.round(row.y),
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

function IntervalPlot({
  interval,
  data,
  plotRtl,
  locale,
}: {
  interval: AxisInterval
  data: AxisIntervalPoint[]
  plotRtl: boolean
  locale: string
}) {
  const dense = typeof interval === "number"

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{intervalLabel(interval)}</p>
      <ChartContainer
        config={chartConfig}
        className={cn(chartLineContainerClassName, "max-w-none")}
      >
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            top: 16,
            right: plotRtl ? 8 : 12,
            left: plotRtl ? 12 : 8,
            bottom: dense ? 36 : 16,
          }}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="4 4"
            stroke="var(--border)"
            strokeOpacity={0.4}
          />
          <XAxis
            dataKey="index"
            reversed={plotRtl}
            interval={interval}
            tickLine={false}
            axisLine={false}
            tickMargin={dense ? 16 : 8}
            minTickGap={dense ? 14 : 20}
            angle={dense ? -45 : 0}
            textAnchor={dense ? "end" : "middle"}
            height={dense ? 56 : undefined}
            tick={{
              fontSize: 11,
              fill: AXIS_TICK_FILL,
            }}
          />
          <YAxis
            orientation={plotRtl ? "right" : "left"}
            interval={interval}
            width={44}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={16}
            tick={{
              fontSize: 12,
              fill: AXIS_TICK_FILL,
            }}
            tickFormatter={(v: number) => formatCompact(v, locale)}
            className="tabular-nums"
          />
          <ChartTooltip
            cursor={LINE_TOOLTIP_CURSOR}
            content={
              <ChartTooltipContent className="rounded-xl border-border/60 shadow-sm" />
            }
          />
          <Line
            type="monotone"
            dataKey="mobile"
            name="mobile"
            stroke="var(--color-mobile)"
            strokeWidth={2.25}
            dot={false}
            activeDot={{
              r: 5,
              strokeWidth: 2,
              stroke: "var(--background)",
              fill: "var(--color-mobile)",
            }}
          />
          <Line
            type="monotone"
            dataKey="desktop"
            name="desktop"
            stroke="var(--color-desktop)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              stroke: "var(--background)",
              fill: "var(--color-desktop)",
            }}
          />
          <Label
            position="insideBottom"
            offset={dense ? 36 : 10}
            value={intervalLabel(interval)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fill: AXIS_TICK_FILL,
            }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

function LineChartAxisInterval({
  title = "Axis Tick Intervals",
  subtitle = "Same series, different Recharts interval strategies.",
  className,
  plotDir,
  seed = MOCK_SEED,
}: LineChartAxisIntervalProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const locale = "en"

  const denseData = React.useMemo(() => buildSeries(100, seed), [seed])
  const shortData = React.useMemo(() => buildSeries(20, seed), [seed])

  const last = denseData[denseData.length - 1]
  const total = last ? last.desktop + last.mobile : 0
  const prev = denseData[denseData.length - 2]
  const prevTotal = prev ? prev.desktop + prev.mobile : null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0

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
                  vs prior step
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Step {denseData.length} · {INTERVALS.length} interval demos
          </p>
        </div>
      </header>

      <div
        dir="ltr"
        className="flex flex-col gap-6"
        role="group"
        aria-label={`${title}. ${subtitle}`}
      >
        {INTERVALS.map((interval) => (
          <IntervalPlot
            key={String(interval)}
            interval={interval}
            data={typeof interval === "number" ? shortData : denseData}
            plotRtl={plotRtl}
            locale={locale}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.desktop.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-2)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.mobile.label}</span>
        </div>
      </div>
    </div>
  )
}

/** Docs / gallery default export. */
export default function LineChartAxisIntervalDemo(
  props: LineChartAxisIntervalProps
) {
  return <LineChartAxisInterval {...props} />
}

export { LineChartAxisInterval }
