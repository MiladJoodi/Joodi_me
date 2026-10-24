"use client"

import * as React from "react"
import type { Options } from "highcharts"

import { cn } from "@/lib/utils"

import {
  ChartHighchartsGauge,
  HC_TRAFFIC,
  hcNum,
  hcTooltipValue,
} from "../_lib/hc-gauge-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Hc Gauge Fuel — semicircle solidgauge fuel level.
 * Soft rose → gold → green stops; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/hc-gauge-fuel.tsx
 */

export type HcGaugeFuelProps = {
  title?: string
  subtitle?: string
  /** Fuel level 0–100. Default 64. */
  value?: number
  className?: string
}

const DEMO_VALUE = 64

const STOPS = [
  { at: 0.1, color: HC_TRAFFIC.red, label: "Low" },
  { at: 0.5, color: HC_TRAFFIC.gold, label: "Mid" },
  { at: 0.9, color: HC_TRAFFIC.green, label: "Full" },
] as const

function buildOptions(value: number): Options {
  return {
    chart: { type: "solidgauge" },
    pane: {
      startAngle: -90,
      endAngle: 90,
      innerSize: "60%",
      background: [
        {
          outerRadius: "100%",
          innerRadius: "60%",
          backgroundColor:
            "color-mix(in oklab, var(--muted-foreground) 22%, transparent)",
          borderWidth: 0,
        },
      ],
    },
    tooltip: {
      pointFormatter() {
        return `<b>${hcTooltipValue(this.y ?? 0, "%")}</b>`
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      stops: STOPS.map(({ at, color }) => [at, color]),
      tickAmount: 2,
      title: { text: undefined },
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          formatter() {
            return `${hcNum(this.y ?? 0)}%`
          },
          style: {
            fontSize: "1.4em",
            fontWeight: "bold",
          },
          y: -8,
        },
      },
    },
    series: [{ type: "solidgauge", name: "Fuel", data: [value] }],
  }
}

function HcGaugeFuel({
  title = "Fuel level",
  subtitle = "Semicircle solid gauge — soft rose / gold / green stops.",
  value = DEMO_VALUE,
  className,
}: HcGaugeFuelProps) {
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
            <span className="text-xs text-muted-foreground">full</span>
          </div>
          <p className="text-xs text-muted-foreground">Fuel</p>
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

export default function HcGaugeFuelDemo(props: HcGaugeFuelProps) {
  return <HcGaugeFuel {...props} />
}

export { HcGaugeFuel }
