import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "input-default",
    title: "Basic",
    description: "A simple text input. Pass native `type`, `placeholder`, and events.",
  },
  {
    name: "input-field",
    title: "Field",
    description: "Pair with `Field`, `FieldLabel`, and `FieldDescription`.",
    requires: ["field", "label", "separator"],
  },
  {
    name: "input-disabled",
    title: "Disabled",
    description:
      "Use the `disabled` prop. Add `data-disabled` on `Field` for matching label styles.",
    requires: ["field", "label", "separator"],
  },
  {
    name: "input-invalid",
    title: "Invalid",
    description:
      "Set `aria-invalid` on the input and `data-invalid` on `Field` with `FieldError`.",
    requires: ["field", "label", "separator"],
  },
  {
    name: "input-file",
    title: "File",
    description: 'Use `type="file"` for uploads.',
    requires: ["field", "label", "separator"],
  },
  {
    name: "input-with-button",
    title: "With Button",
    description:
      'Use `Field` with `orientation="horizontal"` to place a button beside the input.',
    requires: ["button", "field", "label", "separator"],
  },
]

const usageSource = `import { Input } from "@/components/ui/input"

export function Example() {
  return <Input type="email" placeholder="Email" />
}`

export default async function InputDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Input</h1>
        <p className="leading-relaxed text-muted-foreground">
          A text input for forms and data entry. Height{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            h-8
          </code>
          , built-in focus and invalid styles. For icons or buttons inside the
          control, see{" "}
          <a
            href="/docs/components/input-group"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Input Group
          </a>
          .
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="input" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="input.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "type",
              type: "HTML input type",
              defaultValue: '"text"',
              description: "Native input type — text, email, file, password, …",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables the input and shows not-allowed cursor.",
            },
            {
              name: "aria-invalid",
              type: "boolean",
              defaultValue: "—",
              description: "Marks the control invalid and applies destructive ring.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: "—",
              description: "Merge extra Tailwind classes on the input.",
            },
          ]}
        />
      </section>
    </article>
  )
}
