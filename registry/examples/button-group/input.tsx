import { SearchIcon } from "lucide-react"

import { Button } from "@sonojs/ui/components/button"
import { ButtonGroup } from "@sonojs/ui/components/button-group"
import { Input } from "@sonojs/ui/components/input"

export function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button variant="outline" aria-label="Search">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  )
}
