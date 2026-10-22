import { ComponentSource } from "@/components/docs/component-source"
import { InstallNeedsHint } from "@/components/docs/install-needs-hint"
import {
  docsHintNpmDeps,
  docsInstallBash,
  readRegistryInstallMeta,
} from "@/lib/docs-install"

/**
 * Installation: CLI `add` player + the same “Also needs” bar as button-group
 * examples for registryDependencies and npm deps (including lucide-react).
 *
 * Pass `names` when the page is a composition (e.g. date-picker → calendar + popover).
 */
export async function DocsInstallation({
  name,
  names,
}: {
  name?: string
  names?: string[]
}) {
  const primary = names?.length ? names : name ? [name] : []
  if (primary.length === 0) {
    throw new Error("DocsInstallation requires `name` or `names`")
  }

  const metas = await Promise.all(primary.map(readRegistryInstallMeta))
  const primarySet = new Set(primary)
  const registry = [
    ...new Set(
      metas
        .flatMap((m) => m.registryDependencies ?? [])
        .filter((dep) => !primarySet.has(dep))
    ),
  ].sort()
  const npm = docsHintNpmDeps(metas.flatMap((m) => m.dependencies ?? []))
  const code = docsInstallBash(primary)
  const hasNeeds = registry.length > 0 || npm.length > 0

  return (
    <section className="space-y-3">
      <h2 className="text-h3">Installation</h2>
      <div className="overflow-hidden rounded-xl border border-border/80">
        <ComponentSource
          title="CLI"
          lang="bash"
          code={code}
          className="rounded-none border-0"
        />
        {hasNeeds ? (
          <InstallNeedsHint
            label="Also needs"
            registry={registry}
            npm={npm}
          />
        ) : null}
      </div>
    </section>
  )
}
