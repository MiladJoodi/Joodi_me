"use client"

import { CopyButton } from "@/components/docs/copy-button"
import { cn } from "@/lib/utils"

/** Client panel for already-highlighted shiki HTML (server → props). */
export function CodePanel({
  title = "example.tsx",
  code,
  html,
  className,
}: {
  title?: string
  code: string
  html: string
  className?: string
}) {
  return (
    <div className={cn("wink-code-block rounded-none border-0", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-[color:var(--code-border)] px-4 py-2">
        <div className="font-mono text-[14px] font-normal text-[color:var(--code-header-fg)]">
          {title}
        </div>
        <CopyButton value={code} />
      </div>
      <div
        className="wink-code-shiki no-scrollbar max-h-72 overflow-auto font-mono text-[14px] leading-[1.65]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
