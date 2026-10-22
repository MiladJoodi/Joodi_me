import { Field, FieldLabel } from "@sonojs/ui/components/field"
import {
  NativeSelect,
  NativeSelectOption,
} from "@sonojs/ui/components/native-select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@sonojs/ui/components/pagination"

export function PaginationIcons() {
  return (
    <div className="flex w-full max-w-sm items-center justify-between gap-4">
      <Field orientation="horizontal" className="w-auto items-center gap-2">
        <FieldLabel htmlFor="rows-per-page" className="whitespace-nowrap">
          Rows per page
        </FieldLabel>
        <NativeSelect id="rows-per-page" defaultValue="25" size="sm">
          <NativeSelectOption value="10">10</NativeSelectOption>
          <NativeSelectOption value="25">25</NativeSelectOption>
          <NativeSelectOption value="50">50</NativeSelectOption>
        </NativeSelect>
      </Field>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
