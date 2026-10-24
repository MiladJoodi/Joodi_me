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
 * Gauge No Animation — 15 traffic bands, needle locked at 56% with animate off.
 * react-gauge-chart; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/gauge-no-animation.tsx
 */

export type GaugeNoAnimationProps = {
  title?: string
  subtitle?: string
  /** Band count. Default 15. */
  levels?: number
  /** Needle position 0–1. Default 0.56. */
  percent?: number
  className?: string
}

const DEMO_LEVELS = 15
const DEMO_PERCENT = 0.56

function GaugeNoAnimation({
  title = "Score gauge — no animation",
  subtitle = "Fifteen soft traffic bands with the needle parked at 56% (no enter animation).",
  levels = DEMO_LEVELS,
  percent = DEMO_PERCENT,
  className,
}: GaugeNoAnimationProps) {
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
        aria-label={`Gauge chart, ${title}, ${metric}, ${levels} levels, animation off`}
        className="touch-pan-y rounded-lg"
      >
        <ChartGauge
          id="gauge-no-animation"
          animate={false}
          nrOfLevels={levels}
          colors={[...GAUGE_TRAFFIC_COLORS]}
          percent={percent}
          needleColor={GAUGE_NEEDLE}
          needleBaseColor={GAUGE_NEEDLE}
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

export default function GaugeNoAnimationDemo(props: GaugeNoAnimationProps) {
  return <GaugeNoAnimation {...props} />
}

export { GaugeNoAnimation }
