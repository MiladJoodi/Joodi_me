import { CornerDownLeftIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@sonojs/ui/components/input-group"

export function InputGroupTextareaExample() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupTextarea
        placeholder="Ask, search, or chat…"
        className="min-h-24"
      />
      <InputGroupAddon align="block-end">
        <InputGroupText>0/240</InputGroupText>
        <InputGroupButton
          variant="default"
          size="icon-xs"
          className="ms-auto rounded-full"
          aria-label="Send"
        >
          <CornerDownLeftIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
