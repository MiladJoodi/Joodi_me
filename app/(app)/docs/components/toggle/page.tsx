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
    name: "toggle-default",
    title: "Basic",
    description: "A pressed / unpressed control, often used for formatting.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "toggle-outline",
    title: "Outline",
    description: 'Use `variant="outline"` for a bordered look.',
    npmRequires: ["lucide-react"],
  },
  {
    name: "toggle-with-text",
    title: "With Text",
    description:
      'Place icons with `data-icon="inline-start"` so they follow writing direction.',
    npmRequires: ["lucide-react"],
  },
  {
    name: "toggle-size",
    title: "Size",
    description: 'Use `size` — `sm`, `default` (`h-8`), or `lg` (`h-9`).',
    npmRequires: ["lucide-react"],
  },
  {
    name: "toggle-disabled",
    title: "Disabled",
    description: "Pass `disabled` to block interaction.",
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import { BoldIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export function Example() {
  return (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  )
}`

const compositionSource = `Toggle`

export default async function ToggleDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Toggle</h1>
        <p className="leading-relaxed text-muted-foreground">
          A two-state button that can be on or off. For toolbars, see{" "}
          <Link
            href="/docs/components/toggle-group"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Toggle Group
          </Link>
          .
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="toggle" />

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
        <ComponentSource title="toggle.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "pressed",
              type: "boolean",
              defaultValue: "—",
              description: "Controlled pressed state.",
            },
            {
              name: "defaultPressed",
              type: "boolean",
              defaultValue: "—",
              description: "Uncontrolled initial pressed state.",
            },
            {
              name: "onPressedChange",
              type: "(pressed: boolean) => void",
              defaultValue: "—",
              description: "Called when pressed state changes.",
            },
            {
              name: "variant",
              type: '"default" | "outline"',
              defaultValue: '"default"',
              description: "Visual style.",
            },
            {
              name: "size",
              type: '"sm" | "default" | "lg"',
              defaultValue: '"default"',
              description: "Control height — `h-7` / `h-8` / `h-9`.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disable the toggle.",
            },
          ]}
        />
      </section>
    </article>
  )
}
