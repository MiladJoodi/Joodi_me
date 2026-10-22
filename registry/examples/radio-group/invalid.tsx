"use client"

import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@sonojs/ui/components/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@sonojs/ui/components/radio-group"

export function RadioGroupInvalid() {
  return (
    <FieldSet className="w-full max-w-sm gap-4">
      <FieldLegend>Notification preferences</FieldLegend>
      <RadioGroup defaultValue="none" aria-invalid>
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="all" id="ri-all" aria-invalid />
          <FieldLabel htmlFor="ri-all">All new messages</FieldLabel>
        </Field>
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="mentions" id="ri-mentions" aria-invalid />
          <FieldLabel htmlFor="ri-mentions">Direct messages and mentions</FieldLabel>
        </Field>
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="none" id="ri-none" aria-invalid />
          <FieldLabel htmlFor="ri-none">Nothing</FieldLabel>
        </Field>
      </RadioGroup>
      <FieldError>Please select a valid preference.</FieldError>
    </FieldSet>
  )
}
