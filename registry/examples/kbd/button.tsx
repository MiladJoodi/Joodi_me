import { Button } from "@sonojs/ui/components/button"
import { Kbd } from "@sonojs/ui/components/kbd"

export function KbdButton() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline">
        Accept
        <Kbd>↵</Kbd>
      </Button>
      <Button variant="outline">
        Cancel
        <Kbd>Esc</Kbd>
      </Button>
      <Button variant="outline">
        Save
        <Kbd>⌘S</Kbd>
      </Button>
    </div>
  )
}
