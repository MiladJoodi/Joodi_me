import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "empty-default",
    title: "Basic",
    description:
      "Icon, title, description, and a primary action for a first-run empty state.",
    requires: ["button"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "empty-outline",
    title: "Outline",
    description: "Add `border border-dashed` on `Empty` for a framed panel.",
    requires: ["button"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "empty-background",
    title: "Background",
    description: "Use `bg-*` or gradient utilities on `Empty` for atmosphere.",
    requires: ["button"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "empty-avatar",
    title: "Avatar",
    description: "Pass an `Avatar` into `EmptyMedia` without `variant=\"icon\"`.",
    requires: ["button", "avatar"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "empty-input-group",
    title: "Input Group",
    description: "Put search or filters inside `EmptyContent`.",
    requires: ["input-group", "input", "button"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import { FolderCodeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function Example() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon />
        </EmptyMedia>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>No results match your filters.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Add item</Button>
      </EmptyContent>
    </Empty>
  )
}`

const compositionSource = `Empty
├── EmptyHeader
│   ├── EmptyMedia
│   ├── EmptyTitle
│   └── EmptyDescription
└── EmptyContent`

export default async function EmptyDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Empty</h1>
        <p className="leading-relaxed text-muted-foreground">
          Display an empty state when there is no data yet — first-run screens,
          cleared filters, offline users, or 404-style search.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="empty" />

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
        <ComponentSource title="empty.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "variant",
              type: '"default" | "icon"',
              defaultValue: '"default"',
              description:
                "On EmptyMedia — icon wraps children in a muted square; default is transparent for avatars.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: "—",
              description:
                "On Empty — add border, background, or size utilities for layout variants.",
            },
          ]}
        />
      </section>
    </article>
  )
}
