"use client"

import * as React from "react"

import { LoadingRing } from "@/components/sono-loader"
import { cn } from "@/lib/utils"
import { getChartDemoLoader } from "@/registry/charts/demo-loaders"

/**
 * Base stage. Tall min-height only while loading — once the demo is visible,
 * height follows content (heatmaps and other compact charts stay tight).
 */
const STAGE_CLASS = "relative mx-auto w-full min-w-0 max-w-[640px]"
const STAGE_LOADING_MIN =
  "min-h-[26rem] sm:min-h-[28rem]"

type ChartModule = Record<string, unknown>

function resolveDemo(mod: ChartModule): React.ComponentType | null {
  const Comp =
    ("default" in mod && mod.default) ||
    ("SimpleBarChart" in mod && mod.SimpleBarChart) ||
    Object.values(mod).find((value) => typeof value === "function")
  if (!Comp || typeof Comp !== "function") return null
  return Comp as React.ComponentType
}

export function ChartDemo({ id }: { id: string }) {
  const load = getChartDemoLoader(id)

  if (!load) {
    return (
      <p className="text-sm text-destructive">No loader for this chart.</p>
    )
  }

  // Remount on id change so load state resets without sync setState in an effect.
  return <ChartDemoLoader key={id} load={load} />
}

function ChartDemoLoader({ load }: { load: () => Promise<ChartModule> }) {
  const [Demo, setDemo] = React.useState<React.ComponentType | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [revealed, setRevealed] = React.useState(false)
  const [loaderGone, setLoaderGone] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    load()
      .then((mod) => {
        if (cancelled) return
        const Comp = resolveDemo(mod)
        if (!Comp) {
          setError("Demo module has no component export.")
          return
        }
        setDemo(() => Comp)
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load demo.")
      })

    return () => {
      cancelled = true
    }
  }, [load])

  // Reveal only after paint so we can mount the chart while visible —
  // otherwise Recharts entrance finishes (or pops) behind opacity-0.
  React.useEffect(() => {
    if (!Demo) return
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setRevealed(true))
    })
    return () => window.cancelAnimationFrame(frame)
  }, [Demo])

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  const showDemo = Boolean(Demo && revealed)

  return (
    <div className={cn(STAGE_CLASS, !showDemo && STAGE_LOADING_MIN)}>
      {Demo && revealed ? <Demo /> : null}

      {!loaderGone ? (
        <div
          className={cn(
            "absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 ease-out",
            showDemo ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          role="status"
          aria-label="Loading chart"
          aria-hidden={showDemo}
          onTransitionEnd={(event) => {
            if (event.propertyName === "opacity" && showDemo) {
              setLoaderGone(true)
            }
          }}
        >
          <LoadingRing size={40} showLabel label="Loading…" />
        </div>
      ) : null}
    </div>
  )
}
