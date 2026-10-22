import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "marker-default",
    title: "Basic",
    description: "Inline status notes with an optional decorative `MarkerIcon`.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "marker-variant",
    title: "Variant",
    description:
      'Switch layout with `variant="default"`, `border`, or `separator`.',
  },
  {
    name: "marker-status",
    title: "Status",
    description:
      'Set `role="status"` and pair with `Spinner` for live progress.',
    requires: ["spinner"],
  },
  {
    name: "marker-shimmer",
    title: "Shimmer",
    description: "Add the `shimmer` utility class on `MarkerContent` while streaming.",
    requires: ["spinner"],
  },
  {
    name: "marker-separator",
    title: "Separator",
    description:
      'Use `variant="separator"` for labeled dividers — do not set `role="separator"`.',
  },
  {
    name: "marker-border",
    title: "Border",
    description: 'Use `variant="border"` for rows with a bottom rule.',
    npmRequires: ["lucide-react"],
  },
  {
    name: "marker-link",
    title: "Link",
    description: "Set `asChild` and wrap an `<a>` or `<button>` for interactive markers.",
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import { CheckIcon } from "lucide-react"

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/components/ui/marker"

export function Example() {
  return (
    <Marker>
      <MarkerIcon>
        <CheckIcon />
      </MarkerIcon>
      <MarkerContent>Explored 4 files</MarkerContent>
    </Marker>
  )
}`

const compositionSource = `Marker
├── MarkerIcon
└── MarkerContent`

export default async function MarkerDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Marker</h1>
        <p className="leading-relaxed text-muted-foreground">
          Inline status, system notes, bordered rows, and labeled separators —
          useful in chat and agent threads. Presentational by default; set{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            role=&quot;status&quot;
          </code>{" "}
          for live updates.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="marker" />

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
        <ComponentSource title="marker.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "variant",
              type: '"default" | "border" | "separator"',
              defaultValue: '"default"',
              description: "Layout: inline, bottom border, or labeled divider.",
            },
            {
              name: "asChild",
              type: "boolean",
              defaultValue: "false",
              description: "Merge onto a child `<a>` or `<button>` via Slot.",
            },
            {
              name: "role",
              type: "string",
              defaultValue: "—",
              description: 'Use `"status"` for streaming / progress markers.',
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
