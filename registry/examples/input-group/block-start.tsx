import { InfoIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@sonojs/ui/components/input-group"

export function InputGroupBlockStart() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="Enter your full name" />
      <InputGroupAddon align="block-start" className="border-b">
        <InputGroupText>Full name</InputGroupText>
        <InfoIcon className="ms-auto text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  )
}
