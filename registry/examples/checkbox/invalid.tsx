import { Checkbox } from "@sonojs/ui/components/checkbox"
import { Field, FieldGroup, FieldLabel } from "@sonojs/ui/components/field"

export function CheckboxInvalid() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-invalid>
        <Checkbox id="terms-invalid" name="terms-invalid" aria-invalid />
        <FieldLabel htmlFor="terms-invalid">
          Accept terms and conditions
        </FieldLabel>
      </Field>
    </FieldGroup>
  )
}
