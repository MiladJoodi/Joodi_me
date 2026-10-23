"use client"

import * as React from "react"

import { MARKET_UP } from "../_lib/chart-styles"
import {
  EN_WEEKDAYS_FULL,
  generateMatrixHeatData,
  MatrixHeatmap,
  type MatrixHeatmapProps,
} from "../_lib/heatmap-shared"

/**
 * Heatmap Matrix Values — day × hour grid with in-cell counts when wide enough.
 * Soft green `--chart-up`; RTL flips columns.
 * Installs to: components/charts/heatmap-matrix-values.tsx
 */

const HOURS = Array.from({ length: 24 }, (_, i) => String(i))
const DEMO_VALUES = generateMatrixHeatData(7, 24, 5511)
const DEMO_ROWS = [...EN_WEEKDAYS_FULL]

/** All props optional — demo fills rows/cols/values when omitted. */
export type HeatmapMatrixValuesProps = Partial<MatrixHeatmapProps>

function HeatmapMatrixValues({
  title = "Matrix Heatmap · Values",
  subtitle = "Same day × hour grid with counts drawn in cells when there is room.",
  rows = DEMO_ROWS,
  cols = HOURS,
  values = DEMO_VALUES,
  color = MARKET_UP,
  showValues = true,
  valueUnit = "visits",
  ...rest
}: HeatmapMatrixValuesProps = {}) {
  return (
    <MatrixHeatmap
      title={title}
      subtitle={subtitle}
      rows={rows}
      cols={cols}
      values={values}
      color={color}
      showValues={showValues}
      valueUnit={valueUnit}
      {...rest}
    />
  )
}

/** Docs / gallery default export — `<HeatmapMatrixValuesDemo />` needs no props. */
export default function HeatmapMatrixValuesDemo(
  props: HeatmapMatrixValuesProps = {}
) {
  return <HeatmapMatrixValues {...props} />
}

export { HeatmapMatrixValues }
