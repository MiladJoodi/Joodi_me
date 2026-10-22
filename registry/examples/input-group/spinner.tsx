import { Spinner } from "@sonojs/ui/components/spinner"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@sonojs/ui/components/input-group"

export function InputGroupSpinner() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup data-disabled>
        <InputGroupInput placeholder="Searching…" disabled />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup data-disabled>
        <InputGroupInput placeholder="Saving…" disabled />
        <InputGroupAddon align="inline-end">
          <InputGroupText>Saving…</InputGroupText>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
