/**
 * Atomically builds public/r/registry.json and public/r/<item>.json
 * with a shared version + generatedAt so index and items stay compatible.
 *
 * Usage: node scripts/build-registry.mjs
 */

import { createHash } from "node:crypto"
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { registryItems } from "./registry-items.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const outDir = path.join(root, "public", "r")

function readPackageVersion() {
  const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"))
  return pkg.version ?? "0.0.0"
}

function contentHash(files) {
  const hash = createHash("sha256")
  for (const file of files) {
    hash.update(file.path)
    hash.update("\0")
    hash.update(file.content)
    hash.update("\0")
  }
  return hash.digest("hex").slice(0, 12)
}

/**
 * packages/ui uses @sonojs/ui/*; consumers get @/* after install.
 */
function rewriteConsumerImports(content) {
  return content
    .replace(
      /from\s+["']@sonojs\/ui\/components\/([^"']+)["']/g,
      'from "@/components/ui/$1"'
    )
    .replace(
      /from\s+["']@sonojs\/ui\/hooks\/([^"']+)["']/g,
      'from "@/hooks/$1"'
    )
    .replace(
      /from\s+["']@sonojs\/ui\/lib\/([^"']+)["']/g,
      'from "@/lib/$1"'
    )
}

function buildItemPayload(item, version, generatedAt) {
  const files = item.files.map((file) => {
    const abs = path.join(root, file.path)
    if (!existsSync(abs)) {
      throw new Error(`Missing registry file: ${file.path}`)
    }
    let content = readFileSync(abs, "utf8")
    if (file.path.startsWith("packages/ui/")) {
      content = rewriteConsumerImports(content)
    }
    const payload = {
      path: file.target || file.path,
      type: file.type,
      content,
    }
    if (file.target) payload.target = file.target
    return payload
  })

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files,
    version,
    generatedAt,
  }
}

function toIndexEntry(item) {
  return {
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files: item.files.map(({ content: _content, ...file }) => file),
    version: item.version,
    generatedAt: item.generatedAt,
  }
}

function writeAtomic(dir, files) {
  mkdirSync(path.dirname(dir), { recursive: true })
  const staging = mkdtempSync(path.join(tmpdir(), "sonojs-r-"))
  try {
    for (const [name, contents] of Object.entries(files)) {
      writeFileSync(path.join(staging, name), contents, "utf8")
    }

    const backup = `${dir}.bak-${Date.now()}`
    if (existsSync(dir)) {
      renameSync(dir, backup)
    }

    try {
      mkdirSync(dir, { recursive: true })
      for (const name of readdirSync(staging)) {
        cpSync(path.join(staging, name), path.join(dir, name))
      }
      if (existsSync(backup)) {
        rmSync(backup, { recursive: true, force: true })
      }
    } catch (error) {
      if (existsSync(dir)) {
        rmSync(dir, { recursive: true, force: true })
      }
      if (existsSync(backup)) {
        renameSync(backup, dir)
      }
      throw error
    }
  } finally {
    rmSync(staging, { recursive: true, force: true })
  }
}

function main() {
  const generatedAt = new Date().toISOString()
  const pkgVersion = readPackageVersion()

  const draftItems = registryItems.map((item) =>
    buildItemPayload(item, "pending", generatedAt)
  )

  const version = `${pkgVersion}+${contentHash(draftItems.flatMap((item) => item.files))}`

  const builtItems = draftItems.map((item) => ({
    ...item,
    version,
    generatedAt,
  }))

  const index = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "sonojs",
    homepage: "https://sonojs.dev",
    version,
    generatedAt,
    items: builtItems.map(toIndexEntry),
  }

  const output = {
    "registry.json": `${JSON.stringify(index, null, 2)}\n`,
  }

  for (const item of builtItems) {
    output[`${item.name}.json`] = `${JSON.stringify(item, null, 2)}\n`
  }

  writeAtomic(outDir, output)
  console.log(
    `Wrote ${Object.keys(output).length} files to public/r (version ${version})`
  )
}

main()
