import Link from "next/link"

import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "table-default",
    title: "Basic",
    description:
      "Headers and cells default to `text-start`. Align amounts with `text-end`.",
  },
  {
    name: "table-footer",
    title: "Footer",
    description: "Summarize columns with `TableFooter`.",
  },
]

const usageSource = `import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function Example() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-end">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}`

const directionSource = `import { Table, TableHead, TableCell } from "@/components/ui/table"

// Defaults: text-start on heads/cells/caption; container gets dir from useDirection.
// Numeric / trailing columns: use text-end (not text-right).
<TableHead className="text-end">Amount</TableHead>
<TableCell className="text-end">$250.00</TableCell>

// Checkbox columns keep padding on the inline end:
// [&:has([role=checkbox])]:pe-0`

const compositionSource = `Table
├── TableCaption
├── TableHeader
│   └── TableRow
│       └── TableHead
├── TableBody
│   └── TableRow
│       └── TableCell
└── TableFooter
    └── TableRow
        └── TableCell`

export default async function TableDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Table</h1>
        <p className="leading-relaxed text-muted-foreground">
          A responsive table for tabular data. Built with logical alignment (
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            text-start
          </code>
          /{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            text-end
          </code>
          ) so columns flip correctly in RTL — toggle direction in the preview.
          For sorting, filtering, and pagination, see{" "}
          <Link
            href="/docs/components/data-table"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Data Table
          </Link>
          .
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="table" />

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
        <ComponentSource title="table.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Direction</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The scroll container receives{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            dir
          </code>{" "}
          from{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            useDirection
          </code>
          . Prefer{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            text-end
          </code>{" "}
          for amounts — never{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            text-right
          </code>
          .
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
              name: "className",
              type: "string",
              defaultValue: "—",
              description:
                "On any part — merge Tailwind classes (e.g. `text-end` on amount cells).",
            },
            {
              name: "colSpan",
              type: "number",
              defaultValue: "—",
              description: "On `TableCell` / `TableHead` — span columns.",
            },
          ]}
        />
      </section>
    </article>
  )
}
