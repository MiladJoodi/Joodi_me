"use client"

import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import { ArrowUpDownIcon } from "lucide-react"

import { Button } from "@sonojs/ui/components/button"
import { Input } from "@sonojs/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sonojs/ui/components/table"

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const data: Payment[] = [
  { id: "728ed52f", amount: 100, status: "pending", email: "m@example.com" },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  { id: "a1b2c3d4", amount: 316, status: "success", email: "ken99@example.com" },
  { id: "b2c3d4e5", amount: 242, status: "success", email: "Abe45@example.com" },
  {
    id: "c3d4e5f6",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  { id: "d4e5f6a7", amount: 874, status: "success", email: "Silas22@example.com" },
  {
    id: "e5f6a7b8",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
  { id: "f6a7b8c9", amount: 450, status: "pending", email: "sara@example.com" },
  { id: "a7b8c9d0", amount: 199, status: "success", email: "leo@example.com" },
  {
    id: "b8c9d0e1",
    amount: 560,
    status: "processing",
    email: "nina@example.com",
  },
  { id: "c9d0e1f2", amount: 88, status: "failed", email: "omar@example.com" },
  { id: "d0e1f2a3", amount: 1020, status: "success", email: "priya@example.com" },
]

const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
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
    header: ({ column }) => (
      <div dir="ltr" className="text-left">
        <Button
          variant="ghost"
          className="-ms-3"
          onClick={column.getToggleSortingHandler()}
        >
          Email
          <ArrowUpDownIcon className="size-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div dir="ltr" className="text-left">
        {String(row.getValue("email"))}
      </div>
    ),
    filterFn: "includesString",
  }),
  columnHelper.accessor("amount", {
    header: () => <div className="text-end">Amount</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-end font-medium">{formatted}</div>
    },
  }),
])

export function DataTableFiltering() {
  const table = useTable({
    features,
    data,
    columns,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
    },
  })

  return (
    <div className="w-full max-w-2xl space-y-4">
      <Input
        placeholder="Filter emails…"
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("email")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
        dir="ltr"
      />
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
