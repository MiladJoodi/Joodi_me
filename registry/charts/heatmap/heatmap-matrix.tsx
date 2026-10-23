"use client"

import * as React from "react"

import { CHART_SERIES_A } from "../_lib/chart-styles"
import {
  EN_WEEKDAYS_FULL,
  generateMatrixHeatData,
  MatrixHeatmap,
  type MatrixHeatmapProps as MatrixHeatmapBaseProps,
} from "../_lib/heatmap-shared"

/**
 * Heatmap Matrix — day × hour intensity grid (7 × 24).
 * SVG cells; locked navy `--chart-1`; RTL flips column growth.
 * Installs to: components/charts/heatmap-matrix.tsx
 */

const HOURS = Array.from({ length: 24 }, (_, i) => String(i))
const DEMO_VALUES = generateMatrixHeatData(7, 24, 7703)
const DEMO_ROWS = [...EN_WEEKDAYS_FULL]

/** All props optional — demo fills rows/cols/values when omitted. */
export type HeatmapMatrixProps = Partial<MatrixHeatmapBaseProps>

function HeatmapMatrix({
  title = "Matrix Heatmap",
  subtitle = "Traffic by weekday and hour — columns follow writing direction.",
  rows = DEMO_ROWS,
  cols = HOURS,
  values = DEMO_VALUES,
  color = CHART_SERIES_A,
  valueUnit = "visits",
  ...rest
}: HeatmapMatrixProps = {}) {
  return (
    <MatrixHeatmap
      title={title}
      subtitle={subtitle}
      rows={rows}
      cols={cols}
      values={values}
      color={color}
      valueUnit={valueUnit}
      {...rest}
    />
  )
}

/** Docs / gallery default export — `<HeatmapMatrixDemo />` needs no props. */
export default function HeatmapMatrixDemo(props: HeatmapMatrixProps = {}) {
  return <HeatmapMatrix {...props} />
}

export { HeatmapMatrix }
