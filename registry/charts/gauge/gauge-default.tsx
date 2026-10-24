"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import {
  ChartGauge,
  GAUGE_NEEDLE,
  GAUGE_TRAFFIC_LABELS,
  formatGaugeMetric,
} from "../_lib/gauge-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Gauge Default — vivid emerald / amber / rose traffic bands.
 * Default library needle; light + dark band pairs.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/gauge-default.tsx
 */

export type GaugeDefaultProps = {
  title?: string
  subtitle?: string
  /** Needle position 0–1. Default 0.66 (library default). */
  percent?: number
  className?: string
}

const DEMO_PERCENT = 0.66

/** Vivid traffic — deeper on light, luminous on dark. */
const BAND_THEME = {
  light: ["#10B981", "#F59E0B", "#F43F5E"] as const,
  dark: ["#34D399", "#FBBF24", "#FB7185"] as const,
}

function useIsDark() {
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    const root = document.documentElement
    const read = () => setDark(root.classList.contains("dark"))
    read()
    const obs = new MutationObserver(read)
    obs.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  return dark
}

function GaugeDefault({
  title = "Score gauge",
  subtitle = "Vivid traffic bands — emerald / amber / rose on a fixed stage.",
  percent = DEMO_PERCENT,
  className,
}: GaugeDefaultProps) {
  const { ref } = useChartDir()
  const dark = useIsDark()
  const locale = "en"
  const metric = formatGaugeMetric(percent, locale)
  const bands = dark ? BAND_THEME.dark : BAND_THEME.light

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
          key={dark ? "dark" : "light"}
          id="gauge-default"
          colors={[...bands]}
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
              style={{ backgroundColor: bands[index] }}
              aria-hidden
            />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function GaugeDefaultDemo(props: GaugeDefaultProps) {
  return <GaugeDefault {...props} />
}

export { GaugeDefault }
