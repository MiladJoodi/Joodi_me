import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "button-default",
    title: "Default",
    description: "Primary action filled with brand blue.",
  },
  {
    name: "button-outline",
    title: "Outline",
    description: 'Use `variant="outline"` for secondary chrome on a surface.',
  },
  {
    name: "button-secondary",
    title: "Secondary",
    description: 'Use `variant="secondary"` for quieter filled actions.',
  },
  {
    name: "button-ghost",
    title: "Ghost",
    description: 'Use `variant="ghost"` for low-emphasis toolbar actions.',
  },
  {
    name: "button-destructive",
    title: "Destructive",
    description: 'Use `variant="destructive"` for delete and irreversible actions.',
  },
  {
    name: "button-sizes",
    title: "Sizes",
    description: "Control height with `size` — xs, sm, default, lg, and icon sizes.",
  },
]

const buttonSource = `import { Button } from "@/components/ui/button"

export function Example() {
  return <Button>Button</Button>
}`

export default async function ButtonDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Button</h1>
        <p className="leading-relaxed text-muted-foreground">
          Primary uses brand blue; outline, secondary, and ghost stay neutral.
          Comfort density with accessible focus rings.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="button" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="button.tsx" lang="tsx" code={buttonSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "variant",
              type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
              defaultValue: '"default"',
              description: "Visual style of the button.",
            },
            {
              name: "size",
              type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
              defaultValue: '"default"',
              description: "Control height and padding.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables pointer events and dims the control.",
            },
          ]}
        />
      </section>
    </article>
  )
}
