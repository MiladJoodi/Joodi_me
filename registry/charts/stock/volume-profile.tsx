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
  formatCandleCompact,
  formatCandlePrice,
  generateNaturalCandles,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Volume Profile — horizontal volume-by-price bins with POC highlight.
 * Locked gallery chrome + metric scrubber.
 * Installs to: components/charts/volume-profile.tsx
 */

export type VolumeProfileLevel = {
  id: string
  level: number
  volume: number
}

export type VolumeProfileProps = {
  title?: string
  subtitle?: string
  /** Short ticker shown in the card header. */
  symbol?: string
  data?: VolumeProfileLevel[]
  /** Number of price bins. Default 16. */
  bins?: number
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across levels. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const DEFAULT_BINS = 16

function buildProfile(
  bins = DEFAULT_BINS,
  seed = 5520
): VolumeProfileLevel[] {
  const candles = generateNaturalCandles(48, seed, 242)
  const priceMin = Math.min(...candles.map((c) => c.low))
  const priceMax = Math.max(...candles.map((c) => c.high))
  const step = (priceMax - priceMin) / bins || 1

  return Array.from({ length: bins }, (_, i) => {
    const low = priceMin + i * step
    const high = low + step
    const mid = (low + high) / 2
    let volume = 0
    for (const c of candles) {
      if (c.close >= low && c.close < high + (i === bins - 1 ? 1 : 0)) {
        volume += c.volume
      }
    }
    return {
      id: `lvl-${i}`,
      level: Math.round(mid * 100) / 100,
      volume,
    }
  }).reverse()
}

const DEMO_DATA = buildProfile()

const chartConfig = {
  volume: {
    label: "Volume",
    color: CANDLE_UP,
  },
  poc: {
    label: "POC",
    color: "var(--chart-up)",
  },
  other: {
    label: "Other levels",
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

function VolumeProfile({
  title = "Volume Profile",
  subtitle = "Volume traded at each price level — POC marks the highest-volume bin.",
  symbol = "AENE",
  data = DEMO_DATA,
  bins = DEFAULT_BINS,
  className,
  plotDir,
  scrub = true,
}: VolumeProfileProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const poc = React.useMemo(
    () =>
      data.reduce(
        (best, row) => (row.volume > best.volume ? row : best),
        data[0] ?? { id: "", level: 0, volume: 0 }
      ),
    [data]
  )

  const lastIndex = Math.max(0, data.length - 1)
  const pocIndex = Math.max(
    0,
    data.findIndex((row) => row.id === poc.id)
  )
  const idleIndex = pocIndex >= 0 ? pocIndex : lastIndex

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
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const total = active?.volume ?? 0
  const prevTotal = previous?.volume ?? null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const isPoc = active?.id === poc.id

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      const tag = point.id === poc.id ? ", point of control" : ""
      liveRef.current.textContent = `Price ${formatCandlePrice(point.level, locale)}: volume ${formatCandleCompact(point.volume, locale)}${tag}`
    },
    [data, locale, poc.id]
  )

  const moveActive = React.useCallback(
    (next: number, fromKeyboard = false) => {
      const clamped = Math.min(lastIndex, Math.max(0, next))
      setActiveIndex(clamped)
      if (fromKeyboard) announce(clamped)
    },
    [announce, lastIndex]
  )

  const indexFromClientY = React.useCallback(
    (clientY: number) => {
      const el = chartAreaRef.current
      if (!el || data.length === 0) return idleIndex
      const rect = el.getBoundingClientRect()
      if (rect.height <= 0) return idleIndex
      const ratio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height))
      return Math.min(lastIndex, Math.floor(ratio * data.length))
    },
    [data.length, idleIndex, lastIndex]
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
      setActiveIndex(indexFromClientY(t.clientY))
    }

    const onMove = (e: TouchEvent) => {
      if (!scrubbingRef.current) return
      const t = e.touches[0]
      if (!t) return
      e.preventDefault()
      setActiveIndex(indexFromClientY(t.clientY))
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
  }, [idleIndex, indexFromClientY, scrub])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrub) return
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(activeIndex - 1, true)
          break
        case "ArrowDown":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(activeIndex + 1, true)
          break
        case "Home":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(0, true)
          break
        case "End":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(lastIndex, true)
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
    [activeIndex, idleIndex, lastIndex, moveActive, scrub]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    return `Volume profile, ${title}, ${formatCandlePrice(active.level, locale)}, volume ${formatCandleCompact(active.volume, locale)}${isPoc ? ", point of control" : ""}`
  }, [active, isPoc, locale, title])

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
              {formatCandleCompact(total, locale)}
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
                  vs neighbor
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {active
              ? `${formatCandlePrice(active.level, locale)} · volume`
              : ""}
            {isPoc ? " · POC" : ""}
            {liveScrubbing ? " · scrubbing" : ""}
          </p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div className="overflow-hidden rounded-[var(--radius-surface)] border border-border/60 bg-background">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/50 px-4 py-2.5">
          <div>
            <p className="text-sm font-medium">
              Volume profile · {symbol}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Point of control (POC):{" "}
              {formatCandlePrice(Math.round(poc.level * 100) / 100, locale)}
            </p>
          </div>
          <div className="text-end text-[11px] text-muted-foreground">
            <p>{bins} price levels</p>
            <p>Volume at close bins</p>
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
          className="touch-pan-x outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ChartContainer
            config={chartConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[380px] max-h-[420px] max-w-none sm:h-[420px]"
            )}
          >
            <BarChart
              accessibilityLayer
              layout="vertical"
              data={data}
              margin={
                narrow
                  ? { top: 16, right: 12, left: 4, bottom: 28 }
                  : { top: 20, right: 16, left: 8, bottom: 28 }
              }
              onMouseMove={scrub ? onChartMouseMove : undefined}
              onMouseLeave={scrub ? onChartMouseLeave : undefined}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="4 4"
                stroke="var(--border)"
                strokeOpacity={0.4}
              />
              <XAxis
                type="number"
                reversed={plotRtl}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{
                  fontSize: 11,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  formatCandleCompact(value, locale)
                }
                label={{
                  value: "Volume",
                  position: "insideBottom",
                  offset: -14,
                  style: {
                    fill: AXIS_TICK_FILL,
                    fontSize: 11,
                    fontFamily: "var(--font-sans)",
                  },
                }}
                className="tabular-nums"
              />
              <YAxis
                type="category"
                dataKey="id"
                orientation={plotRtl ? "right" : "left"}
                width={narrow ? 48 : 56}
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                tick={{
                  fontSize: 11,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(id: string) => {
                  const row = data.find((r) => r.id === id)
                  return row
                    ? formatCandleCompact(row.level, locale)
                    : ""
                }}
                className="tabular-nums"
              />
              <ChartTooltip
                cursor={BAR_TOOLTIP_CURSOR}
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | VolumeProfileLevel
                        | undefined
                      return row
                        ? formatCandlePrice(row.level, locale)
                        : ""
                    }}
                    formatter={(value, _name, item) => {
                      const row = item?.payload as
                        | VolumeProfileLevel
                        | undefined
                      const atPoc = row?.id === poc.id
                      return (
                        <div className="flex flex-col gap-0.5 tabular-nums">
                          <span className="text-muted-foreground">
                            Volume{" "}
                            <span className="font-medium text-foreground">
                              {formatCandleCompact(Number(value), locale)}
                            </span>
                          </span>
                          {atPoc ? (
                            <span
                              className="font-medium"
                              style={{ color: "var(--chart-up)" }}
                            >
                              Point of control
                            </span>
                          ) : null}
                        </div>
                      )
                    }}
                  />
                }
              />
              <Bar
                name="volume"
                dataKey="volume"
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
              >
                {data.map((row, index) => (
                  <Cell
                    key={row.id}
                    fill={
                      row.id === poc.id
                        ? CANDLE_UP
                        : CANDLE_DOWN
                    }
                    fillOpacity={
                      liveScrubbing && index !== liveIndex
                        ? 0.28
                        : row.id === poc.id
                          ? 0.9
                          : 0.45
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
          <span className="text-foreground">{chartConfig.poc.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-[2px] opacity-45"
            style={{ backgroundColor: "var(--chart-down)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.other.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} {symbol}.
        </caption>
        <thead>
          <tr>
            <th>Price</th>
            <th>Volume</th>
            <th>POC</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.level}</td>
              <td>{row.volume}</td>
              <td>{row.id === poc.id ? "yes" : "no"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function VolumeProfileDemo(props: VolumeProfileProps) {
  return <VolumeProfile {...props} />
}

export { VolumeProfile }
