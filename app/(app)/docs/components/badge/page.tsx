import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
  type VariantExample,
} from "@/components/docs"
import { highlightCode } from "@/lib/highlight-code"

const badgeSources: Record<string, string> = {
  "badge-default": `import { Badge } from "@/components/ui/badge"

export function BadgeDefault() {
  return (
    <div className="flex w-full flex-wrap justify-center gap-2">
      <Badge>Badge</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}`,
  "badge-variants": `import { Badge } from "@/components/ui/badge"

export function BadgeVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  )
}`,
  "badge-icon": `import { BadgeCheck, BookmarkIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function BadgeIconExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">
        <BadgeCheck data-icon="inline-start" />
        Verified
      </Badge>
      <Badge variant="outline">
        Bookmark
        <BookmarkIcon data-icon="inline-end" />
      </Badge>
    </div>
  )
}`,
  "badge-spinner": `import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export function BadgeSpinnerExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="destructive">
        <Spinner data-icon="inline-start" />
        Deleting
      </Badge>
      <Badge variant="secondary">
        Generating
        <Spinner data-icon="inline-end" />
      </Badge>
    </div>
  )
}`,
  "badge-link": `import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function BadgeLinkExample() {
  return (
    <Badge asChild>
      <a href="#link">
        Open Link <ArrowUpRightIcon data-icon="inline-end" />
      </a>
    </Badge>
  )
}`,
  "badge-colors": `import { Badge } from "@/components/ui/badge"

export function BadgeColorsExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        Blue
      </Badge>
      <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
        Green
      </Badge>
      <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
        Sky
      </Badge>
      <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
        Purple
      </Badge>
      <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
        Red
      </Badge>
    </div>
  )
}`,
}

const usageSource = `import { Badge } from "@/components/ui/badge"

export function Example() {
  return <Badge>Badge</Badge>
}`

async function getBadgeExamples(): Promise<VariantExample[]> {
  const base: VariantExample[] = [
    {
      name: "badge-default",
      title: "Default",
      description: "A simple status label.",
    },
    {
      name: "badge-variants",
      title: "Variants",
      description: "Default, secondary, outline, and destructive styles.",
    },
    {
      name: "badge-icon",
      title: "Icon",
      description: "Compose a Lucide icon beside the label.",
    },
    {
      name: "badge-spinner",
      title: "Spinner",
      description: "Show a loading spinner inside the badge.",
      requires: ["spinner"],
    },
    {
      name: "badge-link",
      title: "Link",
      description: "Use `asChild` to render the badge as a link.",
    },
    {
      name: "badge-colors",
      title: "Colors",
      description: "Semantic color treatments for status.",
    },
  ]

  return Promise.all(
    base.map(async (item) => {
      const code = badgeSources[item.name]
      return {
        ...item,
        code,
        codeHtml: await highlightCode(code),
      }
    })
  )
}

export default async function BadgeDocsPage() {
  const examples = await getBadgeExamples()

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Badge</h1>
        <p className="leading-relaxed text-muted-foreground">
          Small status labels for counts, categories, and inline metadata —
          with variants, icons, and link composition.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="badge" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="badge.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "variant",
              type: '"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"',
              defaultValue: '"default"',
              description: "Visual style of the badge.",
            },
            {
              name: "asChild",
              type: "boolean",
              defaultValue: "false",
              description:
                "Render as the child element (e.g. an anchor) instead of a span.",
            },
          ]}
        />
      </section>
    </article>
  )
}
