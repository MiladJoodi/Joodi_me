"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  BarStack,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  CHART_SERIES_A,
  CHART_SERIES_B,
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Ranged Stacked Bar Chart — locked gallery chrome + chart-local stage ranges.
 * Prep / Pack / Ship as `[start, end]` minute ranges via Recharts `BarStack`.
 * Installs to: components/charts/ranged-stacked-bar-chart.tsx
 */

export type StageRange = [number, number]

export type RangedStackedBarPoint = {
  /** ISO date (YYYY-MM-DD) preferred; short labels also accepted. */
  month: string
  prep: StageRange
  pack: StageRange
  ship: StageRange
}

export type RangedStackedBarChartProps = {
  title?: string
  subtitle?: string
  data?: RangedStackedBarPoint[]
  className?: string
  /** Category axis direction. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const BAR_MS = 200
const STACK_RADIUS: [number, number, number, number] = [8, 8, 8, 8]
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const CHART_SERIES_C = "var(--chart-3)"

const STAGE_KEYS = ["prep", "pack", "ship"] as const
type StageKey = (typeof STAGE_KEYS)[number]

const DEMO_DATA: RangedStackedBarPoint[] = [
  {
    month: "2026-01-01",
    prep: [0, 18],
    pack: [18, 30],
    ship: [30, 55],
  },
  {
    month: "2026-02-01",
    prep: [0, 14],
    pack: [14, 28],
    ship: [28, 48],
  },
  {
    month: "2026-03-01",
    prep: [0, 22],
    pack: [22, 40],
    ship: [40, 70],
  },
  {
    month: "2026-04-01",
    prep: [0, 12],
    pack: [12, 24],
    ship: [24, 42],
  },
  {
    month: "2026-05-01",
    prep: [0, 16],
    pack: [16, 32],
    ship: [32, 58],
  },
  {
    month: "2026-06-01",
    prep: [0, 20],
    pack: [20, 36],
    ship: [36, 62],
  },
]

const chartConfig = {
  prep: {
    label: "Prep",
    color: CHART_SERIES_A,
  },
  pack: {
    label: "Pack",
    color: CHART_SERIES_B,
  },
  ship: {
    label: "Ship",
    color: CHART_SERIES_C,
  },
} satisfies ChartConfig

const BAR_TOOLTIP_CURSOR = {
  fill: "color-mix(in oklab, var(--foreground) 5%, transparent)",
} as const

function duration(range: StageRange) {
  return range[1] - range[0]
}

function totalMinutes(row: RangedStackedBarPoint) {
  return (
    duration(row.prep) + duration(row.pack) + duration(row.ship)
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
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return reduced
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

function formatFullMonthYear(month: string, locale: string) {
  const d = parseMonthDate(month)
  if (!d) return month
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(d)
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function RangedTooltip({
  active,
  payload,
  locale,
  dir,
}: {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: RangedStackedBarPoint }>
  locale: string
  /** Page/preview writing direction — plot island is LTR. */
  dir: "ltr" | "rtl"
}) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload
  if (!row) return null
  const total = totalMinutes(row)

  return (
    <div
      dir={dir}
      className="pointer-events-none min-w-[12rem] rounded-xl border border-border/60 bg-background px-3 py-2.5 text-xs shadow-sm font-sans"
    >
      <p className="mb-2 font-medium text-foreground">
        {formatFullMonthYear(row.month, locale)}
      </p>
      <ul className="space-y-1.5">
        {STAGE_KEYS.map((key) => {
          const range = row[key]
          const cfg = chartConfig[key]
          return (
            <li key={key} className="flex flex-col gap-0.5">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: cfg.color }}
                  aria-hidden
                />
                {cfg.label}
              </span>
              <span className="ps-3.5 text-foreground tabular-nums">
                {formatNumber(range[0], locale)}
                {"–"}
                {formatNumber(range[1], locale)} min
                <span className="text-muted-foreground">
                  {" "}
                  ({formatNumber(duration(range), locale)} min)
                </span>
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 border-t border-border pt-2 text-muted-foreground">
        Total process:{" "}
        <span className="font-medium text-foreground tabular-nums">
          {formatNumber(total, locale)} min
        </span>
      </p>
    </div>
  )
}

function RangedStackedBarChart({
  title = "Order Fulfillment Stages – H1 2026",
  subtitle = "Prep, pack, and ship as minute ranges.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: RangedStackedBarChartProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
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
  const total = active ? totalMinutes(active) : 0
  const prevTotal = previous ? totalMinutes(previous) : null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const monthLabel = active
    ? formatFullMonthYear(active.month, locale)
    : ""

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${formatFullMonthYear(point.month, locale)}: ${formatNumber(totalMinutes(point), locale)} min`
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

  const totalLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      width?: string | number
      height?: string | number
      index?: number
      payload?: RangedStackedBarPoint
    }) => {
      if (!liveScrubbing) return null
      const x = Number(props.x) || 0
      const y = Number(props.y) || 0
      const width = Number(props.width) || 0
      const index = props.index ?? 0
      if (index !== liveIndex) return null
      const point = props.payload ?? data[index]
      if (!point) return null

      return (
        <text
          x={x + width / 2}
          y={y - 10}
          textAnchor="middle"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {formatNumber(totalMinutes(point), locale)} min
        </text>
      )
    },
    [data, liveIndex, liveScrubbing, locale]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs last month`
    return `Ranged stacked bar chart, ${title}, ${monthLabel} ${formatNumber(total, locale)} minutes${deltaText}`
  }, [active, deltaPct, deltaUp, locale, monthLabel, title, total])

  const cellOpacity = (index: number) =>
    liveScrubbing && index !== liveIndex ? 0.4 : 1

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[640px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
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
              {formatNumber(total, locale)}
              <span className="ms-1 text-base font-medium text-muted-foreground">
                min
              </span>
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
          <p className="text-xs text-muted-foreground">{monthLabel}</p>
        </div>
      </header>

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
              }
            : undefined
        }
        className="touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={chartConfig}
          className={cn(
            chartBarContainerClassName,
            "aspect-[1.55] h-auto max-w-none sm:h-auto"
          )}
        >
          <BarChart
            accessibilityLayer
            data={data}
            barCategoryGap={narrow ? "18%" : "22%"}
            margin={
              narrow
                ? {
                    top: 28,
                    right: plotRtl ? 4 : 8,
                    left: plotRtl ? 8 : 4,
                    bottom: 4,
                  }
                : { top: 32, right: 12, left: 4, bottom: 8 }
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
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
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
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 32 : 40}
              domain={[0, 80]}
              ticks={[0, 20, 40, 60, 80]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(v: number) => formatNumber(v, locale)}
              className="tabular-nums"
            />
            <ChartTooltip
              cursor={BAR_TOOLTIP_CURSOR}
              content={<RangedTooltip locale={locale} dir={dir} />}
            />
            <BarStack radius={STACK_RADIUS}>
              {STAGE_KEYS.map((key: StageKey, stageIndex) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={`var(--color-${key})`}
                  stroke={`var(--color-${key})`}
                  maxBarSize={narrow ? 36 : 48}
                  isAnimationActive={!reducedMotion && !liveScrubbing}
                  animationDuration={reducedMotion ? 0 : BAR_MS}
                  animationEasing="ease-out"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`${key}-${index}`}
                      fillOpacity={cellOpacity(index)}
                    />
                  ))}
                  {scrub && stageIndex === STAGE_KEYS.length - 1 ? (
                    <LabelList dataKey={key} content={totalLabel} />
                  ) : null}
                </Bar>
              ))}
            </BarStack>
          </BarChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {STAGE_KEYS.map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: chartConfig[key].color }}
              aria-hidden
            />
            <span className="text-foreground">{chartConfig[key].label}</span>
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Prep</th>
            <th>Pack</th>
            <th>Ship</th>
            <th>Total min</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{formatFullMonthYear(row.month, locale)}</td>
              <td>
                {row.prep[0]}–{row.prep[1]}
              </td>
              <td>
                {row.pack[0]}–{row.pack[1]}
              </td>
              <td>
                {row.ship[0]}–{row.ship[1]}
              </td>
              <td>{totalMinutes(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function RangedStackedBarChartDemo(
  props: RangedStackedBarChartProps
) {
  return <RangedStackedBarChart {...props} />
}

export { RangedStackedBarChart }
