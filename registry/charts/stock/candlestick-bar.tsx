"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Cell,
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
  chartBarContainerClassName,
  chartDashedGridClassName,
} from "../_lib/chart-styles"
import {
  CANDLE_DOWN,
  CANDLE_UP,
  CandlestickShape,
  candleRangeKey,
  formatCandleCompact,
  formatCandlePrice,
  formatCandleTime,
  generateMockMarketData,
  type MarketCandle,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Candlestick Bar — locked gallery chrome + type-required dual panel.
 * Synced candlesticks + signed change bars + Brush window.
 * Installs to: components/charts/candlestick-bar.tsx
 */

export type CandlestickBarRow = MarketCandle & { change: number }

export type CandlestickBarProps = {
  title?: string
  subtitle?: string
  data?: CandlestickBarRow[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across candles in the brush window. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const SYNC_ID = "sono-candlestick-bar"
const DEFAULT_WINDOW = 40
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

function buildDemoData(): CandlestickBarRow[] {
  const raw = generateMockMarketData(80, 1911, 100, Date.UTC(2026, 0, 12, 9, 30))
  return raw.map((candle, i, arr) => ({
    ...candle,
    change: i === 0 ? 0 : +(candle.close - arr[i - 1]!.close).toFixed(2),
  }))
}

const DEMO_DATA = buildDemoData()

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

const changeConfig = {
  change: {
    label: "Change",
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

function CandlestickBar({
  title = "Candlestick + Change",
  subtitle = "Synced OHLC candles with signed close-to-close change bars and brush.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: CandlestickBarProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const lastIndex = Math.max(0, data.length - 1)
  const initialStart = Math.max(0, lastIndex - (DEFAULT_WINDOW - 1))
  const [brushRange, setBrushRange] = React.useState({
    startIndex: initialStart,
    endIndex: lastIndex,
  })
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({ data, lastIndex })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    const nextStart = Math.max(0, lastIndex - (DEFAULT_WINDOW - 1))
    setDataTrack({ data, lastIndex })
    setBrushRange({ startIndex: nextStart, endIndex: lastIndex })
    setActiveIndex(lastIndex)
  }

  const { startIndex, endIndex } = brushRange
  const windowLen = Math.max(1, endIndex - startIndex + 1)
  const idleIndex = endIndex
  const liveIndex = scrub ? activeIndex : idleIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[idleIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const total = active?.close ?? 0
  const change = active?.change ?? 0
  const prevClose = previous?.close ?? null
  const deltaPct =
    prevClose != null && prevClose !== 0
      ? ((total - prevClose) / prevClose) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const timeLabel = active ? formatCandleTime(active.time, locale) : ""

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${formatCandleTime(point.time, locale)}: close ${formatCandlePrice(point.close, locale)}, change ${point.change >= 0 ? "+" : ""}${point.change.toFixed(2)}`
    },
    [data, locale]
  )

  const moveActive = React.useCallback(
    (next: number, fromKeyboard = false) => {
      const clamped = Math.min(endIndex, Math.max(startIndex, next))
      setActiveIndex(clamped)
      if (fromKeyboard) announce(clamped)
    },
    [announce, endIndex, startIndex]
  )

  const indexFromClientX = React.useCallback(
    (clientX: number) => {
      const el = chartAreaRef.current
      if (!el || windowLen <= 0) return idleIndex
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return idleIndex
      let ratio = (clientX - rect.left) / rect.width
      if (plotRtl) ratio = 1 - ratio
      ratio = Math.min(1, Math.max(0, ratio))
      const local = Math.min(windowLen - 1, Math.floor(ratio * windowLen))
      return startIndex + local
    },
    [idleIndex, plotRtl, startIndex, windowLen]
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
      const local = Number(chartState.activeTooltipIndex)
      if (!Number.isFinite(local)) return
      scrubbingRef.current = true
      setScrubbing(true)
      setActiveIndex(startIndex + local)
    },
    [scrub, startIndex]
  )

  const onChartMouseLeave = React.useCallback(() => {
    if (!scrub) return
    scrubbingRef.current = false
    setScrubbing(false)
    setActiveIndex(idleIndex)
  }, [idleIndex, scrub])

  const onBrushChange = React.useCallback(
    (range: { startIndex?: number; endIndex?: number } | null) => {
      if (!range) return
      const nextStart = Math.min(
        lastIndex,
        Math.max(0, range.startIndex ?? 0)
      )
      const nextEnd = Math.min(
        lastIndex,
        Math.max(nextStart, range.endIndex ?? lastIndex)
      )
      setBrushRange({ startIndex: nextStart, endIndex: nextEnd })
      setActiveIndex((prev) => Math.min(nextEnd, Math.max(nextStart, prev)))
    },
    [lastIndex]
  )

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
      setActiveIndex(idleIndex)
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
  }, [idleIndex, indexFromClientX, scrub])

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
          moveActive(reverse ? endIndex : startIndex, true)
          break
        case "End":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(reverse ? startIndex : endIndex, true)
          break
        case "Escape":
          event.preventDefault()
          scrubbingRef.current = false
          setScrubbing(false)
          moveActive(idleIndex, true)
          break
        default:
          break
      }
    },
    [
      activeIndex,
      endIndex,
      idleIndex,
      moveActive,
      plotRtl,
      scrub,
      startIndex,
    ]
  )

  const candleShape = React.useCallback(
    (
      props: React.ComponentProps<typeof CandlestickShape>
    ) => {
      const absolute = startIndex + (props.index ?? 0)
      return (
        <CandlestickShape
          {...props}
          dimmed={liveScrubbing && absolute !== liveIndex}
        />
      )
    },
    [liveIndex, liveScrubbing, startIndex]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    return `Candlestick bar, ${title}, ${timeLabel} close ${formatCandlePrice(total, locale)}, change ${change >= 0 ? "+" : ""}${change.toFixed(2)}`
  }, [active, change, locale, timeLabel, title, total])

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
              <span
                style={{
                  color:
                    change >= 0 ? "var(--chart-up)" : "var(--chart-down)",
                }}
              >
                {" · "}
                change {change >= 0 ? "+" : ""}
                {change.toFixed(2)}
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
                setActiveIndex(idleIndex)
              }
            : undefined
        }
        className={cn(
          "flex flex-col gap-2 touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "[&_.recharts-brush-slide]:cursor-grab [&_.recharts-brush-slide]:active:cursor-grabbing",
          "[&_.recharts-brush-traveller]:cursor-ew-resize"
        )}
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
              domain={["dataMin - 1", "dataMax + 1"]}
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
                      | CandlestickBarRow
                      | undefined
                    return row ? formatCandleTime(row.time, locale) : ""
                  }}
                  formatter={(_value, _name, item) => {
                    const row = item?.payload as CandlestickBarRow | undefined
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
          </BarChart>
        </ChartContainer>

        <ChartContainer
          config={changeConfig}
          className={cn(
            chartDashedGridClassName,
            "aspect-[5/1.2] h-auto w-full max-w-none font-sans text-xs"
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
                new Intl.NumberFormat(locale, {
                  maximumFractionDigits: 1,
                }).format(value)
              }
              className="tabular-nums"
            />
            <ReferenceLine y={0} stroke="var(--border)" strokeOpacity={0.8} />
            <Bar
              name="change"
              dataKey="change"
              radius={[2, 2, 0, 0]}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.time}
                  fill={
                    entry.change >= 0
                      ? "var(--chart-up)"
                      : "var(--chart-down)"
                  }
                  fillOpacity={
                    liveScrubbing && index !== liveIndex ? 0.28 : 0.75
                  }
                />
              ))}
            </Bar>
            <Brush
              dataKey="time"
              height={22}
              stroke="var(--chart-1)"
              fill="color-mix(in oklab, var(--muted) 80%, transparent)"
              travellerWidth={8}
              startIndex={startIndex}
              endIndex={endIndex}
              onChange={onBrushChange}
              tickFormatter={(value: number) =>
                formatCandleTime(Number(value), locale)
              }
            />
            <ChartTooltip
              cursor={BAR_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as
                      | CandlestickBarRow
                      | undefined
                    return row ? formatCandleTime(row.time, locale) : ""
                  }}
                  formatter={(value) => {
                    if (value == null) return null
                    const n = Number(value)
                    return (
                      <span
                        className="font-medium tabular-nums"
                        style={{
                          color:
                            n >= 0
                              ? "var(--chart-up)"
                              : "var(--chart-down)",
                        }}
                      >
                        {n >= 0 ? "+" : ""}
                        {n.toFixed(2)}
                      </span>
                    )
                  }}
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
            className="size-2 shrink-0 rounded-sm"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">Brush range</span>
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
            <th>Change</th>
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
              <td>{row.change}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function CandlestickBarDemo(props: CandlestickBarProps) {
  return <CandlestickBar {...props} />
}

export { CandlestickBar }
