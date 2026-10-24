"use client"

import * as React from "react"
import type { Options } from "highcharts"

import { cn } from "@/lib/utils"

import {
  ChartHighchartsGauge,
  HC_DIAL,
  hcNum,
  hcTooltipValue,
} from "../_lib/hc-gauge-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Hc Gauge Combo — solidgauge fill + dial needle on the same value.
 * Soft teal / blue / violet stops; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/hc-gauge-combo.tsx
 */

export type HcGaugeComboProps = {
  title?: string
  subtitle?: string
  /** Shared needle + fill value 0–100. Default 74. */
  value?: number
  className?: string
}

const DEMO_VALUE = 74
const FILL_COLOR = "#6ea1c7"

const STOPS = [
  { at: 0.3, color: "#7eb8a0", label: "Teal" },
  { at: 0.6, color: "#6ea1c7", label: "Blue" },
  { at: 0.9, color: "#8b9dc3", label: "Violet" },
] as const

function buildOptions(value: number): Options {
  return {
    chart: {},
    pane: {
      // No 50% borderRadius — rounded solid fills visually lag behind the dial.
      borderRadius: 0,
      background: [
        {
          outerRadius: "100%",
          innerRadius: "60%",
          backgroundColor:
            "color-mix(in oklab, var(--muted-foreground) 20%, transparent)",
          borderWidth: 0,
        },
      ],
    },
    yAxis: {
      min: 0,
      max: 100,
      tickPositions: [0, 20, 40, 60, 80, 100],
      stops: STOPS.map(({ at, color }) => [at, color]),
    },
    plotOptions: {
      solidgauge: {
        rounded: false,
        borderRadius: 0,
        radius: "100%",
        innerRadius: "60%",
      },
      gauge: {
        dial: {
          // Tip sits mid-band so it reads as the end of the solid fill.
          radius: "80%",
          baseWidth: 3,
          topWidth: 1,
          rearLength: 0,
          borderRadius: 0,
          backgroundColor: HC_DIAL,
          borderColor: HC_DIAL,
        },
        pivot: {
          radius: 5,
          backgroundColor: HC_DIAL,
          borderColor: HC_DIAL,
        },
      },
    },
    series: [
      {
        type: "solidgauge",
        name: "Value",
        data: [{ y: value, color: FILL_COLOR }],
        dataLabels: { enabled: false },
        enableMouseTracking: false,
        rounded: false,
        radius: "100%",
        innerRadius: "60%",
      },
      {
        type: "gauge",
        name: "Value",
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
      },
    ],
  }
}

function HcGaugeCombo({
  title = "Score gauge — combo",
  subtitle = "Solid fill and dial share one value so the tip meets the arc end.",
  value = DEMO_VALUE,
  className,
}: HcGaugeComboProps) {
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
          <p className="text-xs text-muted-foreground">Value</p>
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
        {STOPS.map((stop) => (
          <li key={stop.label} className="inline-flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: stop.color }}
              aria-hidden
            />
            <span>{stop.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function HcGaugeComboDemo(props: HcGaugeComboProps) {
  return <HcGaugeCombo {...props} />
}

export { HcGaugeCombo }
