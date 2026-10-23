"use client"

import * as React from "react"
import { Cell, Pie, PieChart as RechartsPieChart } from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { pieTooltipRow } from "../_lib/pie-tooltip"
import { useChartDir } from "../_lib/use-chart-dir"
import { usePrefersReducedMotion } from "../_lib/use-prefers-reduced-motion"

/**
 * Pie Stacked — nested Store (inner) × Online (outer) month rings.
 * Shared month colors; tooltip distinguishes dataKey. Tokens: `--chart-1…5`.
 * Spec: `registry/charts/PORT.md` · classic twin: `chart-pie-stacked`.
 * Installs to: components/charts/pie-stacked.tsx
 */

export type PieStackedStoreSlice = {
  month: string
  store: number
}

export type PieStackedOnlineSlice = {
  month: string
  online: number
}

export type PieStackedProps = {
  title?: string
  subtitle?: string
  storeData?: PieStackedStoreSlice[]
  onlineData?: PieStackedOnlineSlice[]
  className?: string
  /** Slice order / start angle. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / keyboard slice scrub. Default on. */
  scrub?: boolean
}

const PIE_MS = 200

const SERIES_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

const DEMO_STORE: PieStackedStoreSlice[] = [
  { month: "january", store: 186 },
  { month: "february", store: 305 },
  { month: "march", store: 237 },
  { month: "april", store: 173 },
  { month: "may", store: 209 },
]

const DEMO_ONLINE: PieStackedOnlineSlice[] = [
  { month: "january", online: 80 },
  { month: "february", online: 200 },
  { month: "march", online: 120 },
  { month: "april", online: 190 },
  { month: "may", online: 130 },
]

const MONTH_LABELS: Record<string, string> = {
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
}

function seriesColor(index: number) {
  return SERIES_VARS[index % SERIES_VARS.length]!
}

function monthLabel(month: string) {
  return MONTH_LABELS[month] ?? month
}

function buildConfig(
  storeData: PieStackedStoreSlice[],
  onlineData: PieStackedOnlineSlice[]
): ChartConfig {
  const config: ChartConfig = {
    sales: { label: "Sales" },
    store: { label: "Store" },
    online: { label: "Online" },
  }
  const months = [
    ...new Set([
      ...storeData.map((s) => s.month),
      ...onlineData.map((s) => s.month),
    ]),
  ]
  months.forEach((month, index) => {
    config[month] = {
      label: monthLabel(month),
      color: seriesColor(index),
    }
  })
  return config
}

function withStoreFills(slices: PieStackedStoreSlice[]) {
  return slices.map((slice) => ({
    ...slice,
    fill: `var(--color-${slice.month})`,
  }))
}

function withOnlineFills(slices: PieStackedOnlineSlice[]) {
  return slices.map((slice) => ({
    ...slice,
    fill: `var(--color-${slice.month})`,
  }))
}

function sumStore(slices: PieStackedStoreSlice[]) {
  return slices.reduce((acc, slice) => acc + slice.store, 0)
}

function sumOnline(slices: PieStackedOnlineSlice[]) {
  return slices.reduce((acc, slice) => acc + slice.online, 0)
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function formatPct(value: number) {
  return `${Math.round(value)}%`
}

type ActiveRing = "store" | "online"

const chartPieContainerClassName =
  "mx-auto aspect-square h-auto w-full max-w-[380px] max-h-[min(70vh,380px)] overflow-visible font-sans text-xs tabular-nums [&_.recharts-surface]:overflow-visible"

function PieStacked({
  title = "Store × Online by month",
  subtitle = "Inner store ring · outer online ring — shared month colors.",
  storeData = DEMO_STORE,
  onlineData = DEMO_ONLINE,
  className,
  plotDir,
  scrub = true,
}: PieStackedProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const reducedMotion = usePrefersReducedMotion()
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const locale = "en"

  const chartConfig = React.useMemo(
    () => buildConfig(storeData, onlineData),
    [onlineData, storeData]
  )
  const storePlot = React.useMemo(() => withStoreFills(storeData), [storeData])
  const onlinePlot = React.useMemo(
    () => withOnlineFills(onlineData),
    [onlineData]
  )

  const storeTotal = sumStore(storeData)
  const onlineTotal = sumOnline(onlineData)
  const idleTotal = storeTotal + onlineTotal

  const onlineLast = Math.max(0, onlineData.length - 1)
  const [activeRing, setActiveRing] = React.useState<ActiveRing>("online")
  const [activeIndex, setActiveIndex] = React.useState(onlineLast)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({
    onlineData,
    onlineLast,
  })
  if (
    dataTrack.onlineData !== onlineData ||
    dataTrack.onlineLast !== onlineLast
  ) {
    setDataTrack({ onlineData, onlineLast })
    setActiveRing("online")
    setActiveIndex(onlineLast)
    setScrubbing(false)
  }

  const liveScrubbing = scrub && scrubbing
  const liveRing = liveScrubbing ? activeRing : "online"
  const liveIndex = liveScrubbing
    ? activeIndex
    : liveRing === "online"
      ? onlineLast
      : Math.max(0, storeData.length - 1)

  const liveMonth =
    liveRing === "store"
      ? storeData[liveIndex]?.month
      : onlineData[liveIndex]?.month
  const liveValue =
    liveRing === "store"
      ? storeData[liveIndex]?.store
      : onlineData[liveIndex]?.online
  const ringTotal = liveRing === "store" ? storeTotal : onlineTotal
  const metricValue =
    liveScrubbing && liveValue != null ? liveValue : idleTotal
  const sharePct =
    liveScrubbing && liveValue != null && ringTotal > 0
      ? (liveValue / ringTotal) * 100
      : null
  const caption = liveScrubbing
    ? `${liveRing === "store" ? "Store" : "Online"} · ${monthLabel(liveMonth ?? "")}`
    : "Store + Online"

  const startAngle = plotRtl ? -270 : 90
  const endAngle = plotRtl ? 90 : -270

  const announce = React.useCallback(
    (ring: ActiveRing, index: number) => {
      if (!liveRef.current) return
      if (ring === "store") {
        const slice = storeData[index]
        if (!slice) return
        const pct = storeTotal > 0 ? (slice.store / storeTotal) * 100 : 0
        liveRef.current.textContent = `Store ${monthLabel(slice.month)}: ${formatNumber(slice.store, locale)} (${formatPct(pct)})`
        return
      }
      const slice = onlineData[index]
      if (!slice) return
      const pct = onlineTotal > 0 ? (slice.online / onlineTotal) * 100 : 0
      liveRef.current.textContent = `Online ${monthLabel(slice.month)}: ${formatNumber(slice.online, locale)} (${formatPct(pct)})`
    },
    [locale, onlineData, onlineTotal, storeData, storeTotal]
  )

  const activate = React.useCallback(
    (ring: ActiveRing, index: number, fromKeyboard = false) => {
      const len = ring === "store" ? storeData.length : onlineData.length
      if (len === 0) return
      const clamped = Math.min(len - 1, Math.max(0, index))
      setActiveRing(ring)
      setActiveIndex(clamped)
      setScrubbing(true)
      if (fromKeyboard) announce(ring, clamped)
    },
    [announce, onlineData.length, storeData.length]
  )

  const clearScrub = React.useCallback(() => {
    setScrubbing(false)
    setActiveRing("online")
    setActiveIndex(onlineLast)
  }, [onlineLast])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrub) return
      const reverse = plotRtl
      const ring = liveScrubbing ? activeRing : "online"
      const len = ring === "store" ? storeData.length : onlineData.length
      const last = Math.max(0, len - 1)
      const idx = liveScrubbing ? activeIndex : last

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          activate(ring, idx + (reverse ? 1 : -1), true)
          break
        case "ArrowRight":
          event.preventDefault()
          activate(ring, idx + (reverse ? -1 : 1), true)
          break
        case "ArrowUp":
          event.preventDefault()
          activate(
            "store",
            Math.min(idx, Math.max(0, storeData.length - 1)),
            true
          )
          break
        case "ArrowDown":
          event.preventDefault()
          activate("online", Math.min(idx, onlineLast), true)
          break
        case "Home":
          event.preventDefault()
          activate(ring, reverse ? last : 0, true)
          break
        case "End":
          event.preventDefault()
          activate(ring, reverse ? 0 : last, true)
          break
        case "Escape":
          event.preventDefault()
          clearScrub()
          break
        default:
          break
      }
    },
    [
      activate,
      activeIndex,
      activeRing,
      clearScrub,
      liveScrubbing,
      onlineData.length,
      onlineLast,
      plotRtl,
      scrub,
      storeData.length,
    ]
  )

  const cellOpacity = (ring: ActiveRing, index: number) => {
    if (!liveScrubbing) return 1
    if (ring !== liveRing) return 0.35
    return index === liveIndex ? 1 : 0.4
  }

  const ariaLabel = React.useMemo(() => {
    if (!liveScrubbing || liveValue == null) {
      return `Stacked pie chart, ${title}, total ${formatNumber(idleTotal, locale)}`
    }
    const pct = ringTotal > 0 ? formatPct((liveValue / ringTotal) * 100) : ""
    return `Stacked pie chart, ${title}, ${caption} ${formatNumber(liveValue, locale)} ${pct}`
  }, [
    caption,
    idleTotal,
    liveScrubbing,
    liveValue,
    locale,
    ringTotal,
    title,
  ])

  const months = React.useMemo(() => {
    const keys = [
      ...new Set([
        ...storeData.map((s) => s.month),
        ...onlineData.map((s) => s.month),
      ]),
    ]
    return keys
  }, [onlineData, storeData])

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
                <span className="font-normal">of ring</span>
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
          <RechartsPieChart accessibilityLayer>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  nameKey="month"
                  hideLabel
                  formatter={(value, _name, item) => {
                    const dataKey = String(item?.dataKey ?? "")
                    const ring =
                      dataKey === "store" || dataKey === "online"
                        ? String(chartConfig[dataKey]?.label ?? dataKey)
                        : null
                    const month = String(
                      (item?.payload as { month?: string } | undefined)
                        ?.month ?? ""
                    )
                    const monthLabel = String(
                      chartConfig[month]?.label ?? month
                    )
                    const color =
                      (typeof (item?.payload as { fill?: string } | undefined)
                        ?.fill === "string"
                        ? (item?.payload as { fill: string }).fill
                        : undefined) ??
                      (typeof item?.color === "string" ? item.color : undefined)
                    return pieTooltipRow({
                      value: Number(value),
                      label: ring ? `${ring} · ${monthLabel}` : monthLabel,
                      locale,
                      color,
                    })
                  }}
                />
              }
            />
            <Pie
              data={storePlot}
              dataKey="store"
              nameKey="month"
              cx="50%"
              cy="50%"
              outerRadius="48%"
              startAngle={startAngle}
              endAngle={endAngle}
              stroke="var(--background)"
              strokeWidth={2}
              isAnimationActive={!reducedMotion}
              animationDuration={PIE_MS}
              onMouseEnter={
                scrub ? (_, index) => activate("store", index) : undefined
              }
              onMouseLeave={scrub ? clearScrub : undefined}
            >
              {storePlot.map((slice, index) => (
                <Cell
                  key={`store-${slice.month}`}
                  fill={slice.fill}
                  fillOpacity={cellOpacity("store", index)}
                  className={cn(
                    "outline-none",
                    !reducedMotion &&
                      "transition-[fill-opacity] duration-200 ease-out"
                  )}
                  style={{ cursor: scrub ? "pointer" : undefined }}
                />
              ))}
            </Pie>
            <Pie
              data={onlinePlot}
              dataKey="online"
              nameKey="month"
              cx="50%"
              cy="50%"
              innerRadius="56%"
              outerRadius="78%"
              startAngle={startAngle}
              endAngle={endAngle}
              stroke="var(--background)"
              strokeWidth={2}
              isAnimationActive={!reducedMotion}
              animationDuration={PIE_MS}
              onMouseEnter={
                scrub ? (_, index) => activate("online", index) : undefined
              }
              onMouseLeave={scrub ? clearScrub : undefined}
            >
              {onlinePlot.map((slice, index) => (
                <Cell
                  key={`online-${slice.month}`}
                  fill={slice.fill}
                  fillOpacity={cellOpacity("online", index)}
                  className={cn(
                    "outline-none",
                    !reducedMotion &&
                      "transition-[fill-opacity] duration-200 ease-out"
                  )}
                  style={{ cursor: scrub ? "pointer" : undefined }}
                />
              ))}
            </Pie>
          </RechartsPieChart>
        </ChartContainer>
      </div>

      <div className="mx-auto flex max-w-[380px] flex-col items-center gap-3">
        <p className="text-xs text-muted-foreground">
          Inner <span className="font-medium text-foreground">Store</span>
          {" · "}
          Outer <span className="font-medium text-foreground">Online</span>
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {months.map((month, index) => (
            <li key={month} className="inline-flex items-center gap-1.5">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: seriesColor(index) }}
                aria-hidden
              />
              <span>{monthLabel(month)}</span>
            </li>
          ))}
        </ul>
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Store</th>
            <th scope="col">Online</th>
          </tr>
        </thead>
        <tbody>
          {months.map((month) => {
            const store = storeData.find((s) => s.month === month)?.store ?? 0
            const online =
              onlineData.find((s) => s.month === month)?.online ?? 0
            return (
              <tr key={`a11y-${month}`}>
                <td>{monthLabel(month)}</td>
                <td>{store}</td>
                <td>{online}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function PieStackedDemo(props: PieStackedProps) {
  return <PieStacked {...props} />
}

export { PieStacked }
