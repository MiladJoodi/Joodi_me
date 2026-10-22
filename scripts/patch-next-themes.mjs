import { readFileSync, writeFileSync } from "node:fs"

/**
 * next-themes 0.4.6 + React 19 / Next 16: skip ThemeScript on the client.
 * https://github.com/pacocoursey/next-themes/issues/385
 */
const files = [
  "node_modules/next-themes/dist/index.mjs",
  "node_modules/next-themes/dist/index.js",
]

const marker = 'if(typeof window!=="undefined")return null'

for (const file of files) {
  let src = readFileSync(file, "utf8")
  if (src.includes(marker)) {
    console.log(`${file}: already patched`)
    continue
  }

  const patterns = [
    [
      "scriptProps:w})=>{let p=JSON.stringify",
      `scriptProps:w})=>{${marker};let p=JSON.stringify`,
    ],
    [
      "scriptProps:C})=>{let p=JSON.stringify",
      `scriptProps:C})=>{${marker};let p=JSON.stringify`,
    ],
  ]

  let patched = false
  for (const [from, to] of patterns) {
    if (src.includes(from)) {
      src = src.replace(from, to)
      patched = true
      break
    }
  }

  if (!patched) {
    console.error(`${file}: ThemeScript pattern not found`)
    process.exit(1)
  }

  writeFileSync(file, src)
  console.log(`${file}: patched`)
}
