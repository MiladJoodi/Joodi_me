import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import path from "node:path"

/**
 * Packages `sonojs init` installs. Skipped again on `add` (except
 * `tw-animate-css`, which stays installable via item deps / add path).
 */
export const INIT_NPM_PACKAGES = [
  "clsx",
  "tailwind-merge",
  "tw-animate-css",
]

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

function runNpmInstall(cwd, specs) {
  if (specs.length === 0) return []

  console.log("\nInstalling npm packages:")
  for (const dep of specs) console.log(`  + ${dep}`)

  const result = spawnSync("npm", ["i", ...specs], {
    cwd,
    stdio: "inherit",
    shell: true,
  })

  if (result.status !== 0) {
    throw new Error(
      `npm install failed — run manually:\n  npm i ${specs.join(" ")}`
    )
  }

  return specs
}

/**
 * Install clsx / tailwind-merge / tw-animate-css if missing from package.json.
 * Called by `sonojs init` so consumers never run these by hand.
 */
export function installInitNpmDependencies(cwd) {
  const installed = readInstalledNames(cwd)
  const extra = INIT_NPM_PACKAGES.filter((name) => !installed.has(name)).sort()
  return runNpmInstall(cwd, extra)
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

  return runNpmInstall(cwd, extra)
}
