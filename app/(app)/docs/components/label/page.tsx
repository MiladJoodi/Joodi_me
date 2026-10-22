import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "label-default",
    title: "Basic",
    description: "Associate a label with a control via `htmlFor` and matching `id`.",
    requires: ["input"],
  },
  {
    name: "label-checkbox",
    title: "Checkbox",
    description: "Pair with `Checkbox` for clickable option labels.",
    requires: ["checkbox"],
  },
  {
    name: "label-disabled",
    title: "Disabled",
    description:
      "Uses `peer-disabled` styles when the associated control is disabled.",
    requires: ["checkbox"],
  },
]

const usageSource = `import { Label } from "@/components/ui/label"

export function Example() {
  return <Label htmlFor="email">Your email address</Label>
}`

export default async function LabelDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Label</h1>
        <p className="leading-relaxed text-muted-foreground">
          An accessible label for form controls. For full fields with
          description and error text, prefer{" "}
          <a
            href="/docs/components/field"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Field
          </a>{" "}
          and{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            FieldLabel
          </code>
          .
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="label" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="label.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "htmlFor",
              type: "string",
              defaultValue: "—",
              description: "Id of the labeled control.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: "—",
              description: "Merge extra Tailwind classes on the label.",
            },
          ]}
        />
      </section>
    </article>
  )
}
