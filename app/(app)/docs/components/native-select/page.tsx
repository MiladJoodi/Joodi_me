import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "native-select-default",
    title: "Basic",
    description: "A styled native `<select>` with a chevron affordance.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "native-select-groups",
    title: "Groups",
    description: "Organize options with `NativeSelectOptGroup` and `label`.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "native-select-size",
    title: "Size",
    description: 'Use `size="sm"` for a denser control (`h-7`).',
    npmRequires: ["lucide-react"],
  },
  {
    name: "native-select-disabled",
    title: "Disabled",
    description: "Pass `disabled` on the select. Pair with `data-disabled` on `Field`.",
    requires: ["field", "label", "separator"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "native-select-invalid",
    title: "Invalid",
    description:
      "Set `aria-invalid` on the select and `data-invalid` on `Field` with `FieldError`.",
    requires: ["field", "label", "separator"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"

export function Example() {
  return (
    <NativeSelect>
      <NativeSelectOption value="">Select a fruit</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
    </NativeSelect>
  )
}`

const compositionSource = `NativeSelect
├── NativeSelectOption
└── NativeSelectOptGroup
    └── NativeSelectOption`

export default async function NativeSelectDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Native Select</h1>
        <p className="leading-relaxed text-muted-foreground">
          A styled native HTML{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            select
          </code>{" "}
          — height{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            h-8
          </code>{" "}
          by default. Prefer this for mobile OS pickers and simple forms; use
          the custom Select when you need rich menu chrome.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="native-select" />

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
          title="native-select.tsx"
          lang="tsx"
          code={usageSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "size",
              type: '"default" | "sm"',
              defaultValue: '"default"',
              description: "Control height — default `h-8`, sm `h-7`.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables the native select.",
            },
            {
              name: "aria-invalid",
              type: "boolean",
              defaultValue: "—",
              description: "Marks the control invalid and applies destructive ring.",
            },
            {
              name: "label",
              type: "string",
              defaultValue: "—",
              description: "On `NativeSelectOptGroup` — group heading.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: "—",
              description: "Merge extra Tailwind classes on the select.",
            },
          ]}
        />
      </section>
    </article>
  )
}
