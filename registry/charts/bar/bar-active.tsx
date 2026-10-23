"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
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

import { chartBarContainerClassName } from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Bar Active — locked gallery chrome + chart-local featured bar stroke.
 * One category keeps a dashed outline (`activeBarIndex`); scrub updates the metric.
 * Installs to: components/charts/bar-active.tsx
 */

export type BarActivePoint = {
  /** Stable category key (also used for chartConfig / fill token). */
  browser: string
  visitors: number
  fill?: string
}

export type BarActiveProps = {
  title?: string
  subtitle?: string
  data?: BarActivePoint[]
  className?: string
  /** Category axis direction. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub (dim others, update metric). Default on. */
  scrub?: boolean
  /** Index that keeps the dashed “active” outline. Default `2`. */
  activeBarIndex?: number
}

const NARROW_MQ = "(max-width: 639px)"
const BAR_MS = 200
const BAR_RADIUS = 8
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const DEFAULT_ACTIVE_BAR = 2

/** Browser share demo — English keys matching classic bar-active. */
const DEMO_DATA: BarActivePoint[] = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 275, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
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


function categoryLabel(key: string) {
  const entry = chartConfig[key as keyof typeof chartConfig]
  return entry && "label" in entry ? String(entry.label) : key
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

function ActiveBarShape({
  featuredIndex,
  scrubbing,
  scrubIndex,
  reducedMotion,
  ...props
}: BarShapeProps & {
  featuredIndex: number
  scrubbing: boolean
  scrubIndex: number
  reducedMotion: boolean
}) {
  const index = props.index ?? 0
  const featured = index === featuredIndex
  const dimmed = scrubbing && index !== scrubIndex
  const fill =
    (props.payload as BarActivePoint | undefined)?.fill ?? props.fill

  return (
    <Rectangle
      {...props}
      fill={fill}
      fillOpacity={featured ? 0.8 : 1}
      stroke={featured ? fill : undefined}
      strokeWidth={featured ? 2 : 0}
      strokeDasharray={featured ? "4 4" : undefined}
      strokeDashoffset={featured ? 4 : undefined}
      radius={BAR_RADIUS}
      style={{
        opacity: dimmed ? 0.4 : 1,
        transition: reducedMotion ? undefined : "opacity 0.2s ease-out",
      }}
    />
  )
}

function BarActive({
  title = "Visitors by Browser",
  subtitle = "Featured bar keeps a dashed outline — scrub any category.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
  activeBarIndex = DEFAULT_ACTIVE_BAR,
}: BarActiveProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const lastIndex = Math.max(0, data.length - 1)
  const featuredIndex = Math.min(
    lastIndex,
    Math.max(0, activeBarIndex)
  )
  const [activeIndex, setActiveIndex] = React.useState(featuredIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({
    data,
    featuredIndex,
  })
  if (dataTrack.data !== data || dataTrack.featuredIndex !== featuredIndex) {
    setDataTrack({ data, featuredIndex })
    setActiveIndex(featuredIndex)
  }

  const liveIndex = scrub ? activeIndex : featuredIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[featuredIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const value = active?.visitors ?? 0
  const prevValue = previous?.visitors ?? null
  const deltaPct =
    prevValue != null && prevValue !== 0
      ? ((value - prevValue) / prevValue) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const category = active ? categoryLabel(active.browser) : ""

  const domainMax = React.useMemo(() => {
    const raw = Math.max(...data.map((row) => row.visitors), 1)
    const step = raw <= 200 ? 50 : raw <= 400 ? 50 : 100
    return Math.ceil(raw / step) * step
  }, [data])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${categoryLabel(point.browser)}: ${formatNumber(point.visitors, locale)}`
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
      if (!el || data.length === 0) return featuredIndex
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return featuredIndex
      let ratio = (clientX - rect.left) / rect.width
      if (plotRtl) ratio = 1 - ratio
      ratio = Math.min(1, Math.max(0, ratio))
      return Math.min(lastIndex, Math.floor(ratio * data.length))
    },
    [data.length, featuredIndex, lastIndex, plotRtl]
  )

  const resetToFeatured = React.useCallback(() => {
    scrubbingRef.current = false
    setScrubbing(false)
    setActiveIndex(featuredIndex)
  }, [featuredIndex])

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
    resetToFeatured()
  }, [resetToFeatured, scrub])

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
      resetToFeatured()
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
  }, [indexFromClientX, resetToFeatured, scrub])

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
          resetToFeatured()
          announce(featuredIndex)
          break
        default:
          break
      }
    },
    [
      activeIndex,
      announce,
      featuredIndex,
      lastIndex,
      moveActive,
      plotRtl,
      resetToFeatured,
      scrub,
    ]
  )

  const barShape = React.useCallback(
    (props: BarShapeProps) => (
      <ActiveBarShape
        {...props}
        featuredIndex={featuredIndex}
        scrubbing={liveScrubbing}
        scrubIndex={liveIndex}
        reducedMotion={reducedMotion}
      />
    ),
    [featuredIndex, liveIndex, liveScrubbing, reducedMotion]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous category`
    const featured = data[featuredIndex]
    const featuredText = featured
      ? `, featured ${categoryLabel(featured.browser)}`
      : ""
    return `Active bar chart, ${title}, ${category} ${formatNumber(value, locale)}${deltaText}${featuredText}`
  }, [
    active,
    category,
    data,
    deltaPct,
    deltaUp,
    featuredIndex,
    locale,
    title,
    value,
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
              {formatNumber(value, locale)}
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
            {category}
            {liveIndex === featuredIndex ? (
              <span className="text-muted-foreground/80"> · Featured</span>
            ) : null}
          </p>
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
        onBlur={scrub ? resetToFeatured : undefined}
        className="touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={chartConfig}
          className={cn(chartBarContainerClassName, "max-w-none")}
        >
          <BarChart
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
              dataKey="browser"
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
              tickFormatter={(value: string) => categoryLabel(value)}
            />
            <YAxis
              orientation={plotRtl ? "right" : "left"}
              width={narrow ? 36 : 44}
              domain={[0, domainMax]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(v: number) => formatCompact(v, locale)}
              className="tabular-nums"
            />
            <ChartTooltip
              cursor={BAR_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="w-[9rem] rounded-xl border-border/60 shadow-sm"
                  hideLabel
                />
              }
            />
            <Bar
              dataKey="visitors"
              strokeWidth={2}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : BAR_MS}
              animationEasing="ease-out"
              shape={barShape}
            />
          </BarChart>
        </ChartContainer>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Browser</th>
            <th>Visitors</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.browser}>
              <td>{categoryLabel(row.browser)}</td>
              <td>{row.visitors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function BarActiveDemo(props: BarActiveProps) {
  return <BarActive {...props} />
}

export { BarActive }
