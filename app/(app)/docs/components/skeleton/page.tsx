import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "skeleton-default",
    title: "Basic",
    description: "Compose circles and bars to hint at loading content.",
  },
  {
    name: "skeleton-card",
    title: "Card",
    description: "A card-shaped placeholder with media and text lines.",
  },
  {
    name: "skeleton-text",
    title: "Text",
    description: "Stacked lines for paragraph-style loading states.",
  },
]

const usageSource = `import { Skeleton } from "@/components/ui/skeleton"

export function Example() {
  return <Skeleton className="h-4 w-[100px]" />
}`

const compositionSource = `Skeleton`

export default async function SkeletonDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Skeleton</h1>
        <p className="leading-relaxed text-muted-foreground">
          Use to show a placeholder while content is loading. Size and shape
          come from your{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            className
          </code>
          .
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="skeleton" />

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
        <ComponentSource title="skeleton.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "className",
              type: "string",
              defaultValue: "—",
              description:
                "Set height, width, and radius (e.g. `h-4 w-full rounded-full`).",
            },
            {
              name: "…div props",
              type: 'React.ComponentProps<"div">',
              defaultValue: "—",
              description: "Native attributes pass through to the element.",
            },
          ]}
        />
      </section>
    </article>
  )
}
