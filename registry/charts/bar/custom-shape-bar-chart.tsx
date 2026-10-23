"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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
 * Custom Shape Bar Chart — locked gallery chrome; type-required bevelled
 * bar path (diagonal cut on start edge + rounded end corner). Categorical
 * fills use `--chart-1…5` tokens. Metric header scrubber.
 * Installs to: components/charts/custom-shape-bar-chart.tsx
 */

export type CustomShapeBarPoint = {
  key: string
  name: string
  sales: number
  color: string
}

export type CustomShapeBarChartProps = {
  title?: string
  subtitle?: string
  data?: CustomShapeBarPoint[]
  className?: string
  /** Category order / Y-axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub (dim others, update metric). Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const BAR_MS = 200
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"

/** Categorical ladder — existing design tokens, not a second dual-series pair. */
const CATEGORY_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

const DEMO_DATA: CustomShapeBarPoint[] = [
  { key: "digital", name: "Digital", sales: 48, color: CATEGORY_COLORS[0] },
  { key: "fashion", name: "Fashion", sales: 36, color: CATEGORY_COLORS[1] },
  { key: "beauty", name: "Beauty", sales: 41, color: CATEGORY_COLORS[2] },
  { key: "home", name: "Home", sales: 29, color: CATEGORY_COLORS[3] },
  { key: "food", name: "Food", sales: 33, color: CATEGORY_COLORS[4] },
]

const chartConfig = {
  sales: { label: "Sales", color: CATEGORY_COLORS[0] },
  digital: { label: "Digital", color: CATEGORY_COLORS[0] },
  fashion: { label: "Fashion", color: CATEGORY_COLORS[1] },
  beauty: { label: "Beauty", color: CATEGORY_COLORS[2] },
  home: { label: "Home", color: CATEGORY_COLORS[3] },
  food: { label: "Food", color: CATEGORY_COLORS[4] },
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
  const step = raw <= 40 ? 10 : raw <= 80 ? 20 : 25
  return Math.ceil(raw / step) * step
}

function bevelPath(
  nx: number,
  ny: number,
  nw: number,
  nh: number,
  cut: number,
  r: number,
  /** Cut on the inline-start edge of the bar. */
  cutStart: boolean
) {
  if (cutStart) {
    return [
      `M${nx} ${ny + nh}`,
      `L${nx} ${ny + cut}`,
      `L${nx + cut} ${ny}`,
      `L${nx + nw - r} ${ny}`,
      `Q${nx + nw} ${ny} ${nx + nw} ${ny + r}`,
      `L${nx + nw} ${ny + nh}`,
      "Z",
    ].join(" ")
  }
  return [
    `M${nx + nw} ${ny + nh}`,
    `L${nx + nw} ${ny + cut}`,
    `L${nx + nw - cut} ${ny}`,
    `L${nx + r} ${ny}`,
    `Q${nx} ${ny} ${nx} ${ny + r}`,
    `L${nx} ${ny + nh}`,
    "Z",
  ].join(" ")
}

function CustomBar({
  props,
  activeIndex,
  scrubbing,
  uid,
  cutStart,
  reducedMotion,
}: {
  props: BarShapeProps
  activeIndex: number
  scrubbing: boolean
  uid: string
  cutStart: boolean
  reducedMotion: boolean
}) {
  const { x = 0, y = 0, width = 0, height = 0, index = 0, payload } = props
  const row = payload as CustomShapeBarPoint | undefined
  if (!row || Number(height) <= 0) return null

  const isActive = activeIndex === index
  const dimmed = scrubbing && !isActive
  const lift = !reducedMotion && isActive && scrubbing ? 6 : 0
  const nx = Math.round(Number(x))
  const ny = Math.round(Number(y) - lift)
  const nw = Math.max(Math.round(Number(width)), 1)
  const nh = Math.round(Number(height) + lift)
  const cut = Math.min(Math.floor(nw * 0.28), 14)
  const r = Math.min(Math.floor(nw / 2), 8)
  const gradId = `${uid}-bar-${row.key}`
  const shineId = `${uid}-shine-${row.key}`
  const path = bevelPath(nx, ny, nw, nh, cut, r, cutStart)
  const highlightX1 = cutStart ? nx + cut + 2 : nx + r + 2
  const highlightX2 = cutStart ? nx + nw - r - 2 : nx + nw - cut - 2

  return (
    <g
      style={{
        opacity: dimmed ? 0.4 : 1,
        transition: reducedMotion ? undefined : "opacity 0.2s ease-out",
        cursor: "pointer",
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={row.color} stopOpacity={1} />
          <stop offset="100%" stopColor={row.color} stopOpacity={0.85} />
        </linearGradient>
        <linearGradient id={shineId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.22} />
          <stop offset="55%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
      </defs>

      {isActive && scrubbing ? (
        <path
          d={path}
          fill={row.color}
          fillOpacity={0.16}
          transform="translate(0 4)"
          shapeRendering="geometricPrecision"
        />
      ) : null}

      <path
        d={path}
        fill={`url(#${gradId})`}
        stroke={isActive && scrubbing ? row.color : "none"}
        strokeWidth={isActive && scrubbing ? 1.5 : 0}
        shapeRendering="geometricPrecision"
      />
      <path
        d={path}
        fill={`url(#${shineId})`}
        style={{ pointerEvents: "none" }}
        shapeRendering="geometricPrecision"
      />
      <path
        d={`M${highlightX1} ${ny + 3} L${highlightX2} ${ny + 3}`}
        stroke="var(--background)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeOpacity={0.28}
        style={{ pointerEvents: "none" }}
      />
    </g>
  )
}

function CustomShapeBarChart({
  title = "Category sales",
  subtitle = "Monthly sales by category ($M).",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: CustomShapeBarChartProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const reducedMotion = usePrefersReducedMotion()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const uid = React.useId().replace(/:/g, "")
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
  const total = active?.sales ?? 0
  const prevTotal = previous?.sales ?? null
  const grandTotal = React.useMemo(
    () => data.reduce((sum, row) => sum + row.sales, 0),
    [data]
  )
  const sharePct =
    grandTotal > 0 && active ? (active.sales / grandTotal) * 100 : null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / prevTotal) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0
  const categoryLabel = active?.name ?? ""

  const categoryGap = narrow ? "22%" : "28%"
  const domainMax = React.useMemo(
    () => niceMax(data.map((row) => row.sales)),
    [data]
  )

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      const share =
        grandTotal > 0
          ? `, ${((point.sales / grandTotal) * 100).toFixed(0)}% of total`
          : ""
      liveRef.current.textContent = `${point.name}: ${formatNumber(point.sales, locale)}${share}`
    },
    [data, grandTotal, locale]
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
    (props: BarShapeProps) => (
      <CustomBar
        props={props}
        activeIndex={liveIndex}
        scrubbing={liveScrubbing}
        uid={uid}
        cutStart={!plotRtl}
        reducedMotion={reducedMotion}
      />
    ),
    [liveIndex, liveScrubbing, plotRtl, reducedMotion, uid]
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

      const lift = reducedMotion ? 0 : 6
      return (
        <text
          x={x + width / 2}
          y={y - lift - 10}
          textAnchor="middle"
          fill="var(--foreground)"
          style={{ fontSize: 11, fontWeight: 500 }}
          className="tabular-nums"
        >
          {formatNumber(point.sales, locale)}
        </text>
      )
    },
    [data, liveIndex, liveScrubbing, locale, reducedMotion]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous`
    const shareText =
      sharePct == null ? "" : `, ${sharePct.toFixed(0)}% of total`
    return `Custom shape bar chart, ${title}, ${categoryLabel} ${formatNumber(total, locale)}${shareText}${deltaText}`
  }, [
    active,
    categoryLabel,
    deltaPct,
    deltaUp,
    locale,
    sharePct,
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
                  vs previous
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {categoryLabel}
            {sharePct != null
              ? ` · ${sharePct.toFixed(0)}% of ${formatNumber(grandTotal, locale)}`
              : null}
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
                : { top: 36, right: 12, left: 4, bottom: 8 }
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
                  nameKey="name"
                  labelKey="name"
                  formatter={(value) => (
                    <span className="font-medium tabular-nums text-foreground">
                      {formatNumber(Number(value), locale)} $M
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="sales"
              shape={barShape}
              activeBar={barShape}
              isAnimationActive={!reducedMotion && !liveScrubbing}
              animationDuration={reducedMotion ? 0 : BAR_MS}
              animationEasing="ease-out"
            >
              {scrub ? (
                <LabelList dataKey="sales" content={totalLabel} />
              ) : null}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      <ul className="grid w-full grid-cols-2 gap-2 sm:grid-cols-5">
        {data.map((row, index) => {
          const pct = grandTotal > 0 ? (row.sales / grandTotal) * 100 : 0
          const selected = liveScrubbing && liveIndex === index
          return (
            <li key={row.key}>
              <button
                type="button"
                className={cn(
                  "flex w-full cursor-pointer flex-col gap-1.5 rounded-md border px-2.5 py-2.5 text-start transition-[border-color,background-color,box-shadow] duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
                style={{
                  borderColor: selected ? row.color : "var(--border)",
                  background: selected
                    ? `color-mix(in oklab, ${row.color} 12%, var(--background))`
                    : "var(--background)",
                  boxShadow: selected
                    ? `0 0 0 1px color-mix(in oklab, ${row.color} 35%, transparent)`
                    : undefined,
                }}
                onMouseEnter={() => {
                  if (!scrub) return
                  scrubbingRef.current = true
                  setScrubbing(true)
                  setActiveIndex(index)
                }}
                onFocus={() => {
                  if (!scrub) return
                  scrubbingRef.current = true
                  setScrubbing(true)
                  setActiveIndex(index)
                  announce(index)
                }}
                onMouseLeave={() => {
                  if (!scrub) return
                  scrubbingRef.current = false
                  setScrubbing(false)
                  setActiveIndex(lastIndex)
                }}
                onBlur={() => {
                  if (!scrub) return
                  scrubbingRef.current = false
                  setScrubbing(false)
                  setActiveIndex(lastIndex)
                }}
              >
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: row.color }}
                    aria-hidden
                  />
                  {row.name}
                </span>
                <span className="text-base font-semibold leading-none text-foreground">
                  {pct.toFixed(0)}%
                </span>
                <span
                  className="mt-0.5 h-1 w-full overflow-hidden rounded-full"
                  style={{
                    background: `color-mix(in oklab, ${row.color} 18%, transparent)`,
                  }}
                >
                  <span
                    className="block h-full rounded-full transition-[width] duration-200 ease-out"
                    style={{
                      width: `${pct}%`,
                      background: row.color,
                      opacity: selected ? 1 : 0.75,
                    }}
                  />
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Category</th>
            <th>Sales ($M)</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.key}>
              <td>{row.name}</td>
              <td>{row.sales}</td>
              <td>
                {grandTotal > 0
                  ? `${((row.sales / grandTotal) * 100).toFixed(1)}%`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function CustomShapeBarChartDemo(
  props: CustomShapeBarChartProps
) {
  return <CustomShapeBarChart {...props} />
}

export { CustomShapeBarChart }
