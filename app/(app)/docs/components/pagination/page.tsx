import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "pagination-default",
    title: "Basic",
    description:
      "Previous / next with page links and an ellipsis for longer ranges.",
    requires: ["button"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "pagination-simple",
    title: "Simple",
    description: "Page numbers only — useful when the list is short.",
    requires: ["button"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "pagination-icons",
    title: "Icons Only",
    description:
      "Previous and next beside a rows-per-page control for table footers.",
    requires: ["button", "field", "label", "separator", "native-select"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function Example() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`

const compositionSource = `Pagination
└── PaginationContent
    ├── PaginationItem → PaginationPrevious
    ├── PaginationItem → PaginationLink
    ├── PaginationItem → PaginationEllipsis
    └── PaginationItem → PaginationNext`

export default async function PaginationDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Pagination</h1>
        <p className="leading-relaxed text-muted-foreground">
          Page navigation with previous / next links. Page numbers stay{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            LTR
          </code>{" "}
          (1 → 2 → 3) in both writing directions. Pass custom children on
          Previous / Next to localize labels.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="pagination" />

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
        <ComponentSource title="pagination.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "isActive",
              type: "boolean",
              defaultValue: "false",
              description: "On `PaginationLink` — marks the current page.",
            },
            {
              name: "size",
              type: "Button size",
              defaultValue: '"icon"',
              description: "On `PaginationLink` — defaults to icon; prev/next use default.",
            },
            {
              name: "text",
              type: "string",
              defaultValue: '"Previous" / "Next"',
              description: "On `PaginationPrevious` / `PaginationNext` — visible label.",
            },
            {
              name: "href",
              type: "string",
              defaultValue: "—",
              description: "Native anchor href (swap for Next.js `Link` if needed).",
            },
          ]}
        />
      </section>
    </article>
  )
}
