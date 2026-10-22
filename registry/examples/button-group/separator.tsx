import { Button } from "@winkui/ui/components/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@winkui/ui/components/button-group"

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
