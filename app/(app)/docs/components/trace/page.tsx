import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "trace-default",
    title: "Basic",
    description:
      "A `TraceLine` with an icon and title — plain text when nothing expands.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "trace-status",
    title: "Status",
    description:
      'Set `status` to `running`, `error`, or `pending` (omit for finished work).',
    npmRequires: ["lucide-react"],
  },
  {
    name: "trace-description",
    title: "Description",
    description:
      "Put a duration, diff, or count in `TraceDescription` after the title.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "trace-collapsible",
    title: "Collapsible",
    description:
      "Wrap the line in `TraceCollapsible` to reveal detail under the row.",
    requires: ["code-block"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "trace-open",
    title: "Open State",
    description:
      "Control expansion with `open` / `onOpenChange`, or start open with `defaultOpen`.",
    requires: ["code-block"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "trace-link",
    title: "Link",
    description:
      "Wrap a `TraceLine` in an anchor; add an arrow icon and sr-only new-tab note.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "trace-group",
    title: "Group",
    description: "Stack related steps in one `Trace` list.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "trace-sources",
    title: "Sources",
    description:
      "A collapsible summary whose detail is a nested `Trace` of link rows.",
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import { SearchIcon } from "lucide-react"

import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function Example() {
  return (
    <Trace>
      <TraceLine>
        <TraceIcon>
          <SearchIcon />
        </TraceIcon>
        <TraceTitle>Searched for minimumReleaseAge</TraceTitle>
      </TraceLine>
    </Trace>
  )
}`

const compositionSource = `Trace
└── TraceLine
    ├── TraceIcon
    ├── TraceTitle
    ├── TraceDescription
    └── TraceIcon

Trace
└── TraceCollapsible
    ├── TraceCollapsibleTrigger
    │   └── TraceLine
    └── TraceCollapsibleContent`

const directionSource = `// Logical layout: start/end padding, border-s, ms/me, text-start.
// Chevron uses icon-dir so it flips correctly in RTL.
<Trace>
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine>…</TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>Detail</TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>`

export default async function TraceDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Trace</h1>
        <p className="leading-relaxed text-muted-foreground">
          Rows for agent steps — reasoning, tool calls, sources, and plans.
          Each line shares the same shape; wrap it in a collapsible, link, or
          overlay trigger to add behavior. Use Message for replies and Marker
          for notes between turns. Layout uses logical properties so nested
          borders and chevrons stay correct in RTL.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="trace" />

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
        <ComponentSource title="trace.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Direction</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Expand detail uses a start-edge border and start padding. The
          collapsible chevron is marked{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            icon-dir
          </code>{" "}
          so it mirrors in RTL.
        </p>
        <ComponentSource
          title="direction.tsx"
          lang="tsx"
          code={directionSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "status",
              type: '"running" | "error" | "pending"',
              defaultValue: "—",
              description:
                "On `TraceLine` — running shimmer, error color, or pending opacity. Omit when the step is done.",
            },
            {
              name: "open",
              type: "boolean",
              defaultValue: "—",
              description:
                "On `TraceCollapsible` — controlled open state (pair with `onOpenChange`).",
            },
            {
              name: "defaultOpen",
              type: "boolean",
              defaultValue: "false",
              description: "On `TraceCollapsible` — start expanded.",
            },
            {
              name: "onOpenChange",
              type: "(open: boolean) => void",
              defaultValue: "—",
              description: "On `TraceCollapsible` — called when open changes.",
            },
          ]}
        />
      </section>
    </article>
  )
}
