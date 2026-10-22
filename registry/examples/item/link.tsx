import { ChevronRightIcon, ExternalLinkIcon, HomeIcon } from "lucide-react"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@sonojs/ui/components/item"

export function ItemLink() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Item variant="outline" asChild>
        <a href="#">
          <ItemMedia variant="icon">
            <HomeIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Dashboard</ItemTitle>
            <ItemDescription>
              Overview of your account and activity.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4 icon-dir" />
          </ItemActions>
        </a>
      </Item>
      <Item variant="outline" asChild>
        <a href="https://sonojs.com" target="_blank" rel="noopener noreferrer">
          <ItemContent>
            <ItemTitle>Documentation</ItemTitle>
            <ItemDescription>Opens in a new tab.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ExternalLinkIcon className="size-4" />
          </ItemActions>
        </a>
      </Item>
    </div>
  )
}
