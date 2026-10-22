import { CopyButton } from "@/components/docs/copy-button"
import { highlightCode, type CodeLang } from "@/lib/highlight-code"
import { cn } from "@/lib/utils"

export async function ComponentSource({
  title = "Source",
  code,
  lang = "tsx",
  className,
}: {
  title?: string
  code: string
  lang?: CodeLang
  className?: string
}) {
  const html = await highlightCode(code, lang)

  return (
    <div className={cn("wink-code-block", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-[color:var(--code-border)] px-4 py-2">
        <div className="font-mono text-[14px] font-normal text-[color:var(--code-header-fg)]">
          {title}
        </div>
        <CopyButton value={code} />
      </div>
      <div
        className="wink-code-shiki no-scrollbar font-mono text-[14px] leading-[1.65]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
