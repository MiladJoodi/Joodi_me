"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
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
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import {
  CANDLE_DOWN,
  CANDLE_UP,
  CandlestickShape,
  candleRangeKey,
  formatCandleCompact,
  formatCandleDay,
  formatCandlePrice,
  generateNaturalCandles,
  isBullish,
  macd,
  rsi,
  type MarketCandle,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Candlestick Indicators — OHLC + RSI(14) + MACD(12,26,9) synced panels.
 * No neon; locked gallery chrome + metric scrubber.
 * Installs to: components/charts/candlestick-indicators.tsx
 */

export type IndicatorRow = MarketCandle & {
  rsi: number | null
  macd: number | null
  signal: number | null
  hist: number | null
}

export type CandlestickIndicatorsProps = {
  title?: string
  subtitle?: string
  /** Short ticker shown in the card header. */
  symbol?: string
  data?: IndicatorRow[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across candles. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const SYNC_ID = "sono-candle-indicators"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const RSI_COLOR = "var(--chart-3)"
const MACD_COLOR = CHART_SERIES_A
const SIGNAL_COLOR = CHART_SERIES_B

function buildIndicators(
  length = 56,
  seed = 9012,
  startPrice = 242
): IndicatorRow[] {
  const candles = generateNaturalCandles(length, seed, startPrice)
  const closes = candles.map((c) => c.close)
  const rsiVals = rsi(closes, 14)
  const { macdLine, signal, hist } = macd(closes)
  return candles.map((c, i) => ({
    ...c,
    rsi: rsiVals[i] ?? null,
    macd: macdLine[i] ?? null,
    signal: signal[i] ?? null,
    hist: hist[i] ?? null,
  }))
}

const DEMO_DATA = buildIndicators()

const candleConfig = {
  candle: {
    label: "Candle",
    color: CANDLE_UP,
  },
  up: {
    label: "Bullish",
    color: "var(--chart-up)",
  },
  down: {
    label: "Bearish",
    color: "var(--chart-down)",
  },
} satisfies ChartConfig

const rsiConfig = {
  rsi: {
    label: "RSI",
    color: RSI_COLOR,
  },
} satisfies ChartConfig

const macdConfig = {
  macd: {
    label: "MACD",
    color: MACD_COLOR,
  },
  signal: {
    label: "Signal",
    color: SIGNAL_COLOR,
  },
  hist: {
    label: "Histogram",
    color: CANDLE_UP,
  },
} satisfies ChartConfig

const BAR_TOOLTIP_CURSOR = {
  fill: "color-mix(in oklab, var(--foreground) 5%, transparent)",
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

function formatRsi(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value)
}

function formatMacd(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value)
}

function CandlestickIndicators({
  title = "Candlestick Indicators",
  subtitle = "OHLC with synced RSI(14) and MACD(12, 26, 9) panels.",
  symbol = "AENE",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: CandlestickIndicatorsProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

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
  const total = active?.close ?? 0
  const prevTotal = previous?.close ?? null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const dayLabel = active ? formatCandleDay(active.time, locale) : ""
  const sessionPct =
    active && active.open !== 0
      ? ((active.close - active.open) / active.open) * 100
      : null

  const { domainMin, domainMax } = React.useMemo(() => {
    const lows = data.map((c) => c.low)
    const highs = data.map((c) => c.high)
    const priceMin = Math.min(...lows)
    const priceMax = Math.max(...highs)
    const pad = (priceMax - priceMin) * 0.06 || priceMin * 0.01
    return {
      domainMin: Math.floor((priceMin - pad) * 100) / 100,
      domainMax: Math.ceil((priceMax + pad) * 100) / 100,
    }
  }, [data])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      const parts = [
        formatCandleDay(point.time, locale),
        `close ${formatCandlePrice(point.close, locale)}`,
      ]
      if (point.rsi != null) {
        parts.push(`RSI ${formatRsi(point.rsi, locale)}`)
      }
      if (point.macd != null) {
        parts.push(`MACD ${formatMacd(point.macd, locale)}`)
      }
      liveRef.current.textContent = parts.join(", ")
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

  const candleShape = React.useCallback(
    (props: React.ComponentProps<typeof CandlestickShape>) => (
      <CandlestickShape
        {...props}
        dimmed={liveScrubbing && (props.index ?? 0) !== liveIndex}
      />
    ),
    [liveIndex, liveScrubbing]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    return `Candlestick indicators, ${title}, ${dayLabel} close ${formatCandlePrice(total, locale)}`
  }, [active, dayLabel, locale, title, total])

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
              {formatCandlePrice(total, locale)}
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
            {dayLabel}
            {liveScrubbing ? " · scrubbing" : ""}
            {sessionPct != null && active ? (
              <span
                style={{
                  color: isBullish(active)
                    ? "var(--chart-up)"
                    : "var(--chart-down)",
                }}
              >
                {" · "}
                {sessionPct >= 0 ? "+" : ""}
                {sessionPct.toFixed(2)}% session
              </span>
            ) : null}
            {active?.rsi != null ? (
              <span>
                {" · "}
                RSI {formatRsi(active.rsi, locale)}
              </span>
            ) : null}
            {active?.macd != null ? (
              <span>
                {" · "}
                MACD {formatMacd(active.macd, locale)}
              </span>
            ) : null}
          </p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div className="overflow-hidden rounded-[var(--radius-surface)] border border-border/60 bg-background">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/50 px-4 py-2.5">
          <div>
            <p className="text-sm font-medium">
              Candles + indicators · {symbol}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Last {formatCandlePrice(total, locale)}
            </p>
          </div>
          <div className="flex gap-3 text-[11px] text-muted-foreground">
            <span>
              RSI{" "}
              <strong className="text-foreground">
                {active?.rsi != null
                  ? formatRsi(active.rsi, locale)
                  : "—"}
              </strong>
            </span>
            <span>
              MACD{" "}
              <strong className="text-foreground">
                {active?.macd != null
                  ? formatMacd(active.macd, locale)
                  : "—"}
              </strong>
            </span>
          </div>
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
            config={candleConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[200px] max-h-[240px] max-w-none sm:h-[220px]"
            )}
          >
            <BarChart
              accessibilityLayer
              data={data}
              syncId={SYNC_ID}
              barCategoryGap="1%"
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
                domain={[domainMin, domainMax]}
                tickCount={3}
                tickLine={false}
                axisLine={false}
                tickMargin={6}
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
                cursor={BAR_TOOLTIP_CURSOR}
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | IndicatorRow
                        | undefined
                      return row
                        ? formatCandleDay(row.time, locale)
                        : ""
                    }}
                    formatter={(_value, _name, item) => {
                      const row = item?.payload as IndicatorRow | undefined
                      if (!row) return null
                      return (
                        <div className="flex flex-col gap-0.5 tabular-nums">
                          <span className="font-medium text-foreground">
                            {formatCandlePrice(row.close, locale)}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            O {formatCandlePrice(row.open, locale)} · H{" "}
                            {formatCandlePrice(row.high, locale)} · L{" "}
                            {formatCandlePrice(row.low, locale)}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Bar
                name="candle"
                dataKey={candleRangeKey}
                shape={candleShape}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>

          <div className="border-t border-border/40 px-4 py-1.5">
            <p className="text-[10px] text-muted-foreground">RSI (14)</p>
          </div>
          <ChartContainer
            config={rsiConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[100px] max-h-[110px] max-w-none"
            )}
          >
            <ComposedChart
              accessibilityLayer
              data={data}
              syncId={SYNC_ID}
              margin={
                narrow
                  ? {
                      top: 4,
                      right: plotRtl ? 4 : 8,
                      left: plotRtl ? 8 : 4,
                      bottom: 0,
                    }
                  : { top: 4, right: 8, left: 4, bottom: 0 }
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
                width={narrow ? 36 : 40}
                domain={[0, 100]}
                ticks={[30, 70]}
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{
                  fontSize: 11,
                  fill: AXIS_TICK_FILL,
                }}
                className="tabular-nums"
              />
              <ReferenceLine
                y={70}
                stroke="var(--border)"
                strokeDasharray="3 3"
                strokeOpacity={0.8}
              />
              <ReferenceLine
                y={30}
                stroke="var(--border)"
                strokeDasharray="3 3"
                strokeOpacity={0.8}
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
                        | IndicatorRow
                        | undefined
                      return row
                        ? formatCandleDay(row.time, locale)
                        : ""
                    }}
                    formatter={(value) => {
                      if (value == null) return null
                      return (
                        <div className="flex w-full items-center justify-between gap-4 tabular-nums">
                          <span
                            className="text-muted-foreground"
                            style={{ color: RSI_COLOR }}
                          >
                            RSI
                          </span>
                          <span className="font-medium text-foreground">
                            {formatRsi(Number(value), locale)}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="rsi"
                name="rsi"
                stroke={RSI_COLOR}
                strokeWidth={1.5}
                dot={false}
                connectNulls
                isAnimationActive={false}
                activeDot={{
                  r: 3,
                  fill: RSI_COLOR,
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </ComposedChart>
          </ChartContainer>

          <div className="border-t border-border/40 px-4 py-1.5">
            <p className="text-[10px] text-muted-foreground">
              MACD (12, 26, 9)
            </p>
          </div>
          <ChartContainer
            config={macdConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[120px] max-h-[130px] max-w-none"
            )}
          >
            <ComposedChart
              accessibilityLayer
              data={data}
              syncId={SYNC_ID}
              margin={
                narrow
                  ? {
                      top: 4,
                      right: plotRtl ? 4 : 8,
                      left: plotRtl ? 8 : 4,
                      bottom: 4,
                    }
                  : { top: 4, right: 8, left: 4, bottom: 4 }
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
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={48}
                tick={{
                  fontSize: 11,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  formatCandleDay(Number(value), locale)
                }
                className="tabular-nums"
              />
              <YAxis
                orientation={plotRtl ? "right" : "left"}
                width={narrow ? 36 : 40}
                tickCount={3}
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{
                  fontSize: 11,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  formatCandleCompact(Number(value), locale)
                }
                className="tabular-nums"
              />
              <ReferenceLine
                y={0}
                stroke="var(--border)"
                strokeOpacity={0.8}
              />
              <ChartTooltip
                cursor={BAR_TOOLTIP_CURSOR}
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | IndicatorRow
                        | undefined
                      return row
                        ? formatCandleDay(row.time, locale)
                        : ""
                    }}
                    formatter={(value, name) => {
                      if (value == null) return null
                      if (name === "hist") {
                        const histVal = Number(value)
                        return (
                          <div className="flex w-full items-center justify-between gap-4 tabular-nums">
                            <span
                              className="text-muted-foreground"
                              style={{
                                color:
                                  histVal >= 0 ? CANDLE_UP : CANDLE_DOWN,
                              }}
                            >
                              Hist
                            </span>
                            <span className="font-medium text-foreground">
                              {formatMacd(histVal, locale)}
                            </span>
                          </div>
                        )
                      }
                      const isMacd = name === "macd"
                      return (
                        <div className="flex w-full items-center justify-between gap-4 tabular-nums">
                          <span
                            className="text-muted-foreground"
                            style={{
                              color: isMacd ? MACD_COLOR : SIGNAL_COLOR,
                            }}
                          >
                            {isMacd ? "MACD" : "Signal"}
                          </span>
                          <span className="font-medium text-foreground">
                            {formatMacd(Number(value), locale)}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Bar dataKey="hist" name="hist" isAnimationActive={false}>
                {data.map((row, index) => (
                  <Cell
                    key={row.time}
                    fill={(row.hist ?? 0) >= 0 ? CANDLE_UP : CANDLE_DOWN}
                    fillOpacity={
                      liveScrubbing && index !== liveIndex ? 0.28 : 0.7
                    }
                  />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="macd"
                name="macd"
                stroke={MACD_COLOR}
                strokeWidth={1.5}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="signal"
                name="signal"
                stroke={SIGNAL_COLOR}
                strokeWidth={1.25}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: "var(--chart-up)" }}
            aria-hidden
          />
          <span className="text-foreground">{candleConfig.up.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: "var(--chart-down)" }}
            aria-hidden
          />
          <span className="text-foreground">{candleConfig.down.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: RSI_COLOR }}
            aria-hidden
          />
          <span className="text-foreground">{rsiConfig.rsi.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: MACD_COLOR }}
            aria-hidden
          />
          <span className="text-foreground">{macdConfig.macd.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: SIGNAL_COLOR }}
            aria-hidden
          />
          <span className="text-foreground">{macdConfig.signal.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} {symbol}.
        </caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>RSI</th>
            <th>MACD</th>
            <th>Signal</th>
            <th>Hist</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.time}>
              <td>{formatCandleDay(row.time, locale)}</td>
              <td>{row.open}</td>
              <td>{row.high}</td>
              <td>{row.low}</td>
              <td>{row.close}</td>
              <td>{row.rsi ?? ""}</td>
              <td>{row.macd ?? ""}</td>
              <td>{row.signal ?? ""}</td>
              <td>{row.hist ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function CandlestickIndicatorsDemo(
  props: CandlestickIndicatorsProps
) {
  return <CandlestickIndicators {...props} />
}

export { CandlestickIndicators }
