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
    name: "textarea-default",
    title: "Basic",
    description: "A multi-line text field with native textarea behavior.",
  },
  {
    name: "textarea-field",
    title: "Field",
    description: "Pair with `Field`, `FieldLabel`, and `FieldDescription`.",
    requires: ["field", "label", "separator"],
  },
  {
    name: "textarea-disabled",
    title: "Disabled",
    description:
      "Use the `disabled` prop. Add `data-disabled` on `Field` for matching label styles.",
    requires: ["field", "label", "separator"],
  },
  {
    name: "textarea-invalid",
    title: "Invalid",
    description:
      "Set `aria-invalid` on the textarea and `data-invalid` on `Field` with `FieldError`.",
    requires: ["field", "label", "separator"],
  },
  {
    name: "textarea-with-button",
    title: "With Button",
    description: "Stack a submit button under the textarea.",
    requires: ["button", "field", "label", "separator"],
  },
]

const usageSource = `import { Textarea } from "@/components/ui/textarea"

export function Example() {
  return <Textarea placeholder="Type your message here." />
}`

const compositionSource = `Textarea`

export default async function TextareaDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Textarea</h1>
        <p className="leading-relaxed text-muted-foreground">
          Displays a form textarea or a component that looks like a textarea.
          Uses{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            text-start
          </code>{" "}
          so typed text aligns with writing direction. For a single-line
          control, see{" "}
          <Link
            href="/docs/components/input"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Input
          </Link>
          .
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="textarea" />

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
        <ComponentSource title="textarea.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "placeholder",
              type: "string",
              defaultValue: "—",
              description: "Hint text shown when empty.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disable the control.",
            },
            {
              name: "aria-invalid",
              type: "boolean",
              defaultValue: "—",
              description: "Marks the field invalid and applies error styles.",
            },
            {
              name: "…textarea props",
              type: 'React.ComponentProps<"textarea">',
              defaultValue: "—",
              description: "Native attributes pass through to the element.",
            },
          ]}
        />
      </section>
    </article>
  )
}
