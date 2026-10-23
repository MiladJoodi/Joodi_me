"use client"

import * as React from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { useDirection } from "@sonojs/ui/hooks/use-direction"
import { cn } from "@sonojs/ui/lib/utils"

/** Keep Sonner theme aligned with `.dark` (same source as design tokens). */
function useDocumentColorScheme(): "light" | "dark" {
  const [scheme, setScheme] = React.useState<"light" | "dark">("light")

  React.useLayoutEffect(() => {
    const root = document.documentElement
    const sync = () =>
      setScheme(root.classList.contains("dark") ? "dark" : "light")
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return scheme
}

function Toaster({
  theme: themeProp,
  dir: dirProp,
  toastOptions,
  className,
  style,
  ...props
}: ToasterProps) {
  const { theme: nextTheme, resolvedTheme } = useTheme()
  const documentScheme = useDocumentColorScheme()
  // Portaled under body — prefer explicit dir, else DirectionProvider / <html>.
  const { dir: contextDir } = useDirection()
  const dir = dirProp ?? contextDir

  // Prefer explicit prop → next-themes resolved → `.dark` on <html> (CSS tokens).
  const theme: ToasterProps["theme"] =
    themeProp ??
    (resolvedTheme === "light" || resolvedTheme === "dark"
      ? resolvedTheme
      : nextTheme === "light" || nextTheme === "dark"
        ? nextTheme
        : documentScheme)

  return (
    <Sonner
      theme={theme}
      className={cn("toaster group", className)}
      dir={dir}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          // Sonner hardcodes description colors per theme; force design tokens
          // so light/dark never desync from --popover / --muted-foreground.
          description: cn(
            "!text-muted-foreground",
            toastOptions?.classNames?.description
          ),
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
