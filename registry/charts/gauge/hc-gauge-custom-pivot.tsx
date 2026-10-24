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
 * Hc Gauge Custom Pivot — large hollow pivot with blunt dial.
 * Soft teal bands; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/hc-gauge-custom-pivot.tsx
 */

export type HcGaugeCustomPivotProps = {
  title?: string
  subtitle?: string
  /** Needle value 0–100. Default 78. */
  value?: number
  className?: string
}

const DEMO_VALUE = 78
const TEAL = "#4a9e88"
const TEAL_LIGHT = "#7eb8a0"

const BANDS = [
  { from: 0, to: 60, color: TEAL_LIGHT, label: "0–60" },
  { from: 60, to: 100, color: TEAL, label: "60–100" },
] as const

function buildOptions(value: number): Options {
  return {
    chart: { type: "gauge" },
    pane: {
      startAngle: -150,
      endAngle: 150,
      innerSize: "70%",
      borderRadius: 0,
    },
    yAxis: {
      min: 0,
      max: 100,
      tickWidth: 0,
      minorTickWidth: 0,
      plotBands: BANDS.map(({ from, to, color }) => ({ from, to, color })),
    },
    plotOptions: {
      gauge: {
        dataLabels: {
          verticalAlign: "middle",
          y: 0,
          zIndex: 3,
          style: {
            color: TEAL,
            textOutline: "none",
          },
          formatter() {
            return hcNum(this.y ?? 0)
          },
        },
        dial: {
          radius: "60%",
          backgroundColor: TEAL,
          borderColor: TEAL,
          baseLength: "70%",
          baseWidth: "60%",
          borderRadius: 0,
          topWidth: 0,
        },
        pivot: {
          radius: "50%",
          borderWidth: 5,
          borderColor: TEAL,
          backgroundColor: "var(--background)",
        },
      },
    },
    series: [
      {
        type: "gauge",
        name: "Score",
        data: [value],
        tooltip: {
          pointFormatter() {
            return `<span style="font-size:0.9em">${this.series.name}</span><br/><b>${hcTooltipValue(this.y ?? 0, " of 100")}</b>`
          },
        },
      },
    ],
  }
}

function HcGaugeCustomPivot({
  title = "Score gauge — custom pivot",
  subtitle = "Large hollow pivot and blunt dial on soft teal bands (−150° → 150°).",
  value = DEMO_VALUE,
  className,
}: HcGaugeCustomPivotProps) {
  const { ref } = useChartDir()
  const locale = "en"
  const metric = hcNum(value, locale)
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
              {metric}
            </p>
            <span className="text-xs text-muted-foreground">of 100</span>
          </div>
          <p className="text-xs text-muted-foreground">Score</p>
        </div>
      </header>

      <div
        role="img"
        aria-label={`Gauge chart, ${title}, ${metric} of 100`}
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

export default function HcGaugeCustomPivotDemo(
  props: HcGaugeCustomPivotProps
) {
  return <HcGaugeCustomPivot {...props} />
}

export { HcGaugeCustomPivot }
