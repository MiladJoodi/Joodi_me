/**
 * Ensures registry index and item JSON from the same deploy stay compatible.
 * Used by the CLI before installing files.
 */

export type RegistryVersionMeta = {
  version: string
  generatedAt: string
}

export type RegistryIndexLike = {
  name?: string
  version?: string
  generatedAt?: string
  items?: Array<{ name: string }>
}

export type RegistryItemLike = {
  name?: string
  version?: string
  generatedAt?: string
}

export class RegistryConsistencyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RegistryConsistencyError"
  }
}

export function getRegistryVersionMeta(
  payload: RegistryIndexLike | RegistryItemLike
): RegistryVersionMeta | null {
  if (!payload.version || !payload.generatedAt) return null
  return { version: payload.version, generatedAt: payload.generatedAt }
}

/**
 * Throws if the item is missing from the index or versions diverge.
 */
export function assertRegistryItemCompatible(
  index: RegistryIndexLike,
  item: RegistryItemLike,
  itemName: string
): void {
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
