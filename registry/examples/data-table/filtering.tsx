"use client"

import { createColumnHelper, useTable } from "@tanstack/react-table"
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

import { features, type DataTableFeatures } from "./features"
import { payments, type Payment } from "./payments"

const columnHelper = createColumnHelper<DataTableFeatures, Payment>()

const columns = columnHelper.columns([
  columnHelper.accessor("status", { header: "Status" }),
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
    data: payments,
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
                  {row.getVisibleCells().map((cell) => (
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
