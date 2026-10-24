"use client"

import type { CSSProperties, ComponentProps } from "react"
import GaugeChart from "react-gauge-chart"

import { cn } from "@/lib/utils"

/**
 * Shared react-gauge-chart helpers for gallery gauges.
 * Fixed height avoids the known resize bug in react-gauge-chart.
 * Installs to: components/charts/_lib/gauge-shared.tsx
 */

/** Fixed height avoids the known resize bug in react-gauge-chart. */
export const gaugeChartStyle: CSSProperties = {
  width: "100%",
  height: 250,
  maxWidth: 420,
}

/** Needle/text — theme foreground so dials stay readable in light and dark. */
export const GAUGE_NEEDLE = "var(--foreground)"

/**
 * Soft traffic-light arcs (aligned with chart palette intensity).
 * Mid gold stays readable on light backgrounds.
 */
export const GAUGE_TRAFFIC_COLORS = ["#6cb87a", "#d4b45a", "#d96b5c"] as const

export const GAUGE_TRAFFIC_LABELS = ["Low", "Mid", "High"] as const

/** Build n arc colors green → gold → red so mid yellow stays visible in light theme. */
export function gaugeTrafficRamp(levels: number): string[] {
  if (levels <= 1) return [GAUGE_TRAFFIC_COLORS[0]!]
  if (levels === 2) return [GAUGE_TRAFFIC_COLORS[0]!, GAUGE_TRAFFIC_COLORS[2]!]
  if (levels === 3) return [...GAUGE_TRAFFIC_COLORS]

  const [green, yellow, red] = GAUGE_TRAFFIC_COLORS
  const mid = Math.floor((levels - 1) / 2)
  const mix = (a: string, b: string, t: number) => {
    const parse = (hex: string) =>
      [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16))
    const [ar, ag, ab] = parse(a)
    const [br, bg, bb] = parse(b)
    const ch = (x: number) => Math.round(x).toString(16).padStart(2, "0")
    return `#${ch(ar! + (br! - ar!) * t)}${ch(ag! + (bg! - ag!) * t)}${ch(ab! + (bb! - ab!) * t)}`
  }

  return Array.from({ length: levels }, (_, i) => {
    if (i <= mid) return mix(green!, yellow!, mid === 0 ? 1 : i / mid)
    return mix(yellow!, red!, (i - mid) / (levels - 1 - mid))
  })
}

/** Library passes the display number as a string (e.g. "66"). */
export function formatGaugePercent(value: string) {
  return `${value}%`
}

export function formatGaugeMetric(percent: number, locale = "en") {
  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.round(percent * 100))}%`
}

export type ChartGaugeProps = ComponentProps<typeof GaugeChart> & {
  className?: string
}

export function ChartGauge({
  className,
  textColor = GAUGE_NEEDLE,
  needleColor = GAUGE_NEEDLE,
  needleBaseColor = GAUGE_NEEDLE,
  formatTextValue = formatGaugePercent,
  ...gaugeProps
}: ChartGaugeProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[420px] justify-center font-sans tabular-nums",
        className
      )}
    >
      <GaugeChart
        style={gaugeChartStyle}
        textColor={textColor}
        needleColor={needleColor}
        needleBaseColor={needleBaseColor}
        formatTextValue={formatTextValue}
        {...gaugeProps}
      />
    </div>
  )
}
