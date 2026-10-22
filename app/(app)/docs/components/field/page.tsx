import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "field-default",
    title: "Basic",
    description:
      "Label, control, and optional `FieldDescription` in a vertical stack.",
    requires: ["input", "label", "separator"],
  },
  {
    name: "field-invalid",
    title: "Invalid",
    description:
      "Set `data-invalid` on `Field`, `aria-invalid` on the input, and render `FieldError`.",
    requires: ["input", "label", "separator"],
  },
  {
    name: "field-fieldset",
    title: "Fieldset",
    description:
      "Group related inputs with `FieldSet`, `FieldLegend`, and `FieldGroup`.",
    requires: ["input", "label", "separator"],
  },
  {
    name: "field-checkbox",
    title: "Checkbox",
    description:
      'Use `orientation="horizontal"` with `FieldContent` for labeled toggles.',
    requires: ["checkbox", "label", "separator"],
  },
  {
    name: "field-choice-card",
    title: "Choice Card",
    description:
      "Wrap `Field` inside `FieldLabel` to build selectable option cards.",
    requires: ["checkbox", "label", "separator"],
  },
  {
    name: "field-group",
    title: "Field Group",
    description: "Stack fields and divide sections with `FieldSeparator`.",
    requires: ["button", "input", "label", "separator"],
  },
]

const usageSource = `import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function Example() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="name">Full name</FieldLabel>
        <Input id="name" placeholder="Evil Rabbit" />
        <FieldDescription>This appears on invoices and emails.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}`

const compositionSource = `FieldSet
├── FieldLegend
├── FieldDescription
└── FieldGroup
    └── Field
        ├── FieldLabel
        ├── Input / Checkbox / …
        ├── FieldDescription
        └── FieldError`

export default async function FieldDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Field</h1>
        <p className="leading-relaxed text-muted-foreground">
          Combine labels, controls, and help text into accessible form fields
          and grouped inputs. Supports vertical, horizontal, and responsive
          orientations plus validation via `FieldError`.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="field" />

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
        <ComponentSource title="field.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "orientation",
              type: '"vertical" | "horizontal" | "responsive"',
              defaultValue: '"vertical"',
              description:
                "On Field — layout of label vs control. responsive uses @container/field-group.",
            },
            {
              name: "variant",
              type: '"legend" | "label"',
              defaultValue: '"legend"',
              description:
                "On FieldLegend — label sizes the legend like a FieldLabel.",
            },
            {
              name: "data-invalid",
              type: "boolean",
              defaultValue: "—",
              description:
                "On Field — turns label/description/error into the destructive state.",
            },
            {
              name: "errors",
              type: "Array<{ message?: string }>",
              defaultValue: "—",
              description:
                "On FieldError — renders one message or a list from form validators.",
            },
          ]}
        />
      </section>
    </article>
  )
}
