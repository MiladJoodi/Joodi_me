import { ComponentsDirectory } from "@/components/docs/components-directory"
import { docsNav } from "@/lib/docs-nav"

export default function ComponentsIndexPage() {
  const components =
    docsNav.groups.find((g) => g.title === "Components")?.pages ?? []

  const items = components.map((page) => ({
    title: page.title,
    href: page.href,
    featured: page.featured,
    slug: page.href.replace(/^\/docs\/components\//, ""),
  }))

  return (
    <article className="mx-auto w-full max-w-3xl space-y-6">
      <h1 className="text-h1">Components</h1>
      <ComponentsDirectory items={items} />
    </article>
  )
}
