import { mkdir, readFile, writeFile, access } from "node:fs/promises"
import { constants as fsConstants } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templatesRoot = path.resolve(__dirname, "../templates/init")

const INIT_FILES = [
  { from: "lib/utils.ts", to: "lib/utils.ts" },
  { from: "lib/direction.ts", to: "lib/direction.ts" },
  { from: "hooks/use-direction.tsx", to: "hooks/use-direction.tsx" },
  { from: "styles/winkui.css", to: "styles/winkui.css" },
  { from: "components.json", to: "components.json" },
]

async function pathExists(p) {
  try {
    await access(p, fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}

async function findGlobalsCss(cwd) {
  const candidates = [
    "app/globals.css",
    "src/app/globals.css",
    "src/styles/globals.css",
    "styles/globals.css",
  ]
  for (const rel of candidates) {
    const abs = path.resolve(cwd, rel)
    if (await pathExists(abs)) return { abs, rel }
  }
  return null
}

function importLineForGlobals(cwd, globalsAbs) {
  const winkAbs = path.resolve(cwd, "styles/winkui.css")
  let rel = path.relative(path.dirname(globalsAbs), winkAbs).replace(/\\/g, "/")
  if (!rel.startsWith(".")) rel = `./${rel}`
  return `@import "${rel}";`
}

/**
 * Ensure winkui.css is imported from the app globals stylesheet.
 */
async function ensureGlobalsImport(cwd) {
  const found = await findGlobalsCss(cwd)
  if (!found) {
    return {
      status: "missing",
      message:
        'No globals.css found — add: @import "../styles/winkui.css";',
    }
  }

  let css = await readFile(found.abs, "utf8")
  if (css.includes("styles/winkui.css") || css.includes("winkui.css")) {
    return { status: "exists", rel: found.rel }
  }

  const importLine = importLineForGlobals(cwd, found.abs)

  // Insert after the last leading @import, or at the top.
  const importBlock = css.match(/^(?:@import[^;]+;\s*)+/m)
  if (importBlock) {
    const end = importBlock.index + importBlock[0].length
    css = css.slice(0, end) + `${importLine}\n` + css.slice(end)
  } else {
    css = `${importLine}\n${css}`
  }

  await writeFile(found.abs, css, "utf8")
  return { status: "patched", rel: found.rel }
}

/**
 * Install WinkUI design system + utils into a consumer project.
 * Tokens are scoped to `.winkui` — does not override host :root theme.
 */
export async function initWinkuiProject({
  cwd = process.cwd(),
  overwrite = false,
  registryUrl,
} = {}) {
  const written = []
  const skipped = []

  for (const file of INIT_FILES) {
    const src = path.join(templatesRoot, file.from)
    const dest = path.resolve(cwd, file.to)

    if (!overwrite && (await pathExists(dest))) {
      skipped.push(file.to)
      continue
    }

    let content = await readFile(src, "utf8")

    if (file.to === "components.json" && registryUrl) {
      const json = JSON.parse(content)
      const base = registryUrl.replace(/\/?$/, "/")
      json.registries = {
        ...(json.registries ?? {}),
        "@winkui": `${base}{name}.json`,
      }
      content = `${JSON.stringify(json, null, 2)}\n`
    }

    await mkdir(path.dirname(dest), { recursive: true })
    await writeFile(dest, content, "utf8")
    written.push(file.to)
  }

  const globals = await ensureGlobalsImport(cwd)

  return { written, skipped, globals }
}
