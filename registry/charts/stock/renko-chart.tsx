"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  RenkoBrickShape,
  candleRangeKey,
  formatCandleCompact,
  formatCandlePrice,
  toRenko,
  type MarketCandle,
  type RenkoBrick,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Renko Chart — fixed brick-size price moves (not calendar time).
 * `RenkoBrickShape` + `toRenko`; locked chrome + metric scrubber.
 * Installs to: components/charts/renko-chart.tsx
 */

export type RenkoRow = RenkoBrick & { idx: number }

export type RenkoChartProps = {
  title?: string
  subtitle?: string
  /** Short ticker shown in the card header. */
  symbol?: string
  data?: RenkoRow[]
  /** Brick size in price units. Default ~1% of start. */
  brickSize?: number
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across bricks. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const START = 242
const DEFAULT_BRICK = Math.max(1, Math.round(START * 0.01 * 100) / 100)
const MAX_BRICKS = 32

function generateVolatileCloses(
  length = 64,
  seed = 4410,
  startPrice = START
) {
  const gen = random(seed)
  const closes: number[] = []
  let price = startPrice
  for (let i = 0; i < length; i++) {
    const drift = between(gen, -22, 24) / 1000
    const shock = between(gen, 0, 100) < 16 ? between(gen, -35, 38) / 1000 : 0
    price = Math.max(10, Math.round(price * (1 + drift + shock) * 100) / 100)
    closes.push(price)
  }
  return closes
}

function buildDemoBricks(brickSize: number): RenkoRow[] {
  const closes = generateVolatileCloses()
  const candles: MarketCandle[] = closes.map((close, i) => ({
    time: i,
    open: close,
    close,
    high: close,
    low: close,
    volume: 0,
  }))
  const allBricks = toRenko(candles, brickSize)
  const bricks =
    allBricks.length > MAX_BRICKS
      ? allBricks.slice(allBricks.length - MAX_BRICKS)
      : allBricks
  return bricks.map((b, i) => ({ ...b, idx: i + 1 }))
}

const DEMO_DATA = buildDemoBricks(DEFAULT_BRICK)

const chartConfig = {
  brick: {
    label: "Brick",
    color: CANDLE_UP,
  },
  up: {
    label: "Up",
    color: "var(--chart-up)",
  },
  down: {
    label: "Down",
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

function RenkoChart({
  title = "Renko Chart",
  subtitle = "Price moves by brick size — the axis is brick count, not calendar time.",
  symbol = "AENE",
  data = DEMO_DATA,
  brickSize = DEFAULT_BRICK,
  className,
  plotDir,
  scrub = true,
}: RenkoChartProps) {
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
  const brickLabel = active ? `Brick ${active.idx}` : ""
  const upCount = data.filter((b) => b.up).length
  const downCount = data.length - upCount

  const { domainMin, domainMax } = React.useMemo(() => {
    if (data.length === 0) return { domainMin: 0, domainMax: brickSize }
    const priceMin = Math.min(...data.map((c) => c.low))
    const priceMax = Math.max(...data.map((c) => c.high))
    const pad = brickSize * 1.5
    return {
      domainMin: Math.floor((priceMin - pad) * 100) / 100,
      domainMax: Math.ceil((priceMax + pad) * 100) / 100,
    }
  }, [brickSize, data])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `Brick ${point.idx}: ${point.up ? "up" : "down"} from ${formatCandlePrice(point.open, locale)} to ${formatCandlePrice(point.close, locale)}`
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

  const brickShape = React.useCallback(
    (props: React.ComponentProps<typeof RenkoBrickShape>) => (
      <RenkoBrickShape
        {...props}
        dimmed={liveScrubbing && (props.index ?? 0) !== liveIndex}
      />
    ),
    [liveIndex, liveScrubbing]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    return `Renko, ${title}, brick ${active.idx} ${active.up ? "up" : "down"} ${formatCandlePrice(total, locale)}`
  }, [active, locale, title, total])

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
            {brickLabel}
            {active ? (
              <span
                style={{
                  color: active.up ? "var(--chart-up)" : "var(--chart-down)",
                }}
              >
                {" · "}
                {active.up ? "Up" : "Down"}
                {" · "}
                {formatCandlePrice(active.open, locale)} →{" "}
                {formatCandlePrice(active.close, locale)}
              </span>
            ) : null}
            {" · "}
            brick {formatCandlePrice(brickSize, locale)}
          </p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div className="overflow-hidden rounded-[var(--radius-surface)] border border-border/60 bg-background">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/50 px-4 py-2.5">
          <div>
            <p className="text-sm font-medium">
              Renko · {symbol}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Brick size {formatCandlePrice(brickSize, locale)}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span
                className="size-2 rounded-[2px]"
                style={{ background: CANDLE_UP }}
                aria-hidden
              />
              {upCount} up
            </span>
            <span className="flex items-center gap-1">
              <span
                className="size-2 rounded-[2px]"
                style={{ background: CANDLE_DOWN }}
                aria-hidden
              />
              {downCount} down
            </span>
            <span className="text-muted-foreground">{data.length} bricks</span>
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
            config={chartConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[360px] max-h-[400px] max-w-none sm:h-[400px]"
            )}
          >
            <BarChart
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
              barCategoryGap="6%"
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
                dataKey="idx"
                scale="band"
                reversed={plotRtl}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={20}
                tick={{
                  fontSize: 12,
                  fill: AXIS_TICK_FILL,
                }}
              />
              <YAxis
                orientation={plotRtl ? "right" : "left"}
                width={narrow ? 40 : 48}
                domain={[domainMin, domainMax]}
                tickCount={5}
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
                      const row = payload?.[0]?.payload as RenkoRow | undefined
                      return row ? `Brick ${row.idx}` : ""
                    }}
                    formatter={(_value, _name, item) => {
                      const row = item?.payload as RenkoRow | undefined
                      if (!row) return null
                      return (
                        <div className="flex flex-col gap-0.5 tabular-nums">
                          <span className="text-muted-foreground">
                            From{" "}
                            <span className="font-medium text-foreground">
                              {formatCandlePrice(row.open, locale)}
                            </span>
                          </span>
                          <span className="text-muted-foreground">
                            To{" "}
                            <span className="font-medium text-foreground">
                              {formatCandlePrice(row.close, locale)}
                            </span>
                          </span>
                          <span
                            className="pt-0.5 font-medium"
                            style={{
                              color: row.up
                                ? "var(--chart-up)"
                                : "var(--chart-down)",
                            }}
                          >
                            {row.up ? "Up" : "Down"}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Bar
                name="brick"
                dataKey={candleRangeKey}
                shape={brickShape}
                isAnimationActive={false}
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
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} {symbol}.
        </caption>
        <thead>
          <tr>
            <th>Brick</th>
            <th>Open</th>
            <th>Close</th>
            <th>Direction</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.idx}>
              <td>{row.idx}</td>
              <td>{row.open}</td>
              <td>{row.close}</td>
              <td>{row.up ? "up" : "down"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function RenkoChartDemo(props: RenkoChartProps) {
  return <RenkoChart {...props} />
}

export { RenkoChart }
