import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "navigation-menu-default",
    title: "Basic",
    description: "Triggers with rich content panels and a top-level link.",
  },
  {
    name: "navigation-menu-simple",
    title: "Link",
    description:
      "Compose plain links with `asChild` and `navigationMenuTriggerStyle()`.",
  },
  {
    name: "navigation-menu-viewport",
    title: "No Viewport",
    description:
      "Set `viewport={false}` so each panel positions under its trigger.",
  },
]

const usageSource = `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`

const compositionSource = `NavigationMenu
├── NavigationMenuList
│   ├── NavigationMenuItem
│   │   ├── NavigationMenuTrigger
│   │   └── NavigationMenuContent
│   │       └── NavigationMenuLink
│   └── NavigationMenuItem
│       └── NavigationMenuLink
└── NavigationMenuViewport`

export default async function NavigationMenuDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Navigation Menu</h1>
        <p className="leading-relaxed text-muted-foreground">
          A collection of links for site navigation. Triggers use height{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            h-8
          </code>
          . Compose Next.js{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            Link
          </code>{" "}
          with{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            asChild
          </code>
          .
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} allowOverflow />
      </section>

      <DocsInstallation name="navigation-menu" />

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
        <ComponentSource
          title="navigation-menu.tsx"
          lang="tsx"
          code={usageSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "viewport",
              type: "boolean",
              defaultValue: "true",
              description:
                "On `NavigationMenu` — shared floating viewport vs per-item panels.",
            },
            {
              name: "asChild",
              type: "boolean",
              defaultValue: "false",
              description: "On `NavigationMenuLink` — merge onto a custom link.",
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
