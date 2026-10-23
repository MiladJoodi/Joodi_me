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

import { chartBarContainerClassName } from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Timeline — locked gallery chrome with type-required ranged horizontal bars.
 * Outcome colors use semantic tokens (status); cycles = soft vs solid.
 * Installs to: components/charts/timeline.tsx
 */

export type TimelineOutcome = "success" | "error" | "pending"

export type TimelinePoint = {
  name: string
  type: string
  /** Y-axis label, e.g. `Test 1 · TR`. */
  label: string
  outcome: TimelineOutcome
  /** `[start, end]` seconds. */
  firstCycle: [number, number]
  /** `[start, end]` seconds. */
  secondCycle: [number, number]
}

export type TimelineChartProps = {
  title?: string
  subtitle?: string
  data?: TimelinePoint[]
  className?: string
  /** Time-axis direction. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard row scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const BAR_MS = 200
const BAR_RADIUS = 8
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

const OUTCOME_META: Record<
  TimelineOutcome,
  { label: string; color: string; soft: string }
> = {
  success: {
    label: "Success",
    color: "var(--chart-up)",
    soft: "color-mix(in oklab, var(--chart-up) 55%, transparent)",
  },
  error: {
    label: "Failed",
    color: "var(--destructive)",
    soft: "color-mix(in oklab, var(--destructive) 55%, transparent)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-3)",
    soft: "color-mix(in oklab, var(--chart-3) 55%, transparent)",
  },
}

const DEMO_DATA: TimelinePoint[] = [
  {
    name: "Test 1",
    type: "TR",
    label: "Test 1 · TR",
    outcome: "success",
    firstCycle: [0, 3],
    secondCycle: [4.11, 14.11],
  },
  {
    name: "Test 2",
    type: "MT",
    label: "Test 2 · MT",
    outcome: "error",
    firstCycle: [0, 1.5],
    secondCycle: [9.11, 12.11],
  },
  {
    name: "Test 3",
    type: "MT",
    label: "Test 3 · MT",
    outcome: "success",
    firstCycle: [3, 5.37],
    secondCycle: [8.74, 14.48],
  },
  {
    name: "Test 4",
    type: "MT",
    label: "Test 4 · MT",
    outcome: "error",
    firstCycle: [5.37, 7.87],
    secondCycle: [9.61, 16.98],
  },
  {
    name: "Test 5",
    type: "MT",
    label: "Test 5 · MT",
    outcome: "success",
    firstCycle: [4.87, 8.24],
    secondCycle: [10.74, 17.35],
  },
  {
    name: "Test 6",
    type: "MT",
    label: "Test 6 · MT",
    outcome: "success",
    firstCycle: [3.24, 5.74],
    secondCycle: [8.61, 17.85],
  },
  {
    name: "Test 7",
    type: "MT",
    label: "Test 7 · MT",
    outcome: "success",
    firstCycle: [2.74, 9.11],
    secondCycle: [9.74, 18.22],
  },
  {
    name: "Test 8",
    type: "MT",
    label: "Test 8 · MT",
    outcome: "pending",
    firstCycle: [9.11, 10.61],
    secondCycle: [12.11, 19.72],
  },
]

const chartConfig = {
  firstCycle: {
    label: "First cycle",
    color: "var(--chart-up)",
  },
  secondCycle: {
    label: "Second cycle",
    color: "var(--chart-up)",
  },
} satisfies ChartConfig

const BAR_TOOLTIP_CURSOR = {
  fill: "color-mix(in oklab, var(--foreground) 5%, transparent)",
} as const

function cycleDuration(range: [number, number]) {
  return Math.max(0, range[1] - range[0])
}

function rowDuration(row: TimelinePoint) {
  return cycleDuration(row.firstCycle) + cycleDuration(row.secondCycle)
}

function formatSeconds(value: number, locale: string) {
  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value)}s`
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


function TimelineBarShape({
  soft,
  dimmed,
  ...props
}: BarShapeProps & { soft?: boolean; dimmed?: boolean }) {
  const payload = props.payload as TimelinePoint | undefined
  const outcome = (payload?.outcome ?? "pending") as TimelineOutcome
  const meta = OUTCOME_META[outcome]
  const isActive = Boolean(props.isActive)
  const fill = soft ? meta.soft : meta.color

  return (
    <Rectangle
      {...props}
      radius={BAR_RADIUS}
      fill={fill}
      fillOpacity={dimmed ? 0.4 : 1}
      stroke={isActive ? meta.color : "transparent"}
      strokeWidth={isActive ? 2 : 0}
    />
  )
}

function TimelineChart({
  title = "Test timeline",
  subtitle = "Two cycles per run — colored by outcome.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: TimelineChartProps) {
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

  const barSize = narrow ? 14 : 18
  const categoryGap = narrow ? "24%" : "28%"
  const liveIndex = scrub ? activeIndex : lastIndex
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[lastIndex]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const total = active ? rowDuration(active) : 0
  const prevTotal = previous ? rowDuration(previous) : null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const rowLabel = active?.label ?? ""

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${point.label}: ${formatSeconds(rowDuration(point), locale)}, ${OUTCOME_META[point.outcome].label}`
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
      const ratio = Math.min(
        1,
        Math.max(0, (clientY - rect.top) / rect.height)
      )
      return Math.min(lastIndex, Math.floor(ratio * data.length))
    },
    [data.length, lastIndex]
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
      // Y categories are not reversed — Up/Left = previous row, Down/Right = next.
      switch (event.key) {
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(activeIndex - 1, true)
          break
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(activeIndex + 1, true)
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
    [activeIndex, lastIndex, moveActive, scrub]
  )

  const totalLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      width?: string | number
      height?: string | number
      index?: number
    }) => {
      if (!liveScrubbing) return null
      const x = Number(props.x) || 0
      const y = Number(props.y) || 0
      const width = Number(props.width) || 0
      const height = Number(props.height) || 0
      const index = props.index ?? 0
      if (index !== liveIndex) return null
      const point = data[index]
      if (!point) return null
      const sum = rowDuration(point)
      // Tip is always at x+width (width is negative when XAxis.reversed).
      const tipX = x + width
      const labelY = y + height / 2

      return (
        <text
          x={tipX + (plotRtl ? -8 : 8)}
          y={labelY}
          textAnchor={plotRtl ? "end" : "start"}
          dominantBaseline="middle"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {formatSeconds(sum, locale)}
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
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous row`
    return `Timeline, ${title}, ${rowLabel} ${formatSeconds(total, locale)}${deltaText}`
  }, [active, deltaPct, deltaUp, locale, rowLabel, title, total])

  const shapeFirst = React.useCallback(
    (props: BarShapeProps) => {
      const index = props.index ?? 0
      const dimmed = liveScrubbing && index !== liveIndex
      return <TimelineBarShape {...props} soft dimmed={dimmed} />
    },
    [liveIndex, liveScrubbing]
  )

  const shapeSecond = React.useCallback(
    (props: BarShapeProps) => {
      const index = props.index ?? 0
      const dimmed = liveScrubbing && index !== liveIndex
      return <TimelineBarShape {...props} dimmed={dimmed} />
    },
    [liveIndex, liveScrubbing]
  )

  const tooltipLabelFormatter = React.useCallback(
    (
      _value: unknown,
      payload: ReadonlyArray<{ payload?: TimelinePoint }>
    ) => {
      const row = payload?.[0]?.payload
      if (!row?.label) return null
      return (
        <span>
          {row.label}
          <span className="font-normal text-muted-foreground">
            {" · "}
            {OUTCOME_META[row.outcome].label}
          </span>
        </span>
      )
    },
    []
  )

  const tooltipFormatter = React.useCallback(
    (
      value: number | string | ReadonlyArray<number | string> | undefined,
      name: number | string | undefined
    ) => {
      if (value == null) return null
      const key = String(name ?? "")
      const label =
        key === "firstCycle" || key === "secondCycle"
          ? chartConfig[key].label
          : key
      const range = Array.isArray(value)
        ? (value as [number, number])
        : null
      const duration = range != null ? range[1] - range[0] : Number(value)

      return (
        <div className="flex w-full min-w-[10rem] flex-col gap-0.5">
          <div className="flex items-center justify-between gap-4 leading-none">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-foreground tabular-nums">
              {range
                ? `${formatSeconds(range[0], locale)} – ${formatSeconds(range[1], locale)}`
                : formatSeconds(Number(value), locale)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[11px] leading-none">
            <span className="text-muted-foreground">Duration</span>
            <span className="tabular-nums">
              {formatSeconds(duration, locale)}
            </span>
          </div>
        </div>
      )
    },
    [locale]
  )

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
              {formatSeconds(total, locale)}
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
                  vs previous row
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{rowLabel}</p>
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
            "aspect-[1.35] max-w-none sm:aspect-auto sm:h-80"
          )}
        >
          <BarChart
            accessibilityLayer
            layout="vertical"
            data={data}
            barCategoryGap={categoryGap}
            margin={
              narrow
                ? {
                    top: 10,
                    right: plotRtl ? 4 : 28,
                    left: plotRtl ? 28 : 4,
                    bottom: 8,
                  }
                : {
                    top: 12,
                    right: plotRtl ? 8 : 36,
                    left: plotRtl ? 36 : 8,
                    bottom: 8,
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
              domain={[0, "dataMax + 1"]}
              reversed={plotRtl}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={28}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={(v: number) =>
                new Intl.NumberFormat(locale).format(v)
              }
              className="tabular-nums"
            />
            <YAxis
              type="category"
              dataKey="label"
              width={narrow ? 72 : 96}
              orientation={plotRtl ? "right" : "left"}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{
                fontSize: 11,
                fill: AXIS_TICK_FILL,
              }}
            />
            <ChartTooltip
              cursor={BAR_TOOLTIP_CURSOR}
              content={
                <ChartTooltipContent
                  className="rounded-xl border-border/60 shadow-sm"
                  labelKey="label"
                  labelFormatter={tooltipLabelFormatter}
                  formatter={tooltipFormatter}
                />
              }
            />
            <Bar
              dataKey="firstCycle"
              name="firstCycle"
              maxBarSize={barSize}
              shape={shapeFirst}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : BAR_MS}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="secondCycle"
              name="secondCycle"
              maxBarSize={barSize}
              shape={shapeSecond}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : BAR_MS}
              animationEasing="ease-out"
            >
              {scrub ? (
                <LabelList dataKey="secondCycle" content={totalLabel} />
              ) : null}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {(Object.keys(OUTCOME_META) as TimelineOutcome[]).map((key) => (
          <li key={key} className="inline-flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: OUTCOME_META[key].color }}
              aria-hidden
            />
            <span className="text-foreground">{OUTCOME_META[key].label}</span>
          </li>
        ))}
        <li className="inline-flex items-center gap-2 text-muted-foreground">
          <span
            className="h-2 w-4 rounded-sm"
            style={{ background: OUTCOME_META.success.soft }}
            aria-hidden
          />
          First cycle
        </li>
        <li className="inline-flex items-center gap-2 text-muted-foreground">
          <span
            className="h-2 w-4 rounded-sm"
            style={{ background: OUTCOME_META.success.color }}
            aria-hidden
          />
          Second cycle
        </li>
      </ul>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Test</th>
            <th>Outcome</th>
            <th>First cycle</th>
            <th>Second cycle</th>
            <th>Total duration</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{OUTCOME_META[row.outcome].label}</td>
              <td>
                {row.firstCycle[0]}–{row.firstCycle[1]}
              </td>
              <td>
                {row.secondCycle[0]}–{row.secondCycle[1]}
              </td>
              <td>{rowDuration(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function TimelineDemo(props: TimelineChartProps) {
  return <TimelineChart {...props} />
}

export { TimelineChart }
