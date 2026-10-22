import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@sonojs/ui/components/input-group"
import { Kbd, KbdGroup } from "@sonojs/ui/components/kbd"

export function KbdInputGroup() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="Search documentation…" />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </InputGroupAddon>
    </InputGroup>
  )
}
