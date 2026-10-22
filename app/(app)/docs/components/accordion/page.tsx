import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
} from "@/components/docs"

const examples = [
  { name: "accordion-default", title: "Default" },
  { name: "accordion-multiple", title: "Multiple" },
  { name: "accordion-disabled", title: "Disabled" },
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

export default function AccordionDocsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Accordion</h1>
        <p className="leading-relaxed text-muted-foreground">
          A vertically stacked set of interactive headings that each reveal a
          section of content. Supports single or multiple open items.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-h3">Preview</h2>
        <ComponentVariantPreview examples={examples} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Installation</h2>
        <ComponentSource
          title="CLI"
          lang="bash"
          code={`npx @winkui/ui@latest add accordion`}
        />
      </section>

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
