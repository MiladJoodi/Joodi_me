"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

type Phase = "idle" | "loading" | "finishing"

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [phase, setPhase] = useState<Phase>("idle")
  const [progress, setProgress] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const loadingRef = useRef(false)
  const routeKey = `${pathname}?${searchParams.toString()}`
  const routeKeyRef = useRef(routeKey)

  const clearTimers = () => {
    for (const id of timersRef.current) clearTimeout(id)
    timersRef.current = []
  }

  const schedule = (fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms))
  }

  const finish = () => {
    if (!loadingRef.current) return
    clearTimers()
    setPhase("finishing")
    setProgress(100)
    schedule(() => {
      setPhase("idle")
      setProgress(0)
      loadingRef.current = false
    }, 320)
  }

  const abort = () => {
    if (!loadingRef.current) return
    clearTimers()
    setPhase("idle")
    setProgress(0)
    loadingRef.current = false
  }

  const start = () => {
    if (loadingRef.current) return
    loadingRef.current = true
    clearTimers()
    setPhase("loading")
    setProgress(8)
    schedule(() => setProgress(28), 100)
    schedule(() => setProgress(52), 280)
    schedule(() => setProgress(72), 600)
    schedule(() => setProgress(86), 1200)
    schedule(() => setProgress(92), 2200)
    schedule(() => setProgress(94), 5_000)
    schedule(() => setProgress(96), 12_000)
    schedule(() => setProgress(97), 25_000)
  }

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest("a")
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target && anchor.target !== "_self") return
      if (anchor.hasAttribute("download")) return

      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#")) return
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return

      let url: URL
      try {
        url = new URL(href, window.location.href)
      } catch {
        return
      }

      if (url.origin !== window.location.origin) return

      const next = `${url.pathname}${url.search}`
      const current = `${window.location.pathname}${window.location.search}`
      if (next === current) return

      start()
    }

    const onPopState = () => {
      start()
    }

    document.addEventListener("click", onClick, true)
    window.addEventListener("popstate", onPopState)
    return () => {
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("popstate", onPopState)
    }
  }, [])

  useEffect(() => {
    if (routeKeyRef.current === routeKey) return
    routeKeyRef.current = routeKey
    if (loadingRef.current) finish()
  }, [routeKey])

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && loadingRef.current) {
        abort()
      }
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  useEffect(() => () => clearTimers(), [])

  if (phase === "idle") return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-100 h-1 overflow-hidden"
    >
      <div
        className="h-full bg-primary shadow-[0_0_12px_2px_color-mix(in_oklab,var(--color-primary)_70%,transparent)] transition-[width,opacity] ease-out"
        style={{
          width: `${progress}%`,
          marginInlineEnd: "auto",
          opacity: phase === "finishing" ? 0 : 1,
          transitionDuration: phase === "finishing" ? "280ms" : "420ms",
        }}
      />
    </div>
  )
}
