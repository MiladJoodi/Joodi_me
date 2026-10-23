"use client"

import * as React from "react"
import { TriangleIcon } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
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
 * Asset Returns — locked gallery chrome (navy × orange).
 * Horizontal return % bars with on-fill portfolio value; range tabs + max/min stats.
 * Type-required custom bar shape (rounded trailing edge). Metric scrubber.
 * Installs to: components/charts/asset-returns.tsx
 */

export type AssetReturnsRangeId = "3m" | "6m" | "1y" | "3y"

export type AssetReturnsRow = {
  asset: string
  /** Return percent — bar length. */
  returnPct: number
  /** Approximate portfolio value after growth. */
  amount: number
}

export type AssetReturnsProps = {
  title?: string
  subtitle?: string
  dataByRange?: Record<AssetReturnsRangeId, AssetReturnsRow[]>
  defaultRange?: AssetReturnsRangeId
  className?: string
  /** Category axis side. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
  /** Hover / touch / keyboard scrub across assets. Default on. */
  scrub?: boolean
}

const NARROW_MQ = "(max-width: 639px)"
const AXIS_TICK_FILL =
  "color-mix(in oklab, var(--foreground) 58%, transparent)"
const ON_FILL_LABEL = "#ffffff"

const RANGES: { id: AssetReturnsRangeId; label: string }[] = [
  { id: "3m", label: "3 months" },
  { id: "6m", label: "6 months" },
  { id: "1y", label: "1 year" },
  { id: "3y", label: "3 years" },
]

const DEMO_BY_RANGE: Record<AssetReturnsRangeId, AssetReturnsRow[]> = {
  "3m": [
    { asset: "Crypto", returnPct: 28, amount: 12_804 },
    { asset: "Gold", returnPct: 14, amount: 11_420 },
    { asset: "Silver", returnPct: 12, amount: 11_185 },
    { asset: "USD", returnPct: 9, amount: 10_922 },
    { asset: "Bank savings", returnPct: 6, amount: 10_580 },
    { asset: "Equity index", returnPct: 3, amount: 10_318 },
  ],
  "6m": [
    { asset: "Crypto", returnPct: 86, amount: 18_620 },
    { asset: "Gold", returnPct: 42, amount: 14_215 },
    { asset: "Silver", returnPct: 38, amount: 13_820 },
    { asset: "USD", returnPct: 27, amount: 12_740 },
    { asset: "Bank savings", returnPct: 12, amount: 11_180 },
    { asset: "Equity index", returnPct: 8, amount: 10_795 },
  ],
  "1y": [
    { asset: "Crypto", returnPct: 214, amount: 31_420 },
    { asset: "Gold", returnPct: 98, amount: 19_824 },
    { asset: "Silver", returnPct: 86, amount: 18_640 },
    { asset: "USD", returnPct: 64, amount: 16_425 },
    { asset: "Bank savings", returnPct: 24, amount: 12_410 },
    { asset: "Equity index", returnPct: 18, amount: 11_820 },
  ],
  "3y": [
    { asset: "Crypto", returnPct: 1235, amount: 133_491 },
    { asset: "Gold", returnPct: 892, amount: 99_204 },
    { asset: "Silver", returnPct: 764, amount: 86_412 },
    { asset: "USD", returnPct: 518, amount: 61_825 },
    { asset: "Bank savings", returnPct: 186, amount: 28_640 },
    { asset: "Equity index", returnPct: 46, amount: 14_628 },
  ],
}

const DOMAIN_BY_RANGE: Record<AssetReturnsRangeId, [number, number]> = {
  "3m": [0, 40],
  "6m": [0, 100],
  "1y": [0, 250],
  "3y": [0, 1400],
}

const chartConfig = {
  returnPct: {
    label: "Return",
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

function formatPct(value: number, locale: string) {
  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value)}%`
}

function formatAmount(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatAmountCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function AssetReturns({
  title = "Asset Returns",
  subtitle = "Portfolio growth by asset class across lookback ranges.",
  dataByRange = DEMO_BY_RANGE,
  defaultRange = "3y",
  className,
  plotDir,
  scrub = true,
}: AssetReturnsProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const narrow = useNarrowViewport()
  const chartAreaRef = React.useRef<HTMLDivElement>(null)
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const scrubbingRef = React.useRef(false)
  const locale = "en"

  const [range, setRange] = React.useState<AssetReturnsRangeId>(defaultRange)
  const data = dataByRange[range] ?? DEMO_BY_RANGE[range]
  const domain = DOMAIN_BY_RANGE[range]
  const lastIndex = Math.max(0, data.length - 1)

  const [activeIndex, setActiveIndex] = React.useState(0)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [track, setTrack] = React.useState({ data, range, lastIndex })
  if (
    track.data !== data ||
    track.range !== range ||
    track.lastIndex !== lastIndex
  ) {
    setTrack({ data, range, lastIndex })
    setActiveIndex(0)
  }

  const liveIndex = scrub ? activeIndex : 0
  const liveScrubbing = scrub && scrubbing
  const active = data[liveIndex] ?? data[0]
  const previous = liveIndex > 0 ? data[liveIndex - 1] : null
  const total = active?.returnPct ?? 0
  const prevTotal = previous?.returnPct ?? null
  const deltaPct =
    prevTotal != null && prevTotal !== 0
      ? ((total - prevTotal) / Math.abs(prevTotal)) * 100
      : null
  const deltaUp = deltaPct != null && deltaPct >= 0

  const { maxRow, minRow } = React.useMemo(() => {
    let max = data[0]!
    let min = data[0]!
    for (const row of data) {
      if (row.returnPct > max.returnPct) max = row
      if (row.returnPct < min.returnPct) min = row
    }
    return { maxRow: max, minRow: min }
  }, [data])

  const ticks = React.useMemo(() => {
    const [, max] = domain
    const step = max <= 40 ? 10 : max <= 100 ? 20 : max <= 250 ? 50 : 200
    const out: number[] = []
    for (let v = 0; v <= max; v += step) out.push(v)
    return out
  }, [domain])

  const announce = React.useCallback(
    (index: number) => {
      const point = data[index]
      if (!point || !liveRef.current) return
      liveRef.current.textContent = `${point.asset}: ${formatPct(point.returnPct, locale)}, ${formatAmount(point.amount, locale)}`
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
      const ratio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height))
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
    setActiveIndex(0)
  }, [scrub])

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
      setActiveIndex(0)
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
  }, [indexFromClientY, scrub])

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
          moveActive(0, true)
          break
        default:
          break
      }
    },
    [activeIndex, lastIndex, moveActive, scrub]
  )

  const amountBar = React.useCallback(
    (props: BarShapeProps) => {
      const x = Number(props.x) || 0
      const y = Number(props.y) || 0
      // With XAxis.reversed (RTL), Recharts passes a negative width.
      const width = Number(props.width) || 0
      const height = Math.max(Number(props.height) || 0, 0)
      const bw = Math.abs(width)
      const index = props.index ?? 0
      const row =
        (props.payload as AssetReturnsRow | undefined) ?? data[index]

      if (bw < 1 || height < 1) return null

      const dimmed = liveScrubbing && index !== liveIndex
      const r = Math.min(8, height / 2, bw / 2)
      // Tip is always at x+width (left when width is negative).
      const tipX = x + width
      const tipRight = width >= 0
      const d = tipRight
        ? [
            `M${x},${y}`,
            `H${tipX - r}`,
            `Q${tipX},${y} ${tipX},${y + r}`,
            `V${y + height - r}`,
            `Q${tipX},${y + height} ${tipX - r},${y + height}`,
            `H${x}`,
            "Z",
          ].join(" ")
        : [
            `M${x},${y}`,
            `H${tipX + r}`,
            `Q${tipX},${y} ${tipX},${y + r}`,
            `V${y + height - r}`,
            `Q${tipX},${y + height} ${tipX + r},${y + height}`,
            `H${x}`,
            "Z",
          ].join(" ")

      return (
        <g opacity={dimmed ? 0.4 : 1}>
          <path d={d} fill="var(--color-returnPct)" />
          {row && bw >= 40 ? (
            <text
              x={tipRight ? tipX - 10 : tipX + 10}
              y={y + height / 2}
              textAnchor={tipRight ? "end" : "start"}
              dominantBaseline="central"
              fill={ON_FILL_LABEL}
              fontSize={11}
              fontFamily="var(--font-sans)"
              style={{ letterSpacing: 0, pointerEvents: "none" }}
              className="tabular-nums"
            >
              {bw < 72
                ? "…"
                : formatAmountCompact(row.amount, locale)}
            </text>
          ) : null}
        </g>
      )
    },
    [data, liveIndex, liveScrubbing, locale]
  )

  const ariaLabel = React.useMemo(() => {
    if (!active) return title
    const deltaText =
      deltaPct == null
        ? ""
        : `, ${deltaUp ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs previous asset`
    return `Asset returns, ${title}, ${active.asset} ${formatPct(total, locale)}${deltaText}`
  }, [active, deltaPct, deltaUp, locale, title, total])

  const rangeLabel =
    RANGES.find((item) => item.id === range)?.label ?? range

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
              {formatPct(total, locale)}
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
            {active?.asset}
            {" · "}
            {rangeLabel}
            {active ? (
              <span>
                {" · "}
                {formatAmount(active.amount, locale)}
              </span>
            ) : null}
          </p>
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div
        className={cn(
          "grid overflow-hidden rounded-[var(--radius-surface)] border border-border/70 bg-background",
          "grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)]"
        )}
      >
        <aside className="order-2 flex flex-col gap-4 border-t border-border/60 p-4 md:order-1 md:border-t-0 md:border-e">
          <section className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-foreground">
              Lookback
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {RANGES.map((item) => {
                const selected = range === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRange(item.id)}
                    className={cn(
                      "cursor-pointer rounded-md border px-2 py-2 text-xs font-medium transition-colors",
                      selected
                        ? "border-transparent text-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted/40"
                    )}
                    style={
                      selected
                        ? {
                            borderColor: "var(--chart-1)",
                            background:
                              "color-mix(in oklab, var(--chart-1) 16%, var(--background))",
                          }
                        : undefined
                    }
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-foreground">Stats</h4>
            <div className="flex flex-col gap-2">
              <div
                className="flex flex-wrap items-center justify-between gap-2 rounded-md px-2.5 py-2 text-xs"
                style={{
                  background:
                    "color-mix(in oklab, var(--chart-1) 14%, var(--background))",
                }}
              >
                <span className="shrink-0 font-medium text-muted-foreground">
                  Highest
                </span>
                <span
                  className="inline-flex items-center gap-1 font-semibold"
                  style={{ color: "var(--chart-1)" }}
                >
                  <span>{maxRow.asset}</span>
                  <span>{formatPct(maxRow.returnPct, locale)}</span>
                  <TriangleIcon
                    className="size-2.5 fill-current"
                    aria-hidden
                  />
                </span>
              </div>
              <div
                className="flex flex-wrap items-center justify-between gap-2 rounded-md px-2.5 py-2 text-xs"
                style={{
                  background:
                    "color-mix(in oklab, var(--chart-2) 14%, var(--background))",
                }}
              >
                <span className="shrink-0 font-medium text-muted-foreground">
                  Lowest
                </span>
                <span
                  className="inline-flex items-center gap-1 font-semibold"
                  style={{ color: "var(--chart-2)" }}
                >
                  <span>{minRow.asset}</span>
                  <span>{formatPct(minRow.returnPct, locale)}</span>
                  <TriangleIcon
                    className="size-2.5 rotate-180 fill-current"
                    aria-hidden
                  />
                </span>
              </div>
            </div>
          </section>
        </aside>

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
                  setActiveIndex(0)
                }
              : undefined
          }
          className="order-1 min-w-0 touch-pan-x p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:order-2 md:p-4"
        >
          <ChartContainer
            config={chartConfig}
            className={cn(
              chartBarContainerClassName,
              "aspect-auto h-[300px] max-h-none max-w-none sm:h-[320px]"
            )}
          >
            <BarChart
              accessibilityLayer
              layout="vertical"
              data={data}
              barCategoryGap="22%"
              margin={
                narrow
                  ? {
                      top: 8,
                      right: plotRtl ? 4 : 12,
                      left: plotRtl ? 12 : 4,
                      bottom: 4,
                    }
                  : {
                      top: 8,
                      right: plotRtl ? 8 : 20,
                      left: plotRtl ? 20 : 8,
                      bottom: 4,
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
                domain={domain}
                ticks={ticks}
                reversed={plotRtl}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={0}
                tick={{
                  fontSize: 12,
                  fill: AXIS_TICK_FILL,
                }}
                tickFormatter={(value: number) =>
                  new Intl.NumberFormat(locale, {
                    notation: "compact",
                    maximumFractionDigits: 0,
                  }).format(value)
                }
                className="tabular-nums"
              />
              <YAxis
                type="category"
                dataKey="asset"
                orientation={plotRtl ? "right" : "left"}
                width={narrow ? 88 : 104}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{
                  fontSize: 12,
                  fill: AXIS_TICK_FILL,
                }}
              />
              <ChartTooltip
                cursor={BAR_TOOLTIP_CURSOR}
                content={
                  <ChartTooltipContent
                    className="rounded-xl border-border/60 shadow-sm"
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | AssetReturnsRow
                        | undefined
                      return row?.asset ?? ""
                    }}
                    formatter={(value, _name, item) => {
                      const row = item?.payload as
                        | AssetReturnsRow
                        | undefined
                      if (value == null || !row) return null
                      return (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium tabular-nums text-foreground">
                            {formatPct(Number(value), locale)}
                          </span>
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            {formatAmount(row.amount, locale)}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Bar
                dataKey="returnPct"
                name="returnPct"
                fill="var(--color-returnPct)"
                shape={amountBar}
                maxBarSize={28}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
            aria-hidden
          />
          <span className="text-foreground">{chartConfig.returnPct.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--chart-2)" }}
            aria-hidden
          />
          <span className="text-foreground">Lowest highlight</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle} Range: {rangeLabel}.
        </caption>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Return %</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.asset}>
              <td>{row.asset}</td>
              <td>{row.returnPct}</td>
              <td>{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs / gallery default export. */
export default function AssetReturnsDemo(props: AssetReturnsProps) {
  return <AssetReturns {...props} />
}

export { AssetReturns }
