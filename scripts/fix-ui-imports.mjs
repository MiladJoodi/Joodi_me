/**
 * Rewrite legacy registry import paths inside packages/ui/src/components.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const componentsDir = path.join(root, "packages", "ui", "src", "components")

const replacements = [
  [/from "cn"/g, 'from "@sonojs/ui/lib/utils"'],
  [/from 'cn'/g, "from '@sonojs/ui/lib/utils'"],
  [/from "@\/registry\/new-york-v4\/ui\//g, 'from "@sonojs/ui/components/'],
  [/from '@\/registry\/new-york-v4\/ui\//g, "from '@sonojs/ui/components/"],
  [/from "@\/registry\/new-york-v4\/hooks\//g, 'from "@sonojs/ui/hooks/'],
  [/from '@\/registry\/new-york-v4\/hooks\//g, "from '@sonojs/ui/hooks/"],
  [/from "@\/registry\/new-york-v4\/lib\//g, 'from "@sonojs/ui/lib/'],
  [/from '@\/registry\/new-york-v4\/lib\//g, "from '@sonojs/ui/lib/"],
]

let changed = 0
for (const file of readdirSync(componentsDir)) {
  if (!file.endsWith(".tsx") && !file.endsWith(".ts")) continue
  const abs = path.join(componentsDir, file)
  let source = readFileSync(abs, "utf8")
  const before = source
  for (const [pattern, replacement] of replacements) {
    source = source.replace(pattern, replacement)
  }
  if (source !== before) {
    writeFileSync(abs, source, "utf8")
    changed++
  }
}

console.log(`Updated imports in ${changed} component file(s)`)
