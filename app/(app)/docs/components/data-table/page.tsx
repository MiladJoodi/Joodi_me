import Link from "next/link"

import {
  ComponentSource,
  ComponentVariantPreview,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "data-table-basic",
    title: "Basic",
    description:
      "Copy-paste one file: row `#`, LTR email, and `text-end` amounts.",
    npmRequires: ["@tanstack/react-table"],
  },
  {
    name: "data-table-sorting",
    title: "Sorting",
    description:
      "Sort from the column header with `rowSortingFeature` (self-contained).",
    requires: ["button"],
    npmRequires: ["@tanstack/react-table", "lucide-react"],
  },
  {
    name: "data-table-pagination",
    title: "Pagination",
    description:
      "Previous / Next with `rowPaginationFeature` (self-contained).",
    requires: ["button"],
    npmRequires: ["@tanstack/react-table"],
  },
  {
    name: "data-table-filtering",
    title: "Filtering",
    description:
      "Filter emails with `setFilterValue` (self-contained example).",
    requires: ["button", "input"],
    npmRequires: ["@tanstack/react-table", "lucide-react"],
  },
]

/** One file — no `./features` / `./payments` / `./column-helpers` imports. */
const usageSource = `"use client"

import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Payment = {
  id: string
  amount: number
  status: string
  email: string
}

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

const columnHelper = createColumnHelper<typeof features, Payment>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: "rowNumber",
    header: () => (
      <span className="block w-8 text-center text-muted-foreground">#</span>
    ),
    cell: ({ row, table }) => {
      const pagination = table.store.state.pagination
      const pageIndex = pagination?.pageIndex ?? 0
      const pageSize = pagination?.pageSize ?? 10
      return (
        <span className="block w-8 text-center text-muted-foreground tabular-nums">
          {pageIndex * pageSize + row.index + 1}
        </span>
      )
    },
  }),
  columnHelper.accessor("status", { header: "Status" }),
  columnHelper.accessor("email", {
    header: () => (
      <div dir="ltr" className="text-left">
        Email
      </div>
    ),
    cell: ({ row }) => (
      <div dir="ltr" className="text-left">
        {String(row.getValue("email"))}
      </div>
    ),
  }),
  columnHelper.accessor("amount", {
    header: () => <div className="text-end">Amount</div>,
    cell: ({ row }) => (
      <div className="text-end font-medium">{row.getValue("amount")}</div>
    ),
  }),
])

export function DataTable({ data }: { data: Payment[] }) {
  const table = useTable({ features, data, columns })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}`

export default async function DataTableDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Data Table</h1>
        <p className="leading-relaxed text-muted-foreground">
          Powerful tables and datagrids built by composing SonoJS{" "}
          <Link
            href="/docs/components/table"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Table
          </Link>{" "}
          with TanStack Table. Install the table UI, add{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            @tanstack/react-table
          </code>
          , then copy an example from the Code tab — each demo is a{" "}
          <strong className="font-medium text-foreground">single file</strong>{" "}
          (no extra helpers to install). Prefer{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            text-end
          </code>{" "}
          for amounts and{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            dir=&quot;ltr&quot;
          </code>{" "}
          +{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            text-left
          </code>{" "}
          for emails.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="table" />

      <section className="space-y-3">
        <h2 className="text-h3">TanStack Table</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Data Table examples need TanStack Table v9. Install it next to the
          table component:
        </p>
        <ComponentSource
          title="npm"
          lang="bash"
          code="npm i @tanstack/react-table"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          One file you can paste into your app (pass your own{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            data
          </code>
          ). Open any example&apos;s Code tab for the full variant.
        </p>
        <ComponentSource
          title="data-table.tsx"
          lang="tsx"
          code={usageSource}
        />
      </section>
    </article>
  )
}
