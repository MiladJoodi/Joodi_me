"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Rectangle,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  CHART_SERIES_A,
  CHART_SERIES_B,
  chartBarContainerClassName,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"

/**
 * Population Pyramid — locked gallery chrome (navy × orange).
 * Mirrored Male × Female by age (% of total) + metric header scrubber.
 * Plot geometry matches FarsiUI sample: `stackOffset="sign"`, outward tip radius,
 * always-LTR axes (Male − left / Female + right unless `plotDir="rtl"`).
 * Installs to: components/charts/population-pyramid.tsx
 */

export type PopulationPyramidPoint = {
  /** Age band label, e.g. `25–29`. */
  age: string
  /** Absolute headcount (converted to % of total for the plot). */
  male: number
  female: number
}

export type PopulationPyramidProps = {
  title?: string
  subtitle?: string
  data?: PopulationPyramidPoint[]
  className?: string
  /**
   * Male/Female sides. Default `"ltr"` (Male left, Female right) — plot does not
   * follow page `dir` (same as FarsiUI). Pass `"rtl"` to swap sides.
   */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard age-band scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
/** Outer tip radius — matches `--radius-md` / control scale (~8px). */
const TIP_RADIUS = 8
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

/**
 * Data source: https://www.populationpyramid.net/world/2024/
 * CSV columns: Age,M,F
 */
const RAW_WORLD_2024 = `
100+,110838,476160
95-99,1141691,3389124
90-94,6038458,13078242
85-89,18342182,31348041
80-84,37166893,53013079
75-79,65570812,83217973
70-74,103998992,124048996
65-69,138182244,154357035
60-64,170525048,180992721
55-59,206686596,212285997
50-54,231342779,232097236
45-49,240153677,236696232
40-44,270991534,263180352
35-39,301744799,289424003
30-34,310384416,294303405
25-29,308889349,291429439
20-24,318912554,300510028
15-19,335882343,315258559
10-14,353666705,331681954
5-9,351991008,332121131
0-4,331889289,315450649
`
  .trim()
  .split("\n")
  .map((line) => {
    const [age, m, f] = line.split(",")
    return {
      age: (age ?? "").replace("-", "–"),
      male: Number(m),
      female: Number(f),
    }
  })

const DEMO_DATA: PopulationPyramidPoint[] = RAW_WORLD_2024

const chartConfig = {
  male: {
    label: "Male",
    color: CHART_SERIES_A,
  },
  female: {
    label: "Female",
    color: CHART_SERIES_B,
  },
} satisfies ChartConfig

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

function formatPercent(val: unknown) {
  const n = Math.abs(Number(val))
  if (!Number.isFinite(n)) return ""
  return `${n.toFixed(1)}%`
}

/**
 * Tip % ink — series-tinted via `--foreground` (not `black`) so contrast holds
 * in light and dark. Mixing with black made dark-mode tips nearly invisible.
 */
const TIP_LABEL_MALE =
  "color-mix(in oklab, var(--chart-1) 42%, var(--foreground))"
const TIP_LABEL_FEMALE =
  "color-mix(in oklab, var(--chart-2) 42%, var(--foreground))"

/** Always-on tip % outside each bar — chart-local override (not Simple Bar chrome). */
function EndLabel({
  x,
  y,
  width,
  height,
  value,
  fill,
  dimmed = false,
  reducedMotion = false,
}: {
  x?: string | number
  y?: string | number
  width?: string | number
  height?: string | number
  /** Recharts Label `RenderableText`. */
  value?: unknown
  fill: string
  dimmed?: boolean
  reducedMotion?: boolean
}) {
  const nx = Number(x) || 0
  const ny = Number(y) || 0
  const nw = Number(width) || 0
  const nh = Number(height) || 0
  const nv = Number(value)
  if (!Number.isFinite(nv) || Math.abs(nv) < 0.2) return null
  const outward = nw < 0
  const labelX = outward ? nx + nw - 4 : nx + nw + 4
  return (
    <text
      x={labelX}
      y={ny + nh / 2}
      textAnchor={outward ? "end" : "start"}
      dominantBaseline="central"
      fill={fill}
      fontSize={10}
      fontFamily="var(--font-sans)"
      style={{
        opacity: dimmed ? 0.4 : 1,
        transition: reducedMotion ? undefined : "opacity 0.2s ease-out",
      }}
      className="tabular-nums"
    >
      {formatPercent(nv)}
    </text>
  )
}

/** Round the outward tip; normalize geometry so negative-width bars don’t flip corners. */
function PyramidBar(props: BarShapeProps) {
  const x = Number(props.x) || 0
  const y = Number(props.y) || 0
  const width = Number(props.width) || 0
  const height = Number(props.height) || 0
  const dataKey = String((props as { dataKey?: string }).dataKey ?? "")
  const payload = (props as { payload?: Record<string, number> }).payload
  const signed =
    dataKey && payload && typeof payload[dataKey] === "number"
      ? payload[dataKey]
      : width

  const left = Math.min(x, x + width)
  const bw = Math.abs(width)
  // Negative series → tip faces left; positive → tip faces right.
  const tipLeft = signed < 0

  return (
    <Rectangle
      {...props}
      x={left}
      y={y}
      width={bw}
      height={height}
      radius={
        tipLeft
          ? [TIP_RADIUS, 0, 0, TIP_RADIUS]
          : [0, TIP_RADIUS, TIP_RADIUS, 0]
      }
    />
  )
}

function PopulationPyramid({
  title = "World Population by Age – 2024",
  subtitle = "Male vs Female (% of total).",
  data = DEMO_DATA,
  className,
  plotDir = "ltr",
  scrub = true,
}: PopulationPyramidProps) {
  const { ref } = useChartDir()
  const plotRtl = plotDir === "rtl"
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
  const total = active ? active.male + active.female : 0
  const prevTotal = previous ? previous.male + previous.female : null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const ageLabel = active?.age ?? ""

  const grandTotal = React.useMemo(
    () => data.reduce((sum, row) => sum + row.male + row.female, 0),
    [data]
  )

  // LTR: Male − left, Female + right. Explicit plotDir="rtl" swaps sides.
  const plotData = React.useMemo(
    () =>
      data.map((row) => {
        const malePct = grandTotal > 0 ? (row.male / grandTotal) * 100 : 0
        const femalePct = grandTotal > 0 ? (row.female / grandTotal) * 100 : 0
        return {
          age: row.age,
          male: plotRtl ? malePct : -malePct,
          female: plotRtl ? -femalePct : femalePct,
          maleAbs: row.male,
          femaleAbs: row.female,
        }
      }),
    [data, grandTotal, plotRtl]
  )

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      const sum = point.male + point.female
      liveRef.current.textContent = `${point.age}: ${formatNumber(sum, locale)}`
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
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault()
          scrubbingRef.current = true
          setScrubbing(true)
          moveActive(activeIndex - 1, true)
          break
        case "ArrowDown":
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

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous band`
    return `Population pyramid, ${title}, ${ageLabel} ${formatNumber(total, locale)}${deltaText}`
  }, [active, ageLabel, deltaPct, deltaUp, locale, title, total])

  const cellOpacity = (index: number) =>
    liveScrubbing && index !== liveIndex ? 0.4 : 1

  /** Stable LabelList content — inline `label={() => …}` remounts every scrub frame. */
  const femaleTipLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      width?: string | number
      height?: string | number
      value?: unknown
      index?: number
    }) => (
      <EndLabel
        {...props}
        fill={TIP_LABEL_FEMALE}
        dimmed={liveScrubbing && (props.index ?? 0) !== liveIndex}
        reducedMotion={reducedMotion}
      />
    ),
    [liveIndex, liveScrubbing, reducedMotion]
  )

  const maleTipLabel = React.useCallback(
    (props: {
      x?: string | number
      y?: string | number
      width?: string | number
      height?: string | number
      value?: unknown
      index?: number
    }) => (
      <EndLabel
        {...props}
        fill={TIP_LABEL_MALE}
        dimmed={liveScrubbing && (props.index ?? 0) !== liveIndex}
        reducedMotion={reducedMotion}
      />
    ),
    [liveIndex, liveScrubbing, reducedMotion]
  )

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[700px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
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
                  vs previous band
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{ageLabel}</p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      {/* Plot stays LTR; side flip only via explicit plotDir="rtl". */}
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
            "aspect-square h-auto max-w-none sm:h-auto"
          )}
        >
          <BarChart
            accessibilityLayer
            layout="vertical"
            data={plotData}
            stackOffset="sign"
            barCategoryGap={1}
            margin={
              narrow
                ? { top: 8, right: 36, left: 36, bottom: 20 }
                : { top: 8, right: 52, left: 52, bottom: 28 }
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
              domain={[-10, 10]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              height={36}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
              tickFormatter={formatPercent}
              className="tabular-nums"
            />
            <YAxis
              type="category"
              dataKey="age"
              orientation="right"
              width={narrow ? 40 : 48}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fill: AXIS_TICK_FILL,
              }}
            />
            <Bar
              stackId="age"
              dataKey="female"
              fill="var(--color-female)"
              stroke="none"
              shape={PyramidBar}
              // Always-on tip % — enter animation makes labels blink on load.
              isAnimationActive={false}
            >
              {plotData.map((_, index) => (
                <Cell
                  key={`female-${index}`}
                  fillOpacity={cellOpacity(index)}
                />
              ))}
              <LabelList dataKey="female" content={femaleTipLabel} />
            </Bar>
            <Bar
              stackId="age"
              dataKey="male"
              fill="var(--color-male)"
              stroke="none"
              shape={PyramidBar}
              isAnimationActive={false}
            >
              {plotData.map((_, index) => (
                <Cell
                  key={`male-${index}`}
                  fillOpacity={cellOpacity(index)}
                />
              ))}
              <LabelList dataKey="male" content={maleTipLabel} />
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
          <span className="text-foreground">{chartConfig.male.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-2)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.female.label}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Age</th>
            <th>Male</th>
            <th>Female</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.age}>
              <td>{row.age}</td>
              <td>{row.male}</td>
              <td>{row.female}</td>
              <td>{row.male + row.female}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function PopulationPyramidDemo(props: PopulationPyramidProps) {
  return <PopulationPyramid {...props} />
}

export { PopulationPyramid }
