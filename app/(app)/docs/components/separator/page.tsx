import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "separator-default",
    title: "Basic",
    description: "Divide sections horizontally; nest vertical bars in a row.",
  },
  {
    name: "separator-vertical",
    title: "Vertical",
    description: 'Set `orientation="vertical"` between inline items.',
  },
  {
    name: "separator-list",
    title: "List",
    description: "Use horizontal separators between stacked list rows.",
  },
]

const usageSource = `import { Separator } from "@/components/ui/separator"

export function Example() {
  return (
    <div>
      <div>Above</div>
      <Separator className="my-4" />
      <div>Below</div>
    </div>
  )
}`

const compositionSource = `Separator`

export default async function SeparatorDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Separator</h1>
        <p className="leading-relaxed text-muted-foreground">
          Visually or semantically separates content. Defaults to{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            decorative
          </code>{" "}
          so assistive tech can ignore it unless you need a true thematic break.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="separator" />

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
        <ComponentSource title="separator.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "orientation",
              type: '"horizontal" | "vertical"',
              defaultValue: '"horizontal"',
              description: "Axis of the separator line.",
            },
            {
              name: "decorative",
              type: "boolean",
              defaultValue: "true",
              description:
                "When `true`, removes the separator from the accessibility tree.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: "—",
              description: "Merge extra Tailwind classes (e.g. spacing).",
            },
          ]}
        />
      </section>
    </article>
  )
}
