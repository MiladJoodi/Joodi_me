"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import {
  ChartGauge,
  GAUGE_NEEDLE,
  GAUGE_TRAFFIC_COLORS,
  GAUGE_TRAFFIC_LABELS,
  formatGaugeMetric,
  gaugeTrafficRamp,
} from "../_lib/gauge-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Gauge Levels — 20 soft traffic bands with needle at 86%.
 * react-gauge-chart; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/gauge-levels.tsx
 */

export type GaugeLevelsProps = {
  title?: string
  subtitle?: string
  /** Band count. Default 20. */
  levels?: number
  /** Needle position 0–1. Default 0.86. */
  percent?: number
  className?: string
}

const DEMO_LEVELS = 20
const DEMO_PERCENT = 0.86

function GaugeLevels({
  title = "Score gauge — 20 levels",
  subtitle = "Fine green → gold → red ramp with the needle at 86%.",
  levels = DEMO_LEVELS,
  percent = DEMO_PERCENT,
  className,
}: GaugeLevelsProps) {
  const { ref } = useChartDir()
  const locale = "en"
  const metric = formatGaugeMetric(percent, locale)
  const colors = React.useMemo(() => gaugeTrafficRamp(levels), [levels])

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
          id="gauge-levels"
          nrOfLevels={levels}
          colors={colors}
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

export default function GaugeLevelsDemo(props: GaugeLevelsProps) {
  return <GaugeLevels {...props} />
}

export { GaugeLevels }
