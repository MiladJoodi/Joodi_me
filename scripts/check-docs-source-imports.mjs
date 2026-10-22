import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

/**
 * Find Record<string, string> source maps / template sources in docs pages
 * and verify JSX tags are imported.
 */
const docsRoot = path.join(process.cwd(), "app/(app)/docs/components")
const pages = []

async function walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) await walk(p)
    else if (ent.name === "page.tsx") pages.push(p)
  }
}
await walk(docsRoot)

function checkSource(label, src) {
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
    } else if (m[3]) imported.add(m[3])
    else if (m[4]) imported.add(m[4])
  }

  let body = src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/import[\s\S]*?from\s+["'][^"']+["']/g, "")

  const jsxTags = new Set()
  const tagRe = /<([A-Z][A-Za-z0-9]*)/g
  while ((m = tagRe.exec(body)) !== null) jsxTags.add(m[1])

  const missing = [...jsxTags].filter((t) => !imported.has(t))
  const unused = [...imported].filter((n) => {
    const re = new RegExp(`(?:^|[^\\w])${n}(?:[^\\w]|$)`)
    return !re.test(body)
  })

  return { missing, unused, imported: [...imported], jsx: [...jsxTags] }
}

const issues = []

for (const page of pages) {
  const text = await readFile(page, "utf8")
  const rel = path.relative(process.cwd(), page).replaceAll("\\", "/")

  // Extract Record sources: "key": `...` or "key": `...`
  const mapRe = /"([^"]+)":\s*`([\s\S]*?)`/g
  let m
  while ((m = mapRe.exec(text)) !== null) {
    const key = m[1]
    const src = m[2]
    if (!src.includes("import ") || !src.includes("export ")) continue
    const result = checkSource(key, src)
    if (result.missing.length || result.unused.length) {
      issues.push({ file: rel, key, ...result })
    }
  }

  // usageSource / *Source = `...`
  const singleRe =
    /(?:const|let)\s+(\w*[Ss]ource)\s*=\s*`([\s\S]*?)`/g
  while ((m = singleRe.exec(text)) !== null) {
    const key = m[1]
    const src = m[2]
    if (!src.includes("import ")) continue
    const result = checkSource(key, src)
    if (result.missing.length || result.unused.length) {
      issues.push({ file: rel, key, ...result })
    }
  }
}

if (!issues.length) {
  console.log("OK: docs embedded sources look consistent")
} else {
  for (const i of issues) {
    console.log(`\n${i.file} :: ${i.key}`)
    if (i.missing.length) console.log(`  MISSING: ${i.missing.join(", ")}`)
    if (i.unused.length) console.log(`  unused: ${i.unused.join(", ")}`)
  }
  console.log(`\nTotal: ${issues.length}`)
  process.exitCode = 1
}
