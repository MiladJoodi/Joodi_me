import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@sonojs/ui/components/field"
import { Input } from "@sonojs/ui/components/input"

export function InputField() {
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input id="username" placeholder="maxleiter" autoComplete="username" />
      <FieldDescription>
        Choose a unique username for your account.
      </FieldDescription>
    </Field>
  )
}
