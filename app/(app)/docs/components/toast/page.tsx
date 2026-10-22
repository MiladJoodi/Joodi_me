import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "toast-default",
    title: "Basic",
    description: "Call `toast()` from `sonner` after mounting `Toaster`.",
    requires: ["button"],
    npmRequires: ["sonner", "lucide-react", "next-themes"],
  },
  {
    name: "toast-types",
    title: "Types",
    description:
      "Use `toast.success`, `info`, `warning`, `error`, or a loading → success flow.",
    requires: ["button"],
    npmRequires: ["sonner", "lucide-react", "next-themes"],
  },
  {
    name: "toast-description",
    title: "Description",
    description: "Pass a `description` in the toast options.",
    requires: ["button"],
    npmRequires: ["sonner", "lucide-react", "next-themes"],
  },
]

const usageSource = `"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Button variant="outline" onClick={() => toast("Event has been created.")}>
      Show toast
    </Button>
  )
}`

const setupSource = `import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}`

const directionSource = `import { Toaster } from "@/components/ui/sonner"

// Toaster inherits dir from useDirection / <html dir>.
// Toast chrome and action layout flip in RTL automatically.
<Toaster />

// Optional override:
<Toaster dir="rtl" position="top-center" />`

const compositionSource = `Toaster  // mount once in the root layout
toast()  // call from event handlers`

export default async function ToastDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Toast</h1>
        <p className="leading-relaxed text-muted-foreground">
          Brief notifications for success, errors, and background work. Mount{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            Toaster
          </code>{" "}
          once in the root layout, then call{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            toast()
          </code>{" "}
          from{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            sonner
          </code>
          . Writing direction is passed through so layout flips in RTL.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="sonner" />

      <section className="space-y-3">
        <h2 className="text-h3">Setup</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Add the toaster next to your app shell (inside the theme provider if
          you use one).
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
        <ComponentSource title="toast.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Direction</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            Toaster
          </code>{" "}
          reads{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            useDirection
          </code>{" "}
          and sets{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            dir
          </code>{" "}
          so toast text and actions follow LTR/RTL.
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
              name: "theme",
              type: '"light" | "dark" | "system"',
              defaultValue: "from next-themes",
              description: "On `Toaster` — color scheme for toast chrome.",
            },
            {
              name: "dir",
              type: '"ltr" | "rtl"',
              defaultValue: "inherited",
              description:
                "On `Toaster` — writing direction. Defaults from `useDirection`.",
            },
            {
              name: "position",
              type: "string",
              defaultValue: '"bottom-right"',
              description:
                'On `Toaster` — e.g. `"top-center"`, `"bottom-left"`.',
            },
            {
              name: "toast()",
              type: "(message, options?) => string | number",
              defaultValue: "—",
              description:
                "Imperative API from `sonner` — also `toast.success`, `.error`, etc.",
            },
          ]}
        />
      </section>
    </article>
  )
}
