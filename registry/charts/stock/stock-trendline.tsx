"use client"

import * as React from "react"
import {
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
  CHART_SERIES_B,
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import {
  CANDLE_DOWN,
  CANDLE_UP,
  formatCandleCompact,
  formatCandleDay,
  formatCandlePrice,
  generateNaturalCandles,
  sma,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Stock Trendline — close price + dashed SMA overlay.
 * Type-required symbol card; no neon; locked chrome + metric scrubber.
 * Installs to: components/charts/stock-trendline.tsx
 */

export type StockTrendlineRow = {
  time: number
  close: number
  sma?: number
}

export type StockTrendlineProps = {
  title?: string
  subtitle?: string
  /** Short ticker shown in the card header. */
  symbol?: string
  /** Instrument label under the ticker. */
  symbolName?: string
  data?: StockTrendlineRow[]
  /** SMA lookback in periods. Default 7. */
  smaPeriod?: number
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across points. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const DEFAULT_SMA = 7
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const PRICE_COLOR = CHART_SERIES_A
const SMA_COLOR = CHART_SERIES_B

function withSma(
  length = 40,
  seed = 314,
  startPrice = 242,
  period = DEFAULT_SMA
): StockTrendlineRow[] {
  const candles = generateNaturalCandles(length, seed, startPrice)
  const means = sma(
    candles.map((c) => c.close),
    period
  )
  return candles.map((c, i) => {
    const mean = means[i]
    return {
      time: c.time,
      close: c.close,
      sma: mean == null ? undefined : Math.round(mean * 100) / 100,
    }
  })
}

const DEMO_DATA = withSma()

const chartConfig = {
  close: {
    label: "Close",
    color: PRICE_COLOR,
  },
  sma: {
    label: `SMA ${DEFAULT_SMA}`,
    color: SMA_COLOR,
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

function StockTrendline({
  title = "Stock Trendline",
  subtitle = "Daily close with a dashed moving-average trend overlay.",
  symbol = "AENE",
  symbolName,
  data = DEMO_DATA,
  smaPeriod = DEFAULT_SMA,
  className,
  plotDir,
  scrub = true,
}: StockTrendlineProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"
  const smaLabel = `SMA ${smaPeriod}`
  const instrumentLabel = symbolName ?? `Close + ${smaLabel}`

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
  const dayLabel = active ? formatCandleDay(active.time, locale) : ""
  const periodPct =
    first && first.close !== 0
      ? ((total - first.close) / first.close) * 100
      : 0
  const periodUp = periodPct >= 0
  const vsSma =
    active?.sma != null && active.sma !== 0
      ? ((total - active.sma) / active.sma) * 100
      : null

  const { domainMin, domainMax } = React.useMemo(() => {
    const closes = data.map((d) => d.close)
    const smas = data
      .map((d) => d.sma)
      .filter((v): v is number => v != null)
    const vals = [...closes, ...smas]
    const priceMin = Math.min(...vals)
    const priceMax = Math.max(...vals)
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
      const smaText =
        point.sma != null
          ? `, ${smaLabel} ${formatCandlePrice(point.sma, locale)}`
          : ""
      liveRef.current.textContent = `${formatCandleDay(point.time, locale)}: close ${formatCandlePrice(point.close, locale)}${smaText}`
    },
    [data, locale, smaLabel]
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
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous close`
    return `Stock trendline, ${title}, ${dayLabel} close ${formatCandlePrice(total, locale)}${deltaText}`
  }, [active, dayLabel, deltaPct, deltaUp, locale, title, total])

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
            {liveScrubbing ? " · scrubbing" : " · last close"}
            {active?.sma != null ? (
              <span>
                {" · "}
                {smaLabel} {formatCandlePrice(active.sma, locale)}
                {vsSma != null ? (
                  <span
                    style={{
                      color:
                        vsSma >= 0
                          ? "var(--chart-up)"
                          : "var(--chart-down)",
                    }}
                  >
                    {" · "}
                    {vsSma >= 0 ? "+" : ""}
                    {vsSma.toFixed(2)}% vs SMA
                  </span>
                ) : null}
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
              <p className="text-sm font-semibold tracking-tight">{symbol}</p>
              <ChangeBadge value={periodPct} good={periodUp} locale={locale} />
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {instrumentLabel}
            </p>
          </div>
          <div className="text-end">
            <p className="whitespace-nowrap text-lg font-semibold tabular-nums">
              {formatCandlePrice(total, locale)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {active?.sma != null
                ? `${smaLabel} ${formatCandlePrice(active.sma, locale)}`
                : liveScrubbing
                  ? dayLabel
                  : "Last price"}
            </p>
          </div>
        </div>

        <div className="flex gap-4 px-4 pt-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-[2px]"
              style={{ background: PRICE_COLOR }}
              aria-hidden
            />
            Close
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-0.5 w-3 rounded-full"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, ${SMA_COLOR} 0 3px, transparent 3px 6px)`,
              }}
              aria-hidden
            />
            {smaLabel}
          </span>
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
              "aspect-auto h-[300px] max-h-[340px] max-w-none sm:h-[340px]"
            )}
          >
            <ComposedChart
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
                  : { top: 12, right: 8, left: 4, bottom: 4 }
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
                scale="band"
                reversed={plotRtl}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={narrow ? 48 : 40}
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
                cursor={{
                  stroke: PRICE_COLOR,
                  strokeOpacity: 0.35,
                }}
                content={
                  <ChartTooltipContent
                    className="min-w-[10rem] rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | StockTrendlineRow
                        | undefined
                      return row ? formatCandleDay(row.time, locale) : ""
                    }}
                    formatter={(value, name) => {
                      const isSma = name === "sma"
                      return (
                        <div className="flex w-full items-center justify-between gap-4 tabular-nums">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span
                              className="size-1.5 rounded-full"
                              style={{
                                background: isSma ? SMA_COLOR : PRICE_COLOR,
                              }}
                              aria-hidden
                            />
                            {isSma ? smaLabel : "Close"}
                          </span>
                          <span className="font-medium text-foreground">
                            {value == null
                              ? "—"
                              : formatCandlePrice(Number(value), locale)}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="close"
                name="close"
                stroke={PRICE_COLOR}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 3.5,
                  fill: PRICE_COLOR,
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="sma"
                name="sma"
                stroke={SMA_COLOR}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                activeDot={false}
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
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: PRICE_COLOR }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.close.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-0.5 w-3 shrink-0 rounded-full"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${SMA_COLOR} 0 3px, transparent 3px 6px)`,
            }}
            aria-hidden
          />
          <span className="text-foreground">{smaLabel}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} {symbol}.
        </caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Close</th>
            <th>{smaLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.time}>
              <td>{formatCandleDay(row.time, locale)}</td>
              <td>{row.close}</td>
              <td>{row.sma ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function StockTrendlineDemo(props: StockTrendlineProps) {
  return <StockTrendline {...props} />
}

export { StockTrendline }
