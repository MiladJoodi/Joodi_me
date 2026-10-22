import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@sonojs/ui/components/field"
import { Textarea } from "@sonojs/ui/components/textarea"

export function TextareaInvalid() {
  return (
    <Field data-invalid className="max-w-md">
      <FieldLabel htmlFor="bio-invalid">Bio</FieldLabel>
      <Textarea
        id="bio-invalid"
        placeholder="Tell us a little bit about yourself"
        aria-invalid
        defaultValue="a"
      />
      <FieldDescription>
        Write a short bio for your public profile.
      </FieldDescription>
      <FieldError>Bio must be at least 10 characters.</FieldError>
    </Field>
  )
}
