"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { between, random } from "../_lib/chart-mock-data"
import { chartBarContainerClassName } from "../_lib/chart-styles"
import {
  CANDLE_DOWN,
  CANDLE_UP,
  formatCandleCompact,
  formatCandlePrice,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Order Book Depth — cumulative bid/ask step areas around mid price.
 * No neon; locked gallery chrome + metric scrubber.
 * Installs to: components/charts/order-book-depth.tsx
 */

export type DepthRow = {
  price: number
  bid: number | null
  ask: number | null
}

export type OrderBookDepthProps = {
  title?: string
  subtitle?: string
  /** Short ticker shown in the card header. */
  symbol?: string
  data?: DepthRow[]
  /** Mid price for the book. */
  midPrice?: number
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across price levels. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const MID = 242
const STEP = 0.5
const LEVELS = 18

function buildDepth(
  seed = 77,
  mid = MID,
  levels = LEVELS,
  step = STEP
): DepthRow[] {
  const gen = random(seed)
  const bids: DepthRow[] = []
  const asks: DepthRow[] = []
  let bidCum = 0
  let askCum = 0

  for (let i = levels; i >= 1; i--) {
    bidCum += between(gen, 200, 1_800)
    bids.push({
      price: Math.round((mid - i * step) * 100) / 100,
      bid: bidCum,
      ask: null,
    })
  }
  for (let i = 1; i <= levels; i++) {
    askCum += between(gen, 200, 1_800)
    asks.push({
      price: Math.round((mid + i * step) * 100) / 100,
      bid: null,
      ask: askCum,
    })
  }
  return [
    ...bids,
    { price: mid, bid: bidCum, ask: askCum },
    ...asks,
  ]
}

const DEMO_DATA = buildDepth()

const chartConfig = {
  bid: {
    label: "Bids",
    color: CANDLE_UP,
  },
  ask: {
    label: "Asks",
    color: CANDLE_DOWN,
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

function OrderBookDepth({
  title = "Order Book Depth",
  subtitle = "Cumulative bid and ask size across price levels around mid.",
  symbol = "AENE",
  data = DEMO_DATA,
  midPrice = MID,
  className,
  plotDir,
  scrub = true,
}: OrderBookDepthProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"
  const gid = React.useId().replace(/:/g, "")

  const midIndex = React.useMemo(() => {
    const exact = data.findIndex((row) => row.price === midPrice)
    if (exact >= 0) return exact
    let best = 0
    let bestDist = Number.POSITIVE_INFINITY
    data.forEach((row, i) => {
      const dist = Math.abs(row.price - midPrice)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    return best
  }, [data, midPrice])

  const lastIndex = Math.max(0, data.length - 1)
  const idleIndex = midIndex

  const [activeIndex, setActiveIndex] = React.useState(idleIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({ data, idleIndex })
  if (dataTrack.data !== data || dataTrack.idleIndex !== idleIndex) {
    setDataTrack({ data, idleIndex })
    setActiveIndex(idleIndex)
  }

  const liveIndex = scrub ? activeIndex : idleIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[idleIndex]
  const depthValue = active?.bid ?? active?.ask ?? 0
  const side =
    active?.bid != null && active?.ask != null
      ? "mid"
      : active?.bid != null
        ? "bid"
        : "ask"

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      const parts: string[] = [
        `Price ${formatCandlePrice(point.price, locale)}`,
      ]
      if (point.bid != null) {
        parts.push(`bid depth ${formatCandleCompact(point.bid, locale)}`)
      }
      if (point.ask != null) {
        parts.push(`ask depth ${formatCandleCompact(point.ask, locale)}`)
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
      if (!el || data.length === 0) return idleIndex
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return idleIndex
      let ratio = (clientX - rect.left) / rect.width
      if (plotRtl) ratio = 1 - ratio
      ratio = Math.min(1, Math.max(0, ratio))
      return Math.min(lastIndex, Math.floor(ratio * data.length))
    },
    [data.length, idleIndex, lastIndex, plotRtl]
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
    setActiveIndex(idleIndex)
  }, [idleIndex, scrub])

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
          moveActive(idleIndex, true)
          break
        default:
          break
      }
    },
    [activeIndex, idleIndex, lastIndex, moveActive, plotRtl, scrub]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    return `Order book depth, ${title}, ${formatCandlePrice(active.price, locale)}`
  }, [active, locale, title])

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
              {formatCandlePrice(active?.price ?? midPrice, locale)}
            </p>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums"
              style={{
                color:
                  side === "ask"
                    ? "var(--chart-down)"
                    : side === "bid"
                      ? "var(--chart-up)"
                      : "var(--foreground)",
                backgroundColor:
                  side === "ask"
                    ? "color-mix(in oklab, var(--chart-down) 12%, transparent)"
                    : side === "bid"
                      ? "color-mix(in oklab, var(--chart-up) 12%, transparent)"
                      : "color-mix(in oklab, var(--muted) 60%, transparent)",
              }}
            >
              {side === "mid"
                ? "Mid"
                : side === "bid"
                  ? "Bid"
                  : "Ask"}
              {" · "}
              {formatCandleCompact(depthValue, locale)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {active?.bid != null ? (
              <span style={{ color: "var(--chart-up)" }}>
                Bid depth {formatCandleCompact(active.bid, locale)}
              </span>
            ) : null}
            {active?.bid != null && active?.ask != null ? " · " : null}
            {active?.ask != null ? (
              <span style={{ color: "var(--chart-down)" }}>
                Ask depth {formatCandleCompact(active.ask, locale)}
              </span>
            ) : null}
            {liveScrubbing ? " · scrubbing" : ""}
          </p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div className="overflow-hidden rounded-[var(--radius-surface)] border border-border/60 bg-background">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/50 px-4 py-2.5">
          <div>
            <p className="text-sm font-medium">
              Market depth · {symbol}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Mid {formatCandlePrice(midPrice, locale)}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-[2px]"
                style={{ background: CANDLE_UP }}
                aria-hidden
              />
              Bids
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-[2px]"
                style={{ background: CANDLE_DOWN }}
                aria-hidden
              />
              Asks
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
                  setActiveIndex(idleIndex)
                }
              : undefined
          }
          className="touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ChartContainer
            config={chartConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[340px] max-h-[380px] max-w-none sm:h-[380px]"
            )}
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={
                narrow
                  ? {
                      top: 16,
                      right: plotRtl ? 4 : 8,
                      left: plotRtl ? 8 : 4,
                      bottom: 4,
                    }
                  : { top: 16, right: 8, left: 4, bottom: 4 }
              }
              onMouseMove={scrub ? onChartMouseMove : undefined}
              onMouseLeave={scrub ? onChartMouseLeave : undefined}
            >
              <defs>
                <linearGradient id={`${gid}-bid`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={CANDLE_UP}
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="100%"
                    stopColor={CANDLE_UP}
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient id={`${gid}-ask`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={CANDLE_DOWN}
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="100%"
                    stopColor={CANDLE_DOWN}
                    stopOpacity={0.05}
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
                dataKey="price"
                type="number"
                domain={["dataMin", "dataMax"]}
                reversed={plotRtl}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={40}
                tick={{
                  fontSize: 12,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  formatCandleCompact(Number(value), locale)
                }
                className="tabular-nums"
              />
              <YAxis
                orientation={plotRtl ? "right" : "left"}
                width={narrow ? 40 : 48}
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
                cursor={{
                  stroke: "var(--border)",
                  strokeOpacity: 0.8,
                }}
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | DepthRow
                        | undefined
                      return row
                        ? formatCandlePrice(row.price, locale)
                        : ""
                    }}
                    formatter={(value, name) => {
                      if (value == null) return null
                      const isBid = name === "bid"
                      return (
                        <div className="flex w-full items-center justify-between gap-4 tabular-nums">
                          <span
                            className="text-muted-foreground"
                            style={{
                              color: isBid
                                ? "var(--chart-up)"
                                : "var(--chart-down)",
                            }}
                          >
                            {isBid ? "Bid depth" : "Ask depth"}
                          </span>
                          <span className="font-medium text-foreground">
                            {formatCandleCompact(Number(value), locale)}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Area
                type="stepAfter"
                dataKey="bid"
                name="bid"
                stroke={CANDLE_UP}
                strokeWidth={2}
                fill={`url(#${gid}-bid)`}
                connectNulls={false}
                isAnimationActive={false}
                activeDot={{
                  r: 3.5,
                  fill: CANDLE_UP,
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="stepAfter"
                dataKey="ask"
                name="ask"
                stroke={CANDLE_DOWN}
                strokeWidth={2}
                fill={`url(#${gid}-ask)`}
                connectNulls={false}
                isAnimationActive={false}
                activeDot={{
                  r: 3.5,
                  fill: CANDLE_DOWN,
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
            style={{ backgroundColor: "var(--chart-up)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.bid.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-down)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.ask.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} {symbol}.
        </caption>
        <thead>
          <tr>
            <th>Price</th>
            <th>Bid depth</th>
            <th>Ask depth</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.price}>
              <td>{row.price}</td>
              <td>{row.bid ?? ""}</td>
              <td>{row.ask ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function OrderBookDepthDemo(props: OrderBookDepthProps) {
  return <OrderBookDepth {...props} />
}

export { OrderBookDepth }
