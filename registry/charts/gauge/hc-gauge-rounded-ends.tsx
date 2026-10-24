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
 * Hc Gauge Rounded Ends — Highcharts dial with rounded pane / dial tips.
 * Soft blue bands; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/hc-gauge-rounded-ends.tsx
 */

export type HcGaugeRoundedEndsProps = {
  title?: string
  subtitle?: string
  /** Needle value 0–100. Default 72. */
  value?: number
  className?: string
}

const DEMO_VALUE = 72

const BANDS = [
  { from: 0, to: 60, color: "#9bbfd4", label: "0–60" },
  { from: 60, to: 80, color: "#6ea1c7", label: "60–80" },
  { from: 80, to: 100, color: "#4a7a9a", label: "80–100" },
] as const

const DIAL_COLOR = "#6ea1c7"

function buildOptions(value: number): Options {
  return {
    chart: { type: "gauge" },
    pane: {
      innerSize: "75%",
      borderRadius: "50%",
    },
    yAxis: {
      min: 0,
      max: 100,
      gridLineWidth: 1,
      gridLineColor: "var(--background)",
      tickWidth: 0,
      minorTickWidth: 0,
      plotBands: BANDS.map(({ from, to, color }) => ({ from, to, color })),
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
        dataLabels: {
          formatter() {
            return hcNum(this.y ?? 0)
          },
        },
        dial: {
          radius: "80%",
          backgroundColor: DIAL_COLOR,
          baseWidth: "5%",
          topWidth: "1%",
          rearLength: "0%",
          borderRadius: "50%",
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

function HcGaugeRoundedEnds({
  title = "Score gauge — rounded ends",
  subtitle = "Rounded pane and dial tips on a soft light-to-deep blue band.",
  value = DEMO_VALUE,
  className,
}: HcGaugeRoundedEndsProps) {
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

export default function HcGaugeRoundedEndsDemo(
  props: HcGaugeRoundedEndsProps
) {
  return <HcGaugeRoundedEnds {...props} />
}

export { HcGaugeRoundedEnds }
