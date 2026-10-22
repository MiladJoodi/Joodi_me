import { MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "@winkui/ui/components/button"
import { ButtonGroup } from "@winkui/ui/components/button-group"

export function ButtonGroupOrientation() {
  return (
    <ButtonGroup
      orientation="vertical"
      aria-label="Media controls"
      className="h-fit"
    >
      <Button variant="outline" size="icon">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  )
}
