import {
  Field,
  FieldLabel,
} from "@sonojs/ui/components/field"
import { Textarea } from "@sonojs/ui/components/textarea"

export function TextareaDisabled() {
  return (
    <Field data-disabled className="max-w-md">
      <FieldLabel htmlFor="bio-disabled">Bio</FieldLabel>
      <Textarea
        id="bio-disabled"
        placeholder="Tell us a little bit about yourself"
        disabled
      />
    </Field>
  )
}
