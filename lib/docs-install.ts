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

export type RegistryInstallFile = {
  /** Install path shown to users (prefer registry `target`). */
  title: string
  content: string
}

export type RegistryInstallMeta = {
  dependencies?: string[]
  registryDependencies?: string[]
  files?: RegistryInstallFile[]
}

type RegistryJsonFile = {
  path?: string
  target?: string
  content?: string
}

type RegistryJson = {
  dependencies?: string[]
  registryDependencies?: string[]
  files?: RegistryJsonFile[]
}

function mapFiles(files: RegistryJsonFile[] | undefined): RegistryInstallFile[] {
  if (!files?.length) return []
  const out: RegistryInstallFile[] = []
  for (const file of files) {
    const content = file.content
    if (!content) continue
    const title = file.target || file.path
    if (!title) continue
    out.push({ title, content })
  }
  return out
}

export async function readRegistryInstallMeta(
  name: string
): Promise<RegistryInstallMeta> {
  try {
    const file = path.join(process.cwd(), "public", "r", `${name}.json`)
    const raw = await readFile(file, "utf8")
    const json = JSON.parse(raw) as RegistryJson
    return {
      dependencies: json.dependencies ?? [],
      registryDependencies: json.registryDependencies ?? [],
      files: mapFiles(json.files),
    }
  } catch {
    return { dependencies: [], registryDependencies: [], files: [] }
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

export function docsManualNpmCommand(deps: string[]): string | null {
  const npm = docsHintNpmDeps(deps)
  if (npm.length === 0) return null
  return `npm i ${npm.join(" ")}`
}

export function docsSourceUsesAppAlias(content: string): boolean {
  return content.includes("@/")
}
