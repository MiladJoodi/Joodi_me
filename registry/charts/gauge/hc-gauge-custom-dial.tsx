"use client"

import * as React from "react"
import type { Options } from "highcharts"

import { cn } from "@/lib/utils"

import {
  ChartHighchartsGauge,
  HC_COLOR_0,
  hcNum,
  hcTooltipValue,
} from "../_lib/hc-gauge-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Hc Gauge Custom Dial — solidgauge arc + circular dot dial (no needle).
 * Soft Highcharts blue accent; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/hc-gauge-custom-dial.tsx
 */

export type HcGaugeCustomDialProps = {
  title?: string
  subtitle?: string
  /** Score 0–100. Default 75. */
  value?: number
  className?: string
}

const DEMO_VALUE = 75

function buildOptions(value: number): Options {
  return {
    chart: { type: "gauge" },
    pane: {
      startAngle: -120,
      endAngle: 120,
      innerSize: 160,
      borderRadius: "50%",
      size: 180,
      background: [
        {
          outerRadius: "100%",
          innerRadius: "80%",
          backgroundColor:
            "color-mix(in oklab, var(--muted-foreground) 18%, transparent)",
          borderWidth: 0,
        },
      ],
    },
    yAxis: {
      min: 0,
      max: 100,
      tickWidth: 0,
      minorTickWidth: 0,
      labels: {
        style: { color: "var(--foreground)", fontWeight: "bold" },
      },
    },
    series: [
      {
        type: "solidgauge",
        data: [value],
        enableMouseTracking: false,
        dataLabels: { enabled: false },
        color: HC_COLOR_0,
      },
      {
        type: "gauge",
        name: "Score",
        data: [value],
        tooltip: {
          pointFormatter() {
            return `<span style="font-size:0.9em">${this.series.name}</span><br/><b>${hcTooltipValue(this.y ?? 0, " of 100")}</b>`
          },
        },
        dial: {
          path: [
            ["M", 78, 0],
            ["a", 6, 6, 0, 1, 1, 12, 12],
            ["a", 6, 6, 0, 1, 1, -12, -12],
          ],
          backgroundColor: "var(--background)",
          borderColor: HC_COLOR_0,
          borderWidth: 5,
          radius: "100%",
        },
        pivot: { radius: 0 },
        dataLabels: {
          verticalAlign: "middle",
          y: 0,
          formatter() {
            return hcNum(this.y ?? 0)
          },
        },
      },
    ],
  }
}

function HcGaugeCustomDial({
  title = "Custom dial",
  subtitle = "Dot marker instead of a needle — soft Highcharts blue.",
  value = DEMO_VALUE,
  className,
}: HcGaugeCustomDialProps) {
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
        <li className="inline-flex items-center gap-1.5">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: HC_COLOR_0 }}
            aria-hidden
          />
          <span>Arc</span>
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span
            className="size-2.5 shrink-0 rounded-full border-2 bg-background"
            style={{ borderColor: HC_COLOR_0 }}
            aria-hidden
          />
          <span>Dot dial</span>
        </li>
      </ul>
    </div>
  )
}

export default function HcGaugeCustomDialDemo(props: HcGaugeCustomDialProps) {
  return <HcGaugeCustomDial {...props} />
}

export { HcGaugeCustomDial }
