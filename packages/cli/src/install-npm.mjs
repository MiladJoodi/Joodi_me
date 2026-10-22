import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import path from "node:path"

/** Already covered by `sonojs init` — do not reinstall on every add. */
export const INIT_BASELINE_NPM = new Set(["clsx", "tailwind-merge"])

/** Bare name from npm install spec (`pkg`, `pkg@^1`, `@scope/pkg@2`). */
export function npmPackageName(spec) {
  if (spec.startsWith("@")) {
    const i = spec.indexOf("@", 1)
    return i === -1 ? spec : spec.slice(0, i)
  }
  const i = spec.indexOf("@")
  return i === -1 ? spec : spec.slice(0, i)
}

function hasVersionRange(spec) {
  return npmPackageName(spec) !== spec
}

function readInstalledNames(cwd) {
  try {
    const pkg = JSON.parse(
      readFileSync(path.join(cwd, "package.json"), "utf8")
    )
    return new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ])
  } catch {
    return new Set()
  }
}

/**
 * Install npm packages required by registry items (e.g. react-day-picker@^9).
 * Skips init baseline. Bare names already in package.json are skipped.
 * Versioned specs always run `npm i` so ranges are enforced (v10 → v9).
 * Returns the list that was (or should have been) installed.
 */
export function installNpmDependencies(cwd, deps) {
  const installed = readInstalledNames(cwd)
  const extra = [...new Set(deps)]
    .filter((d) => {
      const name = npmPackageName(d)
      if (INIT_BASELINE_NPM.has(name)) return false
      if (hasVersionRange(d)) return true
      return !installed.has(name)
    })
    .sort()

  if (extra.length === 0) return []

  console.log("\nInstalling npm packages:")
  for (const dep of extra) console.log(`  + ${dep}`)

  const result = spawnSync("npm", ["i", ...extra], {
    cwd,
    stdio: "inherit",
    shell: true,
  })

  if (result.status !== 0) {
    throw new Error(
      `npm install failed — run manually:\n  npm i ${extra.join(" ")}`
    )
  }

  return extra
}
