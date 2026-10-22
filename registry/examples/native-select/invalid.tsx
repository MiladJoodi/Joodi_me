import {
  Field,
  FieldError,
  FieldLabel,
} from "@sonojs/ui/components/field"
import {
  NativeSelect,
  NativeSelectOption,
} from "@sonojs/ui/components/native-select"

export function NativeSelectInvalid() {
  return (
    <Field data-invalid className="max-w-xs">
      <FieldLabel htmlFor="fruit-invalid">Fruit</FieldLabel>
      <NativeSelect
        id="fruit-invalid"
        className="w-full"
        aria-invalid
        defaultValue=""
      >
        <NativeSelectOption value="">Select a fruit</NativeSelectOption>
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
      </NativeSelect>
      <FieldError>Please choose a fruit.</FieldError>
    </Field>
  )
}
