import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "accordion-default",
    title: "Default",
    description: 'Single open item with `type="single"` and `collapsible`.',
  },
  {
    name: "accordion-multiple",
    title: "Multiple",
    description: 'Use `type="multiple"` so several items can stay open.',
  },
  {
    name: "accordion-disabled",
    title: "Disabled",
    description: "Disable an item so its trigger cannot be opened.",
  },
]

const accordionSource = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function Example() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It follows the WAI-ARIA accordion pattern.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`

export default async function AccordionDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Accordion</h1>
        <p className="leading-relaxed text-muted-foreground">
          A vertically stacked set of interactive headings that each reveal a
          section of content. Supports single or multiple open items.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="accordion" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource
          title="accordion.tsx"
          lang="tsx"
          code={accordionSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "type",
              type: '"single" | "multiple"',
              defaultValue: '"single"',
              description:
                "Whether one or several items can be open at once.",
            },
            {
              name: "collapsible",
              type: "boolean",
              defaultValue: "false",
              description:
                "When type is single, allows closing the open item.",
            },
            {
              name: "defaultValue",
              type: "string | string[]",
              description: "Initially open item value(s).",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description:
                "On AccordionItem: disables that item’s trigger.",
            },
          ]}
        />
      </section>
    </article>
  )
}
