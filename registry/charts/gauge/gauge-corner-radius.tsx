"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import {
  ChartGauge,
  GAUGE_NEEDLE,
  GAUGE_TRAFFIC_COLORS,
  GAUGE_TRAFFIC_LABELS,
  formatGaugeMetric,
} from "../_lib/gauge-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Gauge Corner Radius — 10 bands with rounded corners and wider arc padding.
 * react-gauge-chart; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/gauge-corner-radius.tsx
 */

export type GaugeCornerRadiusProps = {
  title?: string
  subtitle?: string
  /** Band count. Default 10. */
  levels?: number
  /** Gap between arcs 0–1. Default 0.1. */
  arcPadding?: number
  /** Arc corner radius. Default 3. */
  cornerRadius?: number
  /** Needle position 0–1. Default 0.6. */
  percent?: number
  className?: string
}

const DEMO_LEVELS = 10
const DEMO_PERCENT = 0.6
const DEMO_ARC_PADDING = 0.1
const DEMO_CORNER_RADIUS = 3

function GaugeCornerRadius({
  title = "Score gauge — corner radius",
  subtitle = "Ten soft traffic bands with rounded corners and wider gaps.",
  levels = DEMO_LEVELS,
  arcPadding = DEMO_ARC_PADDING,
  cornerRadius = DEMO_CORNER_RADIUS,
  percent = DEMO_PERCENT,
  className,
}: GaugeCornerRadiusProps) {
  const { ref } = useChartDir()
  const locale = "en"
  const metric = formatGaugeMetric(percent, locale)

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
              of 100 · {levels} bands
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Score</p>
        </div>
      </header>

      <div
        dir="ltr"
        role="img"
        aria-label={`Gauge chart, ${title}, ${metric}, ${levels} levels`}
        className="touch-pan-y rounded-lg"
      >
        <ChartGauge
          id="gauge-corner-radius"
          nrOfLevels={levels}
          colors={[...GAUGE_TRAFFIC_COLORS]}
          arcPadding={arcPadding}
          cornerRadius={cornerRadius}
          percent={percent}
          needleColor={GAUGE_NEEDLE}
        />
      </div>

      <ul className="mx-auto flex max-w-[420px] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {GAUGE_TRAFFIC_LABELS.map((label, index) => (
          <li key={label} className="inline-flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: GAUGE_TRAFFIC_COLORS[index] }}
              aria-hidden
            />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function GaugeCornerRadiusDemo(props: GaugeCornerRadiusProps) {
  return <GaugeCornerRadius {...props} />
}

export { GaugeCornerRadius }
