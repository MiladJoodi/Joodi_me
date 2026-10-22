import {
  NativeSelect,
  NativeSelectOption,
} from "@sonojs/ui/components/native-select"

export function NativeSelectSize() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <NativeSelect size="sm" className="w-full" defaultValue="apple">
        <NativeSelectOption value="apple">Small</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
      </NativeSelect>
      <NativeSelect className="w-full" defaultValue="apple">
        <NativeSelectOption value="apple">Default</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
