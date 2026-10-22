import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@sonojs/ui/components/input-group"
import { Kbd } from "@sonojs/ui/components/kbd"

export function InputGroupKbd() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search documentation…" />
      <InputGroupAddon align="inline-end">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  )
}
