import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@sonojs/ui/components/input-group"

export function InputGroupDefault() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search…" />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  )
}
