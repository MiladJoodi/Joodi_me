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
 * Gauge Custom Arcs — uneven traffic arc lengths (30% / 50% / 20%).
 * react-gauge-chart; locked header chrome; English / Intl.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/gauge-custom-arcs.tsx
 */

export type GaugeCustomArcsProps = {
  title?: string
  subtitle?: string
  /** Relative arc lengths (sum ≈ 1). Default [0.3, 0.5, 0.2]. */
  arcsLength?: number[]
  /** Needle position 0–1. Default 0.37. */
  percent?: number
  /** Gap between arcs. Default 0.02. */
  arcPadding?: number
  className?: string
}

const DEMO_PERCENT = 0.37
const DEMO_ARC_PADDING = 0.02
const DEMO_ARCS_LENGTH = [0.3, 0.5, 0.2] as const

function GaugeCustomArcs({
  title = "Score gauge — custom arcs",
  subtitle = "Uneven green / gold / red arcs (30% · 50% · 20%) with the needle at 37%.",
  arcsLength = [...DEMO_ARCS_LENGTH],
  percent = DEMO_PERCENT,
  arcPadding = DEMO_ARC_PADDING,
  className,
}: GaugeCustomArcsProps) {
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
            <span className="text-xs text-muted-foreground">of 100</span>
          </div>
          <p className="text-xs text-muted-foreground">Score</p>
        </div>
      </header>

      <div
        dir="ltr"
        role="img"
        aria-label={`Gauge chart, ${title}, ${metric}`}
        className="touch-pan-y rounded-lg"
      >
        <ChartGauge
          id="gauge-custom-arcs"
          nrOfLevels={420}
          arcsLength={arcsLength}
          colors={[...GAUGE_TRAFFIC_COLORS]}
          percent={percent}
          arcPadding={arcPadding}
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
            <span>
              {label}
              {arcsLength[index] != null
                ? ` · ${Math.round(arcsLength[index]! * 100)}%`
                : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function GaugeCustomArcsDemo(props: GaugeCustomArcsProps) {
  return <GaugeCustomArcs {...props} />
}

export { GaugeCustomArcs }
