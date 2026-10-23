"use client"

import * as React from "react"

import { MARKET_UP } from "../_lib/chart-styles"
import {
  CalendarHeatmap,
  generateCalendarHeatData,
  type CalendarHeatmapProps,
} from "../_lib/heatmap-shared"

/**
 * Heatmap Calendar Emerald — same Sunday-start grid with soft green intensity.
 * Uses `--chart-up` (works in light and dark).
 * Installs to: components/charts/heatmap-calendar-emerald.tsx
 */

const DEMO_END = new Date(2026, 9, 23)
const DEMO_DATA = generateCalendarHeatData(365, 9107, DEMO_END)

/** All props optional — demo fills `data` when omitted. */
export type HeatmapCalendarEmeraldProps = Partial<CalendarHeatmapProps>

function HeatmapCalendarEmerald({
  title = "Calendar Heatmap · Emerald",
  subtitle = "Same year grid with a soft green intensity scale — readable in light and dark.",
  data = DEMO_DATA,
  days = 365,
  end = DEMO_END,
  unit = "commits",
  color = MARKET_UP,
  ...rest
}: HeatmapCalendarEmeraldProps = {}) {
  return (
    <CalendarHeatmap
      title={title}
      subtitle={subtitle}
      data={data}
      days={days}
      end={end}
      unit={unit}
      color={color}
      {...rest}
    />
  )
}

/** Docs / gallery default export — `<HeatmapCalendarEmeraldDemo />` needs no props. */
export default function HeatmapCalendarEmeraldDemo(
  props: HeatmapCalendarEmeraldProps = {}
) {
  return <HeatmapCalendarEmerald {...props} />
}

export { HeatmapCalendarEmerald }
