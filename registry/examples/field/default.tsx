import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@sonojs/ui/components/field"
import { Input } from "@sonojs/ui/components/input"

export function FieldDefault() {
  return (
    <FieldGroup className="w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" placeholder="maxleiter" autoComplete="username" />
        <FieldDescription>
          This is your public display name. It can be your real name or a
          pseudonym.
        </FieldDescription>
      </Field>
    </FieldGroup>
  )
}
