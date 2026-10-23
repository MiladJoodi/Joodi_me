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
  CANDLE_UP,
  CandlestickShape,
  candleColor,
  candleRangeKey,
  formatCandleCompact,
  formatCandlePrice,
  formatCandleTime,
  generateMockMarketData,
  isBullish,
  type MarketCandle,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Stock With Volume — dual synced panels: OHLC candles + volume strip.
 * Volume bars tinted by candle direction; locked chrome + metric scrubber.
 * Installs to: components/charts/stock-with-volume.tsx
 */

export type StockWithVolumeProps = {
  title?: string
  subtitle?: string
  data?: MarketCandle[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across bars. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const SYNC_ID = "sono-stock-volume"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const DEMO_DATA = generateMockMarketData(
  64,
  777,
  100,
  Date.UTC(2026, 0, 12, 9, 30)
)

const priceConfig = {
  candle: {
    label: "Price",
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

const volumeConfig = {
  volume: {
    label: "Volume",
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

function formatVolumeTick(value: number, locale: string) {
  if (Math.abs(value) >= 1000) {
    return `${new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(Math.round(value / 1000))}k`
  }
  return formatCandleCompact(value, locale)
}

function StockWithVolume({
  title = "Price + Volume",
  subtitle = "Synced OHLC candles with a volume strip tinted by session direction.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: StockWithVolumeProps) {
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
  const timeLabel = active ? formatCandleTime(active.time, locale) : ""
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
      liveRef.current.textContent = `${formatCandleTime(point.time, locale)}: close ${formatCandlePrice(point.close, locale)}, volume ${formatCandleCompact(point.volume, locale)}`
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
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous close`
    return `Price and volume, ${title}, ${timeLabel} close ${formatCandlePrice(total, locale)}, volume ${formatCandleCompact(active.volume, locale)}${deltaText}`
  }, [active, deltaPct, deltaUp, locale, timeLabel, title, total])

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[700px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
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
            {timeLabel}
            {active ? (
              <span>
                {" · "}
                vol {formatCandleCompact(active.volume, locale)}
                {sessionPct != null ? (
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
                setActiveIndex(lastIndex)
              }
            : undefined
        }
        className="flex flex-col gap-2 touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={priceConfig}
          className={cn(
            chartBarContainerClassName,
            "aspect-[2/1] max-h-[280px] max-w-none"
          )}
        >
          <BarChart
            accessibilityLayer
            data={data}
            syncId={SYNC_ID}
            margin={
              narrow
                ? { top: 8, right: plotRtl ? 4 : 8, left: 0, bottom: 0 }
                : { top: 8, right: 8, left: 0, bottom: 0 }
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
            <XAxis dataKey="time" scale="band" reversed={plotRtl} hide />
            <YAxis
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 44 : 52}
              domain={[domainMin, domainMax]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
                    return row ? formatCandleTime(row.time, locale) : ""
                  }}
                  formatter={(_value, _name, item) => {
                    const row = item?.payload as MarketCandle | undefined
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
                        <span className="text-[11px] text-muted-foreground">
                          Vol {formatCandleCompact(row.volume, locale)}
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
            "aspect-[5/1] h-auto w-full max-w-none font-sans text-xs"
          )}
        >
          <BarChart
            accessibilityLayer
            data={data}
            syncId={SYNC_ID}
            margin={
              narrow
                ? { top: 4, right: plotRtl ? 4 : 8, left: 0, bottom: 8 }
                : { top: 4, right: 8, left: 0, bottom: 8 }
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
              tickMargin={6}
              minTickGap={28}
              tick={{
                fontSize: 11,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: number) =>
                formatCandleTime(Number(value), locale)
              }
            />
            <YAxis
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 44 : 52}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 11,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: number) =>
                formatVolumeTick(value, locale)
              }
              className="tabular-nums"
            />
            <Bar
              name="volume"
              dataKey="volume"
              radius={[2, 2, 0, 0]}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.time}
                  fill={candleColor(entry)}
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
                    return row ? formatCandleTime(row.time, locale) : ""
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
          {title}. {subtitle}
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
              <td>{formatCandleTime(row.time, locale)}</td>
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
export default function StockWithVolumeDemo(props: StockWithVolumeProps) {
  return <StockWithVolume {...props} />
}

export { StockWithVolume }
