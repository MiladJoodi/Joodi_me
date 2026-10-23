"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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

import {
  CHART_SERIES_A,
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Animated Bar Width — locked gallery chrome; type-required width scrub
 * (inactive bars scaleX 20%, active expands). Single series `--chart-1`.
 * Installs to: components/charts/animated-bar-width.tsx
 */

export type AnimatedBarWidthPoint = {
  label: string
  value: number
}

export type AnimatedBarWidthChartProps = {
  title?: string
  subtitle?: string
  data?: AnimatedBarWidthPoint[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub expands active bar. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const BAR_MS = 200
const BAR_RADIUS = 8
const IDLE_SCALE = 0.2
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const DEMO_DATA: AnimatedBarWidthPoint[] = [
  { label: "W1", value: 520 },
  { label: "W2", value: 610 },
  { label: "W3", value: 480 },
  { label: "W4", value: 720 },
  { label: "W5", value: 560 },
  { label: "W6", value: 690 },
  { label: "W7", value: 640 },
  { label: "W8", value: 580 },
  { label: "W9", value: 750 },
  { label: "W10", value: 620 },
  { label: "W11", value: 700 },
  { label: "W12", value: 670 },
]

const chartConfig = {
  value: {
    label: "Sessions",
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
  const step = raw <= 400 ? 100 : raw <= 800 ? 200 : 250
  return Math.ceil(raw / step) * step
}

function AnimatedBarWidthChart({
  title = "Weekly sessions",
  subtitle = "Hover a bar to expand its width.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: AnimatedBarWidthChartProps) {
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

  const barSize = narrow ? 28 : 36
  const categoryGap = narrow ? 4 : 6
  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[lastIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const total = active?.value ?? 0
  const prevTotal = previous?.value ?? null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const categoryLabel = active?.label ?? ""

  const domainMax = React.useMemo(
    () => niceMax(data.map((row) => row.value)),
    [data]
  )

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${point.label}: ${formatNumber(point.value, locale)}`
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

  const barShape = React.useCallback(
    (props: BarShapeProps) => {
      const index = props.index ?? 0
      const x = Number(props.x) || 0
      const width = Number(props.width) || 0
      // Idle: all bars thin. Scrub: only the active bar expands.
      const expanded =
        reducedMotion || (liveScrubbing && index === liveIndex)
      const originX = plotRtl ? x + width : x

      return (
        <>
          <Rectangle {...props} fill="transparent" />
          <Rectangle
            {...props}
            radius={BAR_RADIUS}
            fill="var(--color-value)"
            style={{
              transform: expanded ? undefined : `scaleX(${IDLE_SCALE * 100}%)`,
              transformOrigin: `${originX}px center`,
              transition: reducedMotion ? undefined : "transform 0.2s ease-out",
              pointerEvents: "none",
            }}
          />
        </>
      )
    },
    [liveIndex, liveScrubbing, plotRtl, reducedMotion]
  )

  const totalLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      width?: string | number
      index?: number
    }) => {
      if (!liveScrubbing) return null
      const x = Number(props.x) || 0
      const y = Number(props.y) || 0
      const width = Number(props.width) || 0
      const index = props.index ?? 0
      if (index !== liveIndex) return null
      const point = data[index]
      if (!point) return null

      return (
        <text
          x={x + width / 2}
          y={y - 8}
          textAnchor="middle"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {formatNumber(point.value, locale)}
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
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous`
    return `Animated bar width, ${title}, ${categoryLabel} ${formatNumber(total, locale)}${deltaText}`
  }, [active, categoryLabel, deltaPct, deltaUp, locale, title, total])

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
          <p className="text-xs text-muted-foreground">{categoryLabel}</p>
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
            barCategoryGap={categoryGap}
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
              dataKey="label"
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
              tickFormatter={(value: number) =>
                formatCompact(value, locale)
              }
              className="tabular-nums"
            />
            <ChartTooltip
              cursor={BAR_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  hideLabel
                />
              }
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              maxBarSize={barSize}
              shape={barShape}
              isAnimationActive={false}
            >
              {scrub ? (
                <LabelList dataKey="value" content={totalLabel} />
              ) : null}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.value.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Category</th>
            <th>Sessions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function AnimatedBarWidthDemo(
  props: AnimatedBarWidthChartProps
) {
  return <AnimatedBarWidthChart {...props} />
}

export { AnimatedBarWidthChart }
