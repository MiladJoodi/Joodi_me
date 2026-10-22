import { PlusIcon } from "lucide-react"

import { Button } from "@sonojs/ui/components/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@sonojs/ui/components/button-group"

export function ButtonGroupSplit() {
  return (
    <ButtonGroup>
      <Button variant="secondary">Button</Button>
      <ButtonGroupSeparator />
      <Button size="icon" variant="secondary">
        <PlusIcon />
      </Button>
    </ButtonGroup>
  )
}
