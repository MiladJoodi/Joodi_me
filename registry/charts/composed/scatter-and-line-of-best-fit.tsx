"use client"

import * as React from "react"
import {
  CartesianGrid,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  CHART_SERIES_A,
  CHART_SERIES_B,
  chartLineContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Scatter And Line Of Best Fit — locked gallery chrome (navy × orange).
 * Ad spend → sales scatter + dashed OLS fit line; metric scrubber.
 * Installs to: components/charts/scatter-and-line-of-best-fit.tsx
 */

export type ScatterFitPoint = {
  spend: number
  sales: number
}

export type ScatterFitChartRow = {
  spend: number
  sales?: number
  fit?: number
}

export type ScatterAndLineOfBestFitProps = {
  title?: string
  subtitle?: string
  points?: ScatterFitPoint[]
  className?: string
  /** Value-axis side / X reverse. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across scatter points. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const ANIM_MS = 200
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const DEMO_POINTS: ScatterFitPoint[] = [
  { spend: 1.8, sales: 7.2 },
  { spend: 2.4, sales: 11.5 },
  { spend: 3.1, sales: 8.4 },
  { spend: 3.8, sales: 14.8 },
  { spend: 4.6, sales: 12.1 },
  { spend: 5.2, sales: 18.6 },
  { spend: 6.0, sales: 15.3 },
  { spend: 6.8, sales: 21.0 },
  { spend: 7.5, sales: 17.4 },
  { spend: 8.3, sales: 24.8 },
  { spend: 9.1, sales: 20.2 },
  { spend: 9.8, sales: 27.5 },
  { spend: 10.6, sales: 23.1 },
  { spend: 11.4, sales: 30.4 },
  { spend: 12.2, sales: 25.8 },
  { spend: 13.0, sales: 33.2 },
  { spend: 14.1, sales: 28.6 },
  { spend: 15.0, sales: 36.0 },
  { spend: 15.8, sales: 31.5 },
  { spend: 16.8, sales: 38.4 },
]

function linearFit(rows: ScatterFitPoint[]) {
  const n = rows.length
  const sumX = rows.reduce((s, r) => s + r.spend, 0)
  const sumY = rows.reduce((s, r) => s + r.sales, 0)
  const sumXY = rows.reduce((s, r) => s + r.spend * r.sales, 0)
  const sumXX = rows.reduce((s, r) => s + r.spend * r.spend, 0)
  const denom = n * sumXX - sumX * sumX
  const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom
  const intercept = (sumY - slope * sumX) / n
  return { slope, intercept }
}

const chartConfig = {
  sales: {
    label: "Actual sales",
    color: CHART_SERIES_A,
  },
  fit: {
    label: "Best fit",
    color: CHART_SERIES_B,
  },
} satisfies ChartConfig

const SCATTER_TOOLTIP_CURSOR = {
  stroke: "color-mix(in oklab, var(--foreground) 18%, transparent)",
  strokeWidth: 1,
  strokeDasharray: "4 4",
} as const

function useNarrowViewport() {
  const [narrow, setNarrow] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(NARROW_MQ)
    const onChange = () => setNarrow(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return narrow
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return reduced
}

function formatNumber(value: number, locale: string, digits = 0) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)
}

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function ScatterAndLineOfBestFit({
  title = "Ad Spend vs Sales",
  subtitle = "Scatter with ordinary least-squares fit.",
  points = DEMO_POINTS,
  className,
  plotDir,
  scrub = true,
}: ScatterAndLineOfBestFitProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const { slope, intercept } = React.useMemo(
    () => linearFit(points),
    [points]
  )

  const chartData: ScatterFitChartRow[] = React.useMemo(() => {
    const spends = points.map((p) => p.spend)
    const minSpend = Math.min(...spends, 1.2)
    const maxSpend = Math.max(...spends, 17.5)
    const pad = Math.max(0.4, (maxSpend - minSpend) * 0.04)
    const x0 = Math.max(0, minSpend - pad)
    const x1 = maxSpend + pad
    return [
      ...points.map((p) => ({ spend: p.spend, sales: p.sales })),
      { spend: x0, fit: intercept + slope * x0 },
      { spend: x1, fit: intercept + slope * x1 },
    ]
  }, [intercept, points, slope])

  const scatterLast = Math.max(0, points.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(scatterLast)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [pointsTrack, setPointsTrack] = React.useState({
    points,
    scatterLast,
  })
  if (
    pointsTrack.points !== points ||
    pointsTrack.scatterLast !== scatterLast
  ) {
    setPointsTrack({ points, scatterLast })
    setActiveIndex(scatterLast)
  }

  const liveIndex = scrub ? activeIndex : scatterLast
  const liveScrubbing = scrub && scrubbing
  const active = points[liveIndex] ?? points[scatterLast]
  const previous = liveIndex > 0 ? points[liveIndex - 1] : null
  const total = active?.sales ?? 0
  const prevTotal = previous?.sales ?? null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const expected =
    active != null ? intercept + slope * active.spend : null
  const vsFit =
    active != null && expected != null ? active.sales - expected : null
  const spendLabel =
    active != null
      ? `Spend ${formatNumber(active.spend, locale, 1)}`
      : ""

  const xDomain = React.useMemo(() => {
    const spends = chartData.map((r) => r.spend)
    return [0, Math.ceil(Math.max(...spends, 1))] as [number, number]
  }, [chartData])

  const yDomain = React.useMemo(() => {
    const vals = points.map((p) => p.sales)
    const raw = Math.max(...vals, 1)
    const step = raw <= 20 ? 5 : raw <= 40 ? 10 : 15
    return [0, Math.ceil(raw / step) * step] as [number, number]
  }, [points])

  const announce = React.useCallback(
    (index: number) => {
      const point = points[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `Spend ${formatNumber(point.spend, locale, 1)}: sales ${formatNumber(point.sales, locale, 1)}`
    },
    [locale, points]
  )

  const moveActive = React.useCallback(
    (next: number, fromKeyboard = false) => {
      const clamped = Math.min(scatterLast, Math.max(0, next))
      setActiveIndex(clamped)
      if (fromKeyboard) announce(clamped)
    },
    [announce, scatterLast]
  )

  const indexFromClientX = React.useCallback(
    (clientX: number) => {
      const el = chartAreaRef.current
      if (!el || points.length === 0) return scatterLast
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return scatterLast
      let ratio = (clientX - rect.left) / rect.width
      if (plotRtl) ratio = 1 - ratio
      ratio = Math.min(1, Math.max(0, ratio))
      const [xMin, xMax] = xDomain
      const spend = xMin + ratio * (xMax - xMin)
      let best = 0
      let bestDist = Infinity
      points.forEach((p, i) => {
        const d = Math.abs(p.spend - spend)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      return best
    },
    [plotRtl, points, scatterLast, xDomain]
  )

  const onChartMouseMove = React.useCallback(
    (chartState: {
      activeTooltipIndex?: number | string | null
      activePayload?: ReadonlyArray<{ payload?: ScatterFitChartRow }>
    }) => {
      if (!scrub) return
      const row = chartState.activePayload?.[0]?.payload
      if (row?.sales != null) {
        const idx = points.findIndex(
          (p) => p.spend === row.spend && p.sales === row.sales
        )
        if (idx >= 0) {
          scrubbingRef.current = true
          setScrubbing(true)
          setActiveIndex(idx)
          return
        }
      }
      if (
        chartState?.activeTooltipIndex === undefined ||
        chartState.activeTooltipIndex === null
      ) {
        return
      }
      const idx = Number(chartState.activeTooltipIndex)
      if (!Number.isFinite(idx) || idx < 0 || idx > scatterLast) return
      scrubbingRef.current = true
      setScrubbing(true)
      setActiveIndex(idx)
    },
    [points, scrub, scatterLast]
  )

  const onChartMouseLeave = React.useCallback(() => {
    if (!scrub) return
    scrubbingRef.current = false
    setScrubbing(false)
    setActiveIndex(scatterLast)
  }, [scatterLast, scrub])

  React.useEffect(() => {
    const el = chartAreaRef.current
    if (!el || !scrub) return

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      scrubbingRef.current = true
      setScrubbing(true)
      setActiveIndex(indexFromClientX(t.clientX))
    }

    const onMove = (e: TouchEvent) => {
      if (!scrubbingRef.current) return
      const t = e.touches[0]
      if (!t) return
      e.preventDefault()
      setActiveIndex(indexFromClientX(t.clientX))
    }

    const onEnd = () => {
      scrubbingRef.current = false
      setScrubbing(false)
      setActiveIndex(scatterLast)
    }

    el.addEventListener("touchstart", onStart, { passive: true })
    el.addEventListener("touchmove", onMove, { passive: false })
    el.addEventListener("touchend", onEnd)
    el.addEventListener("touchcancel", onEnd)
    return () => {
      el.removeEventListener("touchstart", onStart)
      el.removeEventListener("touchmove", onMove)
      el.removeEventListener("touchend", onEnd)
      el.removeEventListener("touchcancel", onEnd)
    }
  }, [indexFromClientX, scatterLast, scrub])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrub) return
      const reverse = plotRtl
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(activeIndex + (reverse ? 1 : -1), true)
          break
        case "ArrowRight":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(activeIndex + (reverse ? -1 : 1), true)
          break
        case "Home":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(reverse ? scatterLast : 0, true)
          break
        case "End":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(reverse ? 0 : scatterLast, true)
          break
        case "Escape":
          event.preventDefault()
          scrubbingRef.current = false
          setScrubbing(false)
          moveActive(scatterLast, true)
          break
        default:
          break
      }
    },
    [activeIndex, moveActive, plotRtl, scrub, scatterLast]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous`
    return `Scatter best fit, ${title}, ${spendLabel} sales ${formatNumber(total, locale, 1)}${deltaText}`
  }, [active, deltaPct, deltaUp, locale, spendLabel, title, total])

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
              {formatNumber(total, locale, 1)}
            </p>
            {deltaPct != null ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
                  deltaUp ? "text-[var(--chart-up)]" : "text-destructive"
                )}
                style={{
                  backgroundColor: deltaUp
                    ? "color-mix(in oklab, var(--chart-up) 12%, transparent)"
                    : "color-mix(in oklab, var(--destructive) 12%, transparent)",
                }}
              >
                <span aria-hidden>{deltaUp ? "▲" : "▼"}</span>
                {Math.abs(deltaPct).toFixed(1)}%
                <span className="font-normal text-muted-foreground">
                  vs previous
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {spendLabel}
            {vsFit != null ? (
              <span>
                {" · "}
                {vsFit >= 0 ? "+" : "−"}
                {formatNumber(Math.abs(vsFit), locale, 1)} vs fit
              </span>
            ) : null}
          </p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div
        ref={chartAreaRef}
        dir="ltr"
        role="img"
        aria-label={ariaLabel}
        tabIndex={scrub ? 0 : undefined}
        onKeyDown={scrub ? onKeyDown : undefined}
        onBlur={
          scrub
            ? () => {
                scrubbingRef.current = false
                setScrubbing(false)
                setActiveIndex(scatterLast)
              }
            : undefined
        }
        className="touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={chartConfig}
          className={cn(chartLineContainerClassName, "max-w-none")}
        >
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={
              narrow
                ? {
                    top: 12,
                    right: plotRtl ? 8 : 12,
                    left: plotRtl ? 12 : 8,
                    bottom: 36,
                  }
                : { top: 16, right: 16, left: 8, bottom: 40 }
            }
            onMouseMove={scrub ? onChartMouseMove : undefined}
            onMouseLeave={scrub ? onChartMouseLeave : undefined}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="var(--border)"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="spend"
              type="number"
              reversed={plotRtl}
              domain={xDomain}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: number) =>
                formatCompact(value, locale)
              }
              label={{
                value: "Ad spend ($M)",
                position: "bottom",
                offset: 16,
                style: {
                  fontSize: 11,
                  fill: "var(--muted-foreground)",
                  fontFamily: "var(--font-sans)",
                },
              }}
              className="tabular-nums"
            />
            <YAxis
              type="number"
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 36 : 44}
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: number) =>
                formatCompact(value, locale)
              }
              className="tabular-nums"
            />
            <ChartTooltip
              shared={false}
              cursor={SCATTER_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as
                      | ScatterFitChartRow
                      | undefined
                    if (!row || row.sales == null) return ""
                    return `Spend ${formatNumber(row.spend, locale, 1)}`
                  }}
                  formatter={(value, name, item) => {
                    if (value == null || String(name) !== "sales") {
                      return null
                    }
                    const row = item?.payload as
                      | ScatterFitChartRow
                      | undefined
                    const fitVal =
                      row != null
                        ? intercept + slope * row.spend
                        : null
                    const delta =
                      fitVal != null ? Number(value) - fitVal : null
                    return (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium tabular-nums text-foreground">
                          {formatNumber(Number(value), locale, 1)}
                        </span>
                        {delta != null ? (
                          <span
                            className={cn(
                              "text-[11px] tabular-nums",
                              delta >= 0
                                ? "text-[var(--chart-up)]"
                                : "text-destructive"
                            )}
                          >
                            {delta >= 0 ? "+" : "−"}
                            {formatNumber(Math.abs(delta), locale, 1)} vs
                            fit
                          </span>
                        ) : null}
                      </div>
                    )
                  }}
                />
              }
            />
            <Scatter
              dataKey="sales"
              name="sales"
              fill="var(--color-sales)"
              fillOpacity={liveScrubbing ? 0.85 : 1}
              stroke="none"
              r={liveScrubbing ? 4.5 : 5}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : ANIM_MS}
              animationEasing="ease-out"
            />
            <Line
              dataKey="fit"
              name="fit"
              type="linear"
              stroke="var(--color-fit)"
              strokeWidth={2}
              strokeDasharray="5 4"
              strokeOpacity={liveScrubbing ? 0.85 : 1}
              dot={false}
              activeDot={false}
              connectNulls
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : ANIM_MS}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.sales.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-px w-3 shrink-0 border-t-2 border-dashed"
            style={{ borderColor: "var(--chart-2)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.fit.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Ad spend</th>
            <th>Sales</th>
            <th>Fit</th>
          </tr>
        </thead>
        <tbody>
          {points.map((row) => (
            <tr key={`${row.spend}-${row.sales}`}>
              <td>{row.spend}</td>
              <td>{row.sales}</td>
              <td>{intercept + slope * row.spend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function ScatterAndLineOfBestFitDemo(
  props: ScatterAndLineOfBestFitProps
) {
  return <ScatterAndLineOfBestFit {...props} />
}

export { ScatterAndLineOfBestFit }
