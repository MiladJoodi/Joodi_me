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
    name: "select-default",
    title: "Basic",
    description: "Open a list of options from a button trigger.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "select-groups",
    title: "Groups",
    description:
      "Organize options with `SelectGroup`, `SelectLabel`, and `SelectSeparator`.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "select-scrollable",
    title: "Scrollable",
    description: "Long lists scroll inside the content panel.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "select-disabled",
    title: "Disabled",
    description: "Pass `disabled` on `Select` to block interaction.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "select-invalid",
    title: "Invalid",
    description:
      "Set `aria-invalid` on `SelectTrigger` and `data-invalid` on `Field`.",
    requires: ["field", "label", "separator"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Example() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}`

const compositionSource = `Select
├── SelectTrigger
│   └── SelectValue
└── SelectContent
    ├── SelectGroup
    │   ├── SelectLabel
    │   ├── SelectItem
    │   └── SelectItem
    ├── SelectSeparator
    └── SelectGroup
        ├── SelectLabel
        ├── SelectItem
        └── SelectItem`

export default async function SelectDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Select</h1>
        <p className="leading-relaxed text-muted-foreground">
          Displays a list of options triggered by a button. Content defaults to{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            align=&quot;start&quot;
          </code>{" "}
          for writing-direction friendliness. For a native{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            &lt;select&gt;
          </code>
          , see{" "}
          <Link
            href="/docs/components/native-select"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Native Select
          </Link>
          .
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="select" />

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
        <ComponentSource title="select.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "value",
              type: "string",
              defaultValue: "—",
              description: "On `Select` — controlled selected value.",
            },
            {
              name: "defaultValue",
              type: "string",
              defaultValue: "—",
              description: "On `Select` — uncontrolled initial value.",
            },
            {
              name: "onValueChange",
              type: "(value: string) => void",
              defaultValue: "—",
              description: "Called when the selected value changes.",
            },
            {
              name: "size",
              type: '"sm" | "default"',
              defaultValue: '"default"',
              description: "On `SelectTrigger` — `h-7` or `h-8`.",
            },
            {
              name: "position",
              type: '"item-aligned" | "popper"',
              defaultValue: '"item-aligned"',
              description: "On `SelectContent` — popup positioning strategy.",
            },
            {
              name: "align",
              type: '"start" | "center" | "end"',
              defaultValue: '"start"',
              description: "On `SelectContent` — horizontal alignment.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disable the select or an individual item.",
            },
          ]}
        />
      </section>
    </article>
  )
}
