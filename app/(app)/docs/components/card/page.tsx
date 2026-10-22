import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "card-image",
    title: "Image",
    description: "Place an image before the header for a media card.",
    requires: ["badge", "button"],
  },
  {
    name: "card-image-overlay",
    title: "Image overlay",
    description:
      "Dim and grade the image with an overlay for text-heavy media cards.",
    requires: ["badge", "button"],
  },
  {
    name: "card-default",
    title: "Default",
    description:
      "A login card with header, action, form content, and footer actions.",
    requires: ["button", "input", "label"],
  },
  {
    name: "card-small",
    title: "Small",
    description: 'Use `size="sm"` for a more compact card.',
    requires: ["button"],
  },
  {
    name: "card-spacing",
    title: "Spacing",
    description:
      "Override `--card-spacing` to control inset and gaps between sections.",
    requires: ["button", "input", "label", "toggle-group"],
  },
  {
    name: "card-edge-to-edge",
    title: "Edge to Edge",
    description:
      "Use negative margins with `-mx-(--card-spacing)` for full-bleed content.",
    requires: ["button"],
  },
]

const usageSource = `import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}`

export default async function CardDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Card</h1>
        <p className="leading-relaxed text-muted-foreground">
          Displays a card with header, content, and footer — with size,
          spacing, edge-to-edge, and image layouts.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="card" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="card.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "size",
              type: '"default" | "sm"',
              defaultValue: '"default"',
              description:
                "Card density. Small uses tighter --card-spacing and title size.",
            },
          ]}
        />
      </section>
    </article>
  )
}
