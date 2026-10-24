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
 * Nested Treemap — `type="nest"` drill-down with breadcrumb; keep true hierarchy
 * (e.g. data → render). Locked metric scrub; `--chart-1…5`.
 * Spec: `registry/charts/PORT.md`
 * Installs to: components/charts/nested-treemap.tsx
 */

export type NestedTreemapNode = {
  name: string
  size?: number
  children?: NestedTreemapNode[]
  fill?: string
}

export type NestedTreemapProps = {
  title?: string
  subtitle?: string
  data?: NestedTreemapNode[]
  className?: string
  /** Hover / keyboard scrub. Default on. */
  scrub?: boolean
}

const TREE_MS = 200

const SERIES_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

const NAME_LABELS: Record<string, string> = {
  axis: "Axis",
  controls: "Controls",
  data: "Data",
  events: "Events",
  legend: "Legend",
  render: "Render",
  root: "Root",
}

/**
 * Classic Nested Treemap sample — keep the `data → render` branch so nest
 * drill-down has a second level.
 */
const DEMO_DATA: NestedTreemapNode[] = [
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
      {
        name: "render",
        children: [
          { name: "ArrowType", size: 698 },
          { name: "EdgeRenderer", size: 5569 },
          { name: "IRenderer", size: 353 },
          { name: "ShapeRenderer", size: 2247 },
        ],
      },
      { name: "ScaleBinding", size: 11275 },
      { name: "Tree", size: 7147 },
      { name: "TreeBuilder", size: 9930 },
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

function displayName(name: string) {
  if (!name) return "Root"
  return NAME_LABELS[name] ?? name
}

function nodeSize(node: NestedTreemapNode): number {
  if (node.children?.length) {
    return node.children.reduce((acc, child) => acc + nodeSize(child), 0)
  }
  return typeof node.size === "number" ? node.size : 0
}

function flattenLeaves(
  nodes: NestedTreemapNode[],
  path: string[] = []
): { name: string; size: number; path: string }[] {
  const out: { name: string; size: number; path: string }[] = []
  for (const node of nodes) {
    const next = [...path, node.name]
    if (node.children?.length) {
      out.push(...flattenLeaves(node.children, next))
    } else {
      out.push({
        name: node.name,
        size: node.size ?? 0,
        path: next.join(" / "),
      })
    }
  }
  return out
}

/** Color top-level groups; descendants inherit the group token (legend parity). */
function withFills(
  nodes: NestedTreemapNode[],
  inheritedFill?: string
): NestedTreemapNode[] {
  return nodes.map((node, index) => {
    const fill = inheritedFill ?? seriesColor(index)
    return {
      ...node,
      fill,
      children: node.children ? withFills(node.children, fill) : undefined,
    }
  })
}

function buildConfig(nodes: NestedTreemapNode[]): ChartConfig {
  const config: ChartConfig = {
    size: { label: "Size" },
  }
  nodes.forEach((node, index) => {
    config[node.name] = {
      label: displayName(node.name),
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

const chartTreemapContainerClassName = [
  "mx-auto aspect-auto h-[320px] w-full max-w-[640px] overflow-visible font-sans text-xs tabular-nums sm:h-[380px] [&_.recharts-surface]:overflow-visible",
  // Override Recharts nest breadcrumb chrome (hardcoded black/white boxes).
  "[&_.recharts-treemap-nest-index-wrapper]:mt-3 [&_.recharts-treemap-nest-index-wrapper]:flex [&_.recharts-treemap-nest-index-wrapper]:flex-wrap [&_.recharts-treemap-nest-index-wrapper]:items-center [&_.recharts-treemap-nest-index-wrapper]:justify-center [&_.recharts-treemap-nest-index-wrapper]:gap-1.5 [&_.recharts-treemap-nest-index-wrapper]:text-center",
  "[&_.recharts-treemap-nest-index-box]:m-0! [&_.recharts-treemap-nest-index-box]:cursor-pointer [&_.recharts-treemap-nest-index-box]:rounded-md [&_.recharts-treemap-nest-index-box]:bg-primary [&_.recharts-treemap-nest-index-box]:px-2.5 [&_.recharts-treemap-nest-index-box]:py-1 [&_.recharts-treemap-nest-index-box]:text-xs [&_.recharts-treemap-nest-index-box]:font-medium [&_.recharts-treemap-nest-index-box]:text-primary-foreground",
].join(" ")

type CellProps = TreemapNode & {
  fill?: string
  activeName?: string | null
  scrubbing?: boolean
  reducedMotion?: boolean
}

function NestedTreemapCell(props: CellProps) {
  const {
    x,
    y,
    width,
    height,
    name,
    value,
    depth,
    index,
    fill,
    children,
    activeName,
    scrubbing,
    reducedMotion,
  } = props

  if (width <= 0 || height <= 0 || depth < 1) return null

  const hasChildren = Boolean(children?.length)
  const isActive = !scrubbing || activeName === name
  const opacity = isActive ? 1 : 0.4
  const tileFill =
    typeof fill === "string"
      ? fill
      : seriesColor(typeof index === "number" ? index : 0)
  const showLabel = width > 48 && height > 26
  const showSize = width > 64 && height > 40 && !hasChildren

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={tileFill}
        fillOpacity={opacity}
        stroke="var(--background)"
        strokeWidth={2}
        rx={4}
        ry={4}
        style={{
          cursor: hasChildren || scrubbing ? "pointer" : "default",
          transition: reducedMotion ? undefined : "fill-opacity 200ms ease-out",
        }}
      />
      {showLabel ? (
        <text
          x={x + 8}
          y={y + 16}
          className="fill-white text-[11px] font-medium"
          style={{
            fontFamily: "var(--font-sono-sans), var(--font-sans)",
            pointerEvents: "none",
            opacity,
          }}
        >
          {displayName(name)}
          {hasChildren ? " ›" : ""}
        </text>
      ) : null}
      {showSize ? (
        <text
          x={x + 8}
          y={y + 30}
          className="fill-white/85 text-[10px] tabular-nums"
          style={{
            fontFamily: "var(--font-sono-sans), var(--font-sans)",
            pointerEvents: "none",
            opacity,
          }}
        >
          {formatNumber(typeof value === "number" ? value : 0, "en")}
        </text>
      ) : null}
    </g>
  )
}

function NestedTreemap({
  title = "Module size",
  subtitle = "Nested treemap — click a group to zoom; breadcrumb returns up.",
  data = DEMO_DATA,
  className,
  scrub = true,
}: NestedTreemapProps) {
  const { dir, ref } = useChartDir()
  const plotRtl = dir === "rtl"
  const reducedMotion = usePrefersReducedMotion()
  const liveRef = React.useRef<HTMLParagraphElement>(null)
  const locale = "en"

  const plotData = React.useMemo(() => withFills(data), [data])
  const leaves = React.useMemo(() => flattenLeaves(data), [data])
  const chartConfig = React.useMemo(() => buildConfig(data), [data])
  const total = React.useMemo(
    () => data.reduce((acc, node) => acc + nodeSize(node), 0),
    [data]
  )
  const lastIndex = Math.max(0, leaves.length - 1)

  const [activeIndex, setActiveIndex] = React.useState(lastIndex)
  const [scrubbing, setScrubbing] = React.useState(false)
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)
  const [hoverCaption, setHoverCaption] = React.useState<string | null>(null)
  const [hoverName, setHoverName] = React.useState<string | null>(null)
  const [dataTrack, setDataTrack] = React.useState({ data, lastIndex })
  if (dataTrack.data !== data || dataTrack.lastIndex !== lastIndex) {
    setDataTrack({ data, lastIndex })
    setActiveIndex(lastIndex)
    setScrubbing(false)
    setHoverValue(null)
    setHoverCaption(null)
    setHoverName(null)
  }

  const liveScrubbing = scrub && scrubbing
  const liveLeaf = leaves[activeIndex] ?? leaves[lastIndex]
  const metricValue =
    liveScrubbing && hoverValue != null
      ? hoverValue
      : liveScrubbing && liveLeaf
        ? liveLeaf.size
        : total
  const sharePct =
    liveScrubbing && total > 0 ? (metricValue / total) * 100 : null
  const caption =
    liveScrubbing && hoverCaption
      ? hoverCaption
      : liveScrubbing && liveLeaf
        ? liveLeaf.path
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

  const activateLeaf = React.useCallback(
    (index: number, fromKeyboard = false) => {
      if (leaves.length === 0) return
      const clamped = Math.min(lastIndex, Math.max(0, index))
      const leaf = leaves[clamped]
      setActiveIndex(clamped)
      setScrubbing(true)
      setHoverValue(leaf?.size ?? null)
      setHoverCaption(leaf?.path ?? null)
      setHoverName(leaf?.name ?? null)
      if (fromKeyboard) announce(clamped)
    },
    [announce, lastIndex, leaves]
  )

  const activateNode = React.useCallback((node: TreemapNode) => {
    if (!node.name) return
    setScrubbing(true)
    setHoverValue(typeof node.value === "number" ? node.value : null)
    setHoverCaption(displayName(node.name))
    setHoverName(node.name)
  }, [])

  const clearScrub = React.useCallback(() => {
    setScrubbing(false)
    setHoverValue(null)
    setHoverCaption(null)
    setHoverName(null)
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
          activateLeaf(idx + (reverse ? 1 : -1), true)
          break
        case "ArrowRight":
          event.preventDefault()
          activateLeaf(idx + (reverse ? -1 : 1), true)
          break
        case "Home":
          event.preventDefault()
          activateLeaf(reverse ? lastIndex : 0, true)
          break
        case "End":
          event.preventDefault()
          activateLeaf(reverse ? 0 : lastIndex, true)
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
      activateLeaf,
      activeIndex,
      clearScrub,
      lastIndex,
      liveScrubbing,
      plotRtl,
      scrub,
    ]
  )

  const activeTileName = liveScrubbing
    ? (hoverName ?? liveLeaf?.name ?? null)
    : null

  const renderContent = React.useCallback(
    (node: TreemapNode) => (
      <NestedTreemapCell
        {...node}
        fill={typeof node.fill === "string" ? node.fill : undefined}
        activeName={activeTileName}
        scrubbing={liveScrubbing}
        reducedMotion={reducedMotion}
      />
    ),
    [activeTileName, liveScrubbing, reducedMotion]
  )

  const nestIndexContent = React.useCallback((item: TreemapNode, i: number) => {
    const raw = item?.name
    const label =
      i === 0 || !raw ? "Root" : displayName(typeof raw === "string" ? raw : "Root")
    return <span>{label}</span>
  }, [])

  const ariaLabel = React.useMemo(() => {
    if (!liveScrubbing) {
      return `Nested treemap, ${title}, total ${formatNumber(total, locale)}`
    }
    const pct = total > 0 ? formatPct((metricValue / total) * 100) : ""
    return `Nested treemap, ${title}, ${caption} ${formatNumber(metricValue, locale)} ${pct}`
  }, [caption, liveScrubbing, locale, metricValue, title, total])

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
            data={plotData}
            dataKey="size"
            nameKey="name"
            type="nest"
            aspectRatio={4 / 3}
            stroke="var(--background)"
            isAnimationActive={false}
            animationDuration={TREE_MS}
            animationEasing="ease-out"
            content={renderContent}
            nestIndexContent={nestIndexContent}
            onMouseEnter={
              scrub
                ? (node) => {
                    if (node.depth >= 1) activateNode(node)
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
                  formatName={displayName}
                />
              }
            />
          </Treemap>
        </ChartContainer>
      </div>

      <ul className="mx-auto flex max-w-[640px] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {data.map((node, index) => (
          <li key={node.name} className="inline-flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: seriesColor(index) }}
              aria-hidden
            />
            <span>{displayName(node.name)}</span>
          </li>
        ))}
      </ul>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Module</th>
            <th scope="col">Path</th>
            <th scope="col">Size</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leaf) => (
            <tr key={`a11y-${leaf.path}`}>
              <td>{leaf.name}</td>
              <td>{leaf.path}</td>
              <td>{leaf.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function NestedTreemapDemo(props: NestedTreemapProps) {
  return <NestedTreemap {...props} />
}

export { NestedTreemap }
