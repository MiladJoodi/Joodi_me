"use client"

import * as React from "react"
import type { Options } from "highcharts"

import { cn } from "@/lib/utils"

import {
  ChartHighchartsGauge,
  HC_NEUTRAL,
  HC_TRAFFIC,
  hcNum,
  hcTooltipValue,
} from "../_lib/hc-gauge-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Hc Gauge Threshold — solidgauge with zero threshold (red below / green above).
 * Locked header chrome; English / Intl. Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/hc-gauge-threshold.tsx
 */

export type HcGaugeThresholdProps = {
  title?: string
  subtitle?: string
  /** P&L value on −4…4 scale. Default −1.2. */
  value?: number
  className?: string
}

const DEMO_VALUE = -1.2
const MIN = -4
const MAX = 4

function buildOptions(value: number): Options {
  return {
    chart: { type: "solidgauge" },
    pane: {
      borderRadius: 0,
      innerSize: "80%",
      background: [
        {
          outerRadius: "100%",
          innerRadius: "80%",
          backgroundColor:
            "color-mix(in oklab, var(--muted-foreground) 20%, transparent)",
          borderWidth: 0,
        },
      ],
    },
    tooltip: {
      pointFormatter() {
        return `<span style="font-size:0.9em">${this.series.name}</span><br/><b>${hcTooltipValue(this.y ?? 0)}</b>`
      },
    },
    yAxis: {
      min: MIN,
      max: MAX,
      tickAmount: 2,
      stops: [
        [0.4999, HC_TRAFFIC.red],
        [0.5, HC_TRAFFIC.green],
      ],
      title: { text: undefined },
      plotLines: [
        {
          value: 0,
          color: HC_NEUTRAL,
          width: 2,
          zIndex: 5,
        },
      ],
    },
    series: [
      {
        type: "solidgauge",
        name: "P&L",
        data: [value],
        threshold: 0,
        dataLabels: {
          formatter() {
            return hcNum(this.y ?? 0)
          },
          style: {
            fontSize: "1.2em",
            fontWeight: "bold",
          },
        },
      },
    ],
  }
}

function HcGaugeThreshold({
  title = "Threshold gauge",
  subtitle = "Solid gauge with a zero threshold — red below, green above.",
  value = DEMO_VALUE,
  className,
}: HcGaugeThresholdProps) {
  const { ref } = useChartDir()
  const locale = "en"
  const metric = hcNum(value, locale)
  const options = React.useMemo(() => buildOptions(value), [value])
  const side = value < 0 ? "Below zero" : value > 0 ? "Above zero" : "At zero"

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
            <span className="text-xs text-muted-foreground">
              {MIN}…{MAX}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">P&L · {side}</p>
        </div>
      </header>

      <div
        role="img"
        aria-label={`Threshold gauge, P&L ${metric}, range ${MIN} to ${MAX}`}
        className="touch-pan-y rounded-lg"
      >
        <ChartHighchartsGauge options={options} />
      </div>

      <ul className="mx-auto flex max-w-[420px] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <li className="inline-flex items-center gap-1.5">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: HC_TRAFFIC.red }}
            aria-hidden
          />
          <span>Below 0</span>
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: HC_TRAFFIC.green }}
            aria-hidden
          />
          <span>Above 0</span>
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span
            className="size-2 shrink-0 rounded-full bg-foreground"
            aria-hidden
          />
          <span>Threshold</span>
        </li>
      </ul>
    </div>
  )
}

export default function HcGaugeThresholdDemo(props: HcGaugeThresholdProps) {
  return <HcGaugeThreshold {...props} />
}

export { HcGaugeThreshold }
