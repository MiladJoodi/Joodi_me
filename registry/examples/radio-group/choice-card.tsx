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
              <RadioGroupItem value="plus" id="plan-plus" />
              <FieldContent>
                <FieldTitle>Plus</FieldTitle>
                <FieldDescription>
                  For individuals and small teams.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor="plan-pro">
            <Field orientation="horizontal">
              <RadioGroupItem value="pro" id="plan-pro" />
              <FieldContent>
                <FieldTitle>Pro</FieldTitle>
                <FieldDescription>
                  For growing businesses.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor="plan-enterprise">
            <Field orientation="horizontal">
              <RadioGroupItem value="enterprise" id="plan-enterprise" />
              <FieldContent>
                <FieldTitle>Enterprise</FieldTitle>
                <FieldDescription>
                  For large teams and enterprises.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        </FieldGroup>
      </RadioGroup>
    </FieldSet>
  )
}
