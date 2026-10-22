import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "radio-group-default",
    title: "Basic",
    description: "Pick one option from a mutually exclusive set.",
    requires: ["label"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "radio-group-description",
    title: "Description",
    description: "Add titles and helper copy with `Field` next to each item.",
    requires: ["field", "label", "separator"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "radio-group-choice-card",
    title: "Choice Card",
    description: "Wrap each option in `FieldLabel` for a larger click target.",
    requires: ["field", "label", "separator"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "radio-group-disabled",
    title: "Disabled",
    description: "Disable the whole group with `disabled` on `RadioGroup`.",
    requires: ["label"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "radio-group-invalid",
    title: "Invalid",
    description:
      "Set `aria-invalid` on items and `data-invalid` on `Field` for validation.",
    requires: ["field", "label", "separator"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function Example() {
  return (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
    </RadioGroup>
  )
}`

const compositionSource = `RadioGroup
├── RadioGroupItem
└── RadioGroupItem`

export default async function RadioGroupDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Radio Group</h1>
        <p className="leading-relaxed text-muted-foreground">
          A set of checkable buttons where only one can be selected at a time.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="radio-group" />

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
          title="radio-group.tsx"
          lang="tsx"
          code={usageSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "value",
              type: "string",
              defaultValue: "—",
              description: "On `RadioGroup` — controlled selected value.",
            },
            {
              name: "defaultValue",
              type: "string",
              defaultValue: "—",
              description: "On `RadioGroup` — uncontrolled initial value.",
            },
            {
              name: "onValueChange",
              type: "(value: string) => void",
              defaultValue: "—",
              description: "Called when the selected value changes.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disable the group or an individual `RadioGroupItem`.",
            },
            {
              name: "item value",
              type: "string",
              defaultValue: "—",
              description: "On `RadioGroupItem` — required option value.",
            },
          ]}
        />
      </section>
    </article>
  )
}
