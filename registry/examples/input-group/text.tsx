import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@sonojs/ui/components/input-group"

export function InputGroupTextExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup dir="ltr">
        <InputGroupInput
          placeholder="example.com"
          className="text-left"
        />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup dir="ltr">
        <InputGroupInput placeholder="example" className="text-left" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Amount" />
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
