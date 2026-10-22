import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const root = path.join(process.cwd(), "registry/examples")
const dirs = await readdir(root, { withFileTypes: true })
const issues = []

for (const d of dirs) {
  if (!d.isDirectory()) continue
  const folder = path.join(root, d.name)
  const files = (await readdir(folder)).filter((f) => f.endsWith(".tsx"))
  for (const f of files) {
    const file = path.join(folder, f)
    const src = await readFile(file, "utf8")

    const imported = new Set()
    const importRe =
      /import\s+(?:type\s+)?(?:\{([^}]+)\}|(\*\s+as\s+(\w+))|(\w+))\s+from\s+["'][^"']+["']/gs
    let m
    while ((m = importRe.exec(src)) !== null) {
      if (m[1]) {
        for (const part of m[1].split(",")) {
          let name = part.trim()
          if (!name || name.startsWith("type ")) continue
          name = name.split(/\s+as\s+/).pop().trim()
          if (name) imported.add(name)
        }
      } else if (m[3]) {
        imported.add(m[3])
      } else if (m[4]) {
        imported.add(m[4])
      }
    }

    let body = src
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .replace(/import[\s\S]*?from\s+["'][^"']+["']/g, "")

    const used = new Set()
    for (const name of imported) {
      const re = new RegExp(`(?:^|[^\\w])${name}(?:[^\\w]|$)`)
      if (re.test(body)) used.add(name)
    }

    const unused = [...imported].filter((n) => !used.has(n))

    const jsxTags = new Set()
    const tagRe = /<([A-Z][A-Za-z0-9]*)/g
    while ((m = tagRe.exec(body)) !== null) jsxTags.add(m[1])

    const missing = [...jsxTags].filter((t) => !imported.has(t))

    if (unused.length || missing.length) {
      issues.push({
        file: path.relative(process.cwd(), file).replaceAll("\\", "/"),
        unused,
        missing,
      })
    }
  }
}

if (!issues.length) {
  console.log("OK: no missing/unused import issues in registry/examples")
} else {
  for (const i of issues) {
    console.log(`\n${i.file}`)
    if (i.missing.length) console.log(`  MISSING: ${i.missing.join(", ")}`)
    if (i.unused.length) console.log(`  unused: ${i.unused.join(", ")}`)
  }
  console.log(`\nTotal: ${issues.length}`)
  process.exitCode = 1
}
