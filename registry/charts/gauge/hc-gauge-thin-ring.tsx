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
 * Hc Gauge Thin Ring — thin outer plotBands with dial on HC_DIAL.
 * Soft violet → slate bands; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/hc-gauge-thin-ring.tsx
 */

export type HcGaugeThinRingProps = {
  title?: string
  subtitle?: string
  /** Needle value 0–100. Default 45. */
  value?: number
  className?: string
}

const DEMO_VALUE = 45

const BANDS = [
  {
    from: 0,
    to: 70,
    color: "#b8a8c8",
    label: "0–70",
  },
  {
    from: 70,
    to: 100,
    color: "#8b9dc3",
    label: "70–100",
  },
] as const

function buildOptions(value: number): Options {
  return {
    chart: { type: "gauge" },
    pane: {
      borderRadius: "50%",
      background: undefined,
      margin: 20,
    },
    yAxis: {
      labels: { distance: "20%" },
      lineWidth: 1,
      min: 0,
      max: 100,
      offset: 0,
      tickPosition: "outside",
      minorTickPosition: "outside",
      plotBands: BANDS.map(({ from, to, color }) => ({
        from,
        to,
        color,
        outerRadius: "90%",
        innerRadius: "80%",
      })),
    },
    plotOptions: {
      gauge: {
        dial: {
          baseWidth: 6,
          backgroundColor: HC_DIAL,
        },
        pivot: {
          backgroundColor: HC_DIAL,
          radius: 6,
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
        dataLabels: {
          formatter() {
            return hcNum(this.y ?? 0)
          },
        },
      },
    ],
  }
}

function HcGaugeThinRing({
  title = "Score gauge — thin ring",
  subtitle = "Narrow violet / slate bands on the outer ring with a theme dial.",
  value = DEMO_VALUE,
  className,
}: HcGaugeThinRingProps) {
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

export default function HcGaugeThinRingDemo(props: HcGaugeThinRingProps) {
  return <HcGaugeThinRing {...props} />
}

export { HcGaugeThinRing }
