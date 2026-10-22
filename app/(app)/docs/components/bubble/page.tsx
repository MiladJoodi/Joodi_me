import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  { name: "bubble-default", title: "Default" },
  { name: "bubble-variants", title: "Variants" },
  { name: "bubble-alignment", title: "Alignment" },
  { name: "bubble-group", title: "Group" },
  { name: "bubble-reactions", title: "Reactions" },
  { name: "bubble-link-button", title: "Link / Button" },
]

const usageSource = `import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"

export function Example() {
  return (
    <BubbleGroup>
      <Bubble>
        <BubbleContent>
          I checked the registry output and removed the stale route.
        </BubbleContent>
        <BubbleReactions>
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
    </BubbleGroup>
  )
}`

export default async function BubbleDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Bubble</h1>
        <p className="leading-relaxed text-muted-foreground">
          Displays conversational content in a message bubble — variants,
          alignment, grouping, reactions, and polymorphic link/button content.
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
          code={`npx @winkui/ui@latest add bubble`}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="bubble.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "variant",
              type: '"default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"',
              defaultValue: '"default"',
              description: "Visual treatment of the bubble surface.",
            },
            {
              name: "align",
              type: '"start" | "end"',
              defaultValue: '"start"',
              description:
                "Align the bubble to the start or end of the conversation row.",
            },
            {
              name: "side",
              type: '"top" | "bottom"',
              defaultValue: '"bottom"',
              description: "On BubbleReactions: which edge to anchor to.",
            },
            {
              name: "asChild",
              type: "boolean",
              defaultValue: "false",
              description:
                "On BubbleContent: merge props onto a child (link or button).",
            },
          ]}
        />
      </section>
    </article>
  )
}
