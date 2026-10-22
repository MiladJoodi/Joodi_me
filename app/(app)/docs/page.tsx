import Link from "next/link"

import { ComponentSource } from "@/components/docs"
import { buttonVariants } from "@sonojs/ui/components/button"
import { cn } from "@/lib/utils"

export default function DocsIndexPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-h1">Introduction</h1>
      <p className="leading-relaxed text-muted-foreground">
        Init once for the design system, then add components one at a time —
        you own the source.
      </p>
      <ComponentSource
        title="1. Init design system"
        lang="bash"
        code={`npx @sonojs/ui@latest init`}
      />
      <ComponentSource
        title="2. Add a component"
        lang="bash"
        code={`npx @sonojs/ui@latest add button`}
      />
      <div className="flex flex-wrap gap-3">
        <Link
          href="/docs/components/accordion"
          className={cn(buttonVariants({ variant: "default" }), "cursor-pointer")}
        >
          Browse components
        </Link>
        <Link
          href="/blocks"
          className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}
        >
          Blocks
        </Link>
      </div>
    </article>
  )
}
