import { access, readFile, writeFile } from "node:fs/promises"
import { constants as fsConstants } from "node:fs"
import path from "node:path"

async function pathExists(p) {
  try {
    await access(p, fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Upsert `--name: value;` declarations inside the first matching selector block.
 * Expects flat blocks (SonoJS `:root` / `.dark`).
 */
function upsertVarsInBlock(css, selector, vars) {
  if (!vars || Object.keys(vars).length === 0) {
    return { css, changed: false }
  }

  const startRe = new RegExp(`${escapeRegExp(selector)}\\s*\\{`)
  const startMatch = startRe.exec(css)
  if (!startMatch) return { css, changed: false }

  const openIdx = startMatch.index + startMatch[0].length
  let depth = 1
  let i = openIdx
  for (; i < css.length; i++) {
    const ch = css[i]
    if (ch === "{") depth++
    else if (ch === "}") {
      depth--
      if (depth === 0) break
    }
  }
  if (depth !== 0) return { css, changed: false }

  let body = css.slice(openIdx, i)
  let changed = false

  for (const [rawKey, value] of Object.entries(vars)) {
    const name = rawKey.startsWith("--") ? rawKey : `--${rawKey}`
    const decl = `${name}: ${value};`
    const varRe = new RegExp(`${escapeRegExp(name)}\\s*:[^;]*;`)
    if (varRe.test(body)) {
      const next = body.replace(varRe, decl)
      if (next !== body) {
        body = next
        changed = true
      }
    } else {
      body = `${body.replace(/\s*$/, "")}\n  ${decl}\n`
      changed = true
    }
  }

  if (!changed) return { css, changed: false }
  return {
    css: css.slice(0, openIdx) + body + css.slice(i),
    changed: true,
  }
}

/**
 * Merge registry `cssVars` ({ light, dark }) into the consumer theme file.
 * Prefers `styles/sonojs.css`, falls back to common globals.css paths.
 *
 * @returns {{ status: "patched" | "noop" | "missing", file?: string, keys?: string[] }}
 */
export async function applyRegistryCssVars(cwd, cssVars) {
  if (!cssVars?.light && !cssVars?.dark) {
    return { status: "noop" }
  }

  const candidates = [
    "styles/sonojs.css",
    "app/globals.css",
    "src/app/globals.css",
    "src/styles/globals.css",
    "styles/globals.css",
  ]

  let target = null
  for (const rel of candidates) {
    const abs = path.resolve(cwd, rel)
    if (await pathExists(abs)) {
      target = { abs, rel }
      break
    }
  }

  if (!target) {
    return { status: "missing" }
  }

  let css = await readFile(target.abs, "utf8")
  let changed = false
  const keys = []

  if (cssVars.light) {
    const result = upsertVarsInBlock(css, ":root", cssVars.light)
    css = result.css
    changed = changed || result.changed
    keys.push(...Object.keys(cssVars.light))
  }

  if (cssVars.dark) {
    const result = upsertVarsInBlock(css, ".dark", cssVars.dark)
    css = result.css
    changed = changed || result.changed
    keys.push(...Object.keys(cssVars.dark))
  }

  if (!changed) {
    return { status: "noop", file: target.rel, keys: [...new Set(keys)] }
  }

  await writeFile(target.abs, css, "utf8")
  return { status: "patched", file: target.rel, keys: [...new Set(keys)] }
}
