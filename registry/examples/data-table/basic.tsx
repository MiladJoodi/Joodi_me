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
    // Keep emails LTR + left-aligned in RTL layouts
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

export function DataTableBasic() {
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
