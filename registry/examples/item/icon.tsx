import { ShieldAlertIcon } from "lucide-react"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@sonojs/ui/components/item"

export function ItemIcon() {
  return (
    <Item variant="outline" className="max-w-lg">
      <ItemMedia variant="icon">
        <ShieldAlertIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Security Alert</ItemTitle>
        <ItemDescription>
          New login detected from an unknown device.
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}
