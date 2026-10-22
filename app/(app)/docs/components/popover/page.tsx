import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "popover-default",
    title: "Basic",
    description: "Open rich content from a button trigger.",
    requires: ["button"],
  },
  {
    name: "popover-align",
    title: "Align",
    description:
      'Set `align` on `PopoverContent` to `start`, `center`, or `end`.',
    requires: ["button"],
  },
  {
    name: "popover-form",
    title: "With Form",
    description: "Nest fields and inputs inside the popover panel.",
    requires: ["button", "field", "input", "label", "separator"],
  },
]

const usageSource = `import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>Title</PopoverTitle>
          <PopoverDescription>Description text here.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}`

const compositionSource = `Popover
├── PopoverTrigger
└── PopoverContent
    ├── PopoverHeader
    │   ├── PopoverTitle
    │   └── PopoverDescription
    └── …`

export default async function PopoverDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Popover</h1>
        <p className="leading-relaxed text-muted-foreground">
          Displays rich content in a portal, triggered by a control. Prefer{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            align=&quot;start&quot;
          </code>{" "}
          so the panel follows writing direction.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="popover" />

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
        <ComponentSource title="popover.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "align",
              type: '"start" | "center" | "end"',
              defaultValue: '"center"',
              description: "On `PopoverContent` — horizontal alignment.",
            },
            {
              name: "side",
              type: '"top" | "right" | "bottom" | "left"',
              defaultValue: '"bottom"',
              description: "On `PopoverContent` — preferred side of the trigger.",
            },
            {
              name: "sideOffset",
              type: "number",
              defaultValue: "4",
              description: "Distance in pixels from the trigger.",
            },
            {
              name: "asChild",
              type: "boolean",
              defaultValue: "false",
              description: "On `PopoverTrigger` — merge onto a child control.",
            },
          ]}
        />
      </section>
    </article>
  )
}
