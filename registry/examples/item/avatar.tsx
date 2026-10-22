import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@sonojs/ui/components/avatar"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@sonojs/ui/components/item"

export function ItemAvatar() {
  return (
    <Item variant="outline" className="max-w-lg">
      <ItemMedia>
        <Avatar>
          <AvatarImage src="/images/docs/01.webp" alt="Evil Rabbit" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Evil Rabbit</ItemTitle>
        <ItemDescription>Last seen 5 months ago</ItemDescription>
      </ItemContent>
    </Item>
  )
}
