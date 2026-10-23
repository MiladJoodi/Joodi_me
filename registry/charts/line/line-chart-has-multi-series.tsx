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
  chartLineContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Line Chart Has Multi Series — locked gallery chrome (navy × orange + semantic amber).
 * Type-required: each Line carries its own partial category `data` (overlapping windows).
 * Metric header scrubber; RTL-aware axes.
 * Installs to: components/charts/line-chart-has-multi-series.tsx
 */

export type MultiSeriesPoint = {
  category: string
  value: number
}

export type MultiSeriesDef = {
  name: string
  dataKey: string
  data: MultiSeriesPoint[]
}

export type LineChartHasMultiSeriesProps = {
  title?: string
  subtitle?: string
  series?: MultiSeriesDef[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (update metric). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const LINE_MS = 200
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

/** Third series accent — type-required multi-series, not a dual-palette invent. */
const CHART_SERIES_C = "var(--chart-3)"

const SERIES_COLORS = [CHART_SERIES_A, CHART_SERIES_B, CHART_SERIES_C] as const

const DEMO_SERIES: MultiSeriesDef[] = [
  {
    name: "New York",
    dataKey: "s1",
    data: [
      { category: "2026-01-01", value: 120 },
      { category: "2026-02-01", value: 180 },
      { category: "2026-03-01", value: 150 },
    ],
  },
  {
    name: "Chicago",
    dataKey: "s2",
    data: [
      { category: "2026-02-01", value: 90 },
      { category: "2026-03-01", value: 140 },
      { category: "2026-04-01", value: 160 },
    ],
  },
  {
    name: "Austin",
    dataKey: "s3",
    data: [
      { category: "2026-03-01", value: 70 },
      { category: "2026-04-01", value: 110 },
      { category: "2026-05-01", value: 130 },
    ],
  },
]

const chartConfig = {
  s1: { label: "New York", color: CHART_SERIES_A },
  s2: { label: "Chicago", color: CHART_SERIES_B },
  s3: { label: "Austin", color: CHART_SERIES_C },
} satisfies ChartConfig

const LINE_TOOLTIP_CURSOR = {
  stroke: "color-mix(in oklab, var(--foreground) 18%, transparent)",
  strokeWidth: 1,
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

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function collectCategories(seriesList: MultiSeriesDef[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const s of seriesList) {
    for (const point of s.data) {
      if (!seen.has(point.category)) {
        seen.add(point.category)
        out.push(point.category)
      }
    }
  }
  return out.sort()
}

function sumAtCategory(
  seriesList: MultiSeriesDef[],
  category: string
): number {
  let sum = 0
  for (const s of seriesList) {
    const hit = s.data.find((d) => d.category === category)
    if (hit) sum += hit.value
  }
  return sum
}

function SeriesLine({
  index,
  dataKey,
  data,
  name,
  reducedMotion,
  liveScrubbing,
}: {
  index: number
  dataKey: string
  data: Array<Record<string, string | number>>
  name: string
  reducedMotion: boolean
  liveScrubbing: boolean
}) {
  return (
    <Line
      type="monotone"
      dataKey={dataKey}
      data={data}
      name={name}
      stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
      strokeWidth={2.4}
      strokeOpacity={liveScrubbing ? 0.85 : 1}
      dot={false}
      isAnimationActive={!reducedMotion && !liveScrubbing}
      animationDuration={reducedMotion ? 0 : LINE_MS}
      animationEasing="ease-out"
    />
  )
}

function LineChartHasMultiSeries({
  title = "Regional Sessions – Early 2026",
  subtitle = "Overlapping multi-series windows — each line owns its categories.",
  series: seriesProp = DEMO_SERIES,
  className,
  plotDir,
  scrub = true,
}: LineChartHasMultiSeriesProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const categories = React.useMemo(
    () => collectCategories(seriesProp),
    [seriesProp]
  )
  const lastIndex = Math.max(0, categories.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({
    seriesProp,
    lastIndex,
  })
  if (
    dataTrack.seriesProp !== seriesProp ||
    dataTrack.lastIndex !== lastIndex
  ) {
    setDataTrack({ seriesProp, lastIndex })
    setActiveIndex(lastIndex)
  }

  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const activeCategory = categories[liveIndex] ?? categories[lastIndex] ?? ""
  const previousCategory =
    liveIndex > 0 ? (categories[liveIndex - 1] ?? null) : null
  const total = activeCategory
    ? sumAtCategory(seriesProp, activeCategory)
    : 0
  const prevTotal = previousCategory
    ? sumAtCategory(seriesProp, previousCategory)
    : null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const monthLabel = activeCategory
    ? formatFullMonthYear(activeCategory, locale)
    : ""

  const announce = React.useCallback(
    (index: number) => {
      const category = categories[index]
      if (!category || !liveRef.current) return
      const sum = sumAtCategory(seriesProp, category)
      liveRef.current.textContent = `${formatFullMonthYear(category, locale)}: ${formatNumber(sum, locale)}`
    },
    [categories, locale, seriesProp]
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
      if (!el || categories.length === 0) return lastIndex
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return lastIndex
      let ratio = (clientX - rect.left) / rect.width
      if (plotRtl) ratio = 1 - ratio
      ratio = Math.min(1, Math.max(0, ratio))
      return Math.min(
        lastIndex,
        Math.floor(ratio * categories.length)
      )
    },
    [categories.length, lastIndex, plotRtl]
  )

  const onChartMouseMove = React.useCallback(
    (chartState: {
      activeTooltipIndex?: number | string | null
      activeLabel?: unknown
    }) => {
      if (!scrub) return
      const label = chartState?.activeLabel
      if (label != null) {
        const idx = categories.indexOf(String(label))
        if (idx >= 0) {
          scrubbingRef.current = true
          setScrubbing(true)
          setActiveIndex(idx)
          return
        }
      }
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
      setActiveIndex(Math.min(lastIndex, Math.max(0, idx)))
    },
    [categories, lastIndex, scrub]
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
    if (!activeCategory) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs last month`
    return `Multi-series line chart, ${title}, ${monthLabel} ${formatNumber(total, locale)}${deltaText}`
  }, [
    activeCategory,
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
          className={cn(chartLineContainerClassName, "max-w-none")}
        >
          <LineChart
            accessibilityLayer
            margin={
              narrow
                ? {
                    top: 16,
                    right: plotRtl ? 4 : 8,
                    left: plotRtl ? 8 : 4,
                    bottom: 4,
                  }
                : { top: 20, right: 12, left: 4, bottom: 8 }
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
              dataKey="category"
              type="category"
              allowDuplicatedCategory={false}
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
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
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 36 : 44}
              domain={[0, 200]}
              ticks={[0, 50, 100, 150, 200]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: number) =>
                formatCompact(value, locale)
              }
              className="tabular-nums"
            />
            <ChartTooltip
              cursor={LINE_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="min-w-[12rem] rounded-xl border-border/60 shadow-sm"
                  labelFormatter={(label) => (
                    <span className="text-muted-foreground">
                      {formatFullMonthYear(String(label), locale)}
                    </span>
                  )}
                  formatter={(value, name) => {
                    const key = String(name)
                    const fromConfig =
                      chartConfig[key as keyof typeof chartConfig]?.label
                    const fromSeries =
                      seriesProp.find(
                        (s) => s.dataKey === key || s.name === key
                      )?.name
                    const label = fromConfig ?? fromSeries ?? key
                    return (
                      <div className="flex w-full flex-1 items-center justify-between gap-6">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium tabular-nums">
                          {formatNumber(Number(value), locale)}
                        </span>
                      </div>
                    )
                  }}
                />
              }
            />
            {seriesProp.map((s, index) => (
              <SeriesLine
                key={s.dataKey}
                index={index}
                dataKey={s.dataKey}
                name={s.name}
                data={s.data.map((d) => ({
                  category: d.category,
                  [s.dataKey]: d.value,
                }))}
                reducedMotion={reducedMotion}
                liveScrubbing={liveScrubbing}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {seriesProp.map((s, index) => (
          <div key={s.dataKey} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  SERIES_COLORS[index % SERIES_COLORS.length],
              }}
              aria-hidden
            />
            <span className="text-foreground">{s.name}</span>
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
            {seriesProp.map((s) => (
              <th key={s.dataKey}>{s.name}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category}>
              <td>{formatFullMonthYear(category, locale)}</td>
              {seriesProp.map((s) => {
                const hit = s.data.find((d) => d.category === category)
                return (
                  <td key={s.dataKey}>{hit ? hit.value : "—"}</td>
                )
              })}
              <td>{sumAtCategory(seriesProp, category)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function LineChartHasMultiSeriesDemo(
  props: LineChartHasMultiSeriesProps
) {
  return <LineChartHasMultiSeries {...props} />
}

export { LineChartHasMultiSeries }
