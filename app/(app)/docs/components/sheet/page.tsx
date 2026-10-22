import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "sheet-default",
    title: "Basic",
    description:
      "Default opens from the inline `end` edge (right in LTR, left in RTL).",
    requires: ["button", "input", "label"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "sheet-sides",
    title: "Sides",
    description:
      'Prefer `side="start"` / `"end"` so the panel flips with LTR/RTL. Toggle direction in the preview.',
    requires: ["button"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "sheet-no-close",
    title: "No Close Button",
    description: "Hide the corner X with `showCloseButton={false}`.",
    requires: ["button"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Example() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}`

const directionSource = `import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

// Prefer logical edges — they follow writing direction.
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open from end</Button>
  </SheetTrigger>
  <SheetContent side="end">…</SheetContent>
</Sheet>

// Physical left / right never flip (escape hatch).
<Sheet>
  <SheetContent side="right">…</SheetContent>
</Sheet>`

const compositionSource = `Sheet
├── SheetTrigger
└── SheetContent
    ├── SheetHeader
    │   ├── SheetTitle
    │   └── SheetDescription
    └── SheetFooter`

export default async function SheetDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Sheet</h1>
        <p className="leading-relaxed text-muted-foreground">
          Extends Dialog to slide content in from a screen edge. Prefer{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            side=&quot;start&quot;
          </code>{" "}
          /{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            &quot;end&quot;
          </code>{" "}
          — SonoJS resolves them with{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            getStartSide
          </code>{" "}
          /{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            getEndSide
          </code>{" "}
          so position and slide animation match writing direction.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="sheet" />

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
        <ComponentSource title="sheet.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Direction</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Default is{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            side=&quot;end&quot;
          </code>{" "}
          (inline end: right in LTR, left in RTL). Use physical{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            left
          </code>{" "}
          /{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            right
          </code>{" "}
          only when the edge must stay fixed.
        </p>
        <ComponentSource
          title="sides.tsx"
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
              type: '"top" | "bottom" | "left" | "right" | "start" | "end"',
              defaultValue: '"end"',
              description:
                "On `SheetContent` — prefer `start`/`end` for RTL; `left`/`right` stay physical.",
            },
            {
              name: "showCloseButton",
              type: "boolean",
              defaultValue: "true",
              description: "On `SheetContent` — show the corner close control.",
            },
            {
              name: "open",
              type: "boolean",
              defaultValue: "—",
              description: "On `Sheet` — controlled open state.",
            },
            {
              name: "onOpenChange",
              type: "(open: boolean) => void",
              defaultValue: "—",
              description: "Called when open state changes.",
            },
          ]}
        />
      </section>
    </article>
  )
}
