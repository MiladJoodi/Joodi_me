"use client"

import {
  createColumnHelper,
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

import { features, type DataTableFeatures } from "./features"
import { payments, type Payment } from "./payments"

const columnHelper = createColumnHelper<DataTableFeatures, Payment>()

const columns = columnHelper.columns([
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("email", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ms-3"
        onClick={column.getToggleSortingHandler()}
      >
        Email
        <ArrowUpDownIcon className="size-4" />
      </Button>
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
    data: payments.slice(0, 8),
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
}
