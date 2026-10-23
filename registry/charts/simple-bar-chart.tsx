"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { generateMockData } from "./_lib/chart-mock-data"
import {
  CHART_SERIES_A,
  CHART_SERIES_B,
  chartBarContainerClassName,
} from "./_lib/chart-styles"
import { useChartDir } from "./_lib/use-chart-dir"

/**
 * Simple Bar Chart — English labels; LTR default.
 * Dual series only: primary blue × teal. Semantic colors stay off this demo.
 * Installs to: components/charts/simple-bar-chart.tsx
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const
const NARROW_MQ = "(max-width: 639px)"

const data = generateMockData(6, 823).map((row, i) => ({
  month: MONTHS[i] ?? row.label,
  desktop: row.x,
  mobile: row.y,
}))

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

/** Soft category highlight — no glow. */
const BAR_TOOLTIP_CURSOR = {
  fill: "color-mix(in oklab, var(--foreground) 6%, transparent)",
} as const

const BAR_ACTIVE = {
  fillOpacity: 0.92,
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

export default function SimpleBarChartDemo() {
  const { dir, ref } = useChartDir()
  const isRtl = dir === "rtl"
  const narrow = useNarrowViewport()

  return (
    <div
      ref={ref}
      className="mx-auto flex w-full min-w-0 max-w-[640px] flex-col gap-2 font-sans text-xs"
    >
      <ChartContainer
        config={chartConfig}
        className={cn(chartBarContainerClassName, "max-w-none")}
      >
        <BarChart
          accessibilityLayer
          data={data}
          barCategoryGap={narrow ? "18%" : "24%"}
          barGap={narrow ? 4 : 6}
          margin={
            narrow
              ? { top: 8, right: isRtl ? 2 : 4, left: isRtl ? 4 : 2, bottom: 4 }
              : { top: 8, right: 8, left: 4, bottom: 4 }
          }
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            reversed={isRtl}
            tickLine={false}
            axisLine={false}
            tickMargin={narrow ? 6 : 8}
            minTickGap={narrow ? 4 : 8}
            interval="preserveStartEnd"
          />
          <YAxis
            orientation={isRtl ? "right" : "left"}
            width={narrow ? 32 : 40}
            tickLine={false}
            axisLine={false}
            tickMargin={narrow ? 4 : 8}
            tickCount={narrow ? 4 : 5}
            tickFormatter={(value: number) =>
              narrow && value >= 1000
                ? `${Math.round(value / 1000)}k`
                : String(value)
            }
          />
          <ChartTooltip
            cursor={BAR_TOOLTIP_CURSOR}
            content={<ChartTooltipContent />}
          />
          <Bar
            dataKey="desktop"
            fill="var(--color-desktop)"
            radius={[6, 6, 0, 0]}
            maxBarSize={narrow ? 28 : 36}
            activeBar={BAR_ACTIVE}
            isAnimationActive
            animationDuration={280}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="mobile"
            fill="var(--color-mobile)"
            radius={[6, 6, 0, 0]}
            maxBarSize={narrow ? 28 : 36}
            activeBar={BAR_ACTIVE}
            isAnimationActive
            animationDuration={280}
            animationEasing="ease-out"
          />
        </BarChart>
      </ChartContainer>
      {/* Outside the SVG so legend never clips axis ticks on narrow viewports. */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-1 text-xs text-muted-foreground sm:gap-x-6">
        <div className="flex items-center gap-1.5">
          <span
            className="size-2.5 shrink-0 rounded-[2px] bg-[var(--chart-1)]"
            aria-hidden
          />
          <span>{chartConfig.desktop.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="size-2.5 shrink-0 rounded-[2px] bg-[var(--chart-2)]"
            aria-hidden
          />
          <span>{chartConfig.mobile.label}</span>
        </div>
      </div>
    </div>
  )
}
