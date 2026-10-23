"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Line,
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
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import {
  CANDLE_DOWN,
  CANDLE_UP,
  formatCandleCompact,
  formatCandleDay,
  formatCandlePrice,
  generateNaturalCandles,
  runningDrawdown,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Drawdown Chart — equity line + underwater drawdown area.
 * Dual syncId panels; no neon; locked gallery chrome + metric scrubber.
 * Installs to: components/charts/drawdown-chart.tsx
 */

export type DrawdownRow = {
  time: number
  equity: number
  drawdown: number
}

export type DrawdownChartProps = {
  title?: string
  subtitle?: string
  /** Short ticker shown in the card header. */
  symbol?: string
  data?: DrawdownRow[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across days. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const SYNC_ID = "sono-drawdown"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const EQUITY_COLOR = CHART_SERIES_A
const DRAWDOWN_COLOR = CANDLE_DOWN

function buildDrawdownSeries(
  length = 48,
  seed = 8801,
  startPrice = 242
): DrawdownRow[] {
  const candles = generateNaturalCandles(length, seed, startPrice)
  const dd = runningDrawdown(candles.map((c) => c.close))
  return candles.map((c, i) => ({
    time: c.time,
    equity: c.close,
    drawdown: dd[i]!,
  }))
}

const DEMO_DATA = buildDrawdownSeries()

const chartConfig = {
  equity: {
    label: "Equity",
    color: EQUITY_COLOR,
  },
  drawdown: {
    label: "Drawdown",
    color: DRAWDOWN_COLOR,
  },
} satisfies ChartConfig

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

function formatPct(value: number, locale: string, digits = 1) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${new Intl.NumberFormat(locale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)}%`
}

function DrawdownChart({
  title = "Drawdown Chart",
  subtitle = "Equity path with drawdown from the prior peak — underwater area below zero.",
  symbol = "AENE",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: DrawdownChartProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"
  const gid = React.useId().replace(/:/g, "")

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
  const first = data[0]
  const last = data[lastIndex]
  const dayLabel = active ? formatCandleDay(active.time, locale) : ""

  const maxDd = React.useMemo(
    () => (data.length ? Math.min(...data.map((r) => r.drawdown)) : 0),
    [data]
  )
  const periodReturn =
    first && last && first.equity !== 0
      ? ((last.equity - first.equity) / first.equity) * 100
      : 0
  const returnToActive =
    first && active && first.equity !== 0
      ? ((active.equity - first.equity) / first.equity) * 100
      : 0

  const equityDomain = React.useMemo(() => {
    if (data.length === 0) return [0, 100] as [number, number]
    const vals = data.map((r) => r.equity)
    const lo = Math.min(...vals)
    const hi = Math.max(...vals)
    const pad = (hi - lo) * 0.08 || lo * 0.01
    return [
      Math.floor((lo - pad) * 100) / 100,
      Math.ceil((hi + pad) * 100) / 100,
    ] as [number, number]
  }, [data])

  const ddDomain = React.useMemo(() => {
    const floor = Math.floor(maxDd - 1)
    return [Math.min(floor, -1), 0] as [number, number]
  }, [maxDd])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${formatCandleDay(point.time, locale)}: equity ${formatCandlePrice(point.equity, locale)}, drawdown ${formatPct(point.drawdown, locale)}`
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

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    return `Drawdown chart, ${title}, ${dayLabel}, equity ${formatCandlePrice(active.equity, locale)}, drawdown ${formatPct(active.drawdown, locale)}`
  }, [active, dayLabel, locale, title])

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[760px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
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
              {formatCandlePrice(active?.equity ?? 0, locale)}
            </p>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums"
              style={{
                color: DRAWDOWN_COLOR,
                backgroundColor:
                  "color-mix(in oklab, var(--chart-down) 12%, transparent)",
              }}
            >
              {formatPct(active?.drawdown ?? 0, locale)} from peak
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {dayLabel}
            {liveScrubbing ? " · scrubbing" : ""}
            {" · "}
            return {formatPct(returnToActive, locale)}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--radius-surface)] border border-border/60 bg-background px-3.5 py-3">
            <p className="text-[11px] text-muted-foreground">
              Equity · {symbol}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {formatCandlePrice(active?.equity ?? 0, locale)}
            </p>
          </div>
          <div className="rounded-[var(--radius-surface)] border border-border/60 bg-background px-3.5 py-3">
            <p className="text-[11px] text-muted-foreground">Period return</p>
            <p
              className="mt-0.5 text-sm font-semibold"
              style={{
                color: periodReturn >= 0 ? CANDLE_UP : CANDLE_DOWN,
              }}
            >
              {formatPct(periodReturn, locale)}
            </p>
          </div>
          <div className="rounded-[var(--radius-surface)] border border-border/60 bg-background px-3.5 py-3">
            <p className="text-[11px] text-muted-foreground">Max drawdown</p>
            <p
              className="mt-0.5 text-sm font-semibold"
              style={{ color: DRAWDOWN_COLOR }}
            >
              {formatPct(maxDd, locale)}
            </p>
          </div>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div className="overflow-hidden rounded-[var(--radius-surface)] border border-border/60 bg-background">
        <div className="border-b border-border/50 px-4 py-2.5">
          <p className="text-sm font-medium">Equity &amp; drawdown</p>
          <p className="text-[11px] text-muted-foreground">
            Peak-to-trough underwater curve under the equity line
          </p>
        </div>

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
          className="touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ChartContainer
            config={chartConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[200px] max-h-[220px] max-w-none sm:h-[220px]"
            )}
          >
            <ComposedChart
              accessibilityLayer
              data={data}
              syncId={SYNC_ID}
              margin={
                narrow
                  ? {
                      top: 12,
                      right: plotRtl ? 4 : 8,
                      left: plotRtl ? 8 : 4,
                      bottom: 0,
                    }
                  : { top: 12, right: 8, left: 4, bottom: 0 }
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
                dataKey="time"
                type="category"
                reversed={plotRtl}
                hide
              />
              <YAxis
                orientation={plotRtl ? "right" : "left"}
                width={narrow ? 44 : 52}
                domain={equityDomain}
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                tickCount={3}
                tick={{
                  fontSize: 12,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  formatCandleCompact(Number(value), locale)
                }
                className="tabular-nums"
              />
              <ChartTooltip
                cursor={{
                  stroke: "var(--border)",
                  strokeOpacity: 0.8,
                }}
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | DrawdownRow
                        | undefined
                      return row
                        ? formatCandleDay(row.time, locale)
                        : ""
                    }}
                    formatter={(value, name) => {
                      if (value == null) return null
                      const isEquity = name === "equity"
                      return (
                        <div className="flex w-full items-center justify-between gap-4 tabular-nums">
                          <span
                            className="text-muted-foreground"
                            style={{
                              color: isEquity
                                ? EQUITY_COLOR
                                : DRAWDOWN_COLOR,
                            }}
                          >
                            {isEquity ? "Equity" : "Drawdown"}
                          </span>
                          <span className="font-medium text-foreground">
                            {isEquity
                              ? formatCandlePrice(Number(value), locale)
                              : formatPct(Number(value), locale)}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="equity"
                name="equity"
                stroke={EQUITY_COLOR}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                activeDot={{
                  r: 3.5,
                  fill: EQUITY_COLOR,
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </ComposedChart>
          </ChartContainer>

          <ChartContainer
            config={chartConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[140px] max-h-[160px] max-w-none border-t border-border/40 sm:h-[160px]"
            )}
          >
            <AreaChart
              accessibilityLayer
              data={data}
              syncId={SYNC_ID}
              margin={
                narrow
                  ? {
                      top: 8,
                      right: plotRtl ? 4 : 8,
                      left: plotRtl ? 8 : 4,
                      bottom: 4,
                    }
                  : { top: 8, right: 8, left: 4, bottom: 4 }
              }
              onMouseMove={scrub ? onChartMouseMove : undefined}
              onMouseLeave={scrub ? onChartMouseLeave : undefined}
            >
              <defs>
                <linearGradient
                  id={`${gid}-dd`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={DRAWDOWN_COLOR}
                    stopOpacity={0.05}
                  />
                  <stop
                    offset="100%"
                    stopColor={DRAWDOWN_COLOR}
                    stopOpacity={0.4}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="var(--border)"
                strokeOpacity={0.4}
              />
              <XAxis
                dataKey="time"
                type="category"
                reversed={plotRtl}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={40}
                tick={{
                  fontSize: 12,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  formatCandleDay(Number(value), locale)
                }
                className="tabular-nums"
              />
              <YAxis
                orientation={plotRtl ? "right" : "left"}
                width={narrow ? 40 : 48}
                domain={ddDomain}
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                tickCount={3}
                tick={{
                  fontSize: 12,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  `${Math.round(Number(value))}%`
                }
                className="tabular-nums"
              />
              <ChartTooltip
                cursor={{
                  stroke: "var(--border)",
                  strokeOpacity: 0.8,
                }}
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | DrawdownRow
                        | undefined
                      return row
                        ? formatCandleDay(row.time, locale)
                        : ""
                    }}
                    formatter={(value, name) => {
                      if (value == null) return null
                      const isEquity = name === "equity"
                      return (
                        <div className="flex w-full items-center justify-between gap-4 tabular-nums">
                          <span
                            className="text-muted-foreground"
                            style={{
                              color: isEquity
                                ? EQUITY_COLOR
                                : DRAWDOWN_COLOR,
                            }}
                          >
                            {isEquity ? "Equity" : "Drawdown"}
                          </span>
                          <span className="font-medium text-foreground">
                            {isEquity
                              ? formatCandlePrice(Number(value), locale)
                              : formatPct(Number(value), locale)}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="drawdown"
                name="drawdown"
                stroke={DRAWDOWN_COLOR}
                strokeWidth={1.5}
                fill={`url(#${gid}-dd)`}
                isAnimationActive={false}
                activeDot={{
                  r: 3.5,
                  fill: DRAWDOWN_COLOR,
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: EQUITY_COLOR }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.equity.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: DRAWDOWN_COLOR }}
            aria-hidden
          />
          <span className="text-foreground">
            {chartConfig.drawdown.label}
          </span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} {symbol}.
        </caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Equity</th>
            <th>Drawdown %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.time}>
              <td>{formatCandleDay(row.time, locale)}</td>
              <td>{row.equity}</td>
              <td>{row.drawdown}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function DrawdownChartDemo(props: DrawdownChartProps) {
  return <DrawdownChart {...props} />
}

export { DrawdownChart }
