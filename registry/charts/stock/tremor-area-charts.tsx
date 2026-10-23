"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  CHART_SERIES_A,
  CHART_SERIES_B,
  chartBarContainerClassName,
  chartDashedGridClassName,
} from "../_lib/chart-styles"
import { CANDLE_DOWN, CANDLE_UP } from "../_lib/stock-shared"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * KPI Area Charts — multi-variant revenue area dashboard.
 * Install id stays `tremor-area-charts` for catalog continuity; no third-party branding in UI.
 * KPI minis + hero dual area + stacked / percent variants; no neon; metric scrubber.
 * Installs to: components/charts/tremor-area-charts.tsx
 */

export type MonthRow = {
  month: string
  store: number
  online: number
}

export type KpiAreaChartsProps = {
  title?: string
  subtitle?: string
  data?: MonthRow[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover KPI cards / hero months to update metric. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const STORE_COLOR = CHART_SERIES_A
const ONLINE_COLOR = CHART_SERIES_B
const TOTAL_COLOR = "var(--chart-3)"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const

const STORE_SERIES = [
  28_900, 27_560, 33_220, 34_700, 34_750, 31_290, 34_900, 29_030, 26_430,
  28_370, 29_540, 32_390,
] as const

const ONLINE_SERIES = [
  23_380, 21_030, 21_940, 21_080, 18_120, 17_260, 19_820, 20_120, 23_420,
  24_730, 28_480, 27_360,
] as const

const DEMO_DATA: MonthRow[] = MONTHS.map((month, i) => ({
  month,
  store: STORE_SERIES[i]!,
  online: ONLINE_SERIES[i]!,
}))

function pctChange(first: number, last: number) {
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

function formatAxis(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
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

type MetricFocus =
  | { kind: "kpi"; id: "store" | "online" | "total" }
  | { kind: "month"; index: number }

function KpiMiniArea({
  id,
  label,
  value,
  change,
  color,
  series,
  locale,
  active,
  onActivate,
  onDeactivate,
}: {
  id: string
  label: string
  value: number
  change: number
  color: string
  series: readonly number[]
  locale: string
  active: boolean
  onActivate: () => void
  onDeactivate: () => void
}) {
  const good = change >= 0
  const data = series.map((v, i) => ({ i, value: v }))
  const config = {
    value: { label, color },
  } satisfies ChartConfig
  const uid = React.useId().replace(/:/g, "")
  const gradId = `kpi-area-${id}-${uid}`

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
        className="aspect-auto h-[72px] w-full font-sans"
      >
        <AreaChart data={data} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
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

function AreaGradients({
  idPrefix,
  storeColor,
  onlineColor,
}: {
  idPrefix: string
  storeColor: string
  onlineColor: string
}) {
  return (
    <defs>
      <linearGradient id={`${idPrefix}-store`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={storeColor} stopOpacity={0.36} />
        <stop offset="100%" stopColor={storeColor} stopOpacity={0.02} />
      </linearGradient>
      <linearGradient id={`${idPrefix}-online`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={onlineColor} stopOpacity={0.36} />
        <stop offset="100%" stopColor={onlineColor} stopOpacity={0.02} />
      </linearGradient>
    </defs>
  )
}

function VariantCard({
  title,
  hint,
  children,
}: {
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0 flex-1 overflow-hidden rounded-[var(--radius-surface)] border border-border/60 bg-background">
      <div className="border-b border-border/50 px-3.5 py-2.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </div>
      <div className="px-1 pb-1 pt-2">{children}</div>
    </div>
  )
}

function KpiAreaCharts({
  title = "KPI Area Charts",
  subtitle = "Channel revenue areas — KPI minis, monthly dual series, stacked and share variants.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: KpiAreaChartsProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const locale = "en"
  const lastIndex = Math.max(0, data.length - 1)
  const uid = React.useId().replace(/:/g, "")

  const [focus, setFocus] = React.useState<MetricFocus>({
    kind: "month",
    index: lastIndex,
  })
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({ data, lastIndex })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data, lastIndex })
    setFocus({ kind: "month", index: lastIndex })
  }

  const storeTotal = data.reduce((s, r) => s + r.store, 0)
  const onlineTotal = data.reduce((s, r) => s + r.online, 0)
  const yearTotal = storeTotal + onlineTotal
  const storeChange = pctChange(data[0]?.store ?? 0, data[lastIndex]?.store ?? 0)
  const onlineChange = pctChange(
    data[0]?.online ?? 0,
    data[lastIndex]?.online ?? 0
  )
  const yearChange = pctChange(
    (data[0]?.store ?? 0) + (data[0]?.online ?? 0),
    (data[lastIndex]?.store ?? 0) + (data[lastIndex]?.online ?? 0)
  )

  const monthIndex =
    focus.kind === "month" ? focus.index : lastIndex
  const activeMonth = data[monthIndex] ?? data[lastIndex]
  const monthTotal = activeMonth
    ? activeMonth.store + activeMonth.online
    : 0

  const metric =
    focus.kind === "kpi"
      ? focus.id === "store"
        ? {
            value: storeTotal,
            label: "Store (year)",
            delta: storeChange,
            detail: "Full-year store channel",
          }
        : focus.id === "online"
          ? {
              value: onlineTotal,
              label: "Online (year)",
              delta: onlineChange,
              detail: "Full-year online channel",
            }
          : {
              value: yearTotal,
              label: "Total sales",
              delta: yearChange,
              detail: "Store + online",
            }
      : {
          value: monthTotal,
          label: activeMonth?.month ?? "",
          delta:
            monthIndex > 0 && data[monthIndex - 1]
              ? pctChange(
                  data[monthIndex - 1]!.store + data[monthIndex - 1]!.online,
                  monthTotal
                )
              : null,
          detail: activeMonth
            ? `Store ${formatMoney(activeMonth.store, locale)} · Online ${formatMoney(activeMonth.online, locale)}`
            : "",
        }

  const deltaUp = metric.delta != null && metric.delta >= 0

  const dualConfig = {
    store: { label: "Store", color: STORE_COLOR },
    online: { label: "Online", color: ONLINE_COLOR },
  } satisfies ChartConfig

  const resetIdle = React.useCallback(() => {
    setScrubbing(false)
    setFocus({ kind: "month", index: lastIndex })
  }, [lastIndex])

  const onHeroMouseMove = React.useCallback(
    (chartState: {
      activeLabel?: string | number
      activeTooltipIndex?: number | string | null
    }) => {
      if (!scrub) return
      let idx: number | null = null
      if (
        chartState?.activeTooltipIndex !== undefined &&
        chartState.activeTooltipIndex !== null
      ) {
        const n = Number(chartState.activeTooltipIndex)
        if (Number.isFinite(n)) idx = n
      }
      if (idx == null && typeof chartState?.activeLabel === "string") {
        const found = data.findIndex((r) => r.month === chartState.activeLabel)
        if (found >= 0) idx = found
      }
      if (idx == null) return
      setScrubbing(true)
      setFocus({ kind: "month", index: idx })
    },
    [data, scrub]
  )

  const kpiCards = [
    {
      id: "store" as const,
      label: "Store",
      value: storeTotal,
      change: storeChange,
      color: STORE_COLOR,
      series: data.map((r) => r.store),
    },
    {
      id: "online" as const,
      label: "Online",
      value: onlineTotal,
      change: onlineChange,
      color: ONLINE_COLOR,
      series: data.map((r) => r.online),
    },
    {
      id: "total" as const,
      label: "Total sales",
      value: yearTotal,
      change: yearChange,
      color: TOTAL_COLOR,
      series: data.map((r) => r.store + r.online),
    },
  ]

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
              {formatMoney(metric.value, locale)}
            </p>
            {metric.delta != null ? (
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
                {Math.abs(metric.delta).toFixed(1)}%
                <span className="font-normal text-muted-foreground">
                  {focus.kind === "month" ? "vs previous" : "period"}
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {metric.label}
            {metric.detail ? ` · ${metric.detail}` : ""}
            {scrubbing ? " · scrubbing" : ""}
          </p>
        </div>
      </header>

      <p className="sr-only" aria-live="polite">
        {metric.label}: {formatMoney(metric.value, locale)}
        {metric.delta != null
          ? `, ${deltaUp ? "up" : "down"} ${Math.abs(metric.delta).toFixed(1)}%`
          : ""}
        {metric.detail ? `, ${metric.detail}` : ""}
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {kpiCards.map((card) => (
          <KpiMiniArea
            key={card.id}
            {...card}
            locale={locale}
            active={focus.kind === "kpi" && focus.id === card.id}
            onActivate={() => {
              if (!scrub) return
              setScrubbing(true)
              setFocus({ kind: "kpi", id: card.id })
            }}
            onDeactivate={() => {
              if (!scrub) return
              resetIdle()
            }}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-[var(--radius-surface)] border border-border/60 bg-background">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/50 px-4 py-3">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">
              Monthly revenue
            </p>
            <p className="mt-0.5 whitespace-nowrap text-xl font-semibold tabular-nums">
              {formatMoney(monthTotal, locale)}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {activeMonth?.month}
            </p>
          </div>
          <div className="flex gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="size-2 rounded-[2px]"
                style={{ background: STORE_COLOR }}
                aria-hidden
              />
              Store
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="size-2 rounded-[2px]"
                style={{ background: ONLINE_COLOR }}
                aria-hidden
              />
              Online
            </span>
          </div>
        </div>
        <ChartContainer
          config={dualConfig}
          className={cn(
            chartBarContainerClassName,
            "aspect-auto h-[280px] max-h-[320px] max-w-none sm:h-[320px]"
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
            onMouseMove={scrub ? onHeroMouseMove : undefined}
            onMouseLeave={scrub ? resetIdle : undefined}
          >
            <AreaGradients
              idPrefix={`kpi-hero-${uid}`}
              storeColor={STORE_COLOR}
              onlineColor={ONLINE_COLOR}
            />
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="var(--border)"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="month"
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={18}
              tick={{ fontSize: 12, fill: AXIS_TICK_FILL }}
            />
            <YAxis
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 40 : 48}
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tickCount={5}
              tick={{ fontSize: 12, fill: AXIS_TICK_FILL }}
              tickFormatter={(v: number) => formatAxis(v, locale)}
              className="tabular-nums"
            />
            <ChartTooltip
              cursor={{ stroke: STORE_COLOR, strokeOpacity: 0.35 }}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  indicator="dot"
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-4 tabular-nums">
                      <span className="text-muted-foreground">
                        {name === "store" ? "Store" : "Online"}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatMoney(Number(value), locale)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="store"
              name="store"
              stroke={STORE_COLOR}
              strokeWidth={2}
              fill={`url(#kpi-hero-${uid}-store)`}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="online"
              name="online"
              stroke={ONLINE_COLOR}
              strokeWidth={2}
              fill={`url(#kpi-hero-${uid}-online)`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <VariantCard
          title="Stacked"
          hint="Store and online layered as a combined total"
        >
          <ChartContainer
            config={dualConfig}
            className={cn(
              chartDashedGridClassName,
              "aspect-auto h-[200px] w-full font-sans"
            )}
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              onMouseMove={scrub ? onHeroMouseMove : undefined}
              onMouseLeave={scrub ? resetIdle : undefined}
            >
              <AreaGradients
                idPrefix={`kpi-stack-${uid}`}
                storeColor={STORE_COLOR}
                onlineColor={ONLINE_COLOR}
              />
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="var(--border)"
                strokeOpacity={0.4}
              />
              <XAxis
                dataKey="month"
                reversed={plotRtl}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={28}
                interval="preserveStartEnd"
                tick={{ fontSize: 11, fill: AXIS_TICK_FILL }}
              />
              <YAxis hide domain={[0, "auto"]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    indicator="dot"
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="store"
                name="store"
                stackId="a"
                stroke={STORE_COLOR}
                strokeWidth={1.75}
                fill={`url(#kpi-stack-${uid}-store)`}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="online"
                name="online"
                stackId="a"
                stroke={ONLINE_COLOR}
                strokeWidth={1.75}
                fill={`url(#kpi-stack-${uid}-online)`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </VariantCard>

        <VariantCard
          title="Share"
          hint="Each channel as a percent of the month"
        >
          <ChartContainer
            config={dualConfig}
            className={cn(
              chartDashedGridClassName,
              "aspect-auto h-[200px] w-full font-sans"
            )}
          >
            <AreaChart
              accessibilityLayer
              data={data}
              stackOffset="expand"
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              onMouseMove={scrub ? onHeroMouseMove : undefined}
              onMouseLeave={scrub ? resetIdle : undefined}
            >
              <defs>
                <linearGradient
                  id={`kpi-pct-${uid}-store`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={STORE_COLOR}
                    stopOpacity={0.55}
                  />
                  <stop
                    offset="100%"
                    stopColor={STORE_COLOR}
                    stopOpacity={0.12}
                  />
                </linearGradient>
                <linearGradient
                  id={`kpi-pct-${uid}-online`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={ONLINE_COLOR}
                    stopOpacity={0.55}
                  />
                  <stop
                    offset="100%"
                    stopColor={ONLINE_COLOR}
                    stopOpacity={0.12}
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
                dataKey="month"
                reversed={plotRtl}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={28}
                interval="preserveStartEnd"
                tick={{ fontSize: 11, fill: AXIS_TICK_FILL }}
              />
              <YAxis
                orientation={plotRtl ? "right" : "left"}
                width={36}
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{ fontSize: 11, fill: AXIS_TICK_FILL }}
                tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    indicator="dot"
                    formatter={(value, name, item) => {
                      const row = item?.payload as MonthRow | undefined
                      const abs =
                        row == null
                          ? null
                          : name === "store"
                            ? row.store
                            : row.online
                      return (
                        <div className="flex w-full flex-col gap-0.5 tabular-nums">
                          <span className="text-muted-foreground">
                            {name === "store" ? "Store" : "Online"}
                          </span>
                          <span className="font-medium text-foreground">
                            {abs != null
                              ? formatMoney(abs, locale)
                              : "—"}{" "}
                            · {Math.round(Number(value) * 100)}%
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="store"
                name="store"
                stackId="a"
                stroke={STORE_COLOR}
                strokeWidth={1.75}
                fill={`url(#kpi-pct-${uid}-store)`}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="online"
                name="online"
                stackId="a"
                stroke={ONLINE_COLOR}
                strokeWidth={1.75}
                fill={`url(#kpi-pct-${uid}-online)`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </VariantCard>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Store</th>
            <th>Online</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>{row.store}</td>
              <td>{row.online}</td>
              <td>{row.store + row.online}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function KpiAreaChartsDemo(props: KpiAreaChartsProps) {
  return <KpiAreaCharts {...props} />
}

export { KpiAreaCharts }
