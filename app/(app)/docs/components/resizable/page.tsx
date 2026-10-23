import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "resizable-handle",
    title: "Handle",
    description: "Pass `withHandle` on `ResizableHandle` for a visible grip.",
    npmRequires: ["lucide-react", "react-resizable-panels@^4"],
  },
  {
    name: "resizable-default",
    title: "Basic",
    description: "Drag the separator to resize adjacent panels.",
    npmRequires: ["lucide-react", "react-resizable-panels@^4"],
  },
  {
    name: "resizable-vertical",
    title: "Vertical",
    description: 'Set `orientation="vertical"` to stack panels.',
    npmRequires: ["lucide-react", "react-resizable-panels@^4"],
  },
]

const usageSource = `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function Example() {
  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel defaultSize="50%">One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="50%">Two</ResizablePanel>
    </ResizablePanelGroup>
  )
}`

const compositionSource = `ResizablePanelGroup
├── ResizablePanel
├── ResizableHandle
└── ResizablePanel`

export default async function ResizableDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Resizable</h1>
        <p className="leading-relaxed text-muted-foreground">
          Accessible resizable panel groups with keyboard support. Panel sizes
          use percentage strings (e.g.{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            defaultSize=&quot;50%&quot;
          </code>
          ).
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="resizable" />

      <section className="space-y-3">
        <h2 className="text-h3">Composition</h2>
        <ComponentSource
          title="structure"
          lang="tsx"
          code={compositionSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="resizable.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "orientation",
              type: '"horizontal" | "vertical"',
              defaultValue: '"horizontal"',
              description: "On `ResizablePanelGroup` — resize axis.",
            },
            {
              name: "defaultSize",
              type: "number | string",
              defaultValue: "—",
              description:
                'On `ResizablePanel` — initial size (prefer `"50%"`; bare numbers are pixels).',
            },
            {
              name: "minSize",
              type: "number | string",
              defaultValue: "—",
              description: "On `ResizablePanel` — minimum size constraint.",
            },
            {
              name: "withHandle",
              type: "boolean",
              defaultValue: "false",
              description: "On `ResizableHandle` — show a visible grip.",
            },
          ]}
        />
      </section>
    </article>
  )
}
