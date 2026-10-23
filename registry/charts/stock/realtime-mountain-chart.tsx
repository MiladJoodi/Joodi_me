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

import {
  CHART_SERIES_A,
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import {
  CANDLE_DOWN,
  CANDLE_UP,
  formatCandleCompact,
  formatCandlePrice,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Realtime Mountain Chart — live price area with pulsing tip.
 * Type-required play/pause + `PulsingLiveDot`; no neon; metric scrubber.
 * Installs to: components/charts/realtime-mountain-chart.tsx
 */

export type MountainPoint = {
  time: number
  price: number
}

export type RealtimeMountainChartProps = {
  title?: string
  subtitle?: string
  /** Short ticker shown in the card header. */
  symbol?: string
  /** Sliding window length. Default 48. */
  windowSize?: number
  /** Tick interval in ms. Default 1000. */
  tickMs?: number
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
const WINDOW = 48
const TICK_MS = 1000
const STEP_MS = 1000
const START_PRICE = 242

function timestampToClock(timestamp: number, locale = "en") {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(timestamp))
}

function randomWalkStep(prev: number) {
  const pct = (Math.random() - 0.48) * 0.004
  return Math.max(1, Math.round(prev * (1 + pct) * 100) / 100)
}

function seedSeries(length: number, startPrice: number, endTime: number) {
  const points: MountainPoint[] = []
  let price = startPrice
  const startTime = endTime - (length - 1) * STEP_MS
  for (let i = 0; i < length; i++) {
    if (i > 0) price = randomWalkStep(price)
    points.push({ time: startTime + i * STEP_MS, price })
  }
  return points
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

function PulsingLiveDot({
  cx,
  cy,
  index,
  lastIndex,
  color,
  pulse,
}: {
  cx?: number
  cy?: number
  index?: number
  lastIndex: number
  color: string
  pulse: boolean
}) {
  if (
    index !== lastIndex ||
    cx == null ||
    cy == null ||
    Number.isNaN(cx) ||
    Number.isNaN(cy)
  ) {
    return <g key={`mtn-dot-${index}`} />
  }

  return (
    <g key={`mtn-live-${index}`}>
      {pulse ? (
        <circle cx={cx} cy={cy} fill={color} r={5}>
          <animate
            attributeName="r"
            from="5"
            to="18"
            dur="1.1s"
            begin="0s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.7"
            to="0"
            dur="1.1s"
            begin="0s"
            repeatCount="indefinite"
          />
        </circle>
      ) : null}
      <circle
        cx={cx}
        cy={cy}
        r={3.5}
        fill={color}
        stroke="var(--background)"
        strokeWidth={1.5}
      />
    </g>
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

function RealtimeMountainChart({
  title = "Realtime Mountain",
  subtitle = "Live price area with a sliding window and pulsing tip.",
  symbol = "AENE",
  windowSize = WINDOW,
  tickMs = TICK_MS,
  startPrice = START_PRICE,
  className,
  plotDir,
  scrub = true,
  defaultRunning = true,
}: RealtimeMountainChartProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reduceMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"
  const gradientId = React.useId().replace(/:/g, "")

  const [running, setRunning] = React.useState(defaultRunning)
  const [data, setData] = React.useState<MountainPoint[]>(() =>
    seedSeries(windowSize, startPrice, Date.UTC(2026, 9, 23, 15, 30, 0))
  )

  React.useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1]
        if (!last) return prev
        const next: MountainPoint = {
          time: last.time + STEP_MS,
          price: randomWalkStep(last.price),
        }
        const nextData = [...prev, next]
        return nextData.length > windowSize
          ? nextData.slice(nextData.length - windowSize)
          : nextData
      })
    }, tickMs)
    return () => window.clearInterval(id)
  }, [running, tickMs, windowSize])

  const lastIndex = Math.max(0, data.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)

  const liveIndex = scrub && scrubbing ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const first = data[0]
  const active = data[liveIndex] ?? data[lastIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const total = active?.price ?? 0
  const prevTotal = previous?.price ?? null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const timeLabel = active ? timestampToClock(active.time, locale) : ""
  const periodPct =
    first && first.price !== 0
      ? ((total - first.price) / first.price) * 100
      : 0
  const periodUp = periodPct >= 0
  const stroke = periodUp ? CANDLE_UP : CANDLE_DOWN
  const fillColor = CHART_SERIES_A
  const tipColor = running ? stroke : fillColor

  const chartConfig = {
    price: {
      label: "Live price",
      color: fillColor,
    },
  } satisfies ChartConfig

  const { domainMin, domainMax } = React.useMemo(() => {
    const prices = data.map((d) => d.price)
    if (prices.length === 0) return { domainMin: 0, domainMax: 1 }
    const priceMin = Math.min(...prices)
    const priceMax = Math.max(...prices)
    const pad = (priceMax - priceMin) * 0.12 || priceMin * 0.01
    return {
      domainMin: Math.floor((priceMin - pad) * 100) / 100,
      domainMax: Math.ceil((priceMax + pad) * 100) / 100,
    }
  }, [data])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${timestampToClock(point.time, locale)}: ${formatCandlePrice(point.price, locale)}`
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

  const pulse = running && !reduceMotion && !liveScrubbing

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    return `Realtime mountain, ${title}, ${timeLabel} ${formatCandlePrice(total, locale)}${running ? ", live" : ", paused"}`
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
            {liveScrubbing ? " · scrubbing" : running ? " · live tip" : " · paused"}
            {" · "}
            {windowSize}-tick window
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
                    style={{ background: CANDLE_UP }}
                    aria-hidden
                  />
                  Live
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground">Paused</span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Mountain · {windowSize}-tick window
            </p>
          </div>
          <div className="text-end">
            <p className="whitespace-nowrap text-lg font-semibold tabular-nums">
              {formatCandlePrice(total, locale)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {liveScrubbing ? timeLabel : "Spot price"}
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
          className="touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ChartContainer
            config={chartConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[300px] max-h-[340px] max-w-none sm:h-[340px]"
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
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tipColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={tipColor} stopOpacity={0.02} />
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
                scale="band"
                reversed={plotRtl}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={narrow ? 48 : 36}
                tick={{
                  fontSize: 12,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  timestampToClock(Number(value), locale)
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
                  stroke: tipColor,
                  strokeOpacity: 0.35,
                }}
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | MountainPoint
                        | undefined
                      return row ? timestampToClock(row.time, locale) : ""
                    }}
                    formatter={(value) => (
                      <div className="flex items-center justify-between gap-4 tabular-nums">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium text-foreground">
                          {formatCandlePrice(Number(value), locale)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="price"
                name="price"
                stroke={tipColor}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                fillOpacity={1}
                isAnimationActive={false}
                activeDot={false}
                dot={(props: {
                  cx?: number
                  cy?: number
                  index?: number
                }) => (
                  <PulsingLiveDot
                    cx={props.cx}
                    cy={props.cy}
                    index={props.index}
                    lastIndex={lastIndex}
                    color={tipColor}
                    pulse={pulse}
                  />
                )}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: tipColor }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.price.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} {symbol}.
        </caption>
        <thead>
          <tr>
            <th>Time</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.time}>
              <td>{timestampToClock(row.time, locale)}</td>
              <td>{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function RealtimeMountainChartDemo(
  props: RealtimeMountainChartProps
) {
  return <RealtimeMountainChart {...props} />
}

export { RealtimeMountainChart }
