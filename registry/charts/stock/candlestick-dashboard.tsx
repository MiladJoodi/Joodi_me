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

import { chartBarContainerClassName } from "../_lib/chart-styles"
import {
  CANDLE_DOWN,
  CANDLE_UP,
  CandlestickShape,
  candleColor,
  candleRangeKey,
  formatCandleCompact,
  formatCandleDay,
  formatCandlePrice,
  generateNaturalCandles,
  type MarketCandle,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Candlestick Dashboard — locked gallery chrome + type-required symbol card.
 * KPI header (ticker / last / session change) + candles + volume strip.
 * Installs to: components/charts/candlestick-dashboard.tsx
 */

export type CandlestickDashboardRow = MarketCandle & { vol: number }

export type CandlestickDashboardProps = {
  title?: string
  subtitle?: string
  /** Short ticker shown in the card header. */
  symbol?: string
  /** Company / instrument name under the ticker. */
  symbolName?: string
  data?: CandlestickDashboardRow[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across candles. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

function withVolume(candles: MarketCandle[]): CandlestickDashboardRow[] {
  return candles.map((c) => ({ ...c, vol: c.volume }))
}

const DEMO_DATA = withVolume(generateNaturalCandles(28, 2141, 242))

const chartConfig = {
  candle: {
    label: "Close",
    color: CANDLE_UP,
  },
  vol: {
    label: "Volume",
    color: "var(--chart-1)",
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

function CandlestickDashboard({
  title = "Candlestick Dashboard",
  subtitle = "Symbol card with OHLC candles and volume strip.",
  symbol = "AENE",
  symbolName = "Acme Energy Inc.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: CandlestickDashboardProps) {
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
      : 0
  const sessionUp = sessionPct >= 0

  const { domainMin, domainMax } = React.useMemo(() => {
    const lows = data.map((c) => c.low)
    const highs = data.map((c) => c.high)
    const priceMin = Math.min(...lows)
    const priceMax = Math.max(...highs)
    const pad = (priceMax - priceMin) * 0.08 || priceMin * 0.01
    return {
      domainMin: Math.floor(priceMin - pad),
      domainMax: Math.ceil(priceMax + pad),
    }
  }, [data])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${symbol} ${formatCandleDay(point.time, locale)}: close ${formatCandlePrice(point.close, locale)}, volume ${formatCandleCompact(point.vol, locale)}`
    },
    [data, locale, symbol]
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
    (
      props: React.ComponentProps<typeof CandlestickShape>
    ) => (
      <CandlestickShape
        {...props}
        dimmed={liveScrubbing && (props.index ?? 0) !== liveIndex}
      />
    ),
    [liveIndex, liveScrubbing]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    return `Candlestick dashboard, ${symbol}, ${dayLabel} last ${formatCandlePrice(total, locale)}, session ${formatSessionPct(sessionPct, locale)}`
  }, [active, dayLabel, locale, sessionPct, symbol, title, total])

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[720px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
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
            {symbol}
            {" · "}
            {dayLabel}
            {active ? (
              <span>
                {" · "}
                vol {formatCandleCompact(active.vol, locale)}
              </span>
            ) : null}
          </p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div className="overflow-hidden rounded-[var(--radius-surface)] border border-border/60 bg-background">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/50 px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold tracking-tight text-foreground">
                {symbol}
              </p>
              <ChangeBadge
                value={sessionPct}
                good={sessionUp}
                locale={locale}
              />
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {symbolName}
            </p>
          </div>
          <div className="text-end">
            <p className="whitespace-nowrap text-lg font-semibold tabular-nums text-foreground">
              {formatCandlePrice(total, locale)}
            </p>
            <p className="text-[11px] text-muted-foreground">Last price</p>
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
          className="touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        >
          <ChartContainer
            config={chartConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[280px] max-h-[340px] max-w-none sm:h-[320px]"
            )}
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={
                narrow
                  ? {
                      top: 12,
                      right: plotRtl ? 4 : 8,
                      left: plotRtl ? 8 : 4,
                      bottom: 4,
                    }
                  : { top: 16, right: 8, left: 4, bottom: 4 }
              }
              barCategoryGap="10%"
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
                scale="band"
                reversed={plotRtl}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={narrow ? 56 : 48}
                tick={{
                  fontSize: 12,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  formatCandleDay(Number(value), locale)
                }
              />
              <YAxis
                orientation={plotRtl ? "right" : "left"}
                width={narrow ? 40 : 48}
                domain={[domainMin, domainMax]}
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
              <ChartTooltip
                cursor={BAR_TOOLTIP_CURSOR}
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | CandlestickDashboardRow
                        | undefined
                      return row ? formatCandleDay(row.time, locale) : ""
                    }}
                    formatter={(_value, _name, item) => {
                      const row = item?.payload as
                        | CandlestickDashboardRow
                        | undefined
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
                            className="text-[11px] font-medium"
                            style={{ color: candleColor(row) }}
                          >
                            {pct >= 0 ? "+" : ""}
                            {pct.toFixed(2)}% · vol{" "}
                            {formatCandleCompact(row.vol, locale)}
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
        </div>

        <div className="border-t border-border/50 px-2 pb-2 pt-1">
          <p className="mb-1 px-2 text-[10px] font-medium text-muted-foreground">
            Volume
          </p>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[52px] w-full max-w-none font-sans"
          >
            <BarChart
              data={data}
              margin={{ top: 0, right: 8, left: 4, bottom: 0 }}
              barCategoryGap="8%"
            >
              <XAxis dataKey="time" scale="band" reversed={plotRtl} hide />
              <YAxis hide domain={[0, "auto"]} />
              <Bar
                dataKey="vol"
                name="vol"
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
              >
                {data.map((row, index) => (
                  <Cell
                    key={row.time}
                    fill={candleColor(row)}
                    fillOpacity={
                      liveScrubbing && index !== liveIndex ? 0.28 : 0.55
                    }
                  />
                ))}
              </Bar>
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
          <span className="text-foreground">{chartConfig.up.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: "var(--chart-down)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.down.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-sm opacity-60"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.vol.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} {symbol} — {symbolName}.
        </caption>
        <thead>
          <tr>
            <th>Date</th>
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
              <td>{formatCandleDay(row.time, locale)}</td>
              <td>{row.open}</td>
              <td>{row.high}</td>
              <td>{row.low}</td>
              <td>{row.close}</td>
              <td>{row.vol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function CandlestickDashboardDemo(
  props: CandlestickDashboardProps
) {
  return <CandlestickDashboard {...props} />
}

export { CandlestickDashboard }
