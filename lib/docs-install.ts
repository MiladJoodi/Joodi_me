import { readFile } from "node:fs/promises"
import path from "node:path"

/**
 * Packages that are baseline / noise for the “Also needs” bar.
 * Always surface lucide-react, react-day-picker, date-fns, recharts, …
 */
export const DOCS_INSTALL_NPM_SKIP = new Set([
  "clsx",
  "tailwind-merge",
  "radix-ui",
  "class-variance-authority",
])

/** Bare name from npm install spec (`pkg`, `pkg@^1`, `@scope/pkg@2`). */
export function npmPackageName(spec: string): string {
  if (spec.startsWith("@")) {
    const i = spec.indexOf("@", 1)
    return i === -1 ? spec : spec.slice(0, i)
  }
  const i = spec.indexOf("@")
  return i === -1 ? spec : spec.slice(0, i)
}

export type RegistryInstallMeta = {
  dependencies?: string[]
  registryDependencies?: string[]
}

export async function readRegistryInstallMeta(
  name: string
): Promise<RegistryInstallMeta> {
  try {
    const file = path.join(process.cwd(), "public", "r", `${name}.json`)
    const raw = await readFile(file, "utf8")
    const json = JSON.parse(raw) as RegistryInstallMeta
    return {
      dependencies: json.dependencies ?? [],
      registryDependencies: json.registryDependencies ?? [],
    }
  } catch {
    return { dependencies: [], registryDependencies: [] }
  }
}

/** npm packages for the Installation “Also needs” bar (includes lucide-react). */
export function docsHintNpmDeps(deps: string[] | undefined): string[] {
  if (!deps?.length) return []
  return [...new Set(deps)]
    .filter((d) => !DOCS_INSTALL_NPM_SKIP.has(npmPackageName(d)))
    .sort()
}

export function docsInstallBash(names: string | string[]): string {
  const list = Array.isArray(names) ? names.join(" ") : names
  return `npx @sonojs/ui@latest add ${list}`
}
