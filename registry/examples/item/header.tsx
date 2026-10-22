import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@sonojs/ui/components/item"

export function ItemHeaderExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>sono-1.5-sm</ItemTitle>
          <span className="text-xs text-muted-foreground">12k ctx</span>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>Everyday tasks and UI generation.</ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-xs text-muted-foreground">Fast</span>
          <span className="text-xs font-medium">$0.002 / 1k</span>
        </ItemFooter>
      </Item>
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>sono-1.5-lg</ItemTitle>
          <span className="text-xs text-muted-foreground">128k ctx</span>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>Advanced reasoning and longer context.</ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-xs text-muted-foreground">Balanced</span>
          <span className="text-xs font-medium">$0.008 / 1k</span>
        </ItemFooter>
      </Item>
    </div>
  )
}
