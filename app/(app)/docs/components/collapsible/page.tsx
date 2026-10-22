import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "collapsible-default",
    title: "Show More",
    description:
      "Keep a short list visible, then expand the rest with a labeled trigger.",
    requires: ["button"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "collapsible-advanced",
    title: "Advanced Options",
    description:
      "Hide rarely used fields behind an Advanced trigger in a settings form.",
    requires: ["button", "field", "input"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "collapsible-details",
    title: "Order Details",
    description:
      "Keep status visible; expand for address and items. Same pattern as the installable primitive + `button`.",
    requires: ["button"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "collapsible-file-tree",
    title: "File Tree",
    description:
      "Nest collapsibles for folders. Chevron uses `icon-dir` for RTL.",
    requires: ["button"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Show details</CollapsibleTrigger>
      <CollapsibleContent>
        Extra content that was hidden.
      </CollapsibleContent>
    </Collapsible>
  )
}`

const compositionSource = `Collapsible
├── CollapsibleTrigger
└── CollapsibleContent`

export default async function CollapsibleDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Collapsible</h1>
        <p className="leading-relaxed text-muted-foreground">
          Expand or hide a panel in place — show more lists, advanced form
          fields, order details, or nested trees. Prefer Accordion when you need
          exclusive open sections.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="collapsible" />

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
          title="collapsible.tsx"
          lang="tsx"
          code={usageSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "open",
              type: "boolean",
              defaultValue: "—",
              description: "Controlled open state.",
            },
            {
              name: "defaultOpen",
              type: "boolean",
              defaultValue: "false",
              description: "Uncontrolled initial open state.",
            },
            {
              name: "onOpenChange",
              type: "(open: boolean) => void",
              defaultValue: "—",
              description: "Called when the open state changes.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Prevents opening and closing.",
            },
            {
              name: "asChild",
              type: "boolean",
              defaultValue: "false",
              description:
                "On `CollapsibleTrigger` — merge props onto a child (e.g. `Button`).",
            },
          ]}
        />
      </section>
    </article>
  )
}
