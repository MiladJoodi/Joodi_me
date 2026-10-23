"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  chartBarContainerClassName,
  chartDashedGridClassName,
} from "../_lib/chart-styles"
import {
  CANDLE_DOWN,
  CANDLE_UP,
  CandlestickShape,
  candleColor,
  candleRangeKey,
  formatCandleCompact,
  formatCandlePrice,
  isBullish,
  type MarketCandle,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Realtime Candlestick — live forming candle + volume strip.
 * Ticks update the open candle; a new candle opens on an interval.
 * Type-required play/pause + sticky Y domain; no neon; metric scrubber.
 * Installs to: components/charts/realtime-candlestick.tsx
 */

export type RealtimeCandlestickProps = {
  title?: string
  subtitle?: string
  /** Short ticker shown in the card header. */
  symbol?: string
  /** Sliding candle window. Default 40. */
  windowSize?: number
  /** Tick interval in ms. Default 160. */
  tickMs?: number
  /** Candle open interval in ms. Default 3200. */
  candleMs?: number
  /** Starting price for the seeded walk. */
  startPrice?: number
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across the window. Default on. */
  scrub?: boolean
  /** Start with the live feed running. Default true. */
  defaultRunning?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const REDUCE_MQ = "(prefers-reduced-motion: reduce)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const SYNC_ID = "sono-live-candle"
const WINDOW = 40
const TICK_MS = 160
const CANDLE_MS = 3_200
const START_PRICE = 242
/** Max abs drift per tick — keeps forming candle smooth. */
const TICK_VOL = 0.00028
/** How fast momentum fades toward 0. */
const MOMENTUM_DECAY = 0.86

const BAR_TOOLTIP_CURSOR = {
  fill: "color-mix(in oklab, var(--foreground) 5%, transparent)",
} as const

function timestampToClock(timestamp: number, locale = "en") {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(timestamp))
}

function stepPrice(prev: number, momentum: number) {
  const shock = (Math.random() - 0.5) * TICK_VOL
  const nextMomentum = momentum * MOMENTUM_DECAY + shock
  const next = Math.max(1, Math.round(prev * (1 + nextMomentum) * 100) / 100)
  return { price: next, momentum: nextMomentum }
}

function openCandle(time: number, open: number): MarketCandle {
  return {
    time,
    open,
    close: open,
    high: open,
    low: open,
    volume: Math.round(400 + Math.random() * 350),
  }
}

function applyTick(
  candle: MarketCandle,
  nextClose: number,
  volumeStep: number
): MarketCandle {
  return {
    ...candle,
    close: nextClose,
    high: Math.max(candle.high, nextClose),
    low: Math.min(candle.low, nextClose),
    volume: candle.volume + volumeStep,
  }
}

function seedCandles(
  length: number,
  startPrice: number,
  endTime: number,
  candleMs: number,
  tickMs: number
) {
  const candles: MarketCandle[] = []
  let price = startPrice
  let momentum = 0
  const ticksPerCandle = Math.max(8, Math.round(candleMs / tickMs))
  const startTime = endTime - (length - 1) * candleMs

  for (let i = 0; i < length; i++) {
    const time = startTime + i * candleMs
    let candle = openCandle(time, price)
    for (let t = 0; t < ticksPerCandle; t++) {
      const stepped = stepPrice(candle.close, momentum)
      momentum = stepped.momentum
      candle = applyTick(
        candle,
        stepped.price,
        Math.round(18 + Math.random() * 42)
      )
    }
    candles.push(candle)
    price = candle.close
  }
  return candles
}

function stickyDomain(
  min: number,
  max: number,
  prev: { min: number; max: number } | null
) {
  const span = Math.max(max - min, min * 0.004)
  const pad = span * 0.2
  const targetMin = min - pad
  const targetMax = max + pad
  let nextMin = targetMin
  let nextMax = targetMax
  if (prev) {
    nextMin = Math.min(prev.min, targetMin)
    nextMax = Math.max(prev.max, targetMax)
    if (prev.min < targetMin) {
      nextMin = prev.min + (targetMin - prev.min) * 0.06
    }
    if (prev.max > targetMax) {
      nextMax = prev.max + (targetMax - prev.max) * 0.06
    }
  }
  return {
    min: Math.floor(nextMin * 100) / 100,
    max: Math.ceil(nextMax * 100) / 100,
  }
}

function formatSessionPct(value: number, locale: string) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value)}%`
}

function ChangeBadge({
  value,
  good,
  locale,
}: {
  value: number
  good: boolean
  locale: string
}) {
  return (
    <span
      className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums"
      style={{
        color: good ? CANDLE_UP : CANDLE_DOWN,
        background: good
          ? "color-mix(in oklab, var(--chart-up) 14%, transparent)"
          : "color-mix(in oklab, var(--chart-down) 14%, transparent)",
      }}
    >
      {formatSessionPct(value, locale)}
    </span>
  )
}

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
  const [reduce, setReduce] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(REDUCE_MQ)
    const onChange = () => setReduce(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return reduce
}

const priceConfig = {
  candle: { label: "Candle", color: CANDLE_UP },
  up: { label: "Bullish", color: "var(--chart-up)" },
  down: { label: "Bearish", color: "var(--chart-down)" },
} satisfies ChartConfig

const volumeConfig = {
  volume: { label: "Volume", color: CANDLE_UP },
} satisfies ChartConfig

function RealtimeCandlestick({
  title = "Realtime Candlestick",
  subtitle = "Live forming candle with a synced volume strip and sticky price scale.",
  symbol = "AENE",
  windowSize = WINDOW,
  tickMs = TICK_MS,
  candleMs = CANDLE_MS,
  startPrice = START_PRICE,
  className,
  plotDir,
  scrub = true,
  defaultRunning = true,
}: RealtimeCandlestickProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reduceMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const candleStartedAt = React.useRef(0)
  const momentumRef = React.useRef(0)
  const locale = "en"
  const [domain, setDomain] = React.useState<{
    min: number
    max: number
  } | null>(null)
  const [domainRange, setDomainRange] = React.useState<{
    min: number
    max: number
  } | null>(null)

  const [running, setRunning] = React.useState(defaultRunning)
  const [data, setData] = React.useState<MarketCandle[]>(() =>
    seedCandles(
      windowSize,
      startPrice,
      Date.UTC(2026, 9, 23, 15, 30, 0),
      candleMs,
      tickMs
    )
  )

  React.useEffect(() => {
    if (!running) return
    if (candleStartedAt.current === 0) {
      candleStartedAt.current = Date.now()
    }
    const id = window.setInterval(() => {
      const now = Date.now()
      setData((prev) => {
        const last = prev[prev.length - 1]
        if (!last) return prev

        if (now - candleStartedAt.current >= candleMs) {
          candleStartedAt.current = now
          const next = openCandle(last.time + candleMs, last.close)
          const nextData = [...prev, next]
          return nextData.length > windowSize
            ? nextData.slice(nextData.length - windowSize)
            : nextData
        }

        const stepped = stepPrice(last.close, momentumRef.current)
        momentumRef.current = stepped.momentum
        const nextData = [...prev]
        nextData[nextData.length - 1] = applyTick(
          last,
          stepped.price,
          Math.round(9 + Math.random() * 22)
        )
        return nextData
      })
    }, tickMs)
    return () => window.clearInterval(id)
  }, [candleMs, running, tickMs, windowSize])

  const lastIndex = Math.max(0, data.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)

  const liveIndex = scrub && scrubbing ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const first = data[0]
  const active = data[liveIndex] ?? data[lastIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const total = active?.close ?? 0
  const prevTotal = previous?.close ?? null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const timeLabel = active ? timestampToClock(active.time, locale) : ""
  const periodPct =
    first && first.open !== 0
      ? ((total - first.open) / first.open) * 100
      : 0
  const periodUp = periodPct >= 0
  const sessionUp = active ? isBullish(active) : true
  const sessionPct =
    active && active.open !== 0
      ? ((active.close - active.open) / active.open) * 100
      : null

  const lows = data.map((c) => c.low)
  const highs = data.map((c) => c.high)
  const priceMin = lows.length ? Math.min(...lows) : 0
  const priceMax = highs.length ? Math.max(...highs) : 1
  if (
    domainRange == null ||
    domainRange.min !== priceMin ||
    domainRange.max !== priceMax
  ) {
    setDomainRange({ min: priceMin, max: priceMax })
    setDomain((prev) => stickyDomain(priceMin, priceMax, prev))
  }
  const yDomain = domain ?? stickyDomain(priceMin, priceMax, null)

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${timestampToClock(point.time, locale)}: open ${formatCandlePrice(point.open, locale)}, close ${formatCandlePrice(point.close, locale)}, volume ${formatCandleCompact(point.volume, locale)}`
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
          scrubbingRef.current = false
          setScrubbing(false)
          moveActive(lastIndex, true)
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
    return `Realtime candlestick, ${title}, ${timeLabel} close ${formatCandlePrice(total, locale)}${running ? ", live" : ", paused"}`
  }, [active, locale, running, timeLabel, title, total])

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[760px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
        className
      )}
    >
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setRunning((v) => !v)}
            className={cn(
              "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border/60 bg-background px-2.5 text-xs font-medium text-muted-foreground outline-none transition-colors",
              "hover:bg-muted/60 hover:text-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                running && !reduceMotion && "animate-pulse"
              )}
              style={{
                background: running ? CANDLE_UP : "var(--muted-foreground)",
                opacity: running ? 1 : 0.5,
              }}
              aria-hidden
            />
            {running ? "Live" : "Paused"}
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <p
              className="text-[2rem] font-semibold leading-9 tracking-tight"
              style={{
                color: sessionUp ? "var(--chart-up)" : "var(--chart-down)",
              }}
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
            {timeLabel}
            {active ? (
              <span>
                {" · "}
                O {formatCandlePrice(active.open, locale)}
                {" · "}
                H {formatCandlePrice(active.high, locale)}
                {" · "}
                L {formatCandlePrice(active.low, locale)}
                {" · "}
                vol {formatCandleCompact(active.volume, locale)}
                {sessionPct != null ? (
                  <span
                    style={{
                      color: sessionUp
                        ? "var(--chart-up)"
                        : "var(--chart-down)",
                    }}
                  >
                    {" · "}
                    {sessionPct >= 0 ? "+" : ""}
                    {sessionPct.toFixed(2)}% session
                  </span>
                ) : null}
              </span>
            ) : null}
            {liveScrubbing
              ? " · scrubbing"
              : running
                ? " · live"
                : " · paused"}
          </p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div className="overflow-hidden rounded-[var(--radius-surface)] border border-border/60 bg-background">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/50 px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold tracking-tight">{symbol}</p>
              <ChangeBadge value={periodPct} good={periodUp} locale={locale} />
              {running ? (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      !reduceMotion && "animate-pulse"
                    )}
                    style={{
                      background: sessionUp ? CANDLE_UP : CANDLE_DOWN,
                    }}
                    aria-hidden
                  />
                  Live
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground">Paused</span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Live candles · {windowSize}-bar window
            </p>
          </div>
          <div className="text-end">
            <p
              className="whitespace-nowrap text-lg font-semibold tabular-nums"
              style={{
                color: sessionUp ? "var(--chart-up)" : "var(--chart-down)",
              }}
            >
              {formatCandlePrice(total, locale)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {active
                ? `O ${formatCandlePrice(active.open, locale)} · H ${formatCandlePrice(active.high, locale)} · L ${formatCandlePrice(active.low, locale)}`
                : "Spot"}
            </p>
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
          className="flex flex-col touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ChartContainer
            config={priceConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[260px] max-h-[300px] max-w-none sm:h-[300px]"
            )}
          >
            <BarChart
              accessibilityLayer
              data={data}
              syncId={SYNC_ID}
              margin={
                narrow
                  ? { top: 14, right: plotRtl ? 4 : 8, left: 0, bottom: 0 }
                  : { top: 14, right: 8, left: 4, bottom: 0 }
              }
              barCategoryGap="8%"
              onMouseMove={scrub ? onChartMouseMove : undefined}
              onMouseLeave={scrub ? onChartMouseLeave : undefined}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="var(--border)"
                strokeOpacity={0.4}
              />
              <XAxis dataKey="time" scale="band" reversed={plotRtl} hide />
              <YAxis
                orientation={plotRtl ? "right" : "left"}
                width={narrow ? 44 : 52}
                domain={[yDomain.min, yDomain.max]}
                tickCount={4}
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                tick={{
                  fontSize: 12,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  formatCandleCompact(value, locale)
                }
                className="tabular-nums"
              />
              <Bar
                name="candle"
                dataKey={candleRangeKey}
                shape={candleShape}
                isAnimationActive={false}
              />
              <ChartTooltip
                cursor={BAR_TOOLTIP_CURSOR}
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | MarketCandle
                        | undefined
                      return row ? timestampToClock(row.time, locale) : ""
                    }}
                    formatter={(_value, _name, item) => {
                      const row = item?.payload as MarketCandle | undefined
                      if (!row) return null
                      const pct =
                        row.open === 0
                          ? 0
                          : ((row.close - row.open) / row.open) * 100
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
                          <span
                            className="pt-0.5 font-medium"
                            style={{ color: candleColor(row) }}
                          >
                            {pct >= 0 ? "+" : ""}
                            {pct.toFixed(2)}%
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
            </BarChart>
          </ChartContainer>

          <ChartContainer
            config={volumeConfig}
            className={cn(
              chartDashedGridClassName,
              "aspect-[5/1] h-auto max-h-[88px] w-full max-w-none font-sans text-xs"
            )}
          >
            <BarChart
              accessibilityLayer
              data={data}
              syncId={SYNC_ID}
              margin={
                narrow
                  ? { top: 4, right: plotRtl ? 4 : 8, left: 0, bottom: 8 }
                  : { top: 4, right: 8, left: 4, bottom: 8 }
              }
              barCategoryGap="12%"
              onMouseMove={scrub ? onChartMouseMove : undefined}
              onMouseLeave={scrub ? onChartMouseLeave : undefined}
            >
              <XAxis
                dataKey="time"
                scale="band"
                reversed={plotRtl}
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                minTickGap={40}
                tick={{
                  fontSize: 11,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  timestampToClock(Number(value), locale)
                }
              />
              <YAxis hide domain={[0, "dataMax"]} />
              <Bar
                dataKey="volume"
                isAnimationActive={false}
                radius={[2, 2, 0, 0]}
              >
                {data.map((candle, index) => (
                  <Cell
                    key={candle.time}
                    fill={candleColor(candle)}
                    fillOpacity={
                      liveScrubbing && index !== liveIndex ? 0.28 : 0.55
                    }
                  />
                ))}
              </Bar>
              <ChartTooltip
                cursor={BAR_TOOLTIP_CURSOR}
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | MarketCandle
                        | undefined
                      return row
                        ? timestampToClock(row.time, locale)
                        : ""
                    }}
                    formatter={(value) => (
                      <div className="flex items-center justify-between gap-4 tabular-nums">
                        <span className="text-muted-foreground">Volume</span>
                        <span className="font-medium text-foreground">
                          {formatCandleCompact(Number(value), locale)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
            </BarChart>
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
          <span className="text-foreground">{priceConfig.up.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: "var(--chart-down)" }}
            aria-hidden
          />
          <span className="text-foreground">{priceConfig.down.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-[2px] opacity-55"
            style={{ backgroundColor: "var(--chart-up)" }}
            aria-hidden
          />
          <span className="text-foreground">{volumeConfig.volume.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} {symbol}.
        </caption>
        <thead>
          <tr>
            <th>Time</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.time}>
              <td>{timestampToClock(row.time, locale)}</td>
              <td>{row.open}</td>
              <td>{row.high}</td>
              <td>{row.low}</td>
              <td>{row.close}</td>
              <td>{row.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function RealtimeCandlestickDemo(
  props: RealtimeCandlestickProps
) {
  return <RealtimeCandlestick {...props} />
}

export { RealtimeCandlestick }
