"use client"

import { CopyButton } from "@/components/docs/copy-button"
import { cn } from "@/lib/utils"

/**
 * Soft install hint — same bar as button-group example footers.
 * Shows only the install command (names live inside the command).
 */
export function InstallNeedsHint({
  label = "This example also needs",
  registry = [],
  npm = [],
  className,
}: {
  label?: string
  /** Registry items → `npx @sonojs/ui@latest add …` */
  registry?: string[]
  /** npm packages → `npm i …` (e.g. lucide-react, react-day-picker) */
  npm?: string[]
  className?: string
}) {
  const registryNames = [...new Set(registry.filter(Boolean))].sort()
  const npmNames = [...new Set(npm.filter(Boolean))].sort()
  if (registryNames.length === 0 && npmNames.length === 0) return null

  const parts: string[] = []
  if (registryNames.length > 0) {
    parts.push(`npx @sonojs/ui@latest add ${registryNames.join(" ")}`)
  }
  if (npmNames.length > 0) {
    parts.push(`npm i ${npmNames.join(" ")}`)
  }
  const command = parts.join(" && ")

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-t border-border/60 bg-muted/20 px-3 py-2 text-[12.5px] text-muted-foreground",
        className
      )}
    >
      <span className="shrink-0">{label}</span>
      <code className="min-w-0 flex-1 truncate rounded-md border border-border/70 bg-background px-1.5 py-0.5 font-mono text-[11.5px] text-foreground sm:flex-none">
        {command}
      </code>
      <CopyButton
        value={command}
        className="text-muted-foreground hover:bg-muted hover:text-foreground"
      />
    </div>
  )
}
