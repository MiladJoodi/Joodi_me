"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import {
  ChartGauge,
  GAUGE_NEEDLE,
  formatGaugeMetric,
} from "../_lib/gauge-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Gauge Custom Colors — rose → sand ramp, thicker arc, needle at 37%.
 * react-gauge-chart; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/gauge-custom-colors.tsx
 */

export type GaugeCustomColorsProps = {
  title?: string
  subtitle?: string
  /** Band count. Default 30. */
  levels?: number
  /** Needle position 0–1. Default 0.37. */
  percent?: number
  /** Arc thickness 0–1. Default 0.3. */
  arcWidth?: number
  colors?: string[]
  className?: string
}

const DEMO_LEVELS = 30
const DEMO_PERCENT = 0.37
const DEMO_ARC_WIDTH = 0.3
/** Soft rose → sand (demo palette). */
const DEMO_COLORS = ["#d97986", "#c4a574"] as const

function GaugeCustomColors({
  title = "Score gauge — custom colors",
  subtitle = "Thirty soft rose → sand bands with a thicker arc at 37%.",
  levels = DEMO_LEVELS,
  percent = DEMO_PERCENT,
  arcWidth = DEMO_ARC_WIDTH,
  colors = [...DEMO_COLORS],
  className,
}: GaugeCustomColorsProps) {
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
          id="gauge-custom-colors"
          nrOfLevels={levels}
          colors={colors}
          arcWidth={arcWidth}
          percent={percent}
          needleColor={GAUGE_NEEDLE}
        />
      </div>

      <ul className="mx-auto flex max-w-[420px] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <li className="inline-flex items-center gap-1.5">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: colors[0] }}
            aria-hidden
          />
          <span>Rose</span>
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{
              backgroundColor: colors[colors.length - 1] ?? colors[0],
            }}
            aria-hidden
          />
          <span>Sand</span>
        </li>
      </ul>
    </div>
  )
}

export default function GaugeCustomColorsDemo(props: GaugeCustomColorsProps) {
  return <GaugeCustomColors {...props} />
}

export { GaugeCustomColors }
