/**
 * Registry index/item consistency guard (mirrors lib/registry-consistency.ts).
 */

export class RegistryConsistencyError extends Error {
  constructor(message) {
    super(message)
    this.name = "RegistryConsistencyError"
  }
}

export function getRegistryVersionMeta(payload) {
  if (!payload?.version || !payload?.generatedAt) return null
  return { version: payload.version, generatedAt: payload.generatedAt }
}

export function assertRegistryItemCompatible(index, item, itemName) {
  const items = index.items ?? []
  const listed = items.some((entry) => entry.name === itemName)
  if (!listed) {
    throw new RegistryConsistencyError(
      `Registry item "${itemName}" is not listed in registry.json. Refusing to install an inconsistent pair.`
    )
  }

  if (item.name && item.name !== itemName) {
    throw new RegistryConsistencyError(
      `Requested "${itemName}" but item JSON reports name "${item.name}".`
    )
  }

  const indexMeta = getRegistryVersionMeta(index)
  const itemMeta = getRegistryVersionMeta(item)

  if (!indexMeta || !itemMeta) {
    throw new RegistryConsistencyError(
      `Registry payloads for "${itemName}" are missing version/generatedAt. Rebuild with npm run registry:build.`
    )
  }

  if (
    indexMeta.version !== itemMeta.version ||
    indexMeta.generatedAt !== itemMeta.generatedAt
  ) {
    throw new RegistryConsistencyError(
      `Registry index and "${itemName}" are from different builds (index ${indexMeta.version}@${indexMeta.generatedAt} vs item ${itemMeta.version}@${itemMeta.generatedAt}). Redeploy or wait for a consistent artifact.`
    )
  }
}
