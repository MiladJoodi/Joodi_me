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
 * Hc Gauge Activity — full 360° solidgauge activity ring.
 * Soft pink → rose gradient; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/hc-gauge-activity.tsx
 */

export type HcGaugeActivityProps = {
  title?: string
  subtitle?: string
  /** Activity progress 0–100. Default 79. */
  value?: number
  className?: string
}

const DEMO_VALUE = 79

const GRADIENT = {
  from: "#c86b8f",
  to: "#d97986",
} as const

function buildOptions(value: number): Options {
  return {
    chart: { type: "solidgauge" },
    pane: {
      startAngle: 0,
      endAngle: 360,
      innerSize: "75%",
      margin: 0,
      background: [
        {
          outerRadius: "100%",
          innerRadius: "75%",
          // Readable track in both themes (not Highcharts CSS vars).
          backgroundColor:
            "color-mix(in oklab, var(--foreground) 16%, transparent)",
          borderWidth: 0,
        },
      ],
    },
    tooltip: {
      pointFormatter() {
        return `<span style="font-size:0.9em">${this.series.name}</span><br/><b>${hcTooltipValue(this.y ?? 0, "%")}</b>`
      },
    },
    yAxis: { min: 0, max: 100, lineWidth: 0, tickPositions: [] },
    series: [
      {
        type: "solidgauge",
        name: "Steps",
        data: [
          {
            color: {
              linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
              stops: [
                [0, GRADIENT.from],
                [1, GRADIENT.to],
              ],
            },
            y: value,
          },
        ],
        dataLabels: {
          formatter() {
            return `${hcNum(this.y ?? 0)}%<br/><span style="font-size:0.8em;color:var(--muted-foreground)">Steps</span>`
          },
          useHTML: true,
        },
        rounded: true,
      },
    ],
  }
}

function HcGaugeActivity({
  title = "Activity ring",
  subtitle = "Full-circle solid gauge with a soft pink → rose gradient.",
  value = DEMO_VALUE,
  className,
}: HcGaugeActivityProps) {
  const { ref } = useChartDir()
  const locale = "en"
  const metric = `${hcNum(value, locale)}%`
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
            <span className="text-xs text-muted-foreground">of goal</span>
          </div>
          <p className="text-xs text-muted-foreground">Steps</p>
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
        <li className="inline-flex items-center gap-1.5">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${GRADIENT.from}, ${GRADIENT.to})`,
            }}
            aria-hidden
          />
          <span>Progress</span>
        </li>
      </ul>
    </div>
  )
}

export default function HcGaugeActivityDemo(props: HcGaugeActivityProps) {
  return <HcGaugeActivity {...props} />
}

export { HcGaugeActivity }
