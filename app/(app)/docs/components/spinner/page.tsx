import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "spinner-default",
    title: "Basic",
    description: "A compact loading indicator with `role=\"status\"`.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "spinner-size",
    title: "Size",
    description: "Resize with Tailwind `size-*` utilities.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "spinner-button",
    title: "Button",
    description:
      'Place before the label with `data-icon="inline-start"`, or after with `inline-end`.',
    requires: ["button"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "spinner-badge",
    title: "Badge",
    description: "Show an in-progress state inside a badge.",
    requires: ["badge"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import { Spinner } from "@/components/ui/spinner"

export function Example() {
  return <Spinner />
}`

const compositionSource = `Spinner`

export default async function SpinnerDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Spinner</h1>
        <p className="leading-relaxed text-muted-foreground">
          An indicator for loading states. Uses logical{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            data-icon=&quot;inline-start&quot;
          </code>{" "}
          /{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            inline-end
          </code>{" "}
          so placement follows writing direction in buttons and badges.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="spinner" />

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
        <ComponentSource title="spinner.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "className",
              type: "string",
              defaultValue: "—",
              description: "Merge classes (e.g. `size-6` for a larger spinner).",
            },
            {
              name: "aria-label",
              type: "string",
              defaultValue: '"Loading"',
              description: "Accessible name for the status role.",
            },
            {
              name: "…svg props",
              type: 'React.ComponentProps<"svg">',
              defaultValue: "—",
              description: "Pass-through props for the Lucide icon.",
            },
          ]}
        />
      </section>
    </article>
  )
}
