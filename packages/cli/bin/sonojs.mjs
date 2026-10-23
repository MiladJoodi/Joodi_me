#!/usr/bin/env node
import path from "node:path"
import { fileURLToPath } from "node:url"

import { applyRegistryCssVars } from "../src/apply-css-vars.mjs"
import { RegistryConsistencyError } from "../src/consistency.mjs"
import {
  ensureChartNeonVars,
  ensureTwAnimateImport,
  initSonojsProject,
} from "../src/init.mjs"
import {
  installInitNpmDependencies,
  installNpmDependencies,
} from "../src/install-npm.mjs"
import { installRegistryItemFiles } from "../src/install.mjs"
import { resolveRegistryItem } from "../src/resolve.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const defaultLocalR = path.resolve(__dirname, "../../../public/r")

function printHelp() {
  console.log(`Usage:
  sonojs init [--cwd <dir>] [--registry <url-or-path>] [--overwrite]
  sonojs add <name> [name...] [--registry <url-or-path>] [--cwd <dir>] [--overwrite]

init  — installs design system (styles/sonojs.css), lib/utils.ts, components.json
add   — copies component(s) into components/ui/ (run init first)

Environment:
  SONOJS_REGISTRY   Default registry base (URL or local directory)
`)
}

function parseFlags(rest) {
  let registry = process.env.SONOJS_REGISTRY || defaultLocalR
  let cwd = process.cwd()
  let overwrite = false

  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === "--registry" && rest[i + 1]) {
      registry = rest[i + 1]
      i++
    } else if (rest[i] === "--cwd" && rest[i + 1]) {
      cwd = path.resolve(rest[i + 1])
      i++
    } else if (rest[i] === "--overwrite") {
      overwrite = true
    }
  }

  return { registry, cwd, overwrite }
}

async function cmdInit(rest) {
  const { registry, cwd, overwrite } = parseFlags(rest)
  const registryUrl =
    registry.startsWith("http://") ||
    registry.startsWith("https://") ||
    registry.startsWith("file:")
      ? registry
      : undefined

  const { written, skipped, globals, twAnimate, chartNeon } =
    await initSonojsProject({
      cwd,
      overwrite,
      registryUrl,
    })

  console.log("SonoJS initialized (theme tokens on :root via styles/sonojs.css)")
  for (const file of written) console.log(`  + ${file}`)
  for (const file of skipped) {
    console.log(`  ~ skip (exists): ${file}  (use --overwrite)`)
  }
  if (globals?.status === "patched") {
    console.log(`  + import in ${globals.rel}`)
  } else if (globals?.status === "exists") {
    console.log(`  ~ import already in ${globals.rel}`)
  } else if (globals?.status === "missing") {
    console.log(`  ! ${globals.message}`)
  }
  if (twAnimate?.status === "patched") {
    console.log("  + @import tw-animate-css in styles/sonojs.css")
  }
  if (chartNeon?.status === "patched") {
    console.log(
      `  + chart neon cssVars → ${chartNeon.file} (${chartNeon.keys?.join(", ")})`
    )
  }

  installInitNpmDependencies(cwd)

  console.log(`
Next:
  sonojs add button
`)
}

async function cmdAdd(names, rest) {
  const { registry, cwd, overwrite } = parseFlags(rest)
  const npmDeps = new Set()
  const seen = new Set()
  /** @type {{ light?: Record<string, string>, dark?: Record<string, string> }} */
  const mergedCssVars = { light: {}, dark: {} }

  async function addOne(itemName) {
    if (seen.has(itemName)) return
    seen.add(itemName)

    const { item, index } = await resolveRegistryItem({
      name: itemName,
      registryUrl: registry,
    })

    for (const dep of item.registryDependencies ?? []) {
      await addOne(dep)
    }

    const { written, skipped } = await installRegistryItemFiles(item, {
      cwd,
      overwrite,
    })

    console.log(`Added ${item.name} from ${index.name} @ ${index.version}`)
    for (const file of written) console.log(`  + ${file}`)
    for (const file of skipped) {
      console.log(`  ~ skip (exists): ${file}  (use --overwrite)`)
    }

    if (item.cssVars?.light) {
      Object.assign(mergedCssVars.light, item.cssVars.light)
    }
    if (item.cssVars?.dark) {
      Object.assign(mergedCssVars.dark, item.cssVars.dark)
    }

    for (const dep of item.dependencies ?? []) npmDeps.add(dep)
  }

  for (const name of names) {
    await addOne(name)
  }

  const hasCssVars =
    Object.keys(mergedCssVars.light).length > 0 ||
    Object.keys(mergedCssVars.dark).length > 0
  if (hasCssVars) {
    const cssResult = await applyRegistryCssVars(cwd, mergedCssVars)
    if (cssResult.status === "patched") {
      console.log(
        `  + cssVars → ${cssResult.file} (${cssResult.keys?.join(", ")})`
      )
    } else if (cssResult.status === "missing") {
      console.log(
        "  ! No styles/sonojs.css or globals.css — set --chart-* tokens manually from the registry item cssVars"
      )
    }
  }

  // Sheet/Dialog/Popover enter-exit — install package + CSS import if missing
  // (covers projects that inited before tw-animate was part of the baseline).
  npmDeps.add("tw-animate-css")
  installNpmDependencies(cwd, [...npmDeps])

  const twAnimate = await ensureTwAnimateImport(cwd)
  if (twAnimate?.status === "patched") {
    console.log("  + @import tw-animate-css in styles/sonojs.css")
  }

  const chartNeon = await ensureChartNeonVars(cwd)
  if (chartNeon?.status === "patched") {
    console.log(
      `  + chart neon cssVars → ${chartNeon.file} (${chartNeon.keys?.join(", ")})`
    )
  }

  if (seen.has("sonner")) {
    console.log(`
Next — mount <Toaster /> once in your root layout (inside ThemeProvider if you use one):
  import { Toaster } from "@/components/ui/sonner"
  …
  <body>
    {children}
    <Toaster />
  </body>
`)
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printHelp()
    process.exit(0)
  }

  const [command, ...rest] = args

  try {
    if (command === "init") {
      await cmdInit(rest)
      return
    }

    if (command === "add") {
      const names = []
      let i = 0
      for (; i < rest.length; i++) {
        if (rest[i].startsWith("-")) break
        names.push(rest[i])
      }
      if (names.length === 0) {
        printHelp()
        process.exit(1)
      }
      await cmdAdd(names, rest.slice(i))
      return
    }

    printHelp()
    process.exit(1)
  } catch (error) {
    if (error instanceof RegistryConsistencyError) {
      console.error(`sonojs: ${error.message}`)
      process.exit(2)
    }
    console.error(`sonojs: ${error instanceof Error ? error.message : error}`)
    process.exit(1)
  }
}

main()
