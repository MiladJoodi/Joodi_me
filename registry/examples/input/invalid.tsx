import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@sonojs/ui/components/field"
import { Input } from "@sonojs/ui/components/input"

export function InputInvalid() {
  return (
    <Field data-invalid className="max-w-xs">
      <FieldLabel htmlFor="email-invalid">Email</FieldLabel>
      <Input
        id="email-invalid"
        type="email"
        defaultValue="not-an-email"
        aria-invalid
        autoComplete="email"
      />
      <FieldDescription>This field contains validation errors.</FieldDescription>
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  )
}
