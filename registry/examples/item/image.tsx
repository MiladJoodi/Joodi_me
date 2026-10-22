import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@sonojs/ui/components/item"

export function ItemImage() {
  return (
    <Item variant="outline" className="max-w-lg">
      <ItemMedia variant="image">
        <img src="/images/docs/01.webp" alt="Album cover" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Midnight City</ItemTitle>
        <ItemDescription>Album · Electronic · 2024</ItemDescription>
      </ItemContent>
    </Item>
  )
}
