import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "checkbox-default",
    title: "Default",
    description: "Pair with a `Label` so the text is also a click target.",
    requires: ["label"],
  },
  {
    name: "checkbox-description",
    title: "Description",
    description: "Add helper text under the label for longer agreements.",
    requires: ["label"],
  },
  {
    name: "checkbox-disabled",
    title: "Disabled",
    description: "Use the `disabled` prop to prevent interaction.",
    requires: ["label"],
  },
  {
    name: "checkbox-invalid",
    title: "Invalid",
    description:
      "Set `aria-invalid` on the checkbox and `data-invalid` on `Field`. Invalid keeps a destructive border (and fill when checked).",
    requires: ["field"],
  },
  {
    name: "checkbox-group",
    title: "Group",
    description: "Compose multiple checkboxes for multi-select preferences.",
    requires: ["label"],
  },
]

const usageSource = `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function Example() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}`

export default async function CheckboxDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Checkbox</h1>
        <p className="leading-relaxed text-muted-foreground">
          A control that allows the user to toggle between checked and not
          checked.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="checkbox" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="checkbox.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "checked",
              type: 'boolean | "indeterminate"',
              defaultValue: "—",
              description: "Controlled checked state.",
            },
            {
              name: "defaultChecked",
              type: 'boolean | "indeterminate"',
              defaultValue: "—",
              description: "Uncontrolled initial checked state.",
            },
            {
              name: "onCheckedChange",
              type: '(checked: boolean | "indeterminate") => void',
              defaultValue: "—",
              description: "Called when the checked state changes.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Prevents interaction and dims the control.",
            },
            {
              name: "aria-invalid",
              type: "boolean",
              defaultValue: "—",
              description: "Shows the invalid (destructive) border.",
            },
          ]}
        />
      </section>
    </article>
  )
}
