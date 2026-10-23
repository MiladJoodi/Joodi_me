import { mkdir, readFile, writeFile, access } from "node:fs/promises"
import { constants as fsConstants } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { applyRegistryCssVars } from "./apply-css-vars.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templatesRoot = path.resolve(__dirname, "../templates/init")

/** Neon semantics — same hex as docs `style-vega` / registry cssVars. */
export const CHART_NEON_CSS_VARS = {
  light: {
    "chart-up": "#16a34a",
    "chart-down": "#e11d48",
    "chart-mute": "#52525b",
  },
  dark: {
    "chart-up": "#4ade80",
    "chart-down": "#f25f70",
    "chart-mute": "#d4d4d8",
  },
}

const INIT_FILES = [
  { from: "lib/utils.ts", to: "lib/utils.ts" },
  { from: "lib/direction.ts", to: "lib/direction.ts" },
  { from: "hooks/use-direction.tsx", to: "hooks/use-direction.tsx" },
  { from: "styles/sonojs.css", to: "styles/sonojs.css" },
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
  const sonoAbs = path.resolve(cwd, "styles/sonojs.css")
  let rel = path.relative(path.dirname(globalsAbs), sonoAbs).replace(/\\/g, "/")
  if (!rel.startsWith(".")) rel = `./${rel}`
  return `@import "${rel}";`
}

/**
 * Ensure existing sonojs.css pulls enter/exit utilities (Sheet, Dialog, …).
 * Safe when the file was skipped because it already existed.
 */
export async function ensureTwAnimateImport(cwd) {
  const sonoAbs = path.resolve(cwd, "styles/sonojs.css")
  if (!(await pathExists(sonoAbs))) {
    return { status: "missing" }
  }

  let css = await readFile(sonoAbs, "utf8")
  if (css.includes("tw-animate-css")) {
    return { status: "exists" }
  }

  css = `@import "tw-animate-css";\n\n${css}`
  await writeFile(sonoAbs, css, "utf8")
  return { status: "patched" }
}

/**
 * Ensure `--chart-up` / `--chart-down` / `--chart-mute` exist (and match vega).
 * Covers projects that inited before neon tokens were part of the baseline.
 */
export async function ensureChartNeonVars(cwd) {
  return applyRegistryCssVars(cwd, CHART_NEON_CSS_VARS)
}

/**
 * Ensure sonojs.css is imported from the app globals stylesheet.
 */
async function ensureGlobalsImport(cwd) {
  const found = await findGlobalsCss(cwd)
  if (!found) {
    return {
      status: "missing",
      message:
        'No globals.css found — add: @import "../styles/sonojs.css";',
    }
  }

  let css = await readFile(found.abs, "utf8")
  if (css.includes("styles/sonojs.css") || css.includes("sonojs.css")) {
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
 * Install SonoJS design system + utils into a consumer project.
 * Theme tokens land on `:root` via styles/sonojs.css (imported from globals.css).
 */
export async function initSonojsProject({
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
        "@sonojs": `${base}{name}.json`,
      }
      content = `${JSON.stringify(json, null, 2)}\n`
    }

    await mkdir(path.dirname(dest), { recursive: true })
    await writeFile(dest, content, "utf8")
    written.push(file.to)
  }

  const globals = await ensureGlobalsImport(cwd)
  const twAnimate = await ensureTwAnimateImport(cwd)
  const chartNeon = await ensureChartNeonVars(cwd)

  return { written, skipped, globals, twAnimate, chartNeon }
}
