"use client"

import * as React from "react"
import type { Options } from "highcharts"

import { cn } from "@/lib/utils"

import {
  ChartHighchartsGauge,
  hcNum,
  hcTooltipValue,
} from "../_lib/hc-gauge-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Hc Gauge Semicircle — half-dial speedometer (−90° → 90°).
 * Soft gold → terracotta → red; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/hc-gauge-semicircle.tsx
 */

export type HcGaugeSemicircleProps = {
  title?: string
  subtitle?: string
  /** Needle value 0–200. Default 110. */
  value?: number
  className?: string
}

const DEMO_VALUE = 110
const DIAL_COLOR = "#d96b5c"

const BANDS = [
  { from: 0, to: 120, color: "#d4b45a", label: "0–120" },
  { from: 120, to: 160, color: "#c88860", label: "120–160" },
  { from: 160, to: 200, color: "#d96b5c", label: "160–200" },
] as const

function buildOptions(value: number): Options {
  return {
    chart: { type: "gauge" },
    pane: {
      startAngle: -90,
      endAngle: 90,
      borderRadius: "50%",
    },
    yAxis: {
      min: 0,
      max: 200,
      labels: { distance: 20 },
      plotBands: BANDS.map(({ from, to, color }) => ({ from, to, color })),
    },
    series: [
      {
        type: "gauge",
        name: "Speed",
        data: [value],
        tooltip: {
          pointFormatter() {
            return `<span style="font-size:0.9em">${this.series.name}</span><br/><b>${hcTooltipValue(this.y ?? 0, " km/h")}</b>`
          },
        },
        dataLabels: {
          formatter() {
            return `${hcNum(this.y ?? 0)} km/h`
          },
        },
        dial: {
          radius: "80%",
          baseWidth: "12%",
          topWidth: "1%",
          baseLength: "15%",
          rearLength: "0%",
          borderRadius: "4%",
          backgroundColor: DIAL_COLOR,
          borderColor: DIAL_COLOR,
        },
        pivot: {
          radius: "5%",
          backgroundColor: DIAL_COLOR,
          borderWidth: 0,
        },
      },
    ],
  }
}

function HcGaugeSemicircle({
  title = "Speed gauge — semicircle",
  subtitle = "Half-dial speedometer (−90° → 90°) with soft gold to red bands.",
  value = DEMO_VALUE,
  className,
}: HcGaugeSemicircleProps) {
  const { ref } = useChartDir()
  const locale = "en"
  const metric = `${hcNum(value, locale)} km/h`
  const options = React.useMemo(() => buildOptions(value), [value])

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
              {hcNum(value, locale)}
            </p>
            <span className="text-xs text-muted-foreground">km/h</span>
          </div>
          <p className="text-xs text-muted-foreground">Speed</p>
        </div>
      </header>

      <div
        role="img"
        aria-label={`Gauge chart, ${title}, ${metric}`}
        className="touch-pan-y rounded-lg"
      >
        <ChartHighchartsGauge options={options} />
      </div>

      <ul className="mx-auto flex max-w-[420px] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {BANDS.map((band) => (
          <li key={band.label} className="inline-flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: band.color }}
              aria-hidden
            />
            <span>{band.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function HcGaugeSemicircleDemo(props: HcGaugeSemicircleProps) {
  return <HcGaugeSemicircle {...props} />
}

export { HcGaugeSemicircle }
