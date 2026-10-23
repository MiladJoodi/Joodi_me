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
  type ChartConfig,
} from "@/components/ui/chart"

import { chartBarContainerClassName } from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Waterfall — locked gallery chrome + chart-local up/down/total fills.
 * Floating range bars from a running total; metric header scrubber.
 * Installs to: components/charts/waterfall.tsx
 */

export type WaterfallRawPoint = {
  name: string
  value: number
  /** Final / subtotal column — drawn from 0, does not advance the running total. */
  isTotal?: boolean
}

export type WaterfallPoint = {
  name: string
  value: number
  waterfallRange: [number, number]
  isTotal: boolean
}

export type WaterfallProps = {
  title?: string
  subtitle?: string
  data?: WaterfallRawPoint[]
  className?: string
  /** Category axis direction. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard category scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
/** Top radius — matches `--radius-md` / control scale (~8px). */
const BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0]

const COLORS = {
  total: "var(--chart-1)",
  up: "var(--chart-up)",
  down: "var(--chart-down)",
} as const

/** P&L bridge — revenue in, costs out, profit total. */
const DEMO_RAW: WaterfallRawPoint[] = [
  { name: "Revenue", value: 420 },
  { name: "Services", value: 210 },
  { name: "Fixed costs", value: -170 },
  { name: "Variable costs", value: -120 },
  { name: "Tax", value: -60 },
  { name: "Profit", value: 280, isTotal: true },
]

const chartConfig = {
  waterfallRange: {
    label: "Value",
    color: COLORS.total,
  },
  up: {
    label: "Increase",
    color: COLORS.up,
  },
  down: {
    label: "Decrease",
    color: COLORS.down,
  },
  total: {
    label: "Total",
    color: COLORS.total,
  },
} satisfies ChartConfig

function computeWaterfallData(
  raw: ReadonlyArray<WaterfallRawPoint>
): WaterfallPoint[] {
  let runningTotal = 0

  return raw.map((entry) => {
    const { value, isTotal = false } = entry
    let barBottom: number
    let barTop: number

    if (isTotal) {
      barBottom = Math.min(0, value)
      barTop = Math.max(0, value)
    } else if (value >= 0) {
      barBottom = runningTotal
      barTop = runningTotal + value
    } else {
      barBottom = runningTotal + value
      barTop = runningTotal
    }

    if (!isTotal) {
      runningTotal += value
    }

    return {
      name: entry.name,
      value,
      waterfallRange: [barBottom, barTop],
      isTotal,
    }
  })
}

function getBarColor(entry: WaterfallPoint): string {
  if (entry.isTotal) return COLORS.total
  return entry.value >= 0 ? COLORS.up : COLORS.down
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

function formatSigned(value: number, locale: string) {
  const abs = formatNumber(Math.abs(value), locale)
  if (value > 0) return `+${abs}`
  if (value < 0) return `−${abs}`
  return abs
}

function WaterfallBar(
  props: BarShapeProps & {
    payload?: WaterfallPoint
    fillOpacity?: number
  }
) {
  const entry = props.payload
  if (!entry) return null
  const color = getBarColor(entry)
  const opacity = props.fillOpacity ?? 1

  return (
    <Rectangle
      {...props}
      fill={color}
      fillOpacity={opacity}
      radius={BAR_RADIUS}
    />
  )
}

function WaterfallTooltip({
  active,
  payload,
  locale,
  dir,
}: {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: WaterfallPoint }>
  locale: string
  /** Page/preview writing direction — plot island is LTR. */
  dir: "ltr" | "rtl"
}) {
  if (!(active && payload?.length)) return null
  const entry = payload[0]?.payload
  if (!entry?.name) return null

  return (
    <div
      dir={dir}
      className="pointer-events-none min-w-[9rem] rounded-xl border border-border/60 bg-background px-3 py-2 text-xs shadow-sm font-sans"
    >
      <p className="mb-1 font-medium text-foreground">{entry.name}</p>
      <p className="tabular-nums text-muted-foreground">
        Value{" "}
        <span className="font-medium text-foreground">
          {formatSigned(entry.value, locale)}
        </span>
      </p>
      {entry.isTotal ? (
        <p className="mt-0.5 italic text-muted-foreground">Total</p>
      ) : null}
    </div>
  )
}

function WaterfallChart({
  title = "Profit Bridge – Q1",
  subtitle = "Revenue and costs to net profit.",
  data = DEMO_RAW,
  className,
  plotDir,
  scrub = true,
}: WaterfallProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const plotData = React.useMemo(() => computeWaterfallData(data), [data])

  const lastIndex = Math.max(0, plotData.length - 1)
  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({
    data: plotData,
    lastIndex,
  })
  if (dataTrack.data !== plotData || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data: plotData, lastIndex })
    setActiveIndex(lastIndex)
  }

  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = plotData[liveIndex] ?? plotData[lastIndex]
  const previous = liveIndex > 0 ? plotData[liveIndex - 1] : null
  const value = active?.value ?? 0
  const prevValue = previous?.value ?? null
  const deltaPct =
    prevValue != null && prevValue !== 0
      ? ((value - prevValue) / Math.abs(prevValue)) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const stepLabel = active?.name ?? ""

  const domainMax = React.useMemo(() => {
    const tops = plotData.map((row) => Math.max(...row.waterfallRange, 0))
    const raw = Math.max(...tops, 1)
    const step = raw <= 400 ? 100 : raw <= 800 ? 200 : 250
    return Math.ceil(raw / step) * step
  }, [plotData])

  const announce = React.useCallback(
    (index: number) => {
      const point = plotData[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${point.name}: ${formatSigned(point.value, locale)}`
    },
    [locale, plotData]
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
      if (!el || plotData.length === 0) return lastIndex
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return lastIndex
      let ratio = (clientX - rect.left) / rect.width
      if (plotRtl) ratio = 1 - ratio
      ratio = Math.min(1, Math.max(0, ratio))
      return Math.min(lastIndex, Math.floor(ratio * plotData.length))
    },
    [lastIndex, plotData.length, plotRtl]
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
      const index = (props as { index?: number }).index ?? 0
      const fillOpacity =
        liveScrubbing && index !== liveIndex ? 0.4 : 1
      return <WaterfallBar {...props} fillOpacity={fillOpacity} />
    },
    [liveIndex, liveScrubbing]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous step`
    return `Waterfall chart, ${title}, ${stepLabel} ${formatSigned(value, locale)}${deltaText}`
  }, [active, deltaPct, deltaUp, locale, stepLabel, title, value])

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
              {formatSigned(value, locale)}
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
                  vs previous step
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {stepLabel}
            {active?.isTotal ? (
              <span className="text-muted-foreground/80"> · total</span>
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
            data={plotData}
            barCategoryGap={narrow ? "16%" : "18%"}
            margin={
              narrow
                ? { top: 20, right: 8, left: 4, bottom: 4 }
                : { top: 24, right: 12, left: 4, bottom: 8 }
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
              dataKey="name"
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tick={{
                fontSize: narrow ? 10 : 12,
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
              tickFormatter={(v: number) => formatNumber(v, locale)}
              className="tabular-nums"
            />
            <ChartTooltip
              cursor={{
                fill: "color-mix(in oklab, var(--foreground) 5%, transparent)",
              }}
              content={<WaterfallTooltip locale={locale} dir={dir} />}
            />
            <Bar
              dataKey="waterfallRange"
              shape={barShape}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: COLORS.up }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.up.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: COLORS.down }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.down.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: COLORS.total }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.total.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Step</th>
            <th>Value</th>
            <th>Kind</th>
          </tr>
        </thead>
        <tbody>
          {plotData.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.value}</td>
              <td>
                {row.isTotal
                  ? "total"
                  : row.value >= 0
                    ? "increase"
                    : "decrease"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function WaterfallDemo(props: WaterfallProps) {
  return <WaterfallChart {...props} />
}

export { WaterfallChart, computeWaterfallData }
