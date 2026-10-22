/**
 * Verifies Cache-Control on /r/* vs hashed /_next/static assets.
 * Expects `next start` (or equivalent) on BASE_URL.
 *
 * Usage: node scripts/verify-cache-headers.mjs [baseUrl]
 */

const base = (process.argv[2] || process.env.BASE_URL || "http://127.0.0.1:3000").replace(
  /\/$/,
  ""
)

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function head(path) {
  const res = await fetch(`${base}${path}`, { method: "HEAD" })
  return {
    status: res.status,
    cacheControl: res.headers.get("cache-control") || "",
  }
}

async function main() {
  const registry = await head("/r/registry.json")
  assert(registry.status === 200, `/r/registry.json → ${registry.status}`)
  assert(
    /max-age=0/i.test(registry.cacheControl) &&
      /must-revalidate/i.test(registry.cacheControl),
    `Expected revalidate Cache-Control on /r/registry.json, got: ${registry.cacheControl}`
  )
  assert(
    !/immutable/i.test(registry.cacheControl),
    `/r/registry.json must not be immutable: ${registry.cacheControl}`
  )

  const item = await head("/r/button.json")
  assert(item.status === 200, `/r/button.json → ${item.status}`)
  assert(
    /max-age=0/i.test(item.cacheControl) && /must-revalidate/i.test(item.cacheControl),
    `Expected revalidate Cache-Control on /r/button.json, got: ${item.cacheControl}`
  )

  // Discover a hashed asset from the home HTML
  const htmlRes = await fetch(`${base}/`)
  assert(htmlRes.status === 200, `/ → ${htmlRes.status}`)
  const html = await htmlRes.text()
  const match = html.match(/\/_next\/static\/[^"'\s]+\.(?:js|css)/)
  assert(match, "Could not find /_next/static asset in / HTML")

  const asset = await head(match[0])
  assert(asset.status === 200, `${match[0]} → ${asset.status}`)
  assert(
    !/max-age=0,\s*must-revalidate/i.test(asset.cacheControl),
    `Hashed asset should keep Next defaults, not /r policy. Got: ${asset.cacheControl}`
  )

  const docs = await head("/docs")
  assert(docs.status === 200, `/docs → ${docs.status}`)
  assert(
    /max-age=0/i.test(docs.cacheControl) && /must-revalidate/i.test(docs.cacheControl),
    `Expected revalidate Cache-Control on /docs, got: ${docs.cacheControl}`
  )

  console.log("Cache header checks passed:")
  console.log(`  /r/registry.json → ${registry.cacheControl}`)
  console.log(`  /r/button.json   → ${item.cacheControl}`)
  console.log(`  /docs            → ${docs.cacheControl}`)
  console.log(`  ${match[0]} → ${asset.cacheControl}`)
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
