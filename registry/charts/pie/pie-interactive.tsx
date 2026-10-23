"use client"

import * as React from "react"
import {
  Label,
  Pie,
  PieChart as RechartsPieChart,
  Sector,
  type PieSectorShapeProps,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useChartDir } from "../_lib/use-chart-dir"
import { usePrefersReducedMotion } from "../_lib/use-prefers-reduced-motion"

/**
 * Pie Interactive — month Select drives active sector + center value.
 * Hover can sync Select when `scrub`. Tokens: `--chart-1…5`. Spec: `registry/charts/PORT.md`
 * Classic twin `chart-pie-interactive` not ported here.
 * Installs to: components/charts/pie-interactive.tsx
 */

export type PieInteractiveSlice = {
  month: string
  store: number
}

export type PieInteractiveProps = {
  title?: string
  subtitle?: string
  data?: PieInteractiveSlice[]
  className?: string
  /** Slice order / start angle. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover on pie also changes the active month. Default on. Select always shown. */
  scrub?: boolean
}

const PIE_MS = 200
const CHART_ID = "pie-interactive"

const SERIES_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

const DEMO_DATA: PieInteractiveSlice[] = [
  { month: "january", store: 186 },
  { month: "february", store: 305 },
  { month: "march", store: 237 },
  { month: "april", store: 173 },
  { month: "may", store: 209 },
]

const MONTH_LABELS: Record<string, string> = {
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
}

function seriesColor(index: number) {
  return SERIES_VARS[index % SERIES_VARS.length]!
}

function buildConfig(data: PieInteractiveSlice[]): ChartConfig {
  const config: ChartConfig = {
    sales: { label: "Sales" },
    store: { label: "Store" },
  }
  data.forEach((slice, index) => {
    config[slice.month] = {
      label: MONTH_LABELS[slice.month] ?? slice.month,
      color: seriesColor(index),
    }
  })
  return config
}

function withFills(slices: PieInteractiveSlice[]) {
  return slices.map((slice) => ({
    ...slice,
    fill: `var(--color-${slice.month})`,
  }))
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function monthLabel(month: string) {
  return MONTH_LABELS[month] ?? month
}

const chartPieContainerClassName =
  "mx-auto aspect-square h-auto w-full max-w-[300px] max-h-[300px] overflow-visible font-sans text-xs tabular-nums [&_.recharts-surface]:overflow-visible"

function PieInteractive({
  title = "Store sales by month",
  subtitle = "Pick a month — the active slice expands and the center updates.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: PieInteractiveProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const reducedMotion = usePrefersReducedMotion()
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const locale = "en"

  const chartConfig = React.useMemo(() => buildConfig(data), [data])
  const plotData = React.useMemo(() => withFills(data), [data])
  const months = React.useMemo(() => data.map((item) => item.month), [data])
  const defaultMonth = data[0]?.month ?? "january"

  const [activeMonth, setActiveMonth] = React.useState(defaultMonth)
  const [dataTrack, setDataTrack] = React.useState(data)
  if (dataTrack !== data) {
    setDataTrack(data)
    setActiveMonth(data[0]?.month ?? "january")
  }

  const activeIndex = React.useMemo(() => {
    const idx = data.findIndex((item) => item.month === activeMonth)
    return idx >= 0 ? idx : 0
  }, [activeMonth, data])

  const activeSlice = data[activeIndex] ?? data[0]
  const metricValue = activeSlice?.store ?? 0
  const caption = activeSlice ? monthLabel(activeSlice.month) : "—"

  const startAngle = plotRtl ? -270 : 90
  const endAngle = plotRtl ? 90 : -270

  const announce = React.useCallback(
    (month: string, value: number) => {
      if (!liveRef.current) return
      liveRef.current.textContent = `${monthLabel(month)}: ${formatNumber(value, locale)}`
    },
    [locale]
  )

  const selectMonth = React.useCallback(
    (month: string, fromKeyboard = false) => {
      setActiveMonth(month)
      const slice = data.find((item) => item.month === month)
      if (fromKeyboard && slice) announce(month, slice.store)
    },
    [announce, data]
  )

  const renderPieShape = React.useCallback(
    ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
      if (index === activeIndex) {
        return (
          <g>
            <Sector {...props} outerRadius={outerRadius + 10} />
            <Sector
              {...props}
              outerRadius={outerRadius + 25}
              innerRadius={outerRadius + 12}
            />
          </g>
        )
      }
      return <Sector {...props} outerRadius={outerRadius} />
    },
    [activeIndex]
  )

  const ariaLabel = React.useMemo(() => {
    return `Donut chart, ${title}, ${caption} ${formatNumber(metricValue, locale)}`
  }, [caption, locale, metricValue, title])

  return (
    <div
      ref={ref}
      data-chart={CHART_ID}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[640px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
        className
      )}
    >
      <ChartStyle id={CHART_ID} config={chartConfig} />

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
                {formatNumber(metricValue, locale)}
              </p>
              <span className="text-xs text-muted-foreground">sales</span>
            </div>
            <p className="text-xs text-muted-foreground">{caption}</p>
          </div>

          <Select value={activeMonth} onValueChange={selectMonth}>
            <SelectTrigger
              size="sm"
              className="w-[130px] rounded-md pe-2.5"
              aria-label="Select month"
            >
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-md">
              {months.map((key) => {
                const config = chartConfig[key]
                if (!config) return null
                return (
                  <SelectItem key={key} value={key} className="rounded-md">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="flex size-3 shrink-0 rounded-sm"
                        style={{
                          backgroundColor: `var(--color-${key})`,
                        }}
                      />
                      {config.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div
        dir="ltr"
        role="img"
        aria-label={ariaLabel}
        className="touch-pan-y rounded-lg"
      >
        <ChartContainer
          id={CHART_ID}
          config={chartConfig}
          className={cn(chartPieContainerClassName, "max-w-none")}
        >
          <RechartsPieChart accessibilityLayer>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  nameKey="month"
                  hideLabel
                  formatter={(value) => formatNumber(Number(value), locale)}
                />
              }
            />
            <Pie
              data={plotData}
              dataKey="store"
              nameKey="month"
              cx="50%"
              cy="50%"
              innerRadius={60}
              startAngle={startAngle}
              endAngle={endAngle}
              stroke="var(--background)"
              strokeWidth={5}
              shape={renderPieShape}
              isAnimationActive={!reducedMotion}
              animationDuration={PIE_MS}
              onMouseEnter={
                scrub
                  ? (_, index) => {
                      const slice = data[index]
                      if (slice) selectMonth(slice.month)
                    }
                  : undefined
              }
              style={{ cursor: scrub ? "pointer" : undefined }}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                    return null
                  }
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                        style={{
                          fontFamily:
                            "var(--font-sono-sans), var(--font-sans)",
                        }}
                      >
                        {formatNumber(metricValue, locale)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                        style={{
                          fontFamily:
                            "var(--font-sono-sans), var(--font-sans)",
                          fontSize: 12,
                        }}
                      >
                        {caption}
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
          </RechartsPieChart>
        </ChartContainer>
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Store</th>
          </tr>
        </thead>
        <tbody>
          {data.map((slice) => (
            <tr key={`a11y-${slice.month}`}>
              <td>{monthLabel(slice.month)}</td>
              <td>{slice.store}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PieInteractiveDemo(props: PieInteractiveProps) {
  return <PieInteractive {...props} />
}

export { PieInteractive }
