"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import styles from "./loading-ring.module.css"

const DEFAULT_SIZE = 48

export type LoadingRingProps = {
  /** 0–100. Omit for a slow indeterminate fill loop. */
  value?: number
  size?: number
  className?: string
  /** Shown under the ball when `showLabel` is true. */
  label?: string
  showLabel?: boolean
}

function WaveLayer({
  className,
  amp,
  y,
}: {
  className?: string
  amp: number
  y: number
}) {
  const up = y - amp
  const down = y + amp
  const sine = (ox: number) =>
    `C ${ox + 25} ${up}, ${ox + 25} ${up}, ${ox + 50} ${y} ` +
    `C ${ox + 75} ${down}, ${ox + 75} ${down}, ${ox + 100} ${y}`

  // Fill past the viewBox bottom so troughs never leave a gap above the solid body
  const d = `M0 ${y} ${sine(0)} ${sine(100)} L200 120 L0 120 Z`

  return (
    <div className={className}>
      <svg
        className={styles.waveSvg}
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path fill="currentColor" d={d} />
      </svg>
    </div>
  )
}

/**
 * Circular liquid-fill loader — muted ball, primary water rising from the bottom.
 * Styles are self-contained in `loading-ring.module.css`.
 */
export function LoadingRing({
  value,
  size = DEFAULT_SIZE,
  className,
  label = "Loading…",
  showLabel = false,
}: LoadingRingProps) {
  const determinate = typeof value === "number"
  const [loop, setLoop] = React.useState(12)

  React.useEffect(() => {
    if (determinate) return
    const id = window.setInterval(() => {
      setLoop((v) => (v >= 100 ? 0 : v + 1))
    }, 45)
    return () => window.clearInterval(id)
  }, [determinate])

  const clamped = Math.min(100, Math.max(0, determinate ? value : loop))
  // 100% = empty (fully below), 0% = full.
  const rise = 100 - clamped

  return (
    <div
      role={determinate ? "progressbar" : "status"}
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(styles.root, className)}
    >
      <span className={styles.ball} style={{ width: size, height: size }}>
        <span
          className={styles.column}
          style={{ transform: `translate3d(0, ${rise}%, 0)` }}
        >
          <span className={styles.crest}>
            <WaveLayer className={styles.waveBack} amp={12} y={36} />
            <WaveLayer className={styles.waveFront} amp={10} y={40} />
          </span>
          <span className={styles.body} />
        </span>
      </span>
      {showLabel ? <span className={styles.label}>{label}</span> : null}
    </div>
  )
}
