"use client"

import * as React from "react"
import { Treemap, type TreemapNode } from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"

import { TreemapTooltipContent } from "../_lib/treemap-tooltip"
import { useChartDir } from "../_lib/use-chart-dir"
import { usePrefersReducedMotion } from "../_lib/use-prefers-reduced-motion"

/**
 * Treemap With Padding And Gaps — same flat module layout as Simple, teaching
 * `nodeInset` (parent padding) + `nodeGap` (sibling gaps). Locked metric scrub;
 * `--chart-1…5`. Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/treemap-with-padding-and-gaps.tsx
 */

export type TreemapPaddingLeaf = {
  name: string
  size: number
  group?: string
  fill?: string
}

export type TreemapPaddingGroup = {
  name: string
  children: TreemapPaddingLeaf[]
}

export type TreemapWithPaddingAndGapsProps = {
  title?: string
  subtitle?: string
  data?: TreemapPaddingGroup[]
  className?: string
  /** Inset between a parent boundary and its children. Default 10. */
  nodeInset?: number
  /** Gap between sibling nodes. Default 6. */
  nodeGap?: number
  /** Hover / keyboard leaf scrub. Default on. */
  scrub?: boolean
}

const TREE_MS = 200
const DEFAULT_INSET = 10
const DEFAULT_GAP = 6

const SERIES_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

const GROUP_LABELS: Record<string, string> = {
  axis: "Axis",
  controls: "Controls",
  data: "Data",
  events: "Events",
  legend: "Legend",
}

/** Same two-level Flare sample as Simple Treemap — teaching diff is inset/gap. */
const DEMO_DATA: TreemapPaddingGroup[] = [
  {
    name: "axis",
    children: [
      { name: "Axes", size: 1302 },
      { name: "Axis", size: 24593 },
      { name: "AxisGridLine", size: 652 },
      { name: "AxisLabel", size: 636 },
      { name: "CartesianAxes", size: 6703 },
    ],
  },
  {
    name: "controls",
    children: [
      { name: "AnchorControl", size: 2138 },
      { name: "ClickControl", size: 3824 },
      { name: "Control", size: 1353 },
      { name: "ControlList", size: 4665 },
      { name: "DragControl", size: 2649 },
      { name: "ExpandControl", size: 2832 },
      { name: "HoverControl", size: 4896 },
      { name: "PanZoomControl", size: 5222 },
      { name: "SelectionControl", size: 7862 },
      { name: "TooltipControl", size: 8435 },
    ],
  },
  {
    name: "data",
    children: [
      { name: "Data", size: 20544 },
      { name: "DataList", size: 19788 },
      { name: "DataSprite", size: 10349 },
      { name: "EdgeSprite", size: 3301 },
      { name: "NodeSprite", size: 19382 },
      { name: "ScaleBinding", size: 11275 },
      { name: "Tree", size: 7147 },
      { name: "TreeBuilder", size: 9930 },
      { name: "EdgeRenderer", size: 5569 },
      { name: "ShapeRenderer", size: 2247 },
    ],
  },
  {
    name: "events",
    children: [
      { name: "DataEvent", size: 7313 },
      { name: "SelectionEvent", size: 6880 },
      { name: "TooltipEvent", size: 3701 },
      { name: "VisualizationEvent", size: 2117 },
    ],
  },
  {
    name: "legend",
    children: [
      { name: "Legend", size: 20859 },
      { name: "LegendItem", size: 4614 },
      { name: "LegendRange", size: 10530 },
    ],
  },
]

function seriesColor(index: number) {
  return SERIES_VARS[index % SERIES_VARS.length]!
}

function groupLabel(id: string) {
  return GROUP_LABELS[id] ?? id
}

function withFills(groups: TreemapPaddingGroup[]): TreemapPaddingGroup[] {
  return groups.map((group, index) => ({
    ...group,
    children: group.children.map((leaf) => ({
      ...leaf,
      group: group.name,
      fill: seriesColor(index),
    })),
  }))
}

function flattenLeaves(groups: TreemapPaddingGroup[]): TreemapPaddingLeaf[] {
  return groups.flatMap((group, index) =>
    group.children.map((leaf) => ({
      ...leaf,
      group: leaf.group ?? group.name,
      fill: leaf.fill ?? seriesColor(index),
    }))
  )
}

function sumSize(leaves: TreemapPaddingLeaf[]) {
  return leaves.reduce((acc, leaf) => acc + leaf.size, 0)
}

function buildConfig(groups: TreemapPaddingGroup[]): ChartConfig {
  const config: ChartConfig = {
    size: { label: "Size" },
  }
  groups.forEach((group, index) => {
    config[group.name] = {
      label: groupLabel(group.name),
      color: seriesColor(index),
    }
  })
  return config
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value))
}

function formatPct(value: number) {
  return `${Math.round(value)}%`
}

const chartTreemapContainerClassName =
  "mx-auto aspect-auto h-[320px] w-full max-w-[640px] overflow-visible font-sans text-xs tabular-nums sm:h-[380px] [&_.recharts-surface]:overflow-visible"

type CellProps = TreemapNode & {
  fill?: string
  activeName?: string | null
  scrubbing?: boolean
  reducedMotion?: boolean
}

function PaddingTreemapCell(props: CellProps) {
  const {
    x,
    y,
    width,
    height,
    name,
    depth,
    fill,
    activeName,
    scrubbing,
    reducedMotion,
  } = props

  if (width <= 0 || height <= 0) return null

  // Group plate — muted so nodeInset gutters read against the stage.
  if (depth === 1) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="color-mix(in oklab, var(--muted) 55%, transparent)"
          stroke="var(--border)"
          strokeWidth={1}
          rx={6}
          ry={6}
          style={{ pointerEvents: "none" }}
        />
      </g>
    )
  }

  if (depth < 2) return null

  const isActive = !scrubbing || activeName === name
  const opacity = isActive ? 1 : 0.4
  const showLabel = width > 44 && height > 22

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={typeof fill === "string" ? fill : "var(--chart-1)"}
        fillOpacity={opacity}
        stroke="var(--background)"
        strokeWidth={2}
        rx={4}
        ry={4}
        style={{
          cursor: "pointer",
          transition: reducedMotion ? undefined : "fill-opacity 200ms ease-out",
        }}
      />
      {showLabel ? (
        <text
          x={x + 6}
          y={y + 14}
          className="fill-white text-[10px] font-medium"
          style={{
            fontFamily: "var(--font-sono-sans), var(--font-sans)",
            pointerEvents: "none",
            opacity,
          }}
        >
          {name}
        </text>
      ) : null}
    </g>
  )
}

function TreemapWithPaddingAndGaps({
  title = "Module size",
  subtitle = "Same data as Simple — with nodeInset padding and nodeGap between tiles.",
  data = DEMO_DATA,
  className,
  nodeInset = DEFAULT_INSET,
  nodeGap = DEFAULT_GAP,
  scrub = true,
}: TreemapWithPaddingAndGapsProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = dir === "rtl"
  const reducedMotion = usePrefersReducedMotion()
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const locale = "en"

  const plotGroups = React.useMemo(() => withFills(data), [data])
  const leaves = React.useMemo(() => flattenLeaves(plotGroups), [plotGroups])
  const chartConfig = React.useMemo(() => buildConfig(plotGroups), [plotGroups])
  const total = sumSize(leaves)
  const lastIndex = Math.max(0, leaves.length - 1)

  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [dataTrack, setDataTrack] = React.useState({ data, lastIndex })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data, lastIndex })
    setActiveIndex(lastIndex)
    setScrubbing(false)
  }

  const liveScrubbing = scrub && scrubbing
  const liveIndex = liveScrubbing ? activeIndex : lastIndex
  const liveLeaf = leaves[liveIndex] ?? leaves[lastIndex]
  const metricValue = liveScrubbing && liveLeaf ? liveLeaf.size : total
  const sharePct =
    liveScrubbing && liveLeaf && total > 0
      ? (liveLeaf.size / total) * 100
      : null
  const caption =
    liveScrubbing && liveLeaf
      ? `${liveLeaf.name} · ${groupLabel(liveLeaf.group ?? "")}`
      : "All modules"

  const announce = React.useCallback(
    (index: number) => {
      if (!liveRef.current) return
      const leaf = leaves[index]
      if (!leaf) return
      const pct = total > 0 ? (leaf.size / total) * 100 : 0
      liveRef.current.textContent = `${leaf.name}: ${formatNumber(leaf.size, locale)} (${formatPct(pct)})`
    },
    [leaves, locale, total]
  )

  const activate = React.useCallback(
    (index: number, fromKeyboard = false) => {
      if (leaves.length === 0) return
      const clamped = Math.min(lastIndex, Math.max(0, index))
      setActiveIndex(clamped)
      setScrubbing(true)
      if (fromKeyboard) announce(clamped)
    },
    [announce, lastIndex, leaves.length]
  )

  const activateByName = React.useCallback(
    (name: string) => {
      const index = leaves.findIndex((leaf) => leaf.name === name)
      if (index >= 0) activate(index)
    },
    [activate, leaves]
  )

  const clearScrub = React.useCallback(() => {
    setScrubbing(false)
    setActiveIndex(lastIndex)
  }, [lastIndex])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!scrub) return
      const reverse = plotRtl
      const idx = liveScrubbing ? activeIndex : lastIndex

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
    [
      activate,
      activeIndex,
      clearScrub,
      lastIndex,
      liveScrubbing,
      plotRtl,
      scrub,
    ]
  )

  const activeName = liveScrubbing && liveLeaf ? liveLeaf.name : null

  const renderContent = React.useCallback(
    (node: TreemapNode) => (
      <PaddingTreemapCell
        {...node}
        fill={typeof node.fill === "string" ? node.fill : undefined}
        activeName={activeName}
        scrubbing={liveScrubbing}
        reducedMotion={reducedMotion}
      />
    ),
    [activeName, liveScrubbing, reducedMotion]
  )

  const ariaLabel = React.useMemo(() => {
    if (!liveScrubbing || !liveLeaf) {
      return `Treemap, ${title}, total ${formatNumber(total, locale)}`
    }
    const pct = total > 0 ? formatPct((liveLeaf.size / total) * 100) : ""
    return `Treemap, ${title}, ${liveLeaf.name} ${formatNumber(liveLeaf.size, locale)} ${pct}`
  }, [liveLeaf, liveScrubbing, locale, title, total])

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
          className={cn(chartTreemapContainerClassName, "max-w-none")}
        >
          <Treemap
            data={plotGroups}
            dataKey="size"
            nameKey="name"
            type="flat"
            aspectRatio={4 / 3}
            nodeInset={nodeInset}
            nodeGap={nodeGap}
            stroke="var(--background)"
            isAnimationActive={false}
            animationDuration={TREE_MS}
            animationEasing="ease-out"
            content={renderContent}
            onMouseEnter={
              scrub
                ? (node) => {
                    if (node.depth >= 2 && node.name) activateByName(node.name)
                  }
                : undefined
            }
            onMouseLeave={scrub ? clearScrub : undefined}
          >
            <ChartTooltip
              cursor={false}
              content={
                <TreemapTooltipContent
                  dir={dir}
                  locale={locale}
                />
              }
            />
          </Treemap>
        </ChartContainer>
      </div>

      <ul className="mx-auto flex max-w-[640px] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {plotGroups.map((group, index) => (
          <li key={group.name} className="inline-flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: seriesColor(index) }}
              aria-hidden
            />
            <span>{groupLabel(group.name)}</span>
          </li>
        ))}
      </ul>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Module</th>
            <th scope="col">Group</th>
            <th scope="col">Size</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leaf) => (
            <tr key={`a11y-${leaf.group}-${leaf.name}`}>
              <td>{leaf.name}</td>
              <td>{groupLabel(leaf.group ?? "")}</td>
              <td>{leaf.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TreemapWithPaddingAndGapsDemo(
  props: TreemapWithPaddingAndGapsProps
) {
  return <TreemapWithPaddingAndGaps {...props} />
}

export { TreemapWithPaddingAndGaps }
