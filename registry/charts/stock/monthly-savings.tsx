"use client"

import * as React from "react"
import { TriangleIcon } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts"

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
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Monthly Savings — locked gallery chrome (navy × orange).
 * Channel tabs + compound monthly balance bars; type-required rounded-top
 * `VerticalBar` shape; metric scrubber.
 * Installs to: components/charts/monthly-savings.tsx
 */

export type MonthlySavingsChannelId =
  | "gold"
  | "dollar"
  | "fund"
  | "bank"
  | "cash"

export type MonthlySavingsRow = {
  /** ISO date (YYYY-MM-DD). */
  month: string
  /** Ending balance after deposit + growth. */
  balance: number
  /** Deposit that month. */
  deposit: number
}

export type MonthlySavingsProps = {
  title?: string
  subtitle?: string
  /** Fixed monthly contribution (USD). */
  monthlyDeposit?: number
  defaultChannel?: MonthlySavingsChannelId
  className?: string
  /** Category axis direction / Y side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across months. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const MONTHS = [
  "2026-01-01",
  "2026-02-01",
  "2026-03-01",
  "2026-04-01",
  "2026-05-01",
  "2026-06-01",
  "2026-07-01",
  "2026-08-01",
  "2026-09-01",
  "2026-10-01",
  "2026-11-01",
  "2026-12-01",
] as const

const CHANNELS: {
  id: MonthlySavingsChannelId
  label: string
  /** Approximate monthly growth rate. */
  monthlyRate: number
}[] = [
  { id: "gold", label: "Gold", monthlyRate: 0.032 },
  { id: "dollar", label: "USD", monthlyRate: 0.022 },
  { id: "fund", label: "Fixed fund", monthlyRate: 0.018 },
  { id: "bank", label: "Bank deposit", monthlyRate: 0.015 },
  { id: "cash", label: "Cash", monthlyRate: 0 },
]

const DEFAULT_DEPOSIT = 200

const chartConfig = {
  balance: {
    label: "Balance",
    color: CHART_SERIES_A,
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

function buildSeries(
  monthlyRate: number,
  monthlyDeposit: number
): MonthlySavingsRow[] {
  let balance = 0
  return MONTHS.map((month) => {
    balance = (balance + monthlyDeposit) * (1 + monthlyRate)
    return {
      month,
      deposit: monthlyDeposit,
      balance: Math.round(balance),
    }
  })
}

function parseMonthDate(month: string): Date | null {
  if (/^\d{4}-\d{2}/.test(month)) {
    const iso = month.length === 7 ? `${month}-01` : month.slice(0, 10)
    const d = new Date(`${iso}T00:00:00`)
    return Number.isNaN(d.getTime()) ? null : d
  }
  return null
}

function formatAxisMonth(month: string, locale: string) {
  const d = parseMonthDate(month)
  if (!d) return month
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(d)
}

function formatFullMonth(month: string, locale: string) {
  const d = parseMonthDate(month)
  if (!d) return month
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(d)
}

function formatMoney(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCompactMoney(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function formatPct(value: number, locale: string) {
  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value)}%`
}

function VerticalBar(
  props: BarShapeProps & { dimmed?: boolean }
) {
  const x = Number(props.x) || 0
  const y = Number(props.y) || 0
  const width = Math.max(Number(props.width) || 0, 0)
  const height = Math.max(Number(props.height) || 0, 0)
  if (width < 1 || height < 1) return null

  const r = Math.min(8, width / 2, height / 2)
  const d = [
    `M${x},${y + height}`,
    `V${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `H${x + width - r}`,
    `Q${x + width},${y} ${x + width},${y + r}`,
    `V${y + height}`,
    "Z",
  ].join(" ")

  return (
    <path
      d={d}
      fill="var(--color-balance)"
      opacity={props.dimmed ? 0.4 : 1}
    />
  )
}

function MonthlySavings({
  title = "Monthly Savings",
  subtitle = "Compound balance by savings channel over 12 months.",
  monthlyDeposit = DEFAULT_DEPOSIT,
  defaultChannel = "gold",
  className,
  plotDir,
  scrub = true,
}: MonthlySavingsProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const [channelId, setChannelId] =
    React.useState<MonthlySavingsChannelId>(defaultChannel)
  const channel =
    CHANNELS.find((c) => c.id === channelId) ?? CHANNELS[0]!

  const data = React.useMemo(
    () => buildSeries(channel.monthlyRate, monthlyDeposit),
    [channel.monthlyRate, monthlyDeposit]
  )

  const lastIndex = Math.max(0, data.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [track, setTrack] = React.useState({
    data,
    channelId,
    lastIndex,
  })
  if (
    track.data !== data ||
    track.channelId !== channelId ||
    track.lastIndex !== lastIndex
  ) {
    setTrack({ data, channelId, lastIndex })
    setActiveIndex(lastIndex)
  }

  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[lastIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const total = active?.balance ?? 0
  const prevTotal = previous?.balance ?? null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const monthLabel = active
    ? formatFullMonth(active.month, locale)
    : ""

  const { totalDeposited, finalBalance, profit, profitPct } =
    React.useMemo(() => {
      const deposited = monthlyDeposit * data.length
      const end = data[data.length - 1]?.balance ?? 0
      const gain = end - deposited
      const pct = deposited ? (gain / deposited) * 100 : 0
      return {
        totalDeposited: deposited,
        finalBalance: end,
        profit: gain,
        profitPct: pct,
      }
    }, [data, monthlyDeposit])

  const domainMax = React.useMemo(() => {
    const peak = finalBalance
    const step =
      peak <= 2_000 ? 500 : peak <= 4_000 ? 1_000 : peak <= 8_000 ? 2_000 : 2_500
    return Math.ceil(peak / step) * step || step
  }, [finalBalance])

  const ticks = React.useMemo(() => {
    const step = domainMax / 4
    return [0, step, step * 2, step * 3, domainMax]
  }, [domainMax])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${formatFullMonth(point.month, locale)}: balance ${formatMoney(point.balance, locale)}, deposit ${formatMoney(point.deposit, locale)}`
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

  const barShape = React.useCallback(
    (props: BarShapeProps) => (
      <VerticalBar
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
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs last month`
    return `Monthly savings, ${title}, ${channel.label}, ${monthLabel} ${formatMoney(total, locale)}${deltaText}`
  }, [
    active,
    channel.label,
    deltaPct,
    deltaUp,
    locale,
    monthLabel,
    title,
    total,
  ])

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[720px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
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
              {formatMoney(total, locale)}
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
                  vs last month
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {monthLabel}
            {" · "}
            {channel.label}
            {active ? (
              <span>
                {" · "}
                deposit {formatMoney(active.deposit, locale)}
              </span>
            ) : null}
          </p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div
        className={cn(
          "grid overflow-hidden rounded-[var(--radius-surface)] border border-border/70 bg-background",
          "grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)]"
        )}
      >
        <aside className="order-2 flex flex-col gap-4 border-t border-border/60 p-4 md:order-1 md:border-t-0 md:border-e">
          <section className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-foreground">
              Savings channel
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {CHANNELS.map((item) => {
                const selected = channelId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setChannelId(item.id)}
                    className={cn(
                      "cursor-pointer rounded-md border px-2 py-2 text-xs font-medium transition-colors",
                      selected
                        ? "border-transparent text-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted/40"
                    )}
                    style={
                      selected
                        ? {
                            borderColor: "var(--chart-1)",
                            background:
                              "color-mix(in oklab, var(--chart-1) 16%, var(--background))",
                          }
                        : undefined
                    }
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Monthly deposit{" "}
              <span className="font-medium text-foreground">
                {formatMoney(monthlyDeposit, locale)}
              </span>{" "}
              — compound balance across the year
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-foreground">Stats</h4>
            <div className="flex flex-col gap-2">
              <div
                className="flex flex-wrap items-center justify-between gap-2 rounded-md px-2.5 py-2 text-xs"
                style={{
                  background:
                    "color-mix(in oklab, var(--chart-1) 14%, var(--background))",
                }}
              >
                <span className="shrink-0 font-medium text-muted-foreground">
                  Year-end
                </span>
                <span
                  className="inline-flex items-center gap-1 font-semibold"
                  style={{ color: "var(--chart-1)" }}
                >
                  <span>{formatMoney(finalBalance, locale)}</span>
                  <TriangleIcon
                    className="size-2.5 fill-current"
                    aria-hidden
                  />
                </span>
              </div>
              <div
                className="flex flex-wrap items-center justify-between gap-2 rounded-md px-2.5 py-2 text-xs"
                style={{
                  background:
                    "color-mix(in oklab, var(--chart-2) 14%, var(--background))",
                }}
              >
                <span className="shrink-0 font-medium text-muted-foreground">
                  Approx. profit
                </span>
                <span
                  className="inline-flex items-center gap-1 font-semibold"
                  style={{ color: "var(--chart-2)" }}
                >
                  {formatMoney(profit, locale)}
                  <span className="font-normal opacity-80">
                    ({formatPct(profitPct, locale)})
                  </span>
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Total deposited: {formatMoney(totalDeposited, locale)}
            </p>
          </section>
        </aside>

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
          className="order-1 min-w-0 touch-pan-y p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:order-2 md:p-4"
        >
          <ChartContainer
            config={chartConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[300px] max-h-none max-w-none sm:h-[320px]"
            )}
          >
            <BarChart
              accessibilityLayer
              data={data}
              barCategoryGap="18%"
              margin={
                narrow
                  ? { top: 12, right: 4, left: 4, bottom: 4 }
                  : { top: 12, right: 8, left: 4, bottom: 4 }
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
                dataKey="month"
                scale="band"
                reversed={plotRtl}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={4}
                interval={0}
                tick={{
                  fontSize: 12,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: string) =>
                  formatAxisMonth(value, locale)
                }
              />
              <YAxis
                type="number"
                orientation={plotRtl ? "right" : "left"}
                domain={[0, domainMax]}
                ticks={ticks}
                width={narrow ? 40 : 48}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{
                  fontSize: 12,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  formatCompactMoney(value, locale)
                }
                className="tabular-nums"
              />
              <ChartTooltip
                cursor={BAR_TOOLTIP_CURSOR}
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | MonthlySavingsRow
                        | undefined
                      return row
                        ? formatFullMonth(row.month, locale)
                        : ""
                    }}
                    formatter={(value, _name, item) => {
                      const row = item?.payload as
                        | MonthlySavingsRow
                        | undefined
                      if (value == null || !row) return null
                      return (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium tabular-nums text-foreground">
                            {formatMoney(Number(value), locale)}
                          </span>
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            Deposit {formatMoney(row.deposit, locale)}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Bar
                dataKey="balance"
                name="balance"
                fill="var(--color-balance)"
                shape={barShape}
                maxBarSize={36}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.balance.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-2)" }}
            aria-hidden
          />
          <span className="text-foreground">Profit highlight</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} Channel: {channel.label}.
        </caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Balance</th>
            <th>Deposit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{formatFullMonth(row.month, locale)}</td>
              <td>{row.balance}</td>
              <td>{row.deposit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function MonthlySavingsDemo(props: MonthlySavingsProps) {
  return <MonthlySavings {...props} />
}

export { MonthlySavings }
