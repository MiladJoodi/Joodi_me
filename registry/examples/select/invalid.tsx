"use client"

import {
  Field,
  FieldError,
  FieldLabel,
} from "@sonojs/ui/components/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sonojs/ui/components/select"

export function SelectInvalid() {
  return (
    <Field data-invalid className="w-[200px] gap-2">
      <FieldLabel htmlFor="fruit-invalid">Fruit</FieldLabel>
      <Select>
        <SelectTrigger id="fruit-invalid" aria-invalid className="w-full">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldError>Please select a fruit.</FieldError>
    </Field>
  )
}
