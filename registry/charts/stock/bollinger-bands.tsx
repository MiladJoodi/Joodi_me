"use client"

import * as React from "react"
import {
  Area,
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

import { between, random } from "../_lib/chart-mock-data"
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
  sma,
  stdev,
} from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Bollinger Bands — close + SMA mid + upper/lower σ band fill.
 * Stacked transparent lower + bandTop fill; no neon; metric scrubber.
 * Installs to: components/charts/bollinger-bands.tsx
 */

export type BollingerRow = {
  time: number
  close: number
  mid: number | null
  upper: number | null
  lower: number | null
  /** Stacked band height = upper − lower (for Area stackId). */
  bandTop: number | null
}

export type BollingerBandsProps = {
  title?: string
  subtitle?: string
  /** Short ticker shown in the card header. */
  symbol?: string
  /** Instrument label under the ticker. */
  symbolName?: string
  data?: BollingerRow[]
  /** SMA / stdev lookback. Default 20. */
  period?: number
  /** Band multiplier (σ). Default 2. */
  multiplier?: number
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across days. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const DEFAULT_PERIOD = 20
const DEFAULT_MULT = 2
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const PRICE_COLOR = CHART_SERIES_A
const BAND_COLOR = CHART_SERIES_B
const MID_COLOR = "var(--chart-3)"

/**
 * Phased close series (trend / drop / rally / quiet) so bands expand and contract.
 */
function generateBbSeries(
  length = 80,
  seed = 7721,
  startPrice = 242
): { time: number; close: number }[] {
  const gen = random(seed)
  const dayMs = 24 * 60 * 60 * 1000
  const startTime = Date.UTC(2025, 8, 1)
  const points: { time: number; close: number }[] = []
  let price = startPrice

  for (let i = 0; i < length; i++) {
    const t = i / Math.max(length - 1, 1)
    let drift: number
    let noiseScale: number
    if (t < 0.18) {
      drift = 0.006
      noiseScale = 0.008
    } else if (t < 0.32) {
      drift = -0.014
      noiseScale = 0.016
    } else if (t < 0.55) {
      drift = 0.011
      noiseScale = 0.012
    } else if (t < 0.72) {
      drift = between(gen, -3, 3) / 1000
      noiseScale = 0.006
    } else {
      drift = 0.008
      noiseScale = 0.014
    }
    const noise = (between(gen, -100, 100) / 100) * noiseScale
    const shock =
      between(gen, 0, 100) > 90 ? between(gen, -35, 35) / 1000 : 0
    price = Math.max(
      40,
      Math.round(price * (1 + drift + noise + shock) * 100) / 100
    )
    points.push({ time: startTime + i * dayMs, close: price })
  }
  return points
}

function buildBollinger(
  period = DEFAULT_PERIOD,
  mult = DEFAULT_MULT
): BollingerRow[] {
  const series = generateBbSeries()
  const closes = series.map((p) => p.close)
  const mid = sma(closes, period)
  const sd = stdev(closes, period)
  return series.map((p, i) => {
    const m = mid[i]
    const s = sd[i]
    return {
      time: p.time,
      close: p.close,
      mid: m,
      upper: m != null && s != null ? m + mult * s : null,
      lower: m != null && s != null ? m - mult * s : null,
      bandTop: m != null && s != null ? mult * s * 2 : null,
    }
  })
}

const DEMO_DATA = buildBollinger()

const chartConfig = {
  close: {
    label: "Close",
    color: PRICE_COLOR,
  },
  mid: {
    label: `SMA ${DEFAULT_PERIOD}`,
    color: MID_COLOR,
  },
  upper: {
    label: "Upper",
    color: BAND_COLOR,
  },
  lower: {
    label: "Lower",
    color: BAND_COLOR,
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

function BollingerBands({
  title = "Bollinger Bands",
  subtitle = "Close with SMA mid and ±σ envelopes — band width tracks volatility.",
  symbol = "AENE",
  symbolName,
  data = DEMO_DATA,
  period = DEFAULT_PERIOD,
  multiplier = DEFAULT_MULT,
  className,
  plotDir,
  scrub = true,
}: BollingerBandsProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"
  const gid = React.useId().replace(/:/g, "")
  const midLabel = `SMA ${period}`
  const bandLabel = `±${multiplier}σ`
  const instrumentLabel =
    symbolName ?? `Bollinger · ${midLabel} ${bandLabel}`

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
  const bandWidth =
    active?.upper != null && active?.lower != null
      ? active.upper - active.lower
      : null
  const vsMid =
    active?.mid != null && active.mid !== 0
      ? ((total - active.mid) / active.mid) * 100
      : null

  const { domainMin, domainMax } = React.useMemo(() => {
    const priced = data.filter((d) => d.upper != null && d.lower != null)
    if (priced.length === 0) {
      const closes = data.map((d) => d.close)
      const lo = Math.min(...closes)
      const hi = Math.max(...closes)
      const pad = (hi - lo) * 0.08 || lo * 0.01
      return {
        domainMin: Math.floor(lo - pad),
        domainMax: Math.ceil(hi + pad),
      }
    }
    const priceMin = Math.min(...priced.map((d) => d.lower!))
    const priceMax = Math.max(...priced.map((d) => d.upper!))
    const pad = (priceMax - priceMin) * 0.06
    return {
      domainMin: Math.floor(priceMin - pad),
      domainMax: Math.ceil(priceMax + pad),
    }
  }, [data])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      const parts = [
        formatCandleDay(point.time, locale),
        `close ${formatCandlePrice(point.close, locale)}`,
      ]
      if (point.mid != null) {
        parts.push(`${midLabel} ${formatCandlePrice(point.mid, locale)}`)
      }
      if (point.upper != null && point.lower != null) {
        parts.push(
          `band ${formatCandlePrice(point.lower, locale)}–${formatCandlePrice(point.upper, locale)}`
        )
      }
      liveRef.current.textContent = parts.join(", ")
    },
    [data, locale, midLabel]
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
    return `Bollinger bands, ${title}, ${dayLabel} close ${formatCandlePrice(total, locale)}`
  }, [active, dayLabel, locale, title, total])

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
            {liveScrubbing ? " · scrubbing" : ""}
            {vsMid != null ? (
              <span>
                {" · "}
                {vsMid >= 0 ? "+" : ""}
                {vsMid.toFixed(1)}% vs mid
              </span>
            ) : null}
            {bandWidth != null ? (
              <span>
                {" · "}
                width {formatCandleCompact(bandWidth, locale)}
              </span>
            ) : null}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-surface)] border border-border/60 bg-background px-3.5 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold tracking-tight text-foreground">
              {symbol}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {instrumentLabel}
            </p>
          </div>
          <div className="text-end">
            <p
              className="text-sm font-semibold"
              style={{
                color: periodPct >= 0 ? CANDLE_UP : CANDLE_DOWN,
              }}
            >
              {formatSessionPct(periodPct, locale)}
            </p>
            <p className="text-[11px] text-muted-foreground">period</p>
          </div>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div className="overflow-hidden rounded-[var(--radius-surface)] border border-border/60 bg-background">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/50 px-4 py-2.5">
          <div>
            <p className="text-sm font-medium">
              Bollinger · {symbol}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {midLabel} {bandLabel} · volatility envelope
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
              "aspect-auto h-[340px] max-h-[400px] max-w-none sm:h-[380px]"
            )}
          >
            <ComposedChart
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
                <linearGradient
                  id={`${gid}-band`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={BAND_COLOR}
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="100%"
                    stopColor={BAND_COLOR}
                    stopOpacity={0.04}
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
                dataKey="time"
                type="category"
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
                  formatCandleDay(Number(value), locale)
                }
                className="tabular-nums"
              />
              <YAxis
                orientation={plotRtl ? "right" : "left"}
                width={narrow ? 44 : 52}
                domain={[domainMin, domainMax]}
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                tickCount={4}
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
                        | BollingerRow
                        | undefined
                      return row
                        ? formatCandleDay(row.time, locale)
                        : ""
                    }}
                    formatter={(value, name) => {
                      if (value == null || name === "bandTop") return null
                      const label =
                        name === "close"
                          ? "Close"
                          : name === "mid"
                            ? midLabel
                            : name === "upper"
                              ? "Upper"
                              : name === "lower"
                                ? "Lower"
                                : String(name)
                      const color =
                        name === "close"
                          ? PRICE_COLOR
                          : name === "mid"
                            ? MID_COLOR
                            : BAND_COLOR
                      return (
                        <div className="flex w-full items-center justify-between gap-4 tabular-nums">
                          <span
                            className="text-muted-foreground"
                            style={{ color }}
                          >
                            {label}
                          </span>
                          <span className="font-medium text-foreground">
                            {formatCandlePrice(Number(value), locale)}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="lower"
                stackId="band"
                stroke="none"
                fill="transparent"
                connectNulls
                isAnimationActive={false}
                legendType="none"
                tooltipType="none"
              />
              <Area
                type="monotone"
                dataKey="bandTop"
                stackId="band"
                stroke="none"
                fill={`url(#${gid}-band)`}
                connectNulls
                isAnimationActive={false}
                legendType="none"
                tooltipType="none"
              />
              <Line
                type="monotone"
                dataKey="upper"
                name="upper"
                stroke={BAND_COLOR}
                strokeWidth={1}
                strokeOpacity={0.7}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="lower"
                name="lower"
                stroke={BAND_COLOR}
                strokeWidth={1}
                strokeOpacity={0.7}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="mid"
                name="mid"
                stroke={MID_COLOR}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="close"
                name="close"
                stroke={PRICE_COLOR}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                activeDot={{
                  r: 3.5,
                  fill: PRICE_COLOR,
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
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
            className="size-2 shrink-0 rounded-full border border-dashed"
            style={{ borderColor: MID_COLOR, backgroundColor: "transparent" }}
            aria-hidden
          />
          <span className="text-foreground">{midLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: BAND_COLOR }}
            aria-hidden
          />
          <span className="text-foreground">Bands {bandLabel}</span>
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
            <th>Mid</th>
            <th>Upper</th>
            <th>Lower</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.time}>
              <td>{formatCandleDay(row.time, locale)}</td>
              <td>{row.close}</td>
              <td>{row.mid ?? ""}</td>
              <td>{row.upper ?? ""}</td>
              <td>{row.lower ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function BollingerBandsDemo(props: BollingerBandsProps) {
  return <BollingerBands {...props} />
}

export { BollingerBands }
