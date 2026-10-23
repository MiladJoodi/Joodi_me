"use client"

import * as React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  LabelList,
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
  MARKET_DOWN,
  MARKET_UP,
  chartAreaContainerClassName,
  chartAreaGradientStops,
  chartNeonGlowProps,
  chartNeonOverflowClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"
import { useMarketNeon } from "../_lib/use-market-neon"
import { useNarrowViewport } from "../_lib/use-narrow-viewport"
import { usePrefersReducedMotion } from "../_lib/use-prefers-reduced-motion"

/**
 * Percent Area Chart — locked gallery chrome + **neon** (chart-local).
 * Three stacked monotone areas with `stackOffset="expand"` (100% share).
 * Installs to: components/charts/percent-area-chart.tsx
 */

export type PercentAreaPoint = {
  /** ISO date (YYYY-MM-DD) preferred; short labels also accepted. */
  month: string
  desktop: number
  mobile: number
  tablet: number
}

export type PercentAreaChartProps = {
  title?: string
  subtitle?: string
  data?: PercentAreaPoint[]
  className?: string
  /** First column + Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

type SeriesKey = "desktop" | "mobile" | "tablet"

const AREA_MS = 200
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const CHART_SERIES_C = "var(--chart-3)"

const DEMO_DATA: PercentAreaPoint[] = [
  { month: "2026-01-01", desktop: 300, mobile: 600, tablet: 180 },
  { month: "2026-02-01", desktop: 295, mobile: 520, tablet: 210 },
  { month: "2026-03-01", desktop: 130, mobile: 450, tablet: 160 },
  { month: "2026-04-01", desktop: 220, mobile: 680, tablet: 240 },
  { month: "2026-05-01", desktop: 145, mobile: 783, tablet: 200 },
  { month: "2026-06-01", desktop: 190, mobile: 660, tablet: 230 },
]

const SERIES_KEYS: SeriesKey[] = ["desktop", "mobile", "tablet"]

const AREA_TOOLTIP_CURSOR = {
  stroke: "color-mix(in oklab, var(--foreground) 18%, transparent)",
  strokeWidth: 1,
} as const

function rowTotal(row: PercentAreaPoint) {
  return row.desktop + row.mobile + row.tablet
}

function share(row: PercentAreaPoint, key: SeriesKey) {
  const total = rowTotal(row)
  return total > 0 ? row[key] / total : 0
}

function dominantShare(row: PercentAreaPoint): { key: SeriesKey; pct: number } {
  let best: SeriesKey = "desktop"
  let bestPct = share(row, "desktop")
  for (const key of SERIES_KEYS) {
    const pct = share(row, key)
    if (pct > bestPct) {
      best = key
      bestPct = pct
    }
  }
  return { key: best, pct: bestPct }
}

function formatPercent(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value)
}

function parseMonthDate(month: string): Date | null {
  if (/^\d{4}-\d{2}/.test(month)) {
    const iso = month.length === 7 ? `${month}-01` : month.slice(0, 10)
    const d = new Date(`${iso}T00:00:00`)
    return Number.isNaN(d.getTime()) ? null : d
  }
  return null
}

function formatAxisMonth(month: string, locale: string) {
  const d = parseMonthDate(month)
  if (!d) return month
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(d)
}

function formatFullMonthYear(month: string, locale: string) {
  const d = parseMonthDate(month)
  if (!d) return month
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(d)
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function PercentAreaChart({
  title = "Device share – H1 2026",
  subtitle = "Relative Desktop, Mobile, and Tablet sessions (always 100%).",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: PercentAreaChartProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const neon = useMarketNeon()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"
  const uid = React.useId().replace(/:/g, "")
  const gradDesktop = `pctDesktop-${uid}`
  const gradMobile = `pctMobile-${uid}`
  const gradTablet = `pctTablet-${uid}`

  const colorDesktop = neon ? MARKET_UP : CHART_SERIES_A
  const colorMobile = neon ? MARKET_DOWN : CHART_SERIES_B
  const colorTablet = CHART_SERIES_C
  const glowDesktop = neon ? chartNeonGlowProps(colorDesktop) : null
  const glowMobile = neon ? chartNeonGlowProps(colorMobile) : null
  const glowTablet = neon ? chartNeonGlowProps(colorTablet) : null
  const fillStart = neon ? 0.32 : 0.7
  const fillEnd = neon ? 0 : 0.15

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: colorDesktop,
    },
    mobile: {
      label: "Mobile",
      color: colorMobile,
    },
    tablet: {
      label: "Tablet",
      color: colorTablet,
    },
  } satisfies ChartConfig

  const SERIES_TOKEN = {
    desktop: colorDesktop,
    mobile: colorMobile,
    tablet: colorTablet,
  } as const

  const lastIndex = Math.max(0, data.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({ data, lastIndex })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data, lastIndex })
    setActiveIndex(lastIndex)
  }

  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[lastIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const activeDom = active ? dominantShare(active) : null
  const prevDom = previous ? dominantShare(previous) : null
  const metricPct = activeDom?.pct ?? 0
  const prevMetricPct = prevDom?.pct ?? null
  const deltaPct =
    prevMetricPct != null
      ? (metricPct - prevMetricPct) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const monthLabel = active
    ? formatFullMonthYear(active.month, locale)
    : ""
  const leaderLabel = activeDom
    ? chartConfig[activeDom.key].label
    : ""

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      const dom = dominantShare(point)
      liveRef.current.textContent = `${formatFullMonthYear(point.month, locale)}: ${chartConfig[dom.key].label} ${formatPercent(dom.pct, locale)}`
    },
    [data, locale]
  )

  const moveActive = React.useCallback(
    (next: number, fromKeyboard = false) => {
      const clamped = Math.min(lastIndex, Math.max(0, next))
      setActiveIndex(clamped)
      if (fromKeyboard) announce(clamped)
    },
    [announce, lastIndex]
  )

  const indexFromClientX = React.useCallback(
    (clientX: number) => {
      const el = chartAreaRef.current
      if (!el || data.length === 0) return lastIndex
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return lastIndex
      let ratio = (clientX - rect.left) / rect.width
      if (plotRtl) ratio = 1 - ratio
      ratio = Math.min(1, Math.max(0, ratio))
      return Math.min(lastIndex, Math.floor(ratio * data.length))
    },
    [data.length, lastIndex, plotRtl]
  )

  const onChartMouseMove = React.useCallback(
    (chartState: { activeTooltipIndex?: number | string | null }) => {
      if (!scrub) return
      if (
        chartState?.activeTooltipIndex === undefined ||
        chartState.activeTooltipIndex === null
      ) {
        return
      }
      const idx = Number(chartState.activeTooltipIndex)
      if (!Number.isFinite(idx)) return
      scrubbingRef.current = true
      setScrubbing(true)
      setActiveIndex(idx)
    },
    [scrub]
  )

  const onChartMouseLeave = React.useCallback(() => {
    if (!scrub) return
    scrubbingRef.current = false
    setScrubbing(false)
    setActiveIndex(lastIndex)
  }, [lastIndex, scrub])

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
      setActiveIndex(lastIndex)
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
  }, [indexFromClientX, lastIndex, scrub])

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
          moveActive(reverse ? lastIndex : 0, true)
          break
        case "End":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(reverse ? 0 : lastIndex, true)
          break
        case "Escape":
          event.preventDefault()
          scrubbingRef.current = false
          setScrubbing(false)
          moveActive(lastIndex, true)
          break
        default:
          break
      }
    },
    [activeIndex, lastIndex, moveActive, plotRtl, scrub]
  )

  const makeDot = React.useCallback(
    (colorVar: string, radius: number) =>
      function SeriesDot(props: {
        cx?: number
        cy?: number
        index?: number
      }) {
        const { cx, cy, index = 0 } = props
        if (cx == null || cy == null) return null
        const dimmed = liveScrubbing && index !== liveIndex
        return (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill={colorVar}
            stroke="var(--background)"
            strokeWidth={2}
            opacity={dimmed ? 0.4 : 1}
          />
        )
      },
    [liveIndex, liveScrubbing]
  )

  const desktopDot = React.useMemo(
    () => makeDot("var(--color-desktop)", 3),
    [makeDot]
  )
  const mobileDot = React.useMemo(
    () => makeDot("var(--color-mobile)", 3),
    [makeDot]
  )
  const tabletDot = React.useMemo(
    () => makeDot("var(--color-tablet)", 3.5),
    [makeDot]
  )

  const totalLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      index?: number
      payload?: PercentAreaPoint
    }) => {
      if (!liveScrubbing) return null
      const x = Number(props.x) || 0
      const y = Number(props.y) || 0
      const index = props.index ?? 0
      if (index !== liveIndex) return null
      const point = props.payload ?? data[index]
      if (!point) return null
      const dom = dominantShare(point)

      return (
        <text
          x={x}
          y={y - 14}
          textAnchor="middle"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {chartConfig[dom.key].label} {formatPercent(dom.pct, locale)}
        </text>
      )
    },
    [data, liveIndex, liveScrubbing, locale]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active || !activeDom) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, leader ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)} pts vs last month`
    return `Percent area chart, ${title}, ${monthLabel}, ${leaderLabel} ${formatPercent(metricPct, locale)}${deltaText}`
  }, [
    active,
    activeDom,
    deltaPct,
    deltaUp,
    leaderLabel,
    locale,
    metricPct,
    monthLabel,
    title,
  ])

  const seriesOpacity = liveScrubbing ? 0.85 : 1

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
              {formatPercent(metricPct, locale)}
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
                {Math.abs(deltaPct).toFixed(1)} pts
                <span className="font-normal text-muted-foreground">
                  vs last month
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {monthLabel}
            {leaderLabel ? ` · ${leaderLabel} lead` : null}
          </p>
        </div>

        {active ? (
          <div className="flex gap-2">
            {SERIES_KEYS.map((key) => {
              const pct = share(active, key)
              return (
                <div
                  key={key}
                  className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg border border-border/40 px-2.5 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span
                        className="size-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: SERIES_TOKEN[key] }}
                        aria-hidden
                      />
                      <span className="truncate">
                        {chartConfig[key].label}
                      </span>
                    </span>
                    <span className="shrink-0 text-[12px] font-semibold text-foreground tabular-nums">
                      {formatPercent(pct, locale)}
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted/50">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(pct * 100, 2)}%`,
                        backgroundColor: SERIES_TOKEN[key],
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
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
                setActiveIndex(lastIndex)
              }
            : undefined
        }
        className="touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={chartConfig}
          className={cn(
            chartAreaContainerClassName,
            "max-w-none",
            neon && chartNeonOverflowClassName
          )}
        >
          <RechartsAreaChart
            accessibilityLayer
            data={data}
            stackOffset="expand"
            margin={
              narrow
                ? {
                    top: 28,
                    right: plotRtl ? 4 : 8,
                    left: plotRtl ? 8 : 4,
                    bottom: 4,
                  }
                : { top: 32, right: 12, left: 4, bottom: 8 }
            }
            onMouseMove={scrub ? onChartMouseMove : undefined}
            onMouseLeave={scrub ? onChartMouseLeave : undefined}
          >
            <defs>
              {[
                { grad: gradDesktop, color: colorDesktop },
                { grad: gradMobile, color: colorMobile },
                { grad: gradTablet, color: colorTablet },
              ].map(({ grad, color }) => (
                <linearGradient key={grad} id={grad} x1="0" y1="0" x2="0" y2="1">
                  {chartAreaGradientStops(color, {
                    startOpacity: fillStart,
                    endOpacity: fillEnd,
                  }).map((s) => (
                    <stop
                      key={s.offset}
                      offset={s.offset}
                      stopColor={s.stopColor}
                      stopOpacity={s.stopOpacity}
                    />
                  ))}
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="var(--border)"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="month"
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={4}
              interval={0}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: string) =>
                formatAxisMonth(value, locale)
              }
            />
            <YAxis
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 36 : 44}
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: number) =>
                formatPercent(value, locale)
              }
              className="tabular-nums"
            />
            <ChartTooltip
              cursor={AREA_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  formatter={(value, name, item) => {
                    const row = item?.payload as PercentAreaPoint | undefined
                    const key = String(name) as SeriesKey
                    if (!row || !(key in row)) {
                      return (
                        <span className="font-medium tabular-nums text-foreground">
                          {formatPercent(Number(value), locale)}
                        </span>
                      )
                    }
                    const pct = share(row, key)
                    return (
                      <span className="font-medium tabular-nums text-foreground">
                        {formatPercent(pct, locale)}
                        <span className="ms-1.5 font-normal text-muted-foreground">
                          ({formatNumber(row[key], locale)})
                        </span>
                      </span>
                    )
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="desktop"
              name="desktop"
              stackId="pct"
              stroke={colorDesktop}
              strokeWidth={glowDesktop?.strokeWidth ?? 2}
              strokeOpacity={seriesOpacity}
              fill={`url(#${gradDesktop})`}
              fillOpacity={neon ? 1 : seriesOpacity}
              dot={desktopDot}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "var(--background)",
                fill: colorDesktop,
              }}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : AREA_MS}
              animationEasing="ease-out"
              style={glowDesktop?.style}

              className={glowDesktop?.className}
            />
            <Area
              type="monotone"
              dataKey="mobile"
              name="mobile"
              stackId="pct"
              stroke={colorMobile}
              strokeWidth={glowMobile?.strokeWidth ?? 2}
              strokeOpacity={seriesOpacity}
              fill={`url(#${gradMobile})`}
              fillOpacity={neon ? 1 : seriesOpacity}
              dot={mobileDot}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "var(--background)",
                fill: colorMobile,
              }}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : AREA_MS}
              animationEasing="ease-out"
              style={glowMobile?.style}

              className={glowMobile?.className}
            />
            <Area
              type="monotone"
              dataKey="tablet"
              name="tablet"
              stackId="pct"
              stroke={colorTablet}
              strokeWidth={glowTablet?.strokeWidth ?? 2.25}
              strokeOpacity={seriesOpacity}
              fill={`url(#${gradTablet})`}
              fillOpacity={neon ? 1 : seriesOpacity}
              dot={tabletDot}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: "var(--background)",
                fill: colorTablet,
              }}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : AREA_MS}
              animationEasing="ease-out"
              style={glowTablet?.style}

              className={glowTablet?.className}
            >
              {scrub ? (
                <LabelList dataKey="tablet" content={totalLabel} />
              ) : null}
            </Area>
          </RechartsAreaChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {SERIES_KEYS.map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: SERIES_TOKEN[key] }}
              aria-hidden
            />
            <span className="text-foreground">{chartConfig[key].label}</span>
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Desktop</th>
            <th>Mobile</th>
            <th>Tablet</th>
            <th>Desktop %</th>
            <th>Mobile %</th>
            <th>Tablet %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{formatFullMonthYear(row.month, locale)}</td>
              <td>{row.desktop}</td>
              <td>{row.mobile}</td>
              <td>{row.tablet}</td>
              <td>{formatPercent(share(row, "desktop"), locale)}</td>
              <td>{formatPercent(share(row, "mobile"), locale)}</td>
              <td>{formatPercent(share(row, "tablet"), locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function PercentAreaChartDemo(props: PercentAreaChartProps) {
  return <PercentAreaChart {...props} />
}

export { PercentAreaChart }
