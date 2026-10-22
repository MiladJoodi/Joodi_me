"use client"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@sonojs/ui/components/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@sonojs/ui/components/radio-group"

export function RadioGroupChoiceCard() {
  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend>Plan</FieldLegend>
      <FieldDescription>
        Choose the plan that fits your team.
      </FieldDescription>
      <RadioGroup defaultValue="plus">
        <FieldGroup className="gap-3">
          <FieldLabel htmlFor="plan-plus">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Plus</FieldTitle>
                <FieldDescription>
                  For individuals and small teams.
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value="plus" id="plan-plus" />
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor="plan-pro">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Pro</FieldTitle>
                <FieldDescription>
                  For growing businesses.
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value="pro" id="plan-pro" />
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor="plan-enterprise">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Enterprise</FieldTitle>
                <FieldDescription>
                  For large teams and enterprises.
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value="enterprise" id="plan-enterprise" />
            </Field>
          </FieldLabel>
        </FieldGroup>
      </RadioGroup>
    </FieldSet>
  )
}
