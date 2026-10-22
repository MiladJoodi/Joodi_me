import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@sonojs/ui/components/field"
import { Input } from "@sonojs/ui/components/input"

export function FieldFieldset() {
  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend>Address</FieldLegend>
      <FieldDescription>
        We need your address to deliver your order.
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="street">Street Address</FieldLabel>
          <Input id="street" placeholder="123 Main St" autoComplete="street-address" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input id="city" placeholder="New York" autoComplete="address-level2" />
          </Field>
          <Field>
            <FieldLabel htmlFor="postal">Postal Code</FieldLabel>
            <Input id="postal" placeholder="10001" autoComplete="postal-code" />
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  )
}
