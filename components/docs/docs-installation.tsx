import { DocsInstallationTabs } from "@/components/docs/docs-installation-tabs"
import {
  docsHintNpmDeps,
  docsInstallBash,
  docsManualNpmCommand,
  docsSourceUsesAppAlias,
  readRegistryInstallMeta,
} from "@/lib/docs-install"
import { highlightCode } from "@/lib/highlight-code"

/**
 * Installation: Command (`add`) + Manual (copy files from registry JSON).
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

  const files = metas.flatMap((m) => m.files ?? [])
  const showAliasNote = files.some((f) => docsSourceUsesAppAlias(f.content))
  const manualNpmCommand = docsManualNpmCommand(
    metas.flatMap((m) => m.dependencies ?? [])
  )

  const [cliHtml, ...fileHtmls] = await Promise.all([
    highlightCode(code, "bash"),
    ...files.map((f) => highlightCode(f.content, "tsx")),
  ])

  return (
    <section className="space-y-3">
      <h2 className="text-h3">Installation</h2>
      <DocsInstallationTabs
        cliCode={code}
        cliHtml={cliHtml}
        alsoNeedsRegistry={registry}
        alsoNeedsNpm={npm}
        manualNpmCommand={manualNpmCommand}
        showAliasNote={showAliasNote}
        files={files.map((f, i) => ({
          title: f.title,
          code: f.content,
          html: fileHtmls[i] ?? "",
        }))}
      />
    </section>
  )
}
