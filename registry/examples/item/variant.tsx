import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@sonojs/ui/components/item"

export function ItemVariant() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Item>
        <ItemContent>
          <ItemTitle>Default</ItemTitle>
          <ItemDescription>
            Transparent background with no border.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Outline</ItemTitle>
          <ItemDescription>Outlined style with a visible border.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Muted</ItemTitle>
          <ItemDescription>Muted background for secondary content.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
