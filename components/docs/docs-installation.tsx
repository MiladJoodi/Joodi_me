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
 */
export async function DocsInstallation({ name }: { name: string }) {
  const meta = await readRegistryInstallMeta(name)
  const registry = [...(meta.registryDependencies ?? [])].sort()
  const npm = docsHintNpmDeps(meta.dependencies)
  const code = docsInstallBash(name)
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
