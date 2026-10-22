import { PlusIcon } from "lucide-react"

import { Button } from "@winkui/ui/components/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@winkui/ui/components/button-group"

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
