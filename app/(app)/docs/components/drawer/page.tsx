import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "drawer-default",
    title: "Basic",
    description: "A bottom drawer for mobile-first actions and confirmations.",
    requires: ["button"],
  },
  {
    name: "drawer-sides",
    title: "Sides",
    description:
      "Use `direction=\"start\"` / `\"end\"` so the panel flips with LTR/RTL. Toggle direction in the preview.",
    requires: ["button"],
  },
  {
    name: "drawer-scrollable",
    title: "Scrollable",
    description:
      "Put long copy in a `max-h-* overflow-y-auto` region above the footer.",
    requires: ["button"],
  },
  {
    name: "drawer-responsive",
    title: "With Form",
    description: "Labeled inputs inside the drawer body, actions in the footer.",
    requires: ["button", "input", "label"],
  },
]

const usageSource = `import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function Example() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}`

const directionSource = `import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

// Prefer logical edges — they follow writing direction.
<Drawer direction="end">
  <DrawerTrigger asChild>
    <Button variant="outline">Open from end</Button>
  </DrawerTrigger>
  <DrawerContent>…</DrawerContent>
</Drawer>

// Physical left / right never flip (escape hatch).
<Drawer direction="right">…</Drawer>`

const compositionSource = `Drawer
├── DrawerTrigger
└── DrawerContent
    ├── DrawerHeader
    │   ├── DrawerTitle
    │   └── DrawerDescription
    └── DrawerFooter`

export default async function DrawerDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Drawer</h1>
        <p className="leading-relaxed text-muted-foreground">
          A panel that slides in from an edge. Built on Vaul. For RTL-safe
          side panels, prefer{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            direction=&quot;start&quot;
          </code>{" "}
          /{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            &quot;end&quot;
          </code>{" "}
          — SonoJS resolves them to physical sides so Vaul&apos;s animation
          matches the visual edge.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="drawer" />

      <section className="space-y-3">
        <h2 className="text-h3">Direction (RTL / LTR)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Vaul only understands physical{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            left
          </code>{" "}
          /{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            right
          </code>
          . SonoJS maps{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            start
          </code>{" "}
          /{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            end
          </code>{" "}
          with{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            resolveEdgeSide
          </code>{" "}
          before opening, and sets{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            dir
          </code>{" "}
          on the portaled content so text stays correct.
        </p>
        <ComponentSource
          title="direction.tsx"
          lang="tsx"
          code={directionSource}
        />
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
        <ComponentSource title="drawer.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "direction",
              type: '"top" | "bottom" | "left" | "right" | "start" | "end"',
              defaultValue: '"bottom"',
              description:
                "On Drawer — prefer start/end for RTL. left/right are physical and do not flip.",
            },
            {
              name: "open / onOpenChange",
              type: "boolean / (open: boolean) => void",
              defaultValue: "—",
              description: "On Drawer — controlled open state.",
            },
            {
              name: "asChild",
              type: "boolean",
              defaultValue: "false",
              description:
                "On DrawerTrigger / DrawerClose — merge props into the child (e.g. Button).",
            },
            {
              name: "shouldScaleBackground",
              type: "boolean",
              defaultValue: "true",
              description: "On Drawer — Vaul scales the page behind the drawer.",
            },
          ]}
        />
      </section>
    </article>
  )
}
