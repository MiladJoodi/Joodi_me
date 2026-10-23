"use client"

import * as React from "react"
import { Label, Pie, PieChart as RechartsPieChart } from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Pie Chart In Grid — CSS Grid of responsive donuts (layout teaching demo).
 * Shared ring geometry; center cell captions; no metric scrub / on-slice labels.
 * Tokens: `--chart-1…4`. Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/pie-chart-in-grid.tsx
 */

export type PieChartInGridSlice = {
  name: string
  value: number
}

export type PieChartInGridProps = {
  title?: string
  subtitle?: string
  data?: PieChartInGridSlice[]
  className?: string
}

const SERIES_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
] as const

const DEMO_DATA: PieChartInGridSlice[] = [
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

function buildConfig(data: PieChartInGridSlice[]): ChartConfig {
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

function withFills(slices: PieChartInGridSlice[]) {
  return slices.map((slice) => ({
    ...slice,
    fill: `var(--color-${slice.name})`,
  }))
}

function CellLabel({ children }: { children: string }) {
  return (
    <Label
      position="center"
      style={{
        fontFamily: "var(--font-sono-sans), var(--font-sans)",
        fontSize: 11,
      }}
      fill="var(--muted-foreground)"
    >
      {children}
    </Label>
  )
}

function GridDonut({
  data,
  config,
  caption,
  className,
}: {
  data: ReturnType<typeof withFills>
  config: ChartConfig
  caption: string
  className?: string
}) {
  return (
    <div dir="ltr" className={cn("min-h-0 min-w-0", className)}>
      <ChartContainer
        config={config}
        className="aspect-square h-full max-h-full w-full max-w-full border border-border font-sans text-xs"
        aria-label={`Donut chart, ${caption}`}
      >
        <RechartsPieChart accessibilityLayer>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius="80%"
            innerRadius="60%"
            isAnimationActive={false}
          />
          <CellLabel>{caption}</CellLabel>
        </RechartsPieChart>
      </ChartContainer>
    </div>
  )
}

function PieChartInGrid({
  title = "Pie charts in a CSS grid",
  subtitle = "Same donut, different grid spans — resize the window to see responsive sizing.",
  data = DEMO_DATA,
  className,
}: PieChartInGridProps) {
  const { ref } = useChartDir()
  const chartConfig = React.useMemo(() => buildConfig(data), [data])
  const plotData = React.useMemo(() => withFills(data), [data])

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[960px] flex-col gap-4 font-sans sm:gap-5",
        className
      )}
    >
      <header className="space-y-1">
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </header>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Put each chart in its own grid item. The demos below share one data set
        and sit in a{" "}
        <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          grid-cols-3
        </code>{" "}
        /{" "}
        <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          grid-rows-3
        </code>{" "}
        layout — try narrowing the viewport.
      </p>

      <div className="grid min-h-[400px] w-full grid-cols-3 grid-rows-3 gap-2.5 rounded-lg border border-border p-2.5">
        <GridDonut
          data={plotData}
          config={chartConfig}
          caption="2×2 cell"
          className="col-span-2 row-span-2"
        />
        <GridDonut
          data={plotData}
          config={chartConfig}
          caption="1×1 cell"
          className="col-start-3 row-start-1"
        />
        <GridDonut
          data={plotData}
          config={chartConfig}
          caption="1×1 cell"
          className="col-start-3 row-start-2"
        />
        <GridDonut
          data={plotData}
          config={chartConfig}
          caption="3×1 cell"
          className="col-span-3 row-start-3 mx-auto h-full"
        />
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
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

export default function PieChartInGridDemo(props: PieChartInGridProps) {
  return <PieChartInGrid {...props} />
}

export { PieChartInGrid }
