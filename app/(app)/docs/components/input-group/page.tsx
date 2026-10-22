import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "input-group-default",
    title: "Icon",
    description:
      "Place icons in `InputGroupAddon`. Default `align` is `inline-start`.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "input-group-icon",
    title: "Addon Sides",
    description:
      'Use `align="inline-start"` and `align="inline-end"` — put addons after the input in the DOM.',
    npmRequires: ["lucide-react"],
  },
  {
    name: "input-group-text",
    title: "Text",
    description: "Use `InputGroupText` for prefixes, suffixes, and units.",
  },
  {
    name: "input-group-button",
    title: "Button",
    description:
      '`InputGroupButton` is sized for the group — try `size="icon-xs"`.',
    npmRequires: ["lucide-react"],
  },
  {
    name: "input-group-dropdown",
    title: "Dropdown",
    description: "Compose a `DropdownMenu` inside an addon for selectors.",
    requires: ["dropdown-menu"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "input-group-spinner",
    title: "Spinner",
    description: "Show a loading state with `Spinner` in an end addon.",
    requires: ["spinner"],
  },
  {
    name: "input-group-textarea",
    title: "Textarea",
    description:
      'Use `InputGroupTextarea` with `align="block-end"` for footer actions.',
    npmRequires: ["lucide-react"],
  },
  {
    name: "input-group-block-start",
    title: "Block Start",
    description:
      'Use `align="block-start"` for a header row above the control.',
    npmRequires: ["lucide-react"],
  },
  {
    name: "input-group-kbd",
    title: "Keyboard",
    description: "Use `Kbd` inside an end addon for search shortcuts.",
    requires: ["kbd"],
  },
]

const usageSource = `import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function Example() {
  return (
    <InputGroup>
      <InputGroupInput placeholder="Search…" />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  )
}`

const compositionSource = `InputGroup
├── InputGroupInput / InputGroupTextarea
├── InputGroupAddon (align: inline-start | inline-end | block-start | block-end)
│   ├── InputGroupText
│   └── InputGroupButton
└── …`

export default async function InputGroupDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Input Group</h1>
        <p className="leading-relaxed text-muted-foreground">
          Add icons, text, buttons, and other chrome around an input or
          textarea while sharing one focus ring. Height matches Input (
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            h-8
          </code>
          ). Place addons after the control in the DOM and use{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            align
          </code>{" "}
          for visual position.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="input-group" />

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
        <ComponentSource title="input-group.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "align",
              type: '"inline-start" | "inline-end" | "block-start" | "block-end"',
              defaultValue: '"inline-start"',
              description:
                "On `InputGroupAddon` — visual side relative to the control.",
            },
            {
              name: "size",
              type: '"xs" | "sm" | "icon-xs" | "icon-sm"',
              defaultValue: '"xs"',
              description: "On `InputGroupButton` — compact sizes for the group.",
            },
            {
              name: "variant",
              type: "Button variant",
              defaultValue: '"ghost"',
              description: "On `InputGroupButton` — same variants as `Button`.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: "—",
              description: "Merge extra Tailwind classes on any part.",
            },
          ]}
        />
      </section>
    </article>
  )
}
