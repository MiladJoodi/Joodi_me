import { readFile } from "node:fs/promises"
import path from "node:path"

import type { VariantExample } from "@/components/docs/variant-preview"
import { highlightCode } from "@/lib/highlight-code"

/** Longer names first so `alert-dialog` wins over `alert`. */
const EXAMPLE_FOLDERS = [
  "alert-dialog",
  "attachment",
  "button-group",
  "breadcrumb",
  "accordion",
  "avatar",
  "badge",
  "bubble",
  "alert",
  "button",
  "context-menu",
  "code-block",
  "collapsible",
  "combobox",
  "command",
  "carousel",
  "checkbox",
  "card",
  "data-table",
  "date-picker",
  "dialog",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "hover-card",
  "input-group",
  "input-otp",
  "input",
  "item",
  "kbd",
  "label",
  "marker",
  "menubar",
  "message-scroller",
  "message",
  "native-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle-group",
  "toggle",
  "tooltip",
  "trace",
] as const

function exampleFilePath(exampleName: string): string | null {
  for (const folder of EXAMPLE_FOLDERS) {
    const prefix = `${folder}-`
    if (!exampleName.startsWith(prefix)) continue
    const file = exampleName.slice(prefix.length)
    return path.join(
      process.cwd(),
      "registry",
      "examples",
      folder,
      `${file}.tsx`
    )
  }
  return null
}

/** Rewrite monorepo imports to consumer install paths for docs Code tab. */
function toConsumerSource(source: string): string {
  return source
    .replace(
      /from\s+["']@sonojs\/ui\/components\/([^"']+)["']/g,
      'from "@/components/ui/$1"'
    )
    .replace(
      /from\s+["']@sonojs\/ui\/hooks\/([^"']+)["']/g,
      'from "@/hooks/$1"'
    )
    .replace(
      /from\s+["']@sonojs\/ui\/lib\/([^"']+)["']/g,
      'from "@/lib/$1"'
    )
}

/**
 * Attach consumer-facing source + highlighted HTML for each variant tab.
 * Used by docs Preview | Code chrome.
 */
export async function withVariantCode(
  examples: Pick<
    VariantExample,
    "name" | "title" | "description" | "requires" | "npmRequires"
  >[]
): Promise<VariantExample[]> {
  return Promise.all(
    examples.map(async (item) => {
      const filePath = exampleFilePath(item.name)
      if (!filePath) {
        return item
      }
      try {
        const raw = await readFile(filePath, "utf8")
        const code = toConsumerSource(raw)
        return {
          ...item,
          code,
          codeHtml: await highlightCode(code),
        }
      } catch {
        return item
      }
    })
  )
}
