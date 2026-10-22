import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@sonojs/ui/components/field"
import { Textarea } from "@sonojs/ui/components/textarea"

export function TextareaField() {
  return (
    <Field className="max-w-md">
      <FieldLabel htmlFor="bio">Bio</FieldLabel>
      <Textarea
        id="bio"
        placeholder="Tell us a little bit about yourself"
      />
      <FieldDescription>
        You can <span className="font-medium">@mention</span> other users and
        organizations.
      </FieldDescription>
    </Field>
  )
}
