import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "tabs-default",
    title: "Basic",
    description: "Switch between layered panels with a horizontal tab list.",
  },
  {
    name: "tabs-line",
    title: "Line",
    description: 'Use `variant="line"` on `TabsList` for an underline style.',
  },
  {
    name: "tabs-vertical",
    title: "Vertical",
    description:
      'Set `orientation="vertical"`. The active line uses the inline-end edge so it flips in RTL.',
  },
  {
    name: "tabs-disabled",
    title: "Disabled",
    description: "Disable a trigger with `disabled`.",
  },
  {
    name: "tabs-icons",
    title: "Icons",
    description:
      'Pair icons with `data-icon="inline-start"` so they follow writing direction.',
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Example() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  )
}`

const directionSource = `import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// dir from useDirection — arrow keys and tab order follow LTR/RTL.
// Vertical line indicator: after:-end-1 (inline end toward content).
<Tabs orientation="vertical" defaultValue="account">
  <TabsList variant="line">
    <TabsTrigger value="account">Account</TabsTrigger>
  </TabsList>
</Tabs>`

const compositionSource = `Tabs
├── TabsList
│   ├── TabsTrigger
│   └── TabsTrigger
├── TabsContent
└── TabsContent`

export default async function TabsDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Tabs</h1>
        <p className="leading-relaxed text-muted-foreground">
          Layered sections of content displayed one at a time. Writing direction
          is passed to Radix so keyboard arrows flip in RTL; vertical line tabs
          place the active indicator on the inline-end edge.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="tabs" />

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
        <ComponentSource title="tabs.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Direction</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Toggle LTR/RTL in the preview — horizontal tabs reverse order with the
          writing direction, and vertical line indicators stay on the content
          side via{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            after:-end-1
          </code>
          .
        </p>
        <ComponentSource
          title="direction.tsx"
          lang="tsx"
          code={directionSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "defaultValue",
              type: "string",
              defaultValue: "—",
              description: "On `Tabs` — initially selected tab value.",
            },
            {
              name: "value",
              type: "string",
              defaultValue: "—",
              description: "On `Tabs` — controlled selected value.",
            },
            {
              name: "orientation",
              type: '"horizontal" | "vertical"',
              defaultValue: '"horizontal"',
              description: "Layout of the tab list.",
            },
            {
              name: "variant",
              type: '"default" | "line"',
              defaultValue: '"default"',
              description: "On `TabsList` — pill vs underline style.",
            },
            {
              name: "dir",
              type: '"ltr" | "rtl"',
              defaultValue: "inherited",
              description:
                "Writing direction. Defaults from `useDirection` / `<html dir>`.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "On `TabsTrigger` — disable a tab.",
            },
          ]}
        />
      </section>
    </article>
  )
}
