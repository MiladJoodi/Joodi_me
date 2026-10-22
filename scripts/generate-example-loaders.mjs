/**
 * Generates per-folder example loaders + a thin registry/example-loaders.ts router.
 * Fails hard on missing / ambiguous component exports (no silent skips).
 *
 * Usage: node scripts/generate-example-loaders.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const examplesDir = path.join(root, "registry", "examples")
const outRouter = path.join(root, "registry", "example-loaders.ts")

/** Must stay longest-first for id → folder matching (same idea as docs-variant-examples). */
const FOLDER_ORDER = [
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
]

function stripNoise(source) {
  let out = ""
  let i = 0
  while (i < source.length) {
    if (source[i] === "/" && source[i + 1] === "/") {
      i += 2
      while (i < source.length && source[i] !== "\n") i++
      continue
    }
    if (source[i] === "/" && source[i + 1] === "*") {
      i += 2
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/"))
        i++
      i += 2
      continue
    }
    if (source[i] === "`") {
      i++
      while (i < source.length) {
        if (source[i] === "\\") {
          i += 2
          continue
        }
        if (source[i] === "`") {
          i++
          break
        }
        if (source[i] === "$" && source[i + 1] === "{") {
          i += 2
          let depth = 1
          while (i < source.length && depth > 0) {
            if (source[i] === "{") depth++
            else if (source[i] === "}") depth--
            i++
          }
          continue
        }
        i++
      }
      out += '""'
      continue
    }
    if (source[i] === "'" || source[i] === '"') {
      const q = source[i]
      i++
      while (i < source.length) {
        if (source[i] === "\\") {
          i += 2
          continue
        }
        if (source[i] === q) {
          i++
          break
        }
        i++
      }
      out += '""'
      continue
    }
    out += source[i]
    i++
  }
  return out
}

function findComponentExports(source) {
  const clean = stripNoise(source)
  const names = new Set()

  for (const match of clean.matchAll(
    /\bexport\s+(?:async\s+)?(?:function|const|class)\s+([A-Z][A-Za-z0-9]*)\b/g
  )) {
    names.add(match[1])
  }

  for (const match of clean.matchAll(/\bexport\s*\{([^}]+)\}/g)) {
    for (const part of match[1].split(",")) {
      const trimmed = part.trim()
      if (!trimmed) continue
      const local = trimmed.split(/\s+as\s+/)[0].trim()
      if (/^[A-Z][A-Za-z0-9]*$/.test(local)) names.add(local)
    }
  }

  for (const match of clean.matchAll(
    /\bexport\s+default\s+(?:async\s+)?function\s+([A-Z][A-Za-z0-9]*)\b/g
  )) {
    names.add(match[1])
  }

  return [...names]
}

function pickExport(candidates, folder, fileBase) {
  if (candidates.length === 0) {
    return { error: "no component export (PascalCase function/const/class)" }
  }
  if (candidates.length === 1) {
    return { name: candidates[0] }
  }

  const folderPascal = folder
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("")
  const filePascal = fileBase
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("")
  const expected = `${folderPascal}${filePascal}`
  const expectedExample = `${folderPascal}${filePascal}Example`
  const expectedDemo = `${folderPascal}${filePascal}Demo`

  const preferred = candidates.filter(
    (n) => n === expected || n === expectedExample || n === expectedDemo
  )
  if (preferred.length === 1) {
    return { name: preferred[0] }
  }

  return {
    error: `ambiguous exports [${candidates.join(", ")}] (expected one of ${expected} / ${expectedExample} / ${expectedDemo})`,
  }
}

function walkExamples() {
  /** @type {Map<string, { id: string, fileBase: string, exportName: string }[]>} */
  const byFolder = new Map()
  /** @type {string[]} */
  const errors = []
  /** @type {string[]} */
  const discoveredFolders = []

  const folders = fs
    .readdirSync(examplesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  for (const folder of folders) {
    discoveredFolders.push(folder)
    const dir = path.join(examplesDir, folder)
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".tsx") && f !== "index.tsx")
      .sort()

    const list = []
    for (const file of files) {
      const fileBase = file.replace(/\.tsx$/, "")
      if (fileBase === "index" || fileBase === "_loaders") continue

      const abs = path.join(dir, file)
      const source = fs.readFileSync(abs, "utf8")
      const candidates = findComponentExports(source)
      const picked = pickExport(candidates, folder, fileBase)
      const id = `${folder}-${fileBase}`

      if (picked.error) {
        errors.push(`${folder}/${file}: ${picked.error}`)
        continue
      }

      list.push({ id, fileBase, exportName: picked.name })
    }
    byFolder.set(folder, list)
  }

  return { byFolder, errors, discoveredFolders }
}

function emitFolderLoaders(folder, entries) {
  const lines = [
    "/* eslint-disable */",
    `// AUTO-GENERATED by scripts/generate-example-loaders.mjs - ${folder}`,
    'import type { ComponentType } from "react"',
    "",
    "export type ExampleLoader = () => Promise<{ default: ComponentType<any> }>",
    "",
    "export const exampleLoaders = {",
  ]

  for (const e of entries) {
    lines.push(
      `  ${JSON.stringify(e.id)}: () =>\n    import(${JSON.stringify(`./${e.fileBase}`)}).then((m) => ({\n      default: m.${e.exportName},\n    })),`
    )
  }

  lines.push("} as const satisfies Record<string, ExampleLoader>", "")
  lines.push(
    "export function loadFolderExample(name: string): ExampleLoader | undefined {",
    "  if (Object.prototype.hasOwnProperty.call(exampleLoaders, name)) {",
    "    return exampleLoaders[name as keyof typeof exampleLoaders]",
    "  }",
    "  return undefined",
    "}",
    ""
  )
  return lines.join("\n")
}

function emitRouter(folders) {
  // Longest-first for prefix match
  const ordered = [...FOLDER_ORDER]
  for (const f of folders) {
    if (!ordered.includes(f)) ordered.unshift(f)
  }
  // de-dupe while keeping first occurrence (longest list may need resort)
  const unique = [...new Set(ordered)].sort((a, b) => b.length - a.length)

  const lines = [
    "/* eslint-disable */",
    "// AUTO-GENERATED by scripts/generate-example-loaders.mjs - do not edit.",
    'import type { ComponentType } from "react"',
    "",
    "export type ExampleLoader = () => Promise<{ default: ComponentType<any> }>",
    "",
    "const folderModules = {",
  ]

  for (const folder of [...folders].sort()) {
    lines.push(
      `  ${JSON.stringify(folder)}: () => import(${JSON.stringify(`./examples/${folder}/_loaders`)}),`
    )
  }

  lines.push("} as const", "")
  lines.push(
    `const FOLDERS_LONGEST_FIRST = ${JSON.stringify(unique)} as const`,
    "",
    "function folderForExample(name: string): string | undefined {",
    "  for (const folder of FOLDERS_LONGEST_FIRST) {",
    '    if (name === folder || name.startsWith(`${folder}-`)) return folder',
    "  }",
    "  return undefined",
    "}",
    "",
    "export function loadExample(name: string): ExampleLoader | undefined {",
    "  const folder = folderForExample(name)",
    "  if (!folder || !(folder in folderModules)) return undefined",
    "  const loadFolder = folderModules[folder as keyof typeof folderModules]",
    "  return () =>",
    "    loadFolder().then((mod) => {",
    "      const loader = mod.loadFolderExample(name)",
    "      if (!loader) {",
    '        return Promise.reject(new Error(`Unknown example in folder ${folder}: ${name}`))',
    "      }",
    "      return loader()",
    "    })",
    "}",
    ""
  )

  return lines.join("\n")
}

const { byFolder, errors, discoveredFolders } = walkExamples()

if (errors.length > 0) {
  console.error("generate-example-loaders failed:\n")
  for (const err of errors) console.error(`  - ${err}`)
  console.error(`\n${errors.length} file(s) with invalid exports.`)
  process.exit(1)
}

let total = 0
const foldersWithExamples = []
for (const [folder, entries] of byFolder) {
  if (entries.length === 0) continue
  foldersWithExamples.push(folder)
  total += entries.length
  const out = path.join(examplesDir, folder, "_loaders.ts")
  fs.writeFileSync(out, emitFolderLoaders(folder, entries), "utf8")
}

// Remove stale _loaders.ts in folders that no longer have examples
for (const folder of discoveredFolders) {
  if (foldersWithExamples.includes(folder)) continue
  const stale = path.join(examplesDir, folder, "_loaders.ts")
  if (fs.existsSync(stale)) fs.unlinkSync(stale)
}

if (total === 0) {
  console.error("generate-example-loaders: no examples found")
  process.exit(1)
}

fs.writeFileSync(outRouter, emitRouter(foldersWithExamples), "utf8")
console.log(
  `Wrote ${total} loaders across ${foldersWithExamples.length} folders → registry/example-loaders.ts`
)
