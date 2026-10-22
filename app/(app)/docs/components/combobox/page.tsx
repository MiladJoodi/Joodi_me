import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "combobox-default",
    title: "Basic",
    description: "Autocomplete input with a list of suggestions.",
    requires: ["button", "input-group", "input"],
  },
  {
    name: "combobox-clear",
    title: "With Clear",
    description: "Pass `showClear` on `ComboboxInput` to reset the value.",
    requires: ["button", "input-group", "input"],
  },
  {
    name: "combobox-groups",
    title: "Groups",
    description:
      "Use `ComboboxGroup`, `ComboboxLabel`, and `ComboboxCollection` for sections.",
    requires: ["button", "input-group", "input"],
  },
  {
    name: "combobox-multiple",
    title: "Multiple",
    description:
      "Set `multiple` and render chips with `ComboboxChips` + `useComboboxAnchor`.",
    requires: ["button", "input-group", "input"],
  },
  {
    name: "combobox-disabled",
    title: "Disabled",
    description: "Disable the input with the `disabled` prop.",
    requires: ["button", "input-group", "input"],
  },
]

const usageSource = `import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

export function Example() {
  return (
    <Combobox items={frameworks}>
      <ComboboxInput placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}`

export default async function ComboboxDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Combobox</h1>
        <p className="leading-relaxed text-muted-foreground">
          Autocomplete input with a list of suggestions. Built with Base UI.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="combobox" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="combobox.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "items",
              type: "readonly T[]",
              defaultValue: "—",
              description: "Options passed to the combobox root.",
            },
            {
              name: "multiple",
              type: "boolean",
              defaultValue: "false",
              description: "Allow selecting more than one value (use chips).",
            },
            {
              name: "showClear",
              type: "boolean",
              defaultValue: "false",
              description: "On ComboboxInput — show a clear button.",
            },
            {
              name: "showTrigger",
              type: "boolean",
              defaultValue: "true",
              description: "On ComboboxInput — show the chevron trigger.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables the control.",
            },
          ]}
        />
      </section>
    </article>
  )
}
