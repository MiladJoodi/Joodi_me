import { PlusIcon } from "lucide-react"

import { Button } from "@sonojs/ui/components/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@sonojs/ui/components/avatar"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@sonojs/ui/components/item"

const people = [
  {
    name: "Alex Rivera",
    email: "alex@example.com",
    src: "/images/docs/01.webp",
    fallback: "AR",
  },
  {
    name: "Jamie Chen",
    email: "jamie@example.com",
    src: "/images/docs/02.webp",
    fallback: "JC",
  },
  {
    name: "Taylor Brooks",
    email: "taylor@example.com",
    src: "/images/docs/03.webp",
    fallback: "TB",
  },
]

export function ItemGroupExample() {
  return (
    <ItemGroup className="max-w-md rounded-md border">
      {people.map((person, index) => (
        <div key={person.email}>
          <Item>
            <ItemMedia>
              <Avatar>
                <AvatarImage src={person.src} alt={person.name} />
                <AvatarFallback>{person.fallback}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{person.name}</ItemTitle>
              <ItemDescription>{person.email}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                aria-label={`Add ${person.name}`}
              >
                <PlusIcon />
              </Button>
            </ItemActions>
          </Item>
          {index < people.length - 1 ? <ItemSeparator /> : null}
        </div>
      ))}
    </ItemGroup>
  )
}
