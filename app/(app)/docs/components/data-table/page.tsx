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
      "Render columns with `useTable` and SonoJS `Table` primitives.",
    npmRequires: ["@tanstack/react-table"],
  },
  {
    name: "data-table-sorting",
    title: "Sorting",
    description:
      "Register `rowSortingFeature` and toggle sort from the column header.",
    requires: ["button"],
    npmRequires: ["@tanstack/react-table", "lucide-react"],
  },
  {
    name: "data-table-pagination",
    title: "Pagination",
    description:
      "Enable `rowPaginationFeature` and wire Previous / Next to the table APIs.",
    requires: ["button"],
    npmRequires: ["@tanstack/react-table"],
  },
  {
    name: "data-table-filtering",
    title: "Filtering",
    description:
      "Filter a column with `setFilterValue` and `filterFn: \"includesString\"`.",
    requires: ["button", "input"],
    npmRequires: ["@tanstack/react-table", "lucide-react"],
  },
]

const usageSource = `"use client"

import { createColumnHelper, useTable } from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { features } from "./features"

type Payment = {
  id: string
  amount: number
  status: string
  email: string
}

const columnHelper = createColumnHelper<typeof features, Payment>()

const columns = columnHelper.columns([
  columnHelper.accessor("status", { header: "Status" }),
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("amount", { header: "Amount" }),
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
              {row.getVisibleCells().map((cell) => (
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

const featuresSource = `import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table"

export const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})`

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
          , then opt into features like sorting, filtering, and pagination.
          Prefer{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            text-end
          </code>{" "}
          for amount columns so alignment follows RTL.
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
        <h2 className="text-h3">Features</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          v9 features are opt-in. Share a{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            features
          </code>{" "}
          object across your tables:
        </p>
        <ComponentSource
          title="features.ts"
          lang="tsx"
          code={featuresSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource
          title="data-table.tsx"
          lang="tsx"
          code={usageSource}
        />
      </section>
    </article>
  )
}
