"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  CHART_SERIES_A,
  CHART_SERIES_B,
} from "../_lib/chart-styles"
import { CANDLE_DOWN, CANDLE_UP } from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Sparklines — locked gallery chrome + type-required portfolio dashboard.
 * KPI area cards + watchlist with trend/volume mini-charts (no neon).
 * Installs to: components/charts/sparklines.tsx
 */

export type SparkPoint = { i: number; value: number }

export type SparklinesKpi = {
  id: string
  label: string
  value: number
  series: readonly number[]
  color: string
  invertSentiment?: boolean
}

export type SparklinesWatchRow = {
  symbol: string
  name: string
  price: number
  series: readonly number[]
  volume: readonly number[]
  share: number
}

export type SparklinesProps = {
  title?: string
  subtitle?: string
  kpis?: readonly SparklinesKpi[]
  watchlist?: readonly SparklinesWatchRow[]
  className?: string
  /** Reserved for gallery API parity. */
  plotDir?: "ltr" | "rtl"
  /** Hover KPI cards / watchlist rows to update metric. Default on. */
  scrub?: boolean
}

const CHART_SERIES_C = "var(--chart-3)"
const MUTE_FILL =
  "color-mix(in oklab, var(--muted-foreground) 55%, transparent)"

const SALES_SERIES = [
  412, 418, 405, 422, 416, 430, 424, 438, 432, 445, 440, 452, 448, 458, 454,
  466, 461, 472, 468, 478, 474, 482, 479, 488,
]
const EXPENSES_SERIES = [
  248, 252, 245, 258, 254, 249, 261, 257, 264, 260, 255, 268, 263, 259, 270,
  266, 261, 274, 269, 265, 276, 271, 267, 278,
]
const PROFIT_SERIES = SALES_SERIES.map((v, i) => v - EXPENSES_SERIES[i]!)

const DEMO_KPIS: SparklinesKpi[] = [
  {
    id: "sales",
    label: "Sales",
    value: 424_652,
    series: SALES_SERIES,
    color: CHART_SERIES_A,
  },
  {
    id: "expenses",
    label: "Expenses",
    value: 235_312,
    series: EXPENSES_SERIES,
    color: CHART_SERIES_B,
    invertSentiment: true,
  },
  {
    id: "profit",
    label: "Net profit",
    value: 189_340,
    series: PROFIT_SERIES,
    color: CHART_SERIES_C,
  },
]

const DEMO_WATCHLIST: SparklinesWatchRow[] = [
  {
    symbol: "AENE",
    name: "Acme Energy Inc.",
    price: 284.5,
    series: [100, 101, 99, 103, 105, 104, 107, 109, 108, 111, 113, 112, 115, 117],
    volume: [42, 38, 55, 48, 62, 51, 70, 58, 66, 74, 69, 81, 77, 88],
    share: 28,
  },
  {
    symbol: "STLM",
    name: "Steelmark Co.",
    price: 112.6,
    series: [88, 89, 87, 86, 90, 92, 89, 88, 91, 93, 90, 94, 95, 94],
    volume: [55, 48, 61, 44, 58, 52, 67, 49, 63, 57, 71, 64, 69, 60],
    share: 22,
  },
  {
    symbol: "AUTO",
    name: "Autonova Group",
    price: 41.2,
    series: [72, 70, 73, 68, 66, 69, 64, 62, 65, 61, 59, 63, 60, 58],
    volume: [90, 84, 98, 76, 88, 72, 95, 68, 81, 74, 86, 70, 78, 65],
    share: 14,
  },
  {
    symbol: "MBNK",
    name: "Metro Bank",
    price: 68.5,
    series: [54, 55, 54, 56, 57, 56, 58, 59, 58, 60, 61, 60, 62, 63],
    volume: [33, 36, 31, 40, 38, 42, 35, 44, 41, 47, 43, 50, 46, 52],
    share: 18,
  },
  {
    symbol: "PWRG",
    name: "Power Grid Ltd.",
    price: 95.8,
    series: [80, 81, 79, 82, 81, 83, 82, 84, 83, 85, 84, 86, 85, 87],
    volume: [28, 32, 26, 35, 30, 38, 33, 41, 36, 39, 34, 43, 37, 45],
    share: 11,
  },
]

function toSpark(values: readonly number[]): SparkPoint[] {
  return values.map((value, i) => ({ i, value }))
}

function pctChange(values: readonly number[]) {
  const first = values[0]!
  const last = values[values.length - 1]!
  if (first === 0) return 0
  return ((last - first) / first) * 100
}

function formatPct(value: number, locale: string) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value)}%`
}

function formatMoney(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function formatPrice(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

function SparkAreaCard({
  id,
  label,
  value,
  series,
  color,
  invertSentiment = false,
  active,
  onActivate,
  onDeactivate,
  locale,
}: SparklinesKpi & {
  active: boolean
  onActivate: () => void
  onDeactivate: () => void
  locale: string
}) {
  const data = toSpark(series)
  const change = pctChange(series)
  const good = invertSentiment ? change <= 0 : change >= 0
  const config = {
    value: { label, color },
  } satisfies ChartConfig
  const uid = React.useId().replace(/:/g, "")
  const gradId = `spark-fill-${id}-${uid}`

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onActivate()
        }
      }}
      className={cn(
        "min-w-0 flex-1 cursor-pointer overflow-hidden rounded-[var(--radius-surface)] border bg-background outline-none transition-[box-shadow,border-color]",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active ? "shadow-sm" : "border-border/60"
      )}
      style={
        active
          ? {
              borderColor:
                "color-mix(in oklab, var(--chart-1) 45%, var(--border))",
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-2 px-3.5 pt-3.5">
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-0.5 whitespace-nowrap text-[13px] font-semibold tabular-nums sm:text-sm">
            {formatMoney(value, locale)}
          </p>
        </div>
        <span
          className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums"
          style={{
            color: good ? CANDLE_UP : CANDLE_DOWN,
            background: good
              ? "color-mix(in oklab, var(--chart-up) 14%, transparent)"
              : "color-mix(in oklab, var(--chart-down) 14%, transparent)",
          }}
        >
          {formatPct(change, locale)}
        </span>
      </div>
      <ChartContainer
        config={config}
        className="aspect-auto h-[88px] w-full font-sans"
      >
        <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.38} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={`url(#${gradId})`}
            strokeWidth={2}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function TrendSpark({
  series,
  up,
}: {
  series: readonly number[]
  up: boolean
}) {
  const color = up ? CANDLE_UP : CANDLE_DOWN
  const data = toSpark(series)
  const config = {
    value: { label: "Trend", color },
  } satisfies ChartConfig
  const last = data.length - 1

  return (
    <ChartContainer
      config={config}
      className="aspect-auto h-[40px] w-[120px] font-sans"
    >
      <LineChart data={data} margin={{ top: 6, right: 6, bottom: 4, left: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.75}
          isAnimationActive={false}
          activeDot={false}
          dot={(props: {
            cx?: number
            cy?: number
            index?: number
          }) => {
            const { cx, cy, index } = props
            if (index !== last || cx == null || cy == null) {
              return <g key={`spark-dot-${index}`} />
            }
            return (
              <circle
                key={`spark-end-${index}`}
                cx={cx}
                cy={cy}
                r={3}
                fill={color}
                stroke="var(--background)"
                strokeWidth={1.5}
              />
            )
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}

function VolumeSpark({ series }: { series: readonly number[] }) {
  const data = toSpark(series)
  const config = {
    value: { label: "Volume", color: MUTE_FILL },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={config}
      className="aspect-auto h-[40px] w-[100px] font-sans"
    >
      <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <Bar
          dataKey="value"
          fill={MUTE_FILL}
          fillOpacity={0.85}
          radius={[2, 2, 0, 0]}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  )
}

function ShareBar({ share }: { share: number }) {
  return (
    <div className="flex min-w-[5.5rem] items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{
            width: `${share}%`,
            background: "var(--chart-1)",
          }}
        />
      </div>
      <span className="w-8 text-end text-[11px] tabular-nums text-muted-foreground">
        {share}%
      </span>
    </div>
  )
}

type ScrubTarget =
  | { kind: "kpi"; index: number }
  | { kind: "watch"; index: number }

function Sparklines({
  title = "Portfolio Sparklines",
  subtitle = "KPI area sparks and a 14-day watchlist with trend and volume.",
  kpis = DEMO_KPIS,
  watchlist = DEMO_WATCHLIST,
  className,
  plotDir,
  scrub = true,
}: SparklinesProps) {
  const { ref } = useChartDir()
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const locale = "en"
  void plotDir

  const [target, setTarget] = React.useState<ScrubTarget>({
    kind: "kpi",
    index: 0,
  })
  const [scrubbing, setScrubbing] = React.useState(false)

  const liveTarget =
    scrub && scrubbing ? target : ({ kind: "kpi", index: 0 } as ScrubTarget)

  const metric = React.useMemo(() => {
    if (liveTarget.kind === "kpi") {
      const card = kpis[liveTarget.index] ?? kpis[0]!
      const change = pctChange(card.series)
      const good = card.invertSentiment ? change <= 0 : change >= 0
      return {
        valueLabel: formatMoney(card.value, locale),
        rawValue: card.value,
        change,
        good,
        caption: card.label,
      }
    }
    const row = watchlist[liveTarget.index] ?? watchlist[0]!
    const change = pctChange(row.series)
    return {
      valueLabel: formatPrice(row.price, locale),
      rawValue: row.price,
      change,
      good: change >= 0,
      caption: `${row.symbol} · ${row.name}`,
    }
  }, [kpis, liveTarget, locale, watchlist])

  const announce = React.useCallback(
    (next: ScrubTarget) => {
      if (!liveRef.current) return
      if (next.kind === "kpi") {
        const card = kpis[next.index]
        if (!card) return
        liveRef.current.textContent = `${card.label}: ${formatMoney(card.value, locale)}, ${formatPct(pctChange(card.series), locale)}`
        return
      }
      const row = watchlist[next.index]
      if (!row) return
      liveRef.current.textContent = `${row.symbol}: ${formatPrice(row.price, locale)}, ${formatPct(pctChange(row.series), locale)}`
    },
    [kpis, locale, watchlist]
  )

  const activate = React.useCallback(
    (next: ScrubTarget, fromKeyboard = false) => {
      if (!scrub) return
      setScrubbing(true)
      setTarget(next)
      if (fromKeyboard) announce(next)
    },
    [announce, scrub]
  )

  const deactivate = React.useCallback(() => {
    if (!scrub) return
    setScrubbing(false)
    setTarget({ kind: "kpi", index: 0 })
  }, [scrub])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrub) return
      const kpiLast = Math.max(0, kpis.length - 1)
      const watchLast = Math.max(0, watchlist.length - 1)
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault()
          if (target.kind === "kpi") {
            if (target.index < kpiLast) {
              activate({ kind: "kpi", index: target.index + 1 }, true)
            } else {
              activate({ kind: "watch", index: 0 }, true)
            }
          } else {
            activate(
              {
                kind: "watch",
                index: Math.min(watchLast, target.index + 1),
              },
              true
            )
          }
          break
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault()
          if (target.kind === "watch") {
            if (target.index > 0) {
              activate({ kind: "watch", index: target.index - 1 }, true)
            } else {
              activate({ kind: "kpi", index: kpiLast }, true)
            }
          } else {
            activate(
              {
                kind: "kpi",
                index: Math.max(0, target.index - 1),
              },
              true
            )
          }
          break
        case "Home":
          event.preventDefault()
          activate({ kind: "kpi", index: 0 }, true)
          break
        case "End":
          event.preventDefault()
          activate({ kind: "watch", index: watchLast }, true)
          break
        case "Escape":
          event.preventDefault()
          deactivate()
          announce({ kind: "kpi", index: 0 })
          break
        default:
          break
      }
    },
    [activate, announce, deactivate, kpis.length, scrub, target, watchlist.length]
  )

  const ariaLabel = `Sparklines, ${title}, ${metric.caption} ${metric.valueLabel}, ${formatPct(metric.change, locale)}`

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
              {metric.valueLabel}
            </p>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums"
              style={{
                color: metric.good ? CANDLE_UP : CANDLE_DOWN,
                backgroundColor: metric.good
                  ? "color-mix(in oklab, var(--chart-up) 12%, transparent)"
                  : "color-mix(in oklab, var(--chart-down) 12%, transparent)",
              }}
            >
              <span aria-hidden>{metric.good ? "▲" : "▼"}</span>
              {Math.abs(metric.change).toFixed(1)}%
              <span className="font-normal text-muted-foreground">
                period
              </span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{metric.caption}</p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div
        role="img"
        aria-label={ariaLabel}
        tabIndex={scrub ? 0 : undefined}
        onKeyDown={scrub ? onKeyDown : undefined}
        onBlur={scrub ? deactivate : undefined}
        className="space-y-4 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {kpis.map((card, index) => (
            <SparkAreaCard
              key={card.id}
              {...card}
              locale={locale}
              active={
                scrubbing &&
                liveTarget.kind === "kpi" &&
                liveTarget.index === index
              }
              onActivate={() => activate({ kind: "kpi", index })}
              onDeactivate={deactivate}
            />
          ))}
        </div>

        <div className="overflow-hidden rounded-[var(--radius-surface)] border border-border/60">
          <div className="flex items-center justify-between border-b border-border/50 bg-muted/25 px-3.5 py-2.5">
            <p className="text-sm font-medium text-foreground">
              Today&apos;s portfolio
            </p>
            <p className="text-[11px] text-muted-foreground">Last 14 days</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border/50 text-[11px] text-muted-foreground">
                  <th className="px-3.5 py-2 text-start font-medium">Symbol</th>
                  <th className="px-3 py-2 text-start font-medium">Last</th>
                  <th className="px-3 py-2 text-start font-medium">Change</th>
                  <th className="px-3 py-2 text-start font-medium">Trend</th>
                  <th className="px-3 py-2 text-start font-medium">Volume</th>
                  <th className="px-3.5 py-2 text-start font-medium">Share</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((row, index) => {
                  const change = pctChange(row.series)
                  const up = change >= 0
                  const active =
                    scrubbing &&
                    liveTarget.kind === "watch" &&
                    liveTarget.index === index
                  return (
                    <tr
                      key={row.symbol}
                      tabIndex={scrub ? 0 : undefined}
                      onMouseEnter={() =>
                        activate({ kind: "watch", index })
                      }
                      onMouseLeave={deactivate}
                      onFocus={() => activate({ kind: "watch", index })}
                      onBlur={deactivate}
                      className={cn(
                        "border-b border-border/40 last:border-0 outline-none",
                        scrub && "cursor-pointer hover:bg-muted/20",
                        active && "bg-muted/25"
                      )}
                    >
                      <td className="px-3.5 py-2.5">
                        <div className="flex flex-col">
                          <span className="font-semibold tracking-tight text-foreground">
                            {row.symbol}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 font-medium tabular-nums text-foreground">
                        {formatPrice(row.price, locale)}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-[12px] font-medium tabular-nums"
                          style={{
                            color: up ? CANDLE_UP : CANDLE_DOWN,
                          }}
                        >
                          {formatPct(change, locale)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <TrendSpark series={row.series} up={up} />
                      </td>
                      <td className="px-3 py-2.5">
                        <VolumeSpark series={row.volume} />
                      </td>
                      <td className="px-3.5 py-2.5">
                        <ShareBar share={row.share} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-2)" }}
            aria-hidden
          />
          <span className="text-foreground">Expenses</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-3)" }}
            aria-hidden
          />
          <span className="text-foreground">Net profit</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Change %</th>
            <th>Share %</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map((row) => (
            <tr key={row.symbol}>
              <td>{row.symbol}</td>
              <td>{row.name}</td>
              <td>{row.price}</td>
              <td>{pctChange(row.series).toFixed(1)}</td>
              <td>{row.share}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function SparklinesDemo(props: SparklinesProps) {
  return <Sparklines {...props} />
}

export { Sparklines }
