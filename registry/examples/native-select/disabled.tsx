import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@sonojs/ui/components/field"
import {
  NativeSelect,
  NativeSelectOption,
} from "@sonojs/ui/components/native-select"

export function NativeSelectDisabled() {
  return (
    <Field data-disabled className="max-w-xs">
      <FieldLabel htmlFor="fruit-disabled">Fruit</FieldLabel>
      <NativeSelect id="fruit-disabled" disabled defaultValue="apple">
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
      </NativeSelect>
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  )
}
