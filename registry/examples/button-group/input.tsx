import { SearchIcon } from "lucide-react"

import { Button } from "@winkui/ui/components/button"
import { ButtonGroup } from "@winkui/ui/components/button-group"
import { Input } from "@winkui/ui/components/input"

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
