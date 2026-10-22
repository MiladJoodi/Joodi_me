import { mkdir, writeFile, access } from "node:fs/promises"
import path from "node:path"
import { constants as fsConstants } from "node:fs"

/**
 * Resolve where a registry file should land in the consumer project.
 * Prefers explicit `target`, else falls back to basename under components/ui.
 */
export function resolveInstallPath(file, cwd = process.cwd()) {
  const relative =
    file.target ||
    (file.type === "registry:ui"
      ? path.join("components", "ui", path.basename(file.path))
      : file.path.replace(/^registry\//, ""))

  return path.resolve(cwd, relative)
}

async function pathExists(p) {
  try {
    await access(p, fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}

/**
 * Copy registry item files into the project (consumer owns the source).
 * @returns {{ written: string[], skipped: string[] }}
 */
export async function installRegistryItemFiles(item, {
  cwd = process.cwd(),
  overwrite = false,
} = {}) {
  const written = []
  const skipped = []

  for (const file of item.files ?? []) {
    if (typeof file.content !== "string") {
      throw new Error(
        `Registry file "${file.path}" has no content. Rebuild with npm run registry:build.`
      )
    }

    const dest = resolveInstallPath(file, cwd)
    if (!overwrite && (await pathExists(dest))) {
      skipped.push(path.relative(cwd, dest))
      continue
    }

    await mkdir(path.dirname(dest), { recursive: true })
    await writeFile(dest, file.content, "utf8")
    written.push(path.relative(cwd, dest))
  }

  return { written, skipped }
}
