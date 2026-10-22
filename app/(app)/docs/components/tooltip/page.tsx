import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "tooltip-default",
    title: "Basic",
    description: "Show a short hint on hover or focus.",
    requires: ["button"],
  },
  {
    name: "tooltip-side",
    title: "Side",
    description:
      'Set `side` to `top`, `right`, `bottom`, or `left` (physical edges).',
    requires: ["button"],
  },
  {
    name: "tooltip-kbd",
    title: "With Keyboard Shortcut",
    description: "Nest `Kbd` inside the content for shortcut hints.",
    requires: ["button", "kbd"],
  },
  {
    name: "tooltip-disabled",
    title: "Disabled Button",
    description:
      "Wrap a disabled control in a span so the tooltip can still open.",
    requires: ["button"],
  },
]

const usageSource = `import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Example() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}`

const setupSource = `import { TooltipProvider } from "@/components/ui/tooltip"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}`

const directionSource = `import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Content gets dir from useDirection (portal-safe).
// Prefer align="start" / "end" when the tip should follow writing direction.
<Tooltip>
  <TooltipTrigger>Hover</TooltipTrigger>
  <TooltipContent side="top" align="start">Hint</TooltipContent>
</Tooltip>`

const compositionSource = `TooltipProvider  // mount once near the root
Tooltip
├── TooltipTrigger
└── TooltipContent`

export default async function TooltipDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Tooltip</h1>
        <p className="leading-relaxed text-muted-foreground">
          A popup that shows related information on hover or keyboard focus.
          Content inherits writing direction via{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            useDirection
          </code>{" "}
          so text stays correct in RTL portals.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="tooltip" />

      <section className="space-y-3">
        <h2 className="text-h3">Setup</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Wrap the app (or a large subtree) with{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            TooltipProvider
          </code>
          .
        </p>
        <ComponentSource title="layout.tsx" lang="tsx" code={setupSource} />
      </section>

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
        <ComponentSource title="tooltip.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Direction</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Use{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            align=&quot;start&quot;
          </code>{" "}
          /{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            &quot;end&quot;
          </code>{" "}
          for alignment that follows writing direction.{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            side
          </code>{" "}
          values{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            left
          </code>{" "}
          /{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            right
          </code>{" "}
          stay physical.
        </p>
        <ComponentSource
          title="direction.tsx"
          lang="tsx"
          code={directionSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "side",
              type: '"top" | "right" | "bottom" | "left"',
              defaultValue: '"top"',
              description: "On `TooltipContent` — preferred edge of the trigger.",
            },
            {
              name: "align",
              type: '"start" | "center" | "end"',
              defaultValue: '"center"',
              description:
                "On `TooltipContent` — prefer `start`/`end` with writing direction.",
            },
            {
              name: "sideOffset",
              type: "number",
              defaultValue: "0",
              description: "Distance in pixels from the trigger.",
            },
            {
              name: "delayDuration",
              type: "number",
              defaultValue: "0",
              description: "On `TooltipProvider` — open delay in ms.",
            },
          ]}
        />
      </section>
    </article>
  )
}
