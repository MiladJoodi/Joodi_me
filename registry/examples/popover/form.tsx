"use client"

import { Button } from "@sonojs/ui/components/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@sonojs/ui/components/field"
import { Input } from "@sonojs/ui/components/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@sonojs/ui/components/popover"

export function PopoverForm() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open form</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the width and height for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="mt-3 gap-3">
          <Field>
            <FieldLabel htmlFor="width">Width</FieldLabel>
            <Input id="width" defaultValue="100%" />
          </Field>
          <Field>
            <FieldLabel htmlFor="height">Height</FieldLabel>
            <Input id="height" defaultValue="25px" />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}
