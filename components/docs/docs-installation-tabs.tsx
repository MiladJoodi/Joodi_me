"use client"

import { CopyButton } from "@/components/docs/copy-button"
import { InstallNeedsHint } from "@/components/docs/install-needs-hint"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@sonojs/ui/components/tabs"

export type DocsInstallFileView = {
  title: string
  code: string
  html: string
}

export type DocsInstallationTabsProps = {
  cliCode: string
  cliHtml: string
  alsoNeedsRegistry: string[]
  alsoNeedsNpm: string[]
  manualNpmCommand: string | null
  files: DocsInstallFileView[]
  showAliasNote: boolean
}

function CliCodeFrame({
  code,
  html,
}: {
  code: string
  html: string
}) {
  return (
    <div className="sono-code-block rounded-none border-0">
      <div className="flex items-center justify-between gap-2 border-b border-[color:var(--code-border)] px-4 py-2">
        <div className="font-mono text-[14px] font-normal text-[color:var(--code-header-fg)]">
          CLI
        </div>
        <CopyButton value={code} />
      </div>
      <div
        className="sono-code-shiki no-scrollbar font-mono text-[14px] leading-[1.65]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

function ManualFileFrame({ file }: { file: DocsInstallFileView }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/80">
      <div className="sono-code-block rounded-none border-0">
        <div className="flex items-center justify-between gap-2 border-b border-[color:var(--code-border)] px-4 py-2">
          <div
            className="min-w-0 truncate font-mono text-[14px] font-normal text-[color:var(--code-header-fg)]"
            title={file.title}
          >
            {file.title}
          </div>
          {/* Copy raw source only — never path or highlight HTML */}
          <CopyButton value={file.code} />
        </div>
        <div
          className="sono-code-shiki no-scrollbar max-h-96 overflow-auto font-mono text-[14px] leading-[1.65]"
          dangerouslySetInnerHTML={{ __html: file.html }}
        />
      </div>
    </div>
  )
}

/** Soft command row — same language as InstallNeedsHint (not Dark+ code chrome). */
function SoftCommandBar({
  label,
  command,
}: {
  label: string
  command: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-[12.5px] text-muted-foreground">
      <span className="shrink-0">{label}</span>
      <code className="min-w-0 flex-1 truncate rounded-md border border-border/70 bg-background px-1.5 py-0.5 font-mono text-[11.5px] text-foreground sm:flex-none">
        {command}
      </code>
      <CopyButton
        value={command}
        className="text-muted-foreground hover:bg-muted hover:text-foreground"
      />
    </div>
  )
}

export function DocsInstallationTabs({
  cliCode,
  cliHtml,
  alsoNeedsRegistry,
  alsoNeedsNpm,
  manualNpmCommand,
  files,
  showAliasNote,
}: DocsInstallationTabsProps) {
  const hasCommandNeeds =
    alsoNeedsRegistry.length > 0 || alsoNeedsNpm.length > 0
  const hasManualRegistryDeps = alsoNeedsRegistry.length > 0
  const npmStep = manualNpmCommand ? 1 : 0
  const registryStep = hasManualRegistryDeps
    ? npmStep > 0
      ? 2
      : 1
    : 0
  const filesStep =
    1 + (manualNpmCommand ? 1 : 0) + (hasManualRegistryDeps ? 1 : 0)

  return (
    <Tabs defaultValue="command" className="gap-3">
      <TabsList variant="line" className="w-full justify-start sm:w-fit">
        <TabsTrigger value="command" className="flex-none px-3">
          Command
        </TabsTrigger>
        <TabsTrigger value="manual" className="flex-none px-3">
          Manual
        </TabsTrigger>
      </TabsList>

      <TabsContent value="command" className="mt-0 outline-none">
        {/* Same chrome as the pre-tabs Installation CLI block */}
        <div className="overflow-hidden rounded-xl border border-border/80">
          <CliCodeFrame code={cliCode} html={cliHtml} />
          {hasCommandNeeds ? (
            <InstallNeedsHint
              label="Also needs"
              registry={alsoNeedsRegistry}
              npm={alsoNeedsNpm}
            />
          ) : null}
        </div>
      </TabsContent>

      <TabsContent value="manual" className="mt-0 space-y-4 outline-none">
        <ol className="list-none space-y-4">
          {manualNpmCommand ? (
            <li className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                {npmStep}. Install dependencies
              </p>
              <SoftCommandBar label="Run" command={manualNpmCommand} />
            </li>
          ) : null}

          {hasManualRegistryDeps ? (
            <li className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                {registryStep}. Install registry dependencies
              </p>
              <p className="text-sm text-muted-foreground">
                Add these items first — their sources are not inlined here.
              </p>
              <SoftCommandBar
                label="Also needs"
                command={`npx @sonojs/ui@latest add ${alsoNeedsRegistry.join(" ")}`}
              />
            </li>
          ) : null}

          <li className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {filesStep}. Copy the following file
              {files.length === 1 ? "" : "s"} into your project
            </p>
            {showAliasNote ? (
              <p className="text-sm text-muted-foreground">
                Sources use{" "}
                <code className="font-mono text-[0.9em]">@/</code> aliases (
                <code className="font-mono text-[0.9em]">@/components</code>,{" "}
                <code className="font-mono text-[0.9em]">@/lib</code>,{" "}
                <code className="font-mono text-[0.9em]">@/hooks</code>
                ). Map them in your{" "}
                <code className="font-mono text-[0.9em]">tsconfig</code> paths
                before pasting.
              </p>
            ) : null}
            <div className="space-y-3">
              {files.map((file, index) => (
                <ManualFileFrame
                  key={`${file.title}:${index}`}
                  file={file}
                />
              ))}
            </div>
          </li>
        </ol>
      </TabsContent>
    </Tabs>
  )
}
