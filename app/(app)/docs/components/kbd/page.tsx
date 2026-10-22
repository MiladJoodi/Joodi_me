import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "kbd-default",
    title: "Basic",
    description: "Render a single key or chord with `Kbd`.",
  },
  {
    name: "kbd-group",
    title: "Group",
    description: "Wrap related keys in `KbdGroup` inside helper copy.",
  },
  {
    name: "kbd-button",
    title: "Button",
    description: "Place `Kbd` inside a `Button` to hint a shortcut.",
    requires: ["button"],
  },
  {
    name: "kbd-input-group",
    title: "Input Group",
    description: "Show shortcuts in an `InputGroupAddon`.",
    requires: ["input-group", "input", "button", "textarea"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function Example() {
  return (
    <p className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      Press{" "}
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{" "}
      to search.
    </p>
  )
}`

const compositionSource = `Kbd

KbdGroup
├── Kbd
└── Kbd`

export default async function KbdDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Kbd</h1>
        <p className="leading-relaxed text-muted-foreground">
          Display keyboard keys and chords in docs, tooltips, buttons, and
          search fields. Non-interactive —{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            pointer-events-none
          </code>
          .
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="kbd" />

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
        <ComponentSource title="kbd.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "className",
              type: "string",
              defaultValue: "—",
              description: "On `Kbd` or `KbdGroup` — merge extra Tailwind classes.",
            },
            {
              name: "…kbd props",
              type: "React.ComponentProps<\"kbd\">",
              defaultValue: "—",
              description: "Native attributes pass through to the element.",
            },
          ]}
        />
      </section>
    </article>
  )
}
