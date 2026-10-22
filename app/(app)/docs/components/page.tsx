import Link from "next/link"

import { docsNav } from "@/lib/docs-nav"

export default function ComponentsIndexPage() {
  const components =
    docsNav.groups.find((g) => g.title === "Components")?.pages ?? []

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-h1">Components</h1>
      <p className="text-muted-foreground">
        Install with{" "}
        <code className="wink-inline-code">npx @winkui/ui@latest add …</code>{" "}
        per component.
      </p>
      <ul className="space-y-2">
        {components.map((page) => (
          <li key={page.href}>
            <Link
              href={page.href}
              className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
            >
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  )
}
