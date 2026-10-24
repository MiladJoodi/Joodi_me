"use client"

import * as React from "react"
import type { Options } from "highcharts"

import { cn } from "@/lib/utils"

import {
  ChartHighchartsGauge,
  HC_COLOR_0,
  HC_COLOR_1,
  HC_COLOR_2,
  hcNum,
  hcTooltipValue,
} from "../_lib/hc-gauge-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Hc Gauge Kpi — three nested solidgauge KPI rings.
 * Soft Highcharts blues / violet / green; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/hc-gauge-kpi.tsx
 */

export type HcGaugeKpiRing = {
  name: string
  value: number
  color: string
  outerRadius: string
  innerRadius: string
  track: string
}

export type HcGaugeKpiProps = {
  title?: string
  subtitle?: string
  rings?: HcGaugeKpiRing[]
  className?: string
}

const DEMO_RINGS: HcGaugeKpiRing[] = [
  {
    name: "Conversion",
    value: 82,
    color: HC_COLOR_0,
    outerRadius: "100%",
    innerRadius: "78%",
    track: "rgba(44, 175, 254, 0.25)",
  },
  {
    name: "Engagement",
    value: 59,
    color: HC_COLOR_1,
    outerRadius: "77%",
    innerRadius: "56%",
    track: "rgba(84, 79, 197, 0.25)",
  },
  {
    name: "Retention",
    value: 71,
    color: HC_COLOR_2,
    outerRadius: "55%",
    innerRadius: "34%",
    track: "rgba(0, 226, 114, 0.25)",
  },
]

function buildOptions(rings: HcGaugeKpiRing[]): Options {
  return {
    chart: { type: "solidgauge" },
    tooltip: {
      pointFormatter() {
        return `<span style="color:${this.color};font-weight:bold">${this.series.name}: ${hcTooltipValue(this.y ?? 0, "%")}</span>`
      },
    },
    pane: {
      startAngle: 0,
      endAngle: 360,
      margin: 0,
      background: rings.map((ring) => ({
        outerRadius: ring.outerRadius,
        innerRadius: ring.innerRadius,
        backgroundColor: ring.track,
        borderWidth: 0,
      })),
    },
    yAxis: { min: 0, max: 100, lineWidth: 0, tickPositions: [] },
    plotOptions: {
      solidgauge: {
        dataLabels: { enabled: false },
        linecap: "round",
        stickyTracking: false,
        rounded: true,
      },
    },
    series: rings.map((ring) => ({
      type: "solidgauge" as const,
      name: ring.name,
      radius: ring.outerRadius,
      innerRadius: ring.innerRadius,
      data: [{ color: ring.color, y: ring.value }],
    })),
  }
}

function HcGaugeKpi({
  title = "KPI rings",
  subtitle = "Three nested solid gauges — Conversion, Engagement, Retention.",
  rings = DEMO_RINGS,
  className,
}: HcGaugeKpiProps) {
  const { ref } = useChartDir()
  const locale = "en"
  const primary = rings[0]
  const metric = primary
    ? `${hcNum(primary.value, locale)}%`
    : "—"
  const options = React.useMemo(() => buildOptions(rings), [rings])

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
              {primary?.name ?? "KPI"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Outer ring</p>
        </div>
      </header>

      <div
        role="img"
        aria-label={`KPI gauge, ${rings.map((r) => `${r.name} ${r.value}%`).join(", ")}`}
        className="touch-pan-y rounded-lg"
      >
        <ChartHighchartsGauge options={options} height={320} />
      </div>

      <ul className="mx-auto flex max-w-[420px] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {rings.map((ring) => (
          <li key={ring.name} className="inline-flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: ring.color }}
              aria-hidden
            />
            <span>
              {ring.name} · {hcNum(ring.value, locale)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function HcGaugeKpiDemo(props: HcGaugeKpiProps) {
  return <HcGaugeKpi {...props} />
}

export { HcGaugeKpi }
