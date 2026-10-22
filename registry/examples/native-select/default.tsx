import {
  NativeSelect,
  NativeSelectOption,
} from "@sonojs/ui/components/native-select"

export function NativeSelectDefault() {
  return (
    <NativeSelect className="w-full max-w-xs" defaultValue="">
      <NativeSelectOption value="">Select a fruit</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
    </NativeSelect>
  )
}
