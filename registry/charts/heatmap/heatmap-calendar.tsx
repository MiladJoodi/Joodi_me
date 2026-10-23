"use client"

import * as React from "react"

import { CHART_SERIES_A } from "../_lib/chart-styles"
import {
  CalendarHeatmap,
  generateCalendarHeatData,
  type CalendarHeatmapProps as CalendarHeatmapBaseProps,
} from "../_lib/heatmap-shared"

/**
 * Heatmap Calendar — year of daily activity (GitHub-style Sunday weeks).
 * SVG grid; locked navy `--chart-1`; holiday stroke accents.
 * Installs to: components/charts/heatmap-calendar.tsx
 */

/** Sample fixed holidays (Gregorian). */
const SAMPLE_HOLIDAYS = [
  "2026-01-01",
  "2026-07-04",
  "2026-12-25",
  "2026-12-26",
]

const DEMO_END = new Date(2026, 9, 23)
const DEMO_DATA = generateCalendarHeatData(365, 4201, DEMO_END)

/** All props optional — demo fills `data` when omitted. */
export type HeatmapCalendarProps = Partial<CalendarHeatmapBaseProps>

function HeatmapCalendar({
  title = "Calendar Heatmap",
  subtitle = "One year of daily activity — Sunday-start weeks, intensity by count. Red stroke marks holidays.",
  data = DEMO_DATA,
  days = 365,
  end = DEMO_END,
  unit = "orders",
  holidays = SAMPLE_HOLIDAYS,
  color = CHART_SERIES_A,
  ...rest
}: HeatmapCalendarProps = {}) {
  return (
    <CalendarHeatmap
      title={title}
      subtitle={subtitle}
      data={data}
      days={days}
      end={end}
      unit={unit}
      holidays={holidays}
      color={color}
      {...rest}
    />
  )
}

/** Docs / gallery default export — `<HeatmapCalendarDemo />` needs no props. */
export default function HeatmapCalendarDemo(props: HeatmapCalendarProps = {}) {
  return <HeatmapCalendar {...props} />
}

export { HeatmapCalendar }
