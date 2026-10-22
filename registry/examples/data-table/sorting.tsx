"use client"

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
import { ArrowUpDownIcon } from "lucide-react"

import { Button } from "@sonojs/ui/components/button"
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
]

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
  columnHelper.accessor("status", {
    header: "Status",
  }),
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

export function DataTableSorting() {
  const table = useTable({
    features,
    data,
    columns,
  })

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-md border">
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
}
