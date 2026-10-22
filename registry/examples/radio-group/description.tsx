"use client"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@sonojs/ui/components/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@sonojs/ui/components/radio-group"

export function RadioGroupDescription() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-full max-w-sm gap-4">
      <FieldLabel htmlFor="rg-default">
        <Field orientation="horizontal">
          <RadioGroupItem value="default" id="rg-default" />
          <FieldContent>
            <FieldTitle>Default</FieldTitle>
            <FieldDescription>
              Standard spacing for most use cases.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="rg-comfortable">
        <Field orientation="horizontal">
          <RadioGroupItem value="comfortable" id="rg-comfortable" />
          <FieldContent>
            <FieldTitle>Comfortable</FieldTitle>
            <FieldDescription>
              More space between elements.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="rg-compact">
        <Field orientation="horizontal">
          <RadioGroupItem value="compact" id="rg-compact" />
          <FieldContent>
            <FieldTitle>Compact</FieldTitle>
            <FieldDescription>
              Minimal spacing for dense layouts.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </RadioGroup>
  )
}
