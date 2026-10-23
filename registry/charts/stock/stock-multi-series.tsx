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

import { between, random } from "../_lib/chart-mock-data"
import {
  CHART_SERIES_A,
  CHART_SERIES_B,
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import {
  CANDLE_DOWN,
  CANDLE_UP,
  formatCandleDay,
  formatCandlePrice,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Stock Multi Series — indexed relative-return lines for several tickers.
 * Type-required summary cards + % chart; no neon; metric scrubber.
 * Installs to: components/charts/stock-multi-series.tsx
 */

const SERIES_META = [
  { key: "aene", label: "AENE", start: 242 },
  { key: "fold", label: "FOLD", start: 112 },
  { key: "auto", label: "AUTO", start: 41 },
] as const

type SeriesKey = (typeof SERIES_META)[number]["key"]

export type MultiRow = { time: number } & Record<SeriesKey, number>

export type StockMultiSeriesProps = {
  title?: string
  subtitle?: string
  /** Absolute price rows (not indexed). Indexed % is derived internally. */
  data?: MultiRow[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across days. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const SERIES_C = "var(--chart-3)"

const SERIES_COLORS = [CHART_SERIES_A, CHART_SERIES_B, SERIES_C] as const

function generateMultiSeries(
  length = 40,
  seed = 55,
  startTime = Date.UTC(2025, 6, 1)
): MultiRow[] {
  const gen = random(seed)
  const dayMs = 24 * 60 * 60 * 1000
  const last: Record<string, number> = Object.fromEntries(
    SERIES_META.map((s) => [s.key, s.start])
  )
  const rows: MultiRow[] = []

  for (let i = 0; i < length; i++) {
    const row = { time: startTime + i * dayMs } as MultiRow
    for (const s of SERIES_META) {
      const shock =
        between(gen, 0, 100) < 18 ? between(gen, -55, 60) / 1000 : 0
      const drift = between(gen, -38, 42) / 1000 + shock
      const next = Math.max(1, Math.round(last[s.key]! * (1 + drift) * 100) / 100)
      row[s.key] = next
      last[s.key] = next
    }
    rows.push(row)
  }
  return rows
}

const DEMO_DATA = generateMultiSeries()

function toIndexed(data: MultiRow[]): MultiRow[] {
  const first = data[0]
  if (!first) return []
  return data.map((row) => {
    const out = { time: row.time } as MultiRow
    for (const s of SERIES_META) {
      const base = first[s.key]
      out[s.key] =
        base === 0 ? 0 : ((row[s.key] - base) / base) * 100
    }
    return out
  })
}

function formatPct(value: number, locale: string, digits = 1) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${new Intl.NumberFormat(locale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)}%`
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

function StockMultiSeries({
  title = "Multi-Ticker Returns",
  subtitle = "Relative return from day one — compare symbols on different price bases.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: StockMultiSeriesProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const series = React.useMemo(
    () =>
      SERIES_META.map((s, i) => ({
        ...s,
        color: SERIES_COLORS[i]!,
      })),
    []
  )

  const chartConfig = React.useMemo(
    () =>
      Object.fromEntries(
        series.map((s) => [s.key, { label: s.label, color: s.color }])
      ) as ChartConfig,
    [series]
  )

  const chartData = React.useMemo(() => toIndexed(data), [data])

  const lastIndex = Math.max(0, data.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({ data, lastIndex })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data, lastIndex })
    setActiveIndex(lastIndex)
  }

  const liveIndex = scrub ? activeIndex : lastIndex
  const first = data[0]
  const activeAbs = data[liveIndex] ?? data[lastIndex]
  const activePct = chartData[liveIndex] ?? chartData[lastIndex]
  const prevPct = liveIndex > 0 ? chartData[liveIndex - 1] : null
  const dayLabel = activeAbs
    ? formatCandleDay(activeAbs.time, locale)
    : ""

  const avgPct = activePct
    ? SERIES_META.reduce((sum, s) => sum + activePct[s.key], 0) /
      SERIES_META.length
    : 0
  const prevAvg =
    prevPct != null
      ? SERIES_META.reduce((sum, s) => sum + prevPct[s.key], 0) /
        SERIES_META.length
      : null
  const deltaPct = prevAvg != null ? avgPct - prevAvg : null
  const deltaUp = deltaPct != null && deltaPct >= 0

  const { domainMin, domainMax } = React.useMemo(() => {
    const allPct = chartData.flatMap((row) =>
      SERIES_META.map((s) => row[s.key])
    )
    if (allPct.length === 0) return { domainMin: -5, domainMax: 5 }
    const pctMin = Math.min(...allPct, 0)
    const pctMax = Math.max(...allPct, 0)
    const pctPad = Math.max(2, (pctMax - pctMin) * 0.12)
    return {
      domainMin: Math.floor(pctMin - pctPad),
      domainMax: Math.ceil(pctMax + pctPad),
    }
  }, [chartData])

  const summaries = series.map((s) => {
    const price = activeAbs?.[s.key] ?? s.start
    const change =
      first && first[s.key] !== 0
        ? ((price - first[s.key]) / first[s.key]) * 100
        : 0
    return { ...s, price, change, up: change >= 0 }
  })

  const announce = React.useCallback(
    (index: number) => {
      const abs = data[index]
      const pct = chartData[index]
      if (!abs || !pct || !liveRef.current) return
      const parts = SERIES_META.map(
        (s) =>
          `${s.label} ${formatCandlePrice(abs[s.key], locale)} (${formatPct(pct[s.key], locale)})`
      )
      liveRef.current.textContent = `${formatCandleDay(abs.time, locale)}: ${parts.join(", ")}`
    },
    [chartData, data, locale]
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
    return `Multi-ticker returns, ${title}, ${dayLabel}, average ${formatPct(avgPct, locale)}`
  }, [avgPct, dayLabel, locale, title])

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
              {formatPct(avgPct, locale)}
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
                {Math.abs(deltaPct).toFixed(1)} pp
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
            {" · "}
            avg relative return
            {scrubbing ? " · scrubbing" : ""}
          </p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div className="grid gap-3 sm:grid-cols-3">
        {summaries.map((s) => (
          <div
            key={s.key}
            className="min-w-0 rounded-[var(--radius-surface)] border border-border/60 bg-background px-3.5 py-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-[2px]"
                  style={{ background: s.color }}
                  aria-hidden
                />
                <p className="text-[11px] font-medium">{s.label}</p>
              </div>
              <span
                className="text-[11px] font-medium"
                style={{ color: s.up ? CANDLE_UP : CANDLE_DOWN }}
              >
                {formatPct(s.change, locale)}
              </span>
            </div>
            <p className="mt-0.5 whitespace-nowrap text-[13px] font-semibold sm:text-sm">
              {formatCandlePrice(s.price, locale)}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[var(--radius-surface)] border border-border/60 bg-background">
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
          <p className="text-sm font-medium">Relative return from day one</p>
          <p className="text-[11px] text-muted-foreground">
            {data.length} days
          </p>
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
            <LineChart
              accessibilityLayer
              data={chartData}
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
                  formatCandleDay(Number(value), locale)
                }
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
                tickFormatter={(value: number) => formatPct(value, locale, 0)}
                className="tabular-nums"
              />
              <ChartTooltip
                cursor={{
                  stroke: "var(--border)",
                  strokeOpacity: 0.8,
                }}
                content={
                  <ChartTooltipContent
                    className="min-w-[11rem] rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | MultiRow
                        | undefined
                      return row ? formatCandleDay(row.time, locale) : ""
                    }}
                    formatter={(value, name, item) => {
                      const key = String(name) as SeriesKey
                      const meta = series.find((s) => s.key === key)
                      const pctRow = item?.payload as MultiRow | undefined
                      const absRow = pctRow
                        ? data.find((d) => d.time === pctRow.time)
                        : undefined
                      const abs = absRow?.[key]
                      const pct = Number(value)
                      return (
                        <div className="flex w-full items-center justify-between gap-4 tabular-nums">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span
                              className="size-1.5 rounded-full"
                              style={{ background: meta?.color }}
                              aria-hidden
                            />
                            {meta?.label ?? name}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {abs != null
                                ? formatCandlePrice(abs, locale)
                                : "—"}
                            </span>
                            <span
                              style={{
                                color:
                                  pct >= 0
                                    ? "var(--chart-up)"
                                    : "var(--chart-down)",
                              }}
                            >
                              {formatPct(pct, locale)}
                            </span>
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              {series.map((s) => (
                <Line
                  key={s.key}
                  type="linear"
                  dataKey={s.key}
                  name={s.key}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 3.5,
                    fill: s.color,
                    stroke: "var(--background)",
                    strokeWidth: 2,
                  }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {series.map((s) => (
          <div key={s.key} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
            <span className="text-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Date</th>
            {SERIES_META.map((s) => (
              <th key={s.key}>{s.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.time}>
              <td>{formatCandleDay(row.time, locale)}</td>
              {SERIES_META.map((s) => (
                <td key={s.key}>{row[s.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function StockMultiSeriesDemo(props: StockMultiSeriesProps) {
  return <StockMultiSeries {...props} />
}

export { StockMultiSeries }
