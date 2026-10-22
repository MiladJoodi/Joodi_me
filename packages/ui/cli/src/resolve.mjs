import { readFile } from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"

import { assertRegistryItemCompatible } from "./consistency.mjs"

function joinRegistryUrl(base, file) {
  const normalized = base.endsWith("/") ? base : `${base}/`
  return new URL(file, normalized).href
}

async function loadJson(urlOrPath) {
  if (
    urlOrPath.startsWith("http://") ||
    urlOrPath.startsWith("https://") ||
    urlOrPath.startsWith("file:")
  ) {
    const res = await fetch(urlOrPath)
    if (!res.ok) {
      throw new Error(`Failed to fetch ${urlOrPath}: ${res.status} ${res.statusText}`)
    }
    return res.json()
  }

  const abs = path.resolve(urlOrPath)
  return JSON.parse(await readFile(abs, "utf8"))
}

/**
 * Loads registry index + item and enforces version consistency before install.
 */
export async function resolveRegistryItem({
  name,
  registryUrl = "http://localhost:3000/r",
}) {
  const isRemote =
    registryUrl.startsWith("http://") ||
    registryUrl.startsWith("https://") ||
    registryUrl.startsWith("file:")

  let index
  let item

  if (isRemote) {
    index = await loadJson(joinRegistryUrl(registryUrl, "registry.json"))
    item = await loadJson(joinRegistryUrl(registryUrl, `${name}.json`))
  } else {
    const dir = path.resolve(registryUrl)
    index = await loadJson(path.join(dir, "registry.json"))
    item = await loadJson(path.join(dir, `${name}.json`))
  }

  assertRegistryItemCompatible(index, item, name)
  return { index, item }
}

export function localRegistryFileUrl(repoPublicR) {
  const abs = path.resolve(repoPublicR, "registry.json")
  return pathToFileURL(abs).href.replace(/registry\.json$/, "")
}
