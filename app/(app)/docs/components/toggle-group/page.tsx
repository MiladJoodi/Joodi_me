import Link from "next/link"

import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "toggle-group-default",
    title: "Basic",
    description: 'Multi-select toolbar with `type="multiple"`.',
    requires: ["toggle"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "toggle-group-outline",
    title: "Outline",
    description:
      'Use `variant="outline"` for a connected bordered group (`spacing={0}`).',
    requires: ["toggle"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "toggle-group-spacing",
    title: "Spacing",
    description: "Pass `spacing` to separate items (e.g. `spacing={2}`).",
    requires: ["toggle"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "toggle-group-vertical",
    title: "Vertical",
    description: 'Set `orientation="vertical"` for a stacked group.',
    requires: ["toggle"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "toggle-group-disabled",
    title: "Disabled",
    description: "Disable the whole group with `disabled`.",
    requires: ["toggle"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function Example() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}`

const directionSource = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Connected groups use rounded-s / rounded-e and border-s so corners
// and shared borders flip correctly in RTL. Toggle LTR/RTL in the preview.
<ToggleGroup type="single" variant="outline">
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
</ToggleGroup>`

const compositionSource = `ToggleGroup
├── ToggleGroupItem
└── ToggleGroupItem`

export default async function ToggleGroupDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Toggle Group</h1>
        <p className="leading-relaxed text-muted-foreground">
          A set of two-state buttons that can be toggled on or off. Built on{" "}
          <Link
            href="/docs/components/toggle"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Toggle
          </Link>
          . Connected items use logical start/end radius and borders for RTL.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="toggle-group" />

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
        <ComponentSource
          title="toggle-group.tsx"
          lang="tsx"
          code={usageSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Direction</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            dir
          </code>{" "}
          comes from{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            useDirection
          </code>
          . With{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            spacing=&#123;0&#125;
          </code>
          , first/last items use{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            rounded-s
          </code>{" "}
          /{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            rounded-e
          </code>{" "}
          (not left/right).
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
              name: "type",
              type: '"single" | "multiple"',
              defaultValue: "—",
              description: "Single selection or multi-select.",
            },
            {
              name: "variant",
              type: '"default" | "outline"',
              defaultValue: '"default"',
              description: "Passed through to items via context.",
            },
            {
              name: "size",
              type: '"sm" | "default" | "lg"',
              defaultValue: '"default"',
              description: "Item height scale.",
            },
            {
              name: "spacing",
              type: "number",
              defaultValue: "0",
              description:
                "Gap between items. `0` connects them with shared borders.",
            },
            {
              name: "orientation",
              type: '"horizontal" | "vertical"',
              defaultValue: '"horizontal"',
              description: "Layout axis of the group.",
            },
            {
              name: "dir",
              type: '"ltr" | "rtl"',
              defaultValue: "inherited",
              description: "Writing direction for corners and keyboard nav.",
            },
          ]}
        />
      </section>
    </article>
  )
}
