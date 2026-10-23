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

function QuietCommand({ command }: { command: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <code className="min-w-0 font-mono text-[13px] text-foreground">
        {command}
      </code>
      <CopyButton
        value={command}
        className="shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
      />
    </div>
  )
}

const installTabTriggerClass =
  "flex-none border-transparent px-3 shadow-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-none data-[state=active]:border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"

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
  const registryAdd =
    alsoNeedsRegistry.length > 0
      ? `npx @sonojs/ui@latest add ${alsoNeedsRegistry.join(" ")}`
      : null

  return (
    <Tabs defaultValue="command" className="gap-3">
      <TabsList variant="line" className="w-full justify-start sm:w-fit">
        <TabsTrigger value="command" className={installTabTriggerClass}>
          Command
        </TabsTrigger>
        <TabsTrigger value="manual" className={installTabTriggerClass}>
          Manual
        </TabsTrigger>
      </TabsList>

      <TabsContent value="command" className="mt-0 outline-none">
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

      <TabsContent value="manual" className="mt-0 space-y-5 outline-none">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Copy the following file{files.length === 1 ? "" : "s"} into your
            project.
          </p>
          <div className="space-y-3">
            {files.map((file, index) => (
              <ManualFileFrame
                key={`${file.title}:${index}`}
                file={file}
              />
            ))}
          </div>
        </div>

        {showAliasNote ? (
          <p className="text-sm text-muted-foreground">
            Adjust{" "}
            <code className="font-mono text-[0.9em]">@/</code> import paths to
            match your project.
          </p>
        ) : null}

        {manualNpmCommand || registryAdd ? (
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">
              Then install dependencies:
            </p>
            {manualNpmCommand ? (
              <QuietCommand command={manualNpmCommand} />
            ) : null}
            {registryAdd ? <QuietCommand command={registryAdd} /> : null}
          </div>
        ) : null}
      </TabsContent>
    </Tabs>
  )
}
