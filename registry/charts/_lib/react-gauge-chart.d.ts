declare module "react-gauge-chart" {
  import type { CSSProperties, ReactElement } from "react"

  export type ReactGaugeChartProps = {
    id?: string
    className?: string
    style?: CSSProperties
    marginInPercent?: number
    cornerRadius?: number
    nrOfLevels?: number
    percent?: number
    arcPadding?: number
    arcWidth?: number
    colors?: string[]
    textColor?: string
    needleColor?: string
    needleBaseColor?: string
    hideText?: boolean
    animate?: boolean
    animDelay?: number
    animateDuration?: number
    formatTextValue?: (value: string) => string
    fontSize?: string
    arcsLength?: number[]
    needleScale?: number
  }

  export default function GaugeChart(
    props: ReactGaugeChartProps
  ): ReactElement
}
