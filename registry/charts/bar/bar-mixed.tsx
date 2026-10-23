"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
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
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { chartBarContainerClassName } from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Bar Mixed (classic) — locked gallery chrome; type-required horizontal bars
 * with per-category fills (`--chart-1…5`). Metric header scrubber.
 * Installs to: components/charts/bar-mixed.tsx
 */

export type BarMixedPoint = {
  region: string
  sales: number
  fill: string
}

export type BarMixedProps = {
  title?: string
  subtitle?: string
  data?: BarMixedPoint[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const BAR_MS = 200
/**
 * Tip radius for horizontal bars. With `XAxis.reversed` Recharts uses a
 * negative width, so [0,8,8,0] still rounds the value tip in both LTR and RTL.
 */
const BAR_RADIUS: [number, number, number, number] = [0, 8, 8, 0]
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const DEMO_DATA: BarMixedPoint[] = [
  { region: "california", sales: 275, fill: "var(--color-california)" },
  { region: "texas", sales: 200, fill: "var(--color-texas)" },
  { region: "newYork", sales: 187, fill: "var(--color-newYork)" },
  { region: "florida", sales: 173, fill: "var(--color-florida)" },
  { region: "other", sales: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  sales: {
    label: "Sales",
  },
  california: {
    label: "California",
    color: "var(--chart-1)",
  },
  texas: {
    label: "Texas",
    color: "var(--chart-2)",
  },
  newYork: {
    label: "New York",
    color: "var(--chart-3)",
  },
  florida: {
    label: "Florida",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

const BAR_TOOLTIP_CURSOR = {
  fill: "color-mix(in oklab, var(--foreground) 5%, transparent)",
} as const

function regionLabel(key: string) {
  const entry = chartConfig[key as keyof typeof chartConfig]
  return entry && "label" in entry ? String(entry.label) : key
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

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function niceMax(values: number[]) {
  const raw = Math.max(...values, 1)
  const step = raw <= 200 ? 50 : raw <= 400 ? 100 : 100
  return Math.ceil(raw / step) * step
}

function BarMixed({
  title = "Sales by region",
  subtitle = "Mixed-color horizontal bars by region.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: BarMixedProps) {
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

  const barSize = narrow ? 22 : 28
  const categoryGap = narrow ? "18%" : "22%"
  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[lastIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const total = active?.sales ?? 0
  const prevTotal = previous?.sales ?? null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const activeRegion = active ? regionLabel(active.region) : ""

  const domainMax = React.useMemo(
    () => niceMax(data.map((row) => row.sales)),
    [data]
  )

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${regionLabel(point.region)}: ${formatNumber(point.sales, locale)}`
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

  const indexFromClientY = React.useCallback(
    (clientY: number) => {
      const el = chartAreaRef.current
      if (!el || data.length === 0) return lastIndex
      const rect = el.getBoundingClientRect()
      if (rect.height <= 0) return lastIndex
      let ratio = (clientY - rect.top) / rect.height
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
  }, [indexFromClientY, lastIndex, scrub])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrub) return
      const reverse = plotRtl
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(activeIndex + (reverse ? 1 : -1), true)
          break
        case "ArrowDown":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(activeIndex + (reverse ? -1 : 1), true)
          break
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
      payload?: BarMixedPoint
    }) => {
      if (!liveScrubbing) return null
      const x = Number(props.x) || 0
      const y = Number(props.y) || 0
      const width = Number(props.width) || 0
      const height = Number(props.height) || 0
      const index = props.index ?? 0
      if (index !== liveIndex) return null
      const point = props.payload ?? data[index]
      if (!point) return null

      // Tip is always at x+width (width is negative when XAxis.reversed).
      const tipX = x + width

      return (
        <text
          x={tipX + (plotRtl ? -8 : 8)}
          y={y + height / 2}
          textAnchor={plotRtl ? "end" : "start"}
          dominantBaseline="central"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {formatNumber(point.sales, locale)}
        </text>
      )
    },
    [data, liveIndex, liveScrubbing, locale, plotRtl]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous`
    return `Mixed bar chart, ${title}, ${activeRegion} ${formatNumber(total, locale)}${deltaText}`
  }, [active, activeRegion, deltaPct, deltaUp, locale, title, total])

  const cellOpacity = (index: number) =>
    liveScrubbing && index !== liveIndex ? 0.4 : 1

  const yAxisWidth = narrow ? 80 : 96

  const legendItems = (
    [
      "california",
      "texas",
      "newYork",
      "florida",
      "other",
    ] as const
  ).map((key) => ({
    key,
    label: chartConfig[key].label,
    color: chartConfig[key].color,
  }))

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
                  vs previous
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{activeRegion}</p>
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
          className={cn(chartBarContainerClassName, "max-w-none")}
        >
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            barCategoryGap={categoryGap}
            margin={
              narrow
                ? {
                    top: 8,
                    right: plotRtl ? 4 : liveScrubbing ? 40 : 12,
                    left: plotRtl ? (liveScrubbing ? 40 : 12) : 4,
                    bottom: 8,
                  }
                : {
                    top: 12,
                    right: plotRtl ? 4 : liveScrubbing ? 48 : 16,
                    left: plotRtl ? (liveScrubbing ? 48 : 16) : 4,
                    bottom: 12,
                  }
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
              domain={[0, domainMax]}
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
            <YAxis
              dataKey="region"
              type="category"
              orientation={plotRtl ? "right" : "left"}
              reversed={plotRtl}
              width={yAxisWidth}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(value: string) => regionLabel(value)}
            />
            <ChartTooltip
              cursor={BAR_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  hideLabel
                  nameKey="region"
                  labelFormatter={(_, payload) => {
                    const key = payload?.[0]?.payload?.region as
                      | string
                      | undefined
                    return key ? regionLabel(key) : ""
                  }}
                />
              }
            />
            <Bar
              dataKey="sales"
              radius={BAR_RADIUS}
              maxBarSize={barSize}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : BAR_MS}
              animationEasing="ease-out"
            >
              {data.map((row, index) => (
                <Cell
                  key={row.region}
                  fill={row.fill}
                  fillOpacity={cellOpacity(index)}
                />
              ))}
              {scrub ? (
                <LabelList dataKey="sales" content={totalLabel} />
              ) : null}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      <ul className="m-0 flex w-full list-none flex-wrap items-center justify-center gap-x-10 gap-y-3 p-0 text-sm text-muted-foreground">
        {legendItems.map((item) => (
          <li
            key={item.key}
            className="inline-flex shrink-0 items-center gap-2.5 px-1"
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            <span className="whitespace-nowrap text-foreground">
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Region</th>
            <th>Sales</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.region}>
              <td>{regionLabel(row.region)}</td>
              <td>{row.sales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function BarMixedDemo(props: BarMixedProps) {
  return <BarMixed {...props} />
}

export { BarMixed }
