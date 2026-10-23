"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Multi Timeframe — same symbol on daily / weekly / monthly close lines.
 * Aggregated from one daily series; no neon; locked chrome + per-panel scrub.
 * Installs to: components/charts/multi-timeframe.tsx
 */

export type TfPoint = { time: number; close: number }

export type MultiTimeframeProps = {
  title?: string
  subtitle?: string
  /** Short ticker shown in the header. */
  symbol?: string
  /** Daily close series — weekly/monthly are derived. */
  data?: TfPoint[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub per panel. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const SERIES_C = "var(--chart-3)"

function aggregateWeekly(daily: TfPoint[]): TfPoint[] {
  const out: TfPoint[] = []
  for (let i = 0; i < daily.length; i += 5) {
    const slice = daily.slice(i, i + 5)
    const last = slice[slice.length - 1]!
    out.push({ time: last.time, close: last.close })
  }
  return out
}

function aggregateMonthly(daily: TfPoint[]): TfPoint[] {
  const out: TfPoint[] = []
  for (let i = 0; i < daily.length; i += 20) {
    const slice = daily.slice(i, i + 20)
    const last = slice[slice.length - 1]!
    out.push({ time: last.time, close: last.close })
  }
  return out
}

function toDailyCloses(
  length = 80,
  seed = 1204,
  startPrice = 242
): TfPoint[] {
  return generateNaturalCandles(length, seed, startPrice).map((c) => ({
    time: c.time,
    close: c.close,
  }))
}

const DEMO_DAILY = toDailyCloses()

const FRAME_META = [
  { id: "d", label: "Daily", color: CHART_SERIES_A },
  { id: "w", label: "Weekly", color: SERIES_C },
  { id: "m", label: "Monthly", color: CHART_SERIES_B },
] as const

type FrameId = (typeof FRAME_META)[number]["id"]

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

function FrameChart({
  frameId,
  label,
  color,
  data,
  plotRtl,
  narrow,
  scrub,
  locale,
  onFocus,
}: {
  frameId: FrameId
  label: string
  color: string
  data: TfPoint[]
  plotRtl: boolean
  narrow: boolean
  scrub: boolean
  locale: string
  onFocus: (frameId: FrameId, index: number, scrubbing: boolean) => void
}) {
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
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
  const last = data[lastIndex]
  const periodChange =
    first && last && first.close !== 0
      ? ((last.close - first.close) / first.close) * 100
      : 0
  const displayClose = active?.close ?? 0
  const dayLabel = active ? formatCandleDay(active.time, locale) : ""

  const { domainMin, domainMax } = React.useMemo(() => {
    if (data.length === 0) return { domainMin: 0, domainMax: 100 }
    const prices = data.map((d) => d.close)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const pad = (max - min) * 0.1 || min * 0.01
    return { domainMin: min - pad, domainMax: max + pad }
  }, [data])

  const chartConfig = React.useMemo(
    () =>
      ({
        close: { label: "Close", color },
      }) satisfies ChartConfig,
    [color]
  )

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${label}, ${formatCandleDay(point.time, locale)}: ${formatCandlePrice(point.close, locale)}`
    },
    [data, label, locale]
  )

  const moveActive = React.useCallback(
    (next: number, fromKeyboard = false) => {
      const clamped = Math.min(lastIndex, Math.max(0, next))
      setActiveIndex(clamped)
      onFocus(frameId, clamped, true)
      if (fromKeyboard) announce(clamped)
    },
    [announce, frameId, lastIndex, onFocus]
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
      onFocus(frameId, idx, true)
    },
    [frameId, onFocus, scrub]
  )

  const onChartMouseLeave = React.useCallback(() => {
    if (!scrub) return
    scrubbingRef.current = false
    setScrubbing(false)
    setActiveIndex(lastIndex)
    onFocus(frameId, lastIndex, false)
  }, [frameId, lastIndex, onFocus, scrub])

  React.useEffect(() => {
    const el = chartAreaRef.current
    if (!el || !scrub) return

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      scrubbingRef.current = true
      setScrubbing(true)
      const idx = indexFromClientX(t.clientX)
      setActiveIndex(idx)
      onFocus(frameId, idx, true)
    }

    const onMove = (e: TouchEvent) => {
      if (!scrubbingRef.current) return
      const t = e.touches[0]
      if (!t) return
      e.preventDefault()
      const idx = indexFromClientX(t.clientX)
      setActiveIndex(idx)
      onFocus(frameId, idx, true)
    }

    const onEnd = () => {
      scrubbingRef.current = false
      setScrubbing(false)
      setActiveIndex(lastIndex)
      onFocus(frameId, lastIndex, false)
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
  }, [frameId, indexFromClientX, lastIndex, onFocus, scrub])

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
          onFocus(frameId, lastIndex, false)
          break
        default:
          break
      }
    },
    [activeIndex, frameId, lastIndex, moveActive, onFocus, plotRtl, scrub]
  )

  const ariaLabel = `${label} close, ${dayLabel} ${formatCandlePrice(displayClose, locale)}`

  return (
    <div className="overflow-hidden rounded-[var(--radius-surface)] border border-border/60 bg-background">
      <div className="flex items-center justify-between gap-2 border-b border-border/50 px-3.5 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: color }}
            aria-hidden
          />
          <p className="text-sm font-medium text-foreground">{label}</p>
          <ChangeBadge
            value={periodChange}
            good={periodChange >= 0}
            locale={locale}
          />
        </div>
        <div className="text-end">
          <p className="text-[12px] font-semibold tabular-nums text-foreground">
            {formatCandlePrice(displayClose, locale)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {liveScrubbing ? dayLabel : `${data.length} bars`}
          </p>
        </div>
      </div>

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
                onFocus(frameId, lastIndex, false)
              }
            : undefined
        }
        className="touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={chartConfig}
          className={cn(
            chartBarContainerClassName,
            "aspect-auto h-[160px] max-h-[180px] max-w-none sm:h-[180px]"
          )}
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={
              narrow
                ? {
                    top: 10,
                    right: plotRtl ? 4 : 6,
                    left: plotRtl ? 6 : 2,
                    bottom: 2,
                  }
                : { top: 10, right: 6, left: 2, bottom: 2 }
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
              width={narrow ? 40 : 48}
              domain={[domainMin, domainMax]}
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
            <ChartTooltip
              cursor={{
                stroke: "var(--border)",
                strokeOpacity: 0.8,
              }}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as TfPoint | undefined
                    return row ? formatCandleDay(row.time, locale) : ""
                  }}
                  formatter={(value) => (
                    <div className="flex w-full items-center justify-between gap-4 tabular-nums">
                      <span
                        className="text-muted-foreground"
                        style={{ color }}
                      >
                        Close
                      </span>
                      <span className="font-medium text-foreground">
                        {formatCandlePrice(Number(value), locale)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="close"
              name="close"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              activeDot={{
                r: 3.5,
                fill: color,
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}

function MultiTimeframe({
  title = "Multi Timeframe",
  subtitle = "Same symbol on daily, weekly, and monthly close paths — weekly and monthly roll up from daily.",
  symbol = "AENE",
  data = DEMO_DAILY,
  className,
  plotDir,
  scrub = true,
}: MultiTimeframeProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const locale = "en"

  const frames = React.useMemo(() => {
    const weekly = aggregateWeekly(data)
    const monthly = aggregateMonthly(data)
    return FRAME_META.map((meta) => ({
      ...meta,
      data:
        meta.id === "d" ? data : meta.id === "w" ? weekly : monthly,
    }))
  }, [data])

  const dailyLast = data[data.length - 1]
  const dailyFirst = data[0]
  const dailyReturn =
    dailyFirst && dailyLast && dailyFirst.close !== 0
      ? ((dailyLast.close - dailyFirst.close) / dailyFirst.close) * 100
      : 0

  const [focus, setFocus] = React.useState<{
    frameId: FrameId
    index: number
    scrubbing: boolean
  }>({ frameId: "d", index: Math.max(0, data.length - 1), scrubbing: false })

  const onFocus = React.useCallback(
    (frameId: FrameId, index: number, scrubbing: boolean) => {
      setFocus({ frameId, index, scrubbing })
    },
    []
  )

  const focusFrame = frames.find((f) => f.id === focus.frameId) ?? frames[0]!
  const focusPoint =
    focusFrame.data[focus.index] ??
    focusFrame.data[focusFrame.data.length - 1]
  const headerClose = focusPoint?.close ?? dailyLast?.close ?? 0
  const headerDay = focusPoint
    ? formatCandleDay(focusPoint.time, locale)
    : ""
  const headerFrameLabel = focusFrame.label

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
              {formatCandlePrice(headerClose, locale)}
            </p>
            <ChangeBadge
              value={dailyReturn}
              good={dailyReturn >= 0}
              locale={locale}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {symbol}
            {" · "}
            {focus.scrubbing
              ? `${headerFrameLabel} · ${headerDay}`
              : `${data.length} daily bars`}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <p className="text-sm font-medium text-foreground">
            {symbol} · multi-timeframe
          </p>
          <p className="text-[11px] text-muted-foreground">
            {data.length} day base
          </p>
        </div>

        {frames.map((f) => (
          <FrameChart
            key={f.id}
            frameId={f.id}
            label={f.label}
            color={f.color}
            data={f.data}
            plotRtl={plotRtl}
            narrow={narrow}
            scrub={scrub}
            locale={locale}
            onFocus={onFocus}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {FRAME_META.map((f) => (
          <div key={f.id} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: f.color }}
              aria-hidden
            />
            <span className="text-foreground">{f.label}</span>
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} {symbol}.
        </caption>
        <thead>
          <tr>
            <th>Timeframe</th>
            <th>Date</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody>
          {frames.flatMap((f) =>
            f.data.map((row) => (
              <tr key={`${f.id}-${row.time}`}>
                <td>{f.label}</td>
                <td>{formatCandleDay(row.time, locale)}</td>
                <td>{row.close}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function MultiTimeframeDemo(props: MultiTimeframeProps) {
  return <MultiTimeframe {...props} />
}

export { MultiTimeframe }
