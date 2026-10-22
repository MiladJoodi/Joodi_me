import { MessageSquareIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@sonojs/ui/components/avatar"
import { Button } from "@sonojs/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@sonojs/ui/components/empty"

export function EmptyAvatar() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Avatar size="lg">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </EmptyMedia>
        <EmptyTitle>User is offline</EmptyTitle>
        <EmptyDescription>
          This user is currently offline. Leave a message or try again later.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">
          <MessageSquareIcon />
          Leave a message
        </Button>
      </EmptyContent>
    </Empty>
  )
}
