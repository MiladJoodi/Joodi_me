import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@sonojs/ui/components/field"
import { Input } from "@sonojs/ui/components/input"

export function FieldInvalid() {
  return (
    <FieldGroup className="w-full max-w-sm">
      <Field data-invalid>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          defaultValue="not-an-email"
          aria-invalid
          autoComplete="email"
        />
        <FieldDescription>We never share your email.</FieldDescription>
        <FieldError>Enter a valid email address.</FieldError>
      </Field>
    </FieldGroup>
  )
}
