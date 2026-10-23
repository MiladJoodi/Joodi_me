"use client"

import * as React from "react"
import {
  Cell,
  Label,
  Pie,
  PieChart as RechartsPieChart,
  Sector,
  type PieSectorShapeProps,
  type TooltipContentProps,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"

import { useChartDir } from "../_lib/use-chart-dir"
import { usePrefersReducedMotion } from "../_lib/use-prefers-reduced-motion"

/**
 * Pie With Gradient — donut with radial + shine sector fills, center metric, channel cards.
 * Active expand/ring; cards drive scrub. Tokens: `--chart-1…4`. Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/pie-with-gradient.tsx
 */

export type PieWithGradientSlice = {
  key: string
  name: string
  value: number
}

export type PieWithGradientProps = {
  title?: string
  subtitle?: string
  data?: PieWithGradientSlice[]
  className?: string
  /** Slice order / start angle. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / keyboard / card scrub. Default on. */
  scrub?: boolean
}

const PIE_MS = 200

const SERIES_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
] as const

const DEMO_DATA: PieWithGradientSlice[] = [
  { key: "online", name: "online", value: 42 },
  { key: "store", name: "store", value: 28 },
  { key: "app", name: "app", value: 18 },
  { key: "partner", name: "partner", value: 12 },
]

const SLICE_LABELS: Record<string, string> = {
  online: "Online",
  store: "Store",
  app: "App",
  partner: "Partner",
}

function seriesColor(index: number) {
  return SERIES_VARS[index % SERIES_VARS.length]!
}

function buildConfig(data: PieWithGradientSlice[]): ChartConfig {
  const config: ChartConfig = {
    value: { label: "Sales" },
  }
  data.forEach((slice, index) => {
    config[slice.key] = {
      label: SLICE_LABELS[slice.key] ?? SLICE_LABELS[slice.name] ?? slice.name,
      color: seriesColor(index),
    }
  })
  return config
}

function withPlotRows(slices: PieWithGradientSlice[]) {
  return slices.map((slice, index) => ({
    ...slice,
    fill: `var(--color-${slice.key})`,
    color: seriesColor(index),
  }))
}

function sumValues(slices: PieWithGradientSlice[]) {
  return slices.reduce((acc, slice) => acc + slice.value, 0)
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function formatPct(value: number) {
  return `${Math.round(value)}%`
}

function sliceLabel(slice: PieWithGradientSlice) {
  return SLICE_LABELS[slice.key] ?? SLICE_LABELS[slice.name] ?? slice.name
}

const chartPieContainerClassName =
  "mx-auto aspect-square h-auto w-full max-w-[400px] max-h-[min(70vh,400px)] overflow-visible font-sans text-xs tabular-nums [&_.recharts-surface]:overflow-visible"

type PlotRow = ReturnType<typeof withPlotRows>[number]

function GradientSlice({
  props,
  active,
  uid,
  plotData,
}: {
  props: PieSectorShapeProps
  active: number | undefined
  uid: string
  plotData: PlotRow[]
}) {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle,
    endAngle,
    index = 0,
  } = props
  const slice = plotData[index]
  if (!slice) return null

  const isActive = active === index
  const ir = Number(innerRadius)
  const or = Number(outerRadius) + (isActive ? 6 : 0)
  const gradId = `${uid}-grad-${slice.key}`
  const shineId = `${uid}-shine-${slice.key}`

  return (
    <g style={{ cursor: "pointer" }}>
      <defs>
        <radialGradient
          id={gradId}
          cx={cx}
          cy={cy}
          r={or}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.55} />
          <stop offset="38%" stopColor={slice.color} stopOpacity={0.88} />
          <stop offset="100%" stopColor={slice.color} stopOpacity={1} />
        </radialGradient>
        <linearGradient
          id={shineId}
          x1={cx - or}
          y1={cy - or}
          x2={cx + or}
          y2={cy + or}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.28} />
          <stop offset="45%" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.08} />
        </linearGradient>
      </defs>

      {isActive ? (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={ir}
          outerRadius={or + 2}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={slice.color}
          fillOpacity={0.18}
          stroke="none"
          cornerRadius={10}
        />
      ) : null}

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={ir}
        outerRadius={or}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={`url(#${gradId})`}
        stroke="var(--background)"
        strokeWidth={3}
        cornerRadius={10}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={ir}
        outerRadius={or}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={`url(#${shineId})`}
        stroke="none"
        cornerRadius={10}
        style={{ pointerEvents: "none" }}
      />

      {isActive ? (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={or + 5}
          outerRadius={or + 9}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={slice.color}
          stroke="none"
          cornerRadius={4}
        />
      ) : null}
    </g>
  )
}

function GradientTooltip({
  active,
  payload,
  total,
  locale,
}: TooltipContentProps & { total: number; locale: string }) {
  if (!(active && payload?.length)) return null
  const row = payload[0]?.payload as PlotRow | undefined
  if (!row) return null
  const pct = total > 0 ? (row.value / total) * 100 : 0
  return (
    <div className="min-w-[10rem] rounded-md border border-border bg-background px-3 py-2.5 font-sans text-xs shadow-sm">
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className="size-2.5 rounded-full"
          style={{ background: row.color }}
        />
        <span className="font-medium text-foreground">{sliceLabel(row)}</span>
      </div>
      <p className="text-muted-foreground">
        Sales:{" "}
        <span className="font-semibold text-foreground">
          {formatNumber(row.value, locale)}
        </span>
      </p>
      <p className="mt-0.5 text-muted-foreground">
        Share:{" "}
        <span className="font-semibold text-foreground">{formatPct(pct)}</span>
      </p>
    </div>
  )
}

function CenterLabel({
  active,
  plotData,
  total,
  locale,
}: {
  active: number | undefined
  plotData: PlotRow[]
  total: number
  locale: string
}) {
  const slice = active != null ? plotData[active] : null
  const pct = slice && total > 0 ? (slice.value / total) * 100 : null

  return (
    <Label
      content={({ viewBox }) => {
        if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
        const { cx, cy } = viewBox
        const ir =
          "innerRadius" in viewBox && typeof viewBox.innerRadius === "number"
            ? viewBox.innerRadius
            : 70
        const discR = Math.max(ir * 0.72, 36)
        const labelSize = Math.max(10, Math.round(discR * 0.2))
        const valueSize = Math.max(18, Math.round(discR * 0.42))
        return (
          <g>
            <circle
              cx={cx}
              cy={cy}
              r={discR}
              fill="var(--background)"
              stroke="var(--border)"
              strokeWidth={1}
              opacity={0.95}
            />
            <text
              x={cx}
              y={cy - discR * 0.22}
              textAnchor="middle"
              fill="var(--muted-foreground)"
              style={{
                fontSize: labelSize,
                fontFamily: "var(--font-sono-sans), var(--font-sans)",
              }}
            >
              {slice ? sliceLabel(slice) : "Total sales"}
            </text>
            <text
              x={cx}
              y={cy + discR * 0.28}
              textAnchor="middle"
              fill={slice ? slice.color : "var(--foreground)"}
              style={{
                fontSize: valueSize,
                fontWeight: 700,
                fontFamily: "var(--font-sono-sans), var(--font-sans)",
              }}
            >
              {slice
                ? formatPct(pct!)
                : formatNumber(total, locale)}
            </text>
          </g>
        )
      }}
    />
  )
}

function PieWithGradient({
  title = "Sales by channel",
  subtitle = "Gradient donut with channel cards — hover a slice or card.",
  data = DEMO_DATA,
  className,
  plotDir,
  scrub = true,
}: PieWithGradientProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const reducedMotion = usePrefersReducedMotion()
  const uid = React.useId().replace(/:/g, "")
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const locale = "en"

  const chartConfig = React.useMemo(() => buildConfig(data), [data])
  const plotData = React.useMemo(() => withPlotRows(data), [data])
  const total = sumValues(data)
  const lastIndex = Math.max(0, data.length - 1)

  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined
  )
  const [dataTrack, setDataTrack] = React.useState(data)
  if (dataTrack !== data) {
    setDataTrack(data)
    setActiveIndex(undefined)
  }

  const liveScrubbing = scrub && activeIndex != null
  const liveIndex = liveScrubbing ? activeIndex : undefined
  const liveSlice =
    liveIndex != null ? (data[liveIndex] ?? undefined) : undefined
  const metricValue = liveSlice ? liveSlice.value : total
  const sharePct =
    liveSlice && total > 0 ? (liveSlice.value / total) * 100 : null
  const caption = liveSlice ? sliceLabel(liveSlice) : "All channels"

  const startAngle = plotRtl ? -270 : 90
  const endAngle = plotRtl ? 90 : -270

  const announce = React.useCallback(
    (index: number) => {
      if (!liveRef.current) return
      const slice = data[index]
      if (!slice) return
      const pct = total > 0 ? (slice.value / total) * 100 : 0
      liveRef.current.textContent = `${sliceLabel(slice)}: ${formatNumber(slice.value, locale)} (${formatPct(pct)})`
    },
    [data, locale, total]
  )

  const activate = React.useCallback(
    (index: number, fromKeyboard = false) => {
      if (!scrub || data.length === 0) return
      const clamped = Math.min(lastIndex, Math.max(0, index))
      setActiveIndex(clamped)
      if (fromKeyboard) announce(clamped)
    },
    [announce, data.length, lastIndex, scrub]
  )

  const clearScrub = React.useCallback(() => {
    setActiveIndex(undefined)
  }, [])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrub) return
      const reverse = plotRtl
      const idx = activeIndex ?? (reverse ? lastIndex : 0)

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          activate(idx + (reverse ? 1 : -1), true)
          break
        case "ArrowRight":
          event.preventDefault()
          activate(idx + (reverse ? -1 : 1), true)
          break
        case "Home":
          event.preventDefault()
          activate(reverse ? lastIndex : 0, true)
          break
        case "End":
          event.preventDefault()
          activate(reverse ? 0 : lastIndex, true)
          break
        case "Escape":
          event.preventDefault()
          clearScrub()
          break
        default:
          break
      }
    },
    [activate, activeIndex, clearScrub, lastIndex, plotRtl, scrub]
  )

  const ariaLabel = React.useMemo(() => {
    if (!liveSlice) {
      return `Donut chart, ${title}, total ${formatNumber(total, locale)}`
    }
    const pct = total > 0 ? formatPct((liveSlice.value / total) * 100) : ""
    return `Donut chart, ${title}, ${caption} ${formatNumber(liveSlice.value, locale)} ${pct}`
  }, [caption, liveSlice, locale, title, total])

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[440px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
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
              {formatNumber(metricValue, locale)}
            </p>
            {sharePct != null ? (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground"
                style={{
                  backgroundColor:
                    "color-mix(in oklab, var(--foreground) 8%, transparent)",
                }}
              >
                {formatPct(sharePct)}
                <span className="font-normal">of total</span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{caption}</p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div
        dir="ltr"
        role="img"
        aria-label={ariaLabel}
        tabIndex={scrub ? 0 : undefined}
        onKeyDown={scrub ? onKeyDown : undefined}
        onBlur={scrub ? clearScrub : undefined}
        className="touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChartContainer
          config={chartConfig}
          className={cn(chartPieContainerClassName, "max-w-none")}
        >
          <RechartsPieChart
            accessibilityLayer
            margin={{ top: 12, right: 12, bottom: 12, left: 12 }}
          >
            <Pie
              data={plotData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="56%"
              outerRadius="82%"
              startAngle={startAngle}
              endAngle={endAngle}
              paddingAngle={3}
              cornerRadius={10}
              isAnimationActive={!reducedMotion}
              animationDuration={PIE_MS}
              shape={(props) => (
                <GradientSlice
                  props={props}
                  active={liveIndex}
                  uid={uid}
                  plotData={plotData}
                />
              )}
              onMouseEnter={
                scrub ? (_, index) => activate(index) : undefined
              }
              onMouseLeave={scrub ? clearScrub : undefined}
            >
              {plotData.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
              <CenterLabel
                active={liveIndex}
                plotData={plotData}
                total={total}
                locale={locale}
              />
            </Pie>
            <ChartTooltip
              content={(tooltipProps) => (
                <GradientTooltip
                  {...tooltipProps}
                  total={total}
                  locale={locale}
                />
              )}
            />
          </RechartsPieChart>
        </ChartContainer>
      </div>

      <ul className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
        {plotData.map((slice, index) => {
          const pct = total > 0 ? (slice.value / total) * 100 : 0
          const selected = liveIndex === index
          return (
            <li key={slice.key}>
              <button
                type="button"
                disabled={!scrub}
                onMouseEnter={scrub ? () => activate(index) : undefined}
                onFocus={scrub ? () => activate(index) : undefined}
                onMouseLeave={scrub ? clearScrub : undefined}
                onBlur={scrub ? clearScrub : undefined}
                className={cn(
                  "flex w-full cursor-pointer flex-col gap-1.5 rounded-md border px-2.5 py-2.5 text-start transition-[border-color,background-color,box-shadow] duration-200 disabled:cursor-not-allowed disabled:opacity-70",
                  !reducedMotion && "ease-out"
                )}
                style={{
                  borderColor: selected ? slice.color : "var(--border)",
                  background: selected
                    ? `color-mix(in oklab, ${slice.color} 12%, var(--background))`
                    : "var(--background)",
                  boxShadow: selected
                    ? `0 0 0 1px color-mix(in oklab, ${slice.color} 35%, transparent)`
                    : undefined,
                }}
              >
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: slice.color }}
                  />
                  {sliceLabel(slice)}
                </span>
                <span className="text-base font-semibold leading-none text-foreground">
                  {formatPct(pct)}
                </span>
                <span
                  className="mt-0.5 h-1 w-full overflow-hidden rounded-full"
                  style={{
                    background: `color-mix(in oklab, ${slice.color} 18%, transparent)`,
                  }}
                >
                  <span
                    className={cn(
                      "block h-full rounded-full",
                      !reducedMotion && "transition-[width] duration-200"
                    )}
                    style={{
                      width: `${pct}%`,
                      background: slice.color,
                      opacity: selected ? 1 : 0.75,
                    }}
                  />
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {formatNumber(slice.value, locale)} sales
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((slice) => (
            <tr key={`a11y-${slice.key}`}>
              <td>{sliceLabel(slice)}</td>
              <td>{slice.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PieWithGradientDemo(props: PieWithGradientProps) {
  return <PieWithGradient {...props} />
}

export { PieWithGradient }
