import { createHighlighter, type Highlighter } from "shiki"

export type CodeLang =
  | "tsx"
  | "ts"
  | "typescript"
  | "jsx"
  | "js"
  | "javascript"
  | "html"
  | "css"
  | "json"
  | "bash"
  | "shell"
  | "sh"

/** VS Code Dark+ — the default dark editor theme. */
const THEME = "dark-plus" as const

const langs = [
  "tsx",
  "typescript",
  "jsx",
  "javascript",
  "html",
  "css",
  "json",
  "bash",
  "shellscript",
] as const

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [THEME],
      langs: [...langs],
    })
  }
  return highlighterPromise
}

function resolveLang(lang: CodeLang): string {
  switch (lang) {
    case "ts":
      return "typescript"
    case "js":
      return "javascript"
    case "shell":
    case "sh":
      return "bash"
    default:
      return lang
  }
}

/** Highlight source with VS Code Dark+ (shiki `dark-plus`). */
export async function highlightCode(
  code: string,
  lang: CodeLang = "tsx"
): Promise<string> {
  const highlighter = await getHighlighter()
  return highlighter.codeToHtml(code.replace(/\n$/, ""), {
    lang: resolveLang(lang),
    theme: THEME,
  })
}
