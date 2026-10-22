import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "item-default",
    title: "Basic",
    description: "Title, description, and optional actions in a flex row.",
    requires: ["button", "separator"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "item-variant",
    title: "Variant",
    description: 'Use `variant="outline"` or `variant="muted"` for surface styles.',
    requires: ["separator"],
  },
  {
    name: "item-size",
    title: "Size",
    description: 'Use `size="sm"` for denser lists.',
    requires: ["separator"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "item-icon",
    title: "Icon",
    description: 'Set `ItemMedia` to `variant="icon"` for a framed icon.',
    requires: ["separator"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "item-avatar",
    title: "Avatar",
    description: "Pass an `Avatar` into `ItemMedia` for people and profiles.",
    requires: ["avatar", "separator"],
  },
  {
    name: "item-image",
    title: "Image",
    description: 'Use `ItemMedia` with `variant="image"` for covers and thumbnails.',
    requires: ["separator"],
  },
  {
    name: "item-group",
    title: "Group",
    description: "Stack related rows with `ItemGroup` and `ItemSeparator`.",
    requires: ["avatar", "button", "separator"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "item-header",
    title: "Header",
    description: "Use `ItemHeader` and `ItemFooter` for meta above and below.",
    requires: ["separator"],
  },
  {
    name: "item-link",
    title: "Link",
    description: "Set `asChild` and wrap an `<a>` to make the whole item clickable.",
    requires: ["separator"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import { InboxIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export function Example() {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <InboxIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Inbox</ItemTitle>
        <ItemDescription>Review messages and notifications.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          Open
        </Button>
      </ItemActions>
    </Item>
  )
}`

const compositionSource = `ItemGroup
└── Item
    ├── ItemHeader
    ├── ItemMedia
    ├── ItemContent
    │   ├── ItemTitle
    │   └── ItemDescription
    ├── ItemActions
    └── ItemFooter`

export default async function ItemDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Item</h1>
        <p className="leading-relaxed text-muted-foreground">
          A flex row for media, title, description, and actions. Use{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            Item
          </code>{" "}
          for content lists; use{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            Field
          </code>{" "}
          when the row wraps a form control.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="item" />

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
        <ComponentSource title="item.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "variant",
              type: '"default" | "outline" | "muted"',
              defaultValue: '"default"',
              description: "Surface style on `Item`.",
            },
            {
              name: "size",
              type: '"default" | "sm"',
              defaultValue: '"default"',
              description: "Padding and gap density on `Item`.",
            },
            {
              name: "asChild",
              type: "boolean",
              defaultValue: "false",
              description:
                "Merge props onto the child (e.g. an `<a>`) via Radix Slot.",
            },
            {
              name: "variant (media)",
              type: '"default" | "icon" | "image"',
              defaultValue: '"default"',
              description: "On `ItemMedia` — icon frame or image crop.",
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
