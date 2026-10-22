import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  { name: "avatar-default", title: "Default" },
  { name: "avatar-basic", title: "Basic" },
  { name: "avatar-sizes", title: "Sizes" },
  { name: "avatar-badge", title: "Badge" },
  { name: "avatar-group", title: "Group" },
]

const usageSource = `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function Example() {
  return (
    <Avatar>
      <AvatarImage src="/images/docs/01.webp" alt="User 1" />
      <AvatarFallback>U1</AvatarFallback>
    </Avatar>
  )
}`

export default async function AvatarDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Avatar</h1>
        <p className="leading-relaxed text-muted-foreground">
          An image element with a fallback for representing the user — with
          optional badge, sizes, and overlapping groups.
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
          code={`npx @winkui/ui@latest add avatar`}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="avatar.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "size",
              type: '"default" | "sm" | "lg"',
              defaultValue: '"default"',
              description:
                "Avatar size. Default 32px (size-8), sm 24px, lg 40px.",
            },
          ]}
        />
      </section>
    </article>
  )
}
