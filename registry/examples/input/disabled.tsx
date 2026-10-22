import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@sonojs/ui/components/field"
import { Input } from "@sonojs/ui/components/input"

export function InputDisabled() {
  return (
    <Field data-disabled className="max-w-xs">
      <FieldLabel htmlFor="email-disabled">Email</FieldLabel>
      <Input
        id="email-disabled"
        type="email"
        placeholder="Email"
        disabled
        autoComplete="email"
      />
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  )
}
