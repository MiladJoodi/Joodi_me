import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@sonojs/ui/components/avatar"
import { Bubble, BubbleContent } from "@sonojs/ui/components/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from "@sonojs/ui/components/message"

export function MessageGroupExample() {
  return (
    <MessageGroup className="max-w-md">
      <Message>
        <MessageAvatar />
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>I checked the registry addresses.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar />
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              The install failure is coming from the workspace package.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarImage src="/images/docs/03.webp" alt="Jamie" />
            <AvatarFallback>JC</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              Try clearing the cache and running the build again.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
