"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import {
  MARKET_DOWN,
  MARKET_MUTE,
  MARKET_UP,
  chartAreaGradientStops,
} from "../_lib/chart-styles"
import { useChartDir } from "../_lib/use-chart-dir"
import { useMarketNeon } from "../_lib/use-market-neon"

/**
 * Market Cards — locked gallery chrome + **neon** SVG sparklines (chart-local).
 * Three asset cards: 30-day up / KWD down / gold flat.
 * Neon glow on branded skins (`useMarketNeon`); soft fill when raw.
 * Installs to: components/charts/market-cards.tsx
 */

export type SparkPoint = { x: number; y: number }

export type MarketCardsProps = {
  title?: string
  subtitle?: string
  className?: string
  /** Reserved for gallery API parity. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
}

function softFill(color: string, opacity: number) {
  return `color-mix(in oklab, ${color} ${Math.round(opacity * 100)}%, transparent)`
}

function pointsToLinePath(points: SparkPoint[]) {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ")
}

function pointsToAreaPath(points: SparkPoint[], height: number) {
  if (points.length === 0) return ""
  const line = pointsToLinePath(points)
  const last = points[points.length - 1]!
  const first = points[0]!
  return `${line} L${last.x.toFixed(2)} ${height} L${first.x.toFixed(2)} ${height} Z`
}

function Sparkline({
  points,
  stroke,
  fillId,
  glow = false,
  className,
  height = 88,
  width = 320,
}: {
  points: SparkPoint[]
  stroke: string
  fillId: string
  glow?: boolean
  className?: string
  height?: number
  width?: number
}) {
  const last = points[points.length - 1]!
  const linePath = pointsToLinePath(points)
  const areaPath = pointsToAreaPath(points, height)
  const stops = chartAreaGradientStops(stroke, {
    startOpacity: glow ? 0.32 : 0.18,
    endOpacity: glow ? 0 : 0.02,
  })
  const glowFilterId = `${fillId}-glow`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-auto w-full overflow-visible", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          {stops.map((s) => (
            <stop
              key={s.offset}
              offset={s.offset}
              stopColor={s.stopColor}
              stopOpacity={s.stopOpacity}
            />
          ))}
        </linearGradient>
        {glow ? (
          <filter
            id={glowFilterId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ) : null}
      </defs>
      <path d={areaPath} fill={`url(#${fillId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={glow ? 2.35 : 1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        filter={glow ? `url(#${glowFilterId})` : undefined}
        style={
          glow ? { filter: `drop-shadow(0 0 7px ${stroke})` } : undefined
        }
      />
      <circle
        cx={last.x}
        cy={last.y}
        r={glow ? 4.4 : 3.4}
        fill={stroke}
        style={
          glow ? { filter: `drop-shadow(0 0 6px ${stroke})` } : undefined
        }
      />
    </svg>
  )
}

/** Step-up then climb — 30-day trend sample. */
export const TREND_POINTS: SparkPoint[] = [
  { x: 0, y: 78 },
  { x: 18, y: 72 },
  { x: 32, y: 64 },
  { x: 48, y: 58 },
  { x: 62, y: 52 },
  { x: 78, y: 56 },
  { x: 92, y: 44 },
  { x: 108, y: 48 },
  { x: 124, y: 36 },
  { x: 142, y: 40 },
  { x: 158, y: 28 },
  { x: 174, y: 32 },
  { x: 190, y: 22 },
  { x: 208, y: 18 },
  { x: 224, y: 26 },
  { x: 242, y: 20 },
  { x: 258, y: 30 },
  { x: 276, y: 24 },
  { x: 294, y: 34 },
  { x: 320, y: 28 },
]

/** Soft decline sample. */
export const KWD_POINTS: SparkPoint[] = [
  { x: 0, y: 42 },
  { x: 22, y: 48 },
  { x: 40, y: 36 },
  { x: 58, y: 52 },
  { x: 78, y: 40 },
  { x: 98, y: 58 },
  { x: 118, y: 46 },
  { x: 138, y: 62 },
  { x: 158, y: 50 },
  { x: 178, y: 64 },
  { x: 198, y: 54 },
  { x: 218, y: 68 },
  { x: 238, y: 56 },
  { x: 258, y: 70 },
  { x: 278, y: 60 },
  { x: 298, y: 66 },
  { x: 320, y: 58 },
]

/** Flat / sideways sample. */
export const GOLD_POINTS: SparkPoint[] = [
  { x: 0, y: 62 },
  { x: 28, y: 62 },
  { x: 36, y: 38 },
  { x: 78, y: 38 },
  { x: 86, y: 58 },
  { x: 128, y: 58 },
  { x: 136, y: 72 },
  { x: 188, y: 72 },
  { x: 198, y: 48 },
  { x: 248, y: 48 },
  { x: 258, y: 34 },
  { x: 320, y: 28 },
]

const cardShell =
  "w-full rounded-xl border border-border/60 bg-transparent p-5 text-foreground shadow-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

type ChangeTone = "muted" | "up" | "down"

const CHANGE_COLOR: Record<ChangeTone, string | undefined> = {
  muted: MARKET_MUTE,
  up: MARKET_UP,
  down: MARKET_DOWN,
}

function formatMoney(value: number, locale: string, currency = "USD") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)
}

function MarketAssetCard({
  title,
  code,
  price,
  badge,
  footerLabel,
  footerChange,
  changeTone = "muted",
  points,
  stroke,
  fillId,
  glow,
}: {
  title: string
  code?: string
  price: number
  badge: string
  footerLabel: string
  footerChange: string
  changeTone?: ChangeTone
  points: SparkPoint[]
  stroke: string
  fillId: string
  glow?: boolean
}) {
  const toneColor = CHANGE_COLOR[changeTone]
  const locale = "en"

  return (
    <article className={cardShell}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-start">
          <h3 className="truncate text-[17px] font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {code ? (
            <p className="mt-0.5 font-mono text-[12px] uppercase text-muted-foreground">
              {code}
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px]",
            toneColor ? "font-medium" : "bg-muted text-muted-foreground"
          )}
          style={
            toneColor
              ? {
                  color: toneColor,
                  backgroundColor: softFill(toneColor, 0.12),
                }
              : undefined
          }
        >
          {badge}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-start gap-2">
        <span className="text-[28px] font-semibold leading-none tracking-tight text-foreground tabular-nums">
          {formatMoney(price, locale)}
        </span>
      </div>

      <div className="mt-5">
        <Sparkline
          points={points}
          stroke={stroke}
          fillId={fillId}
          glow={glow}
          height={92}
        />
      </div>

      <div className="mt-3 flex items-center justify-start gap-2 text-[12px]">
        <span className="text-muted-foreground">{footerLabel}</span>
        <span
          className={cn(
            "tabular-nums",
            toneColor ? "font-medium" : "text-muted-foreground"
          )}
          style={toneColor ? { color: toneColor } : undefined}
        >
          {footerChange}
        </span>
      </div>
    </article>
  )
}

function MarketTrendCard({
  fillId,
  glow,
}: {
  fillId: string
  glow?: boolean
}) {
  return (
    <article className={cn(cardShell, "pb-6 pt-5")}>
      <div className="mb-4 flex items-start justify-between gap-3 text-[12px] text-muted-foreground">
        <span>30-day trend</span>
        <span>Sep 23 – today</span>
      </div>
      <Sparkline
        points={TREND_POINTS}
        stroke={MARKET_UP}
        fillId={fillId}
        glow={glow}
        height={140}
      />
    </article>
  )
}

function MarketCards({
  title = "Market snapshot",
  subtitle = "Neon SVG area sparklines on asset cards — up, down, and flat tones.",
  className,
  plotDir,
}: MarketCardsProps) {
  const { ref } = useChartDir()
  const neon = useMarketNeon()
  const uid = React.useId().replace(/:/g, "")
  // plotDir reserved for gallery API parity — cards inherit page dir.
  void plotDir

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-5 font-sans tabular-nums sm:gap-6",
        className
      )}
    >
      <header className="space-y-1">
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </header>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <MarketTrendCard fillId={`market-trend-${uid}`} glow={neon} />
        <MarketAssetCard
          title="Kuwaiti Dinar"
          code="kwd"
          price={2.74}
          badge="−0%"
          footerLabel="7 days"
          footerChange="−0.05%"
          changeTone="down"
          points={KWD_POINTS}
          stroke={MARKET_DOWN}
          fillId={`market-kwd-${uid}`}
          glow={neon}
        />
        <div className="md:col-span-2">
          <MarketAssetCard
            title="Gold gram"
            price={78.4}
            badge="— 0%"
            footerLabel="7 days"
            footerChange="0%"
            changeTone="muted"
            points={GOLD_POINTS}
            stroke={MARKET_MUTE}
            fillId={`market-gold-${uid}`}
            glow={neon}
          />
        </div>
      </div>
    </div>
  )
}

/** Docs / gallery default export. */
export default function MarketCardsDemo(props: MarketCardsProps) {
  return <MarketCards {...props} />
}

export { MarketCards, Sparkline, MarketAssetCard }
