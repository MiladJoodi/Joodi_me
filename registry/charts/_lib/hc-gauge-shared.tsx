"use client"

import { useEffect, useMemo, useState } from "react"
import type { Options } from "highcharts"
import Highcharts from "highcharts/esm/highcharts.js"
import "highcharts/esm/highcharts-more.js"
import "highcharts/esm/modules/solid-gauge.js"
import HighchartsReact from "highcharts-react-official"

import { cn } from "@/lib/utils"

/**
 * Shared Highcharts gauge / solidgauge helpers.
 * Soft dial chrome; English / Intl labels. Client-only mount gate.
 * Installs to: components/charts/_lib/hc-gauge-shared.tsx
 */

/** Softened Highcharts defaults — closer to chart intensity on light. */
export const HC_COLOR_0 = "#5aa8d4"
export const HC_COLOR_1 = "#6b66b8"
export const HC_COLOR_2 = "#5cb88a"

/**
 * Always-visible needle on light/dark.
 * Prefer theme foreground so dials stay readable in both modes.
 */
export const HC_DIAL = "var(--foreground)"
export const HC_NEUTRAL = "var(--foreground)"

/** Soft traffic bands shared with react-gauge demos. */
export const HC_TRAFFIC = {
  green: "#6cb87a",
  gold: "#d4b45a",
  red: "#d96b5c",
} as const

export function hcNum(value: number | string, locale = "en") {
  const n = typeof value === "number" ? value : Number(value)
  if (Number.isFinite(n)) {
    return new Intl.NumberFormat(locale).format(n)
  }
  return String(value)
}

/** Tooltip value, e.g. hcTooltipValue(75, " of 100") → "75 of 100" */
export function hcTooltipValue(
  value: number | string,
  suffix = "",
  locale = "en"
) {
  return `${hcNum(value, locale)}${suffix}`
}

type ChartHighchartsGaugeProps = {
  options: Options
  height?: number
  className?: string
}

function deepMergeOptions(base: Options, extra: Options): Options {
  return Highcharts.merge(base, extra)
}

export function ChartHighchartsGauge({
  options,
  height = 280,
  className,
}: ChartHighchartsGaugeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const merged = useMemo<Options>(() => {
    const defaults: Options = {
      credits: { enabled: false },
      exporting: { enabled: false },
      accessibility: { enabled: false },
      title: { text: undefined },
      subtitle: { text: undefined },
      chart: {
        backgroundColor: "transparent",
        animation: false,
        height,
        style: { fontFamily: "inherit" },
      },
      tooltip: {
        backgroundColor: "var(--popover)",
        borderColor: "var(--border)",
        borderWidth: 1,
        borderRadius: 8,
        shadow: false,
        style: {
          color: "var(--popover-foreground)",
          fontFamily: "inherit",
        },
      },
      yAxis: {
        labels: {
          style: {
            color: "var(--foreground)",
            fontFamily: "inherit",
          },
        },
        title: {
          style: {
            color: "var(--muted-foreground)",
            fontFamily: "inherit",
          },
        },
        lineColor: "var(--border)",
        tickColor: "var(--border)",
        minorTickColor: "var(--border)",
      },
      plotOptions: {
        gauge: {
          dial: {
            backgroundColor: HC_DIAL,
            borderColor: HC_DIAL,
          },
          pivot: {
            backgroundColor: HC_DIAL,
            borderColor: HC_DIAL,
          },
          dataLabels: {
            borderWidth: 0,
            backgroundColor: "transparent",
            style: {
              color: "var(--foreground)",
              fontFamily: "inherit",
              fontWeight: "600",
              textOutline: "none",
            },
          },
        },
        solidgauge: {
          dataLabels: {
            borderWidth: 0,
            backgroundColor: "transparent",
            style: {
              color: "var(--foreground)",
              fontFamily: "inherit",
              fontWeight: "600",
              textOutline: "none",
            },
          },
        },
      },
    }

    return deepMergeOptions(defaults, {
      ...options,
      chart: {
        ...options.chart,
        backgroundColor: "transparent",
        animation: false,
        height,
        style: {
          fontFamily: "inherit",
          ...(options.chart?.style ?? {}),
        },
      },
      title: { text: undefined },
      subtitle: { text: undefined },
    })
  }, [height, options])

  if (!mounted) {
    return (
      <div
        className={cn("mx-auto w-full max-w-[420px]", className)}
        style={{ height }}
      />
    )
  }

  return (
    <div
      className={cn("mx-auto w-full max-w-[420px] font-sans", className)}
      dir="ltr"
    >
      <HighchartsReact highcharts={Highcharts} options={merged} />
    </div>
  )
}
