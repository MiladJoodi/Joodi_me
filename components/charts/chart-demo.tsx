"use client"

import * as React from "react"

import { LoadingRing } from "@/components/sono-loader"
import { cn } from "@/lib/utils"
import { getChartDemoLoader } from "@/registry/charts/demo-loaders"

/** Matches simple-bar stage (plot h-56/h-64 + legend row) so the preview card does not jump. */
const STAGE_CLASS =
  "relative mx-auto w-full min-w-0 max-w-[640px] min-h-[15.5rem] sm:min-h-[17.5rem]"

export function ChartDemo({ id }: { id: string }) {
  const [Demo, setDemo] = React.useState<React.ComponentType | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [revealed, setRevealed] = React.useState(false)
  const [loaderGone, setLoaderGone] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    const load = getChartDemoLoader(id)
    if (!load) {
      setError("No loader for this chart.")
      return
    }

    setDemo(null)
    setError(null)
    setRevealed(false)
    setLoaderGone(false)

    load()
      .then((mod) => {
        if (cancelled) return
        const Comp =
          ("default" in mod && mod.default) ||
          ("SimpleBarChart" in mod && mod.SimpleBarChart) ||
          Object.values(mod).find(
            (value) => typeof value === "function"
          )
        if (!Comp || typeof Comp !== "function") {
          setError("Demo module has no component export.")
          return
        }
        setDemo(() => Comp as React.ComponentType)
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load demo.")
      })

    return () => {
      cancelled = true
    }
  }, [id])

  // Fade in chart (and fade out loader) on the next frames after mount.
  React.useEffect(() => {
    if (!Demo) return
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setRevealed(true))
    })
    return () => window.cancelAnimationFrame(id)
  }, [Demo])

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  return (
    <div className={STAGE_CLASS}>
      {Demo ? (
        <div
          className={cn(
            "transition-opacity duration-300 ease-out",
            revealed ? "opacity-100" : "opacity-0"
          )}
        >
          <Demo />
        </div>
      ) : null}

      {!loaderGone ? (
        <div
          className={cn(
            "absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 ease-out",
            Demo && revealed
              ? "pointer-events-none opacity-0"
              : "opacity-100"
          )}
          role="status"
          aria-label="Loading chart"
          aria-hidden={Boolean(Demo && revealed)}
          onTransitionEnd={(event) => {
            if (
              event.propertyName === "opacity" &&
              Demo &&
              revealed
            ) {
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
