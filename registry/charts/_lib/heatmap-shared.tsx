"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { CHART_SERIES_A } from "./chart-styles"
import { useChartDir, type ChartDir } from "./use-chart-dir"

/**
 * Shared Heatmap helpers — calendar + matrix SVG grids.
 * EN / Gregorian; week starts Sunday (GitHub-style).
 * Layout flips with page `dir` via `useChartDir`.
 */

export const EN_WEEKDAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const

export const EN_WEEKDAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"] as const

export type HeatDayValue = { date: Date | string; value: number }

/** Sun=0 … Sat=6. */
export function sunWeekday(date: Date) {
  return date.getDay()
}

export function dayKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function addDays(date: Date, n: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + n)
  return next
}

export function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** Deterministic LCG for demo data. */
export function seededRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 0x100000000
  }
}

export function generateCalendarHeatData(
  days: number,
  seed: number,
  end: Date = new Date()
): HeatDayValue[] {
  const rnd = seededRandom(seed)
  const last = startOfLocalDay(end)
  const out: HeatDayValue[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(last, -i)
    const dow = sunWeekday(date)
    const weekendBoost = dow === 0 || dow === 6 ? 1.35 : 1
    const spike = rnd() > 0.92 ? 2.4 : 1
    const value = Math.floor(rnd() * 14 * weekendBoost * spike)
    if (value > 0) out.push({ date, value })
  }
  return out
}

export function generateMatrixHeatData(
  rows: number,
  cols: number,
  seed: number
): number[][] {
  const rnd = seededRandom(seed)
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const hourPeak = Math.exp(-Math.pow((c - 14) / 6, 2))
      const evening = Math.exp(-Math.pow((c - 21) / 3.5, 2))
      const friBoost = r === 5 ? 1.25 : 1
      return Math.round(
        (8 + rnd() * 40 + hourPeak * 90 + evening * 70) * friBoost
      )
    })
  )
}

const LEVEL_OPACITY = [0.08, 0.28, 0.48, 0.72, 1] as const

function levelOf(value: number, max: number) {
  if (!value || value <= 0) return 0
  return Math.min(4, 1 + Math.floor((value / (max || 1)) * 3.999))
}

function formatHeatCount(value: number, locale = "en") {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
    value
  )
}

function formatHeatDay(date: Date, locale = "en") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function formatHeatMonth(date: Date, locale = "en") {
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(date)
}

function HeatLegend({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span>Less</span>
      <div className="flex items-center gap-1">
        {LEVEL_OPACITY.map((opacity, i) => (
          <span
            key={i}
            className="size-2.5 rounded-[3px] ring-1 ring-foreground/10"
            style={{
              background:
                i === 0
                  ? "color-mix(in oklab, var(--foreground) 10%, transparent)"
                  : color,
              opacity: i === 0 ? 1 : opacity,
            }}
          />
        ))}
      </div>
      <span>More</span>
    </div>
  )
}

function useContainerWidth<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null)
  const [width, setWidth] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width))
    })
    ro.observe(el)
    setWidth(Math.round(el.clientWidth))
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

type TooltipState = {
  x: number
  y: number
  title: string
  value: string
}

function FloatingTip({
  tip,
  width,
  dir,
}: {
  tip: TooltipState | null
  width: number
  dir: ChartDir
}) {
  if (!tip) return null
  const nearStart =
    dir === "rtl"
      ? tip.x > Math.max(width - 180, width * 0.6)
      : tip.x < Math.min(180, width * 0.4)
  const shift =
    dir === "rtl"
      ? nearStart
        ? "calc(-100% - 12px)"
        : "12px"
      : nearStart
        ? "12px"
        : "calc(-100% - 12px)"

  return (
    <div
      role="tooltip"
      dir={dir}
      className="pointer-events-none absolute z-20 min-w-36 max-w-56 rounded-xl border border-border/80 bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur-md"
      style={{
        left: tip.x,
        top: tip.y,
        transform: `translate(${shift}, -50%)`,
      }}
    >
      <p className="font-medium text-foreground">{tip.title}</p>
      <p className="mt-0.5 text-muted-foreground">{tip.value}</p>
    </div>
  )
}

export type CalendarHeatmapProps = {
  title?: string
  subtitle?: string
  data: HeatDayValue[]
  days?: number
  end?: Date
  holidays?: (Date | string)[]
  unit?: string
  color?: string
  className?: string
  /** Category / week growth direction. Omit to follow page `dir`. */
  plotDir?: "ltr" | "rtl"
}

export function CalendarHeatmap({
  title = "Calendar Heatmap",
  subtitle = "Year of daily activity — Sunday-start weeks, intensity by count.",
  data,
  days = 365,
  end,
  holidays,
  unit = "orders",
  color = CHART_SERIES_A,
  className,
  plotDir,
}: CalendarHeatmapProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const locale = "en"

  const last = React.useMemo(
    () => startOfLocalDay(end ?? new Date()),
    [end]
  )
  const holidaySet = React.useMemo(
    () =>
      new Set(
        (holidays ?? []).map((d) =>
          typeof d === "string" ? d.slice(0, 10) : dayKey(d)
        )
      ),
    [holidays]
  )

  const { cells, weekCount, max, total, rangeIndexes } = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const row of data) {
      const key =
        typeof row.date === "string" ? row.date.slice(0, 10) : dayKey(row.date)
      map.set(key, (map.get(key) ?? 0) + row.value)
    }
    let first = addDays(last, -(days - 1))
    first = addDays(first, -sunWeekday(first))
    const out: {
      date: Date
      key: string
      value: number
      week: number
      dow: number
      inRange: boolean
    }[] = []
    const rangeStart = addDays(last, -(days - 1))
    for (let d = first, i = 0; d <= last; d = addDays(d, 1), i++) {
      const key = dayKey(d)
      out.push({
        date: d,
        key,
        value: map.get(key) ?? 0,
        week: Math.floor(i / 7),
        dow: sunWeekday(d),
        inRange: d >= rangeStart,
      })
    }
    const inRange = out.filter((c) => c.inRange)
    const indexes = out
      .map((c, i) => (c.inRange ? i : -1))
      .filter((i) => i >= 0)
    return {
      cells: out,
      weekCount: Math.ceil(out.length / 7),
      max: Math.max(1, ...inRange.map((c) => c.value)),
      total: inRange.reduce((sum, cell) => sum + cell.value, 0),
      rangeIndexes: indexes,
    }
  }, [data, days, last])

  const [wrapRef, width] = useContainerWidth<HTMLDivElement>()
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const [active, setActive] = React.useState<number | null>(null)
  const [tip, setTip] = React.useState<TooltipState | null>(null)

  const describe = React.useCallback(
    (c: (typeof cells)[number]) => {
      const label = formatHeatDay(c.date, locale)
      return holidaySet.has(c.key) ? `${label} (holiday)` : label
    },
    [holidaySet, locale]
  )

  const side = 22
  const head = 20
  const gap = 3
  const fit = (w: number) => {
    const ideal = (w - side) / weekCount - gap
    if (ideal >= 10) return { cell: Math.min(15, ideal), skip: 0 }
    const shown = Math.max(1, Math.floor((w - side) / (10 + gap)))
    return { cell: 10, skip: Math.max(0, weekCount - shown) }
  }

  const { cell, skip } = width > 0 ? fit(width) : { cell: 12, skip: 0 }
  const pitch = cell + gap
  const height = head + 7 * pitch
  const labelEdge = plotRtl ? width - 4 : 4
  const labelAnchor = plotRtl ? "end" : "start"
  const gridStart = plotRtl ? Math.max(side, width - side) : side

  const months = React.useMemo(() => {
    const list: { week: number; label: string }[] = []
    for (const c of cells) {
      if (!c.inRange || c.week < skip) continue
      const day = c.date.getDate()
      if (day === 1 || (list.length === 0 && c.dow === 0)) {
        list.push({
          week: c.week,
          label: formatHeatMonth(c.date, locale),
        })
      }
    }
    return list.filter((m, i, arr) => {
      if (i === 0) return true
      return (m.week - arr[i - 1]!.week) * pitch > 28
    })
  }, [cells, locale, pitch, skip])

  const cx = (week: number) =>
    plotRtl
      ? gridStart - (week - skip + 1) * pitch + gap / 2
      : gridStart + (week - skip) * pitch + gap / 2
  const cy = (dow: number) => head + dow * pitch

  const showTip = React.useCallback(
    (index: number, el: SVGRectElement) => {
      const c = cells[index]!
      const box = el.ownerSVGElement?.getBoundingClientRect()
      const rect = el.getBoundingClientRect()
      if (!box) return
      setActive(index)
      setTip({
        x: rect.left - box.left + rect.width / 2,
        y: rect.top - box.top + rect.height / 2,
        title: describe(c),
        value: c.value
          ? `${formatHeatCount(c.value, locale)} ${unit}`
          : `No ${unit}`,
      })
      if (liveRef.current) {
        liveRef.current.textContent = `${describe(c)}: ${
          c.value
            ? `${formatHeatCount(c.value, locale)} ${unit}`
            : `No ${unit}`
        }`
      }
    },
    [cells, describe, locale, unit]
  )

  const clearTip = React.useCallback(() => {
    setActive(null)
    setTip(null)
  }, [])

  const moveActive = React.useCallback(
    (nextIndex: number) => {
      if (rangeIndexes.length === 0) return
      const clamped = Math.min(
        rangeIndexes.length - 1,
        Math.max(0, nextIndex)
      )
      const cellIndex = rangeIndexes[clamped]!
      const c = cells[cellIndex]
      if (!c) return
      setActive(cellIndex)
      setTip(null)
      if (liveRef.current) {
        liveRef.current.textContent = `${describe(c)}: ${
          c.value
            ? `${formatHeatCount(c.value, locale)} ${unit}`
            : `No ${unit}`
        }`
      }
    },
    [cells, describe, locale, rangeIndexes, unit]
  )

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (rangeIndexes.length === 0) return
      const currentPos =
        active == null
          ? rangeIndexes.length - 1
          : Math.max(0, rangeIndexes.indexOf(active))
      const reverse = plotRtl
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          moveActive(currentPos + (reverse ? 7 : -7))
          break
        case "ArrowRight":
          event.preventDefault()
          moveActive(currentPos + (reverse ? -7 : 7))
          break
        case "ArrowUp":
          event.preventDefault()
          moveActive(currentPos - 1)
          break
        case "ArrowDown":
          event.preventDefault()
          moveActive(currentPos + 1)
          break
        case "Home":
          event.preventDefault()
          moveActive(0)
          break
        case "End":
          event.preventDefault()
          moveActive(rangeIndexes.length - 1)
          break
        case "Escape":
          event.preventDefault()
          clearTip()
          break
        default:
          break
      }
    },
    [active, clearTip, moveActive, plotRtl, rangeIndexes]
  )

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[760px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
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
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="text-[12px] text-muted-foreground">
            {formatHeatCount(total, locale)} {unit} over {days} days
          </p>
          <HeatLegend color={color} />
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div
        ref={wrapRef}
        className="relative w-full rounded-[var(--radius-surface)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerLeave={clearTip}
        onBlur={clearTip}
      >
        {width > 0 && (
          <svg
            width={width}
            height={height}
            className="overflow-visible"
            role="img"
            aria-label={title}
          >
            {months.map((m) => (
              <text
                key={`${m.week}-${m.label}`}
                x={cx(m.week) + cell / 2}
                y={11}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {m.label}
              </text>
            ))}
            {EN_WEEKDAYS_SHORT.map((d, i) =>
              cell < 11 && i % 2 === 1 ? null : (
                <text
                  key={`${d}-${i}`}
                  x={labelEdge}
                  y={cy(i) + cell * 0.72}
                  textAnchor={labelAnchor}
                  className="fill-muted-foreground text-[9px]"
                >
                  {d}
                </text>
              )
            )}
            {cells.map((c, i) => {
              if (!c.inRange || c.week < skip) return null
              const lvl = levelOf(c.value, max)
              const isActive = active === i
              const isHoliday = holidaySet.has(c.key)
              return (
                <rect
                  key={c.key}
                  x={cx(c.week)}
                  y={cy(c.dow)}
                  width={cell}
                  height={cell}
                  rx={Math.min(4, cell / 3.2)}
                  fill={
                    lvl === 0
                      ? "color-mix(in oklab, var(--foreground) 10%, transparent)"
                      : color
                  }
                  fillOpacity={lvl === 0 ? 1 : LEVEL_OPACITY[lvl]}
                  stroke={
                    isActive
                      ? "var(--foreground)"
                      : isHoliday
                        ? "var(--destructive)"
                        : "transparent"
                  }
                  strokeWidth={isActive ? 1.75 : isHoliday ? 1.25 : 0}
                  className="cursor-pointer transition-[filter,opacity] duration-150"
                  style={{
                    filter: isActive
                      ? "drop-shadow(0 0 6px color-mix(in oklab, var(--foreground) 35%, transparent))"
                      : undefined,
                  }}
                  onPointerEnter={(e) => showTip(i, e.currentTarget)}
                />
              )
            })}
          </svg>
        )}
        <FloatingTip tip={tip} width={width} dir={dir} />
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>{unit}</th>
          </tr>
        </thead>
        <tbody>
          {cells
            .filter((c) => c.inRange)
            .map((c) => (
              <tr key={c.key}>
                <td>{c.key}</td>
                <td>{c.value}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export type MatrixHeatmapProps = {
  title?: string
  subtitle?: string
  rows: string[]
  cols: string[]
  values: number[][]
  color?: string
  showValues?: boolean
  valueUnit?: string
  className?: string
  plotDir?: "ltr" | "rtl"
}

export function MatrixHeatmap({
  title = "Matrix Heatmap",
  subtitle = "Day × hour intensity grid.",
  rows,
  cols,
  values,
  color = "var(--chart-2)",
  showValues = false,
  valueUnit = "visits",
  className,
  plotDir,
}: MatrixHeatmapProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = (plotDir ?? dir) === "rtl"
  const locale = "en"

  const [wrapRef, width] = useContainerWidth<HTMLDivElement>()
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const [active, setActive] = React.useState<[number, number] | null>(null)
  const [tip, setTip] = React.useState<TooltipState | null>(null)
  const max = Math.max(1, ...values.flat())
  const labelW = Math.min(
    58,
    Math.max(36, Math.max(...rows.map((r) => r.length)) * 5.5 + 6)
  )
  const labelGap = 5
  const sideW = labelW + labelGap
  const head = 18
  const gap = 2

  const cw = width > 0 ? (width - sideW) / cols.length : 14
  const ch = Math.max(16, Math.min(32, cw * 0.85))
  const height = head + rows.length * ch
  const gridEdge = plotRtl ? width - sideW : sideW

  const showTip = (i: number, j: number, el: SVGRectElement) => {
    const box = el.ownerSVGElement?.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    if (!box) return
    const v = values[i]?.[j] ?? 0
    setActive([i, j])
    setTip({
      x: rect.left - box.left + rect.width / 2,
      y: rect.top - box.top + rect.height / 2,
      title: `${rows[i]} · ${cols[j] ?? ""}:00`,
      value: `${formatHeatCount(v, locale)} ${valueUnit}`,
    })
    if (liveRef.current) {
      liveRef.current.textContent = `${rows[i]} ${cols[j]}:00, ${formatHeatCount(v, locale)} ${valueUnit}`
    }
  }

  const cellX = (j: number) =>
    plotRtl
      ? gridEdge - (j + 1) * cw + gap / 2
      : gridEdge + j * cw + gap / 2

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[760px] flex-col gap-5 font-sans tabular-nums sm:gap-6",
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
        <div className="flex justify-end">
          <HeatLegend color={color} />
        </div>
      </header>

      <p ref={liveRef} className="sr-only" aria-live="polite" />

      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-[var(--radius-surface)]"
        onPointerLeave={() => {
          setActive(null)
          setTip(null)
        }}
      >
        {width > 0 && (
          <svg
            width={width}
            height={height}
            className="block overflow-hidden"
            role="img"
            aria-label={title}
          >
            {cols.map((c, j) =>
              j % Math.max(1, Math.ceil(24 / Math.max(cw, 1))) === 0 ? (
                <text
                  key={c}
                  x={cellX(j) + (cw - gap) / 2}
                  y={12}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[9px]"
                >
                  {c}
                </text>
              ) : null
            )}
            {rows.map((r, i) => (
              <text
                key={r}
                x={plotRtl ? width - 1 : 1}
                y={head + i * ch + ch * 0.68}
                textAnchor={plotRtl ? "end" : "start"}
                className="fill-muted-foreground text-[10px]"
              >
                {r}
              </text>
            ))}
            {rows.map((_, i) =>
              cols.map((_, j) => {
                const v = values[i]?.[j] ?? 0
                const on = active?.[0] === i && active?.[1] === j
                const t = v / max
                const x = cellX(j)
                const y = head + i * ch + gap / 2
                return (
                  <g key={`${i}-${j}`}>
                    <rect
                      x={x}
                      y={y}
                      width={Math.max(1, cw - gap)}
                      height={Math.max(1, ch - gap)}
                      rx={4}
                      fill={
                        v <= 0
                          ? "color-mix(in oklab, var(--foreground) 8%, transparent)"
                          : color
                      }
                      fillOpacity={v <= 0 ? 1 : 0.18 + t * 0.82}
                      stroke={on ? "var(--foreground)" : "transparent"}
                      strokeWidth={on ? 1.5 : 0}
                      className="cursor-pointer transition-[filter] duration-150"
                      style={{
                        filter: on
                          ? "drop-shadow(0 0 8px color-mix(in oklab, var(--foreground) 30%, transparent))"
                          : undefined,
                      }}
                      onPointerEnter={(e) => showTip(i, j, e.currentTarget)}
                    />
                    {showValues && cw > 28 && v > 0 && (
                      <text
                        x={x + (cw - gap) / 2}
                        y={y + (ch - gap) * 0.68}
                        textAnchor="middle"
                        className="pointer-events-none text-[9px]"
                        fill={
                          t > 0.55
                            ? "var(--background)"
                            : "var(--foreground)"
                        }
                      >
                        {formatHeatCount(v, locale)}
                      </text>
                    )}
                  </g>
                )
              })
            )}
          </svg>
        )}
        <FloatingTip tip={tip} width={width} dir={dir} />
      </div>

      <table className="sr-only">
        <caption>
          {title}. {subtitle}
        </caption>
        <thead>
          <tr>
            <th>Row</th>
            <th>Col</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.flatMap((r, i) =>
            cols.map((c, j) => (
              <tr key={`${r}-${c}`}>
                <td>{r}</td>
                <td>{c}</td>
                <td>{values[i]?.[j] ?? 0}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
