import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
} from "@/components/docs"

const examples = [
  { name: "button-default", title: "Default" },
  { name: "button-outline", title: "Outline" },
  { name: "button-secondary", title: "Secondary" },
  { name: "button-ghost", title: "Ghost" },
  { name: "button-destructive", title: "Destructive" },
  { name: "button-sizes", title: "Sizes" },
]

const buttonSource = `import { Button } from "@/components/ui/button"

export function Example() {
  return <Button>Button</Button>
}`

export default function ButtonDocsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Button</h1>
        <p className="leading-relaxed text-muted-foreground">
          Primary uses brand blue; outline, secondary, and ghost stay neutral.
          Comfort density with accessible focus rings.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-h3">Preview</h2>
        <ComponentVariantPreview examples={examples} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Installation</h2>
        <ComponentSource
          title="CLI"
          lang="bash"
          code={`npx @winkui/ui@latest add button`}
        />
      </section>

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
