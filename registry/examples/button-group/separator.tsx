import { Button } from "@sonojs/ui/components/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@sonojs/ui/components/button-group"

export function ButtonGroupSeparatorExample() {
  return (
    <ButtonGroup>
      <Button variant="secondary" size="sm">
        Copy
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="sm">
        Paste
      </Button>
    </ButtonGroup>
  )
}
