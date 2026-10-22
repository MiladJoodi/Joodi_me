import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "hover-card-default",
    title: "Basic",
    description: "Preview rich content when the user hovers a trigger.",
    requires: ["button", "avatar"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "hover-card-sides",
    title: "Sides",
    description:
      "Set `side` on `HoverCardContent` to `top`, `right`, `bottom`, or `left`.",
    requires: ["button"],
  },
  {
    name: "hover-card-delays",
    title: "Delays",
    description:
      "Tune open/close timing with `openDelay` and `closeDelay` on `HoverCard`.",
    requires: ["button"],
  },
]

const usageSource = `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger>Hover</HoverCardTrigger>
      <HoverCardContent>
        Preview content for sighted users — links, profiles, and short facts.
      </HoverCardContent>
    </HoverCard>
  )
}`

const compositionSource = `HoverCard
├── HoverCardTrigger
└── HoverCardContent`

export default async function HoverCardDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Hover Card</h1>
        <p className="leading-relaxed text-muted-foreground">
          For sighted users to preview content behind a link or control. Prefer{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            align=&quot;start&quot;
          </code>{" "}
          when the card should follow writing direction.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="hover-card" />

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
        <ComponentSource title="hover-card.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "openDelay",
              type: "number",
              defaultValue: "700",
              description: "On HoverCard — ms before the card opens on hover.",
            },
            {
              name: "closeDelay",
              type: "number",
              defaultValue: "300",
              description: "On HoverCard — ms before the card closes.",
            },
            {
              name: "side",
              type: '"top" | "right" | "bottom" | "left"',
              defaultValue: '"bottom"',
              description: "On HoverCardContent — physical edge for placement.",
            },
            {
              name: "align",
              type: '"start" | "center" | "end"',
              defaultValue: '"center"',
              description:
                "On HoverCardContent — prefer start/end for RTL-aware layouts.",
            },
            {
              name: "asChild",
              type: "boolean",
              defaultValue: "false",
              description:
                "On HoverCardTrigger — merge props into the child (e.g. Button).",
            },
          ]}
        />
      </section>
    </article>
  )
}
