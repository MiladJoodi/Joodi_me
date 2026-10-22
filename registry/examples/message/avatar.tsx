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
} from "@sonojs/ui/components/message"

export function MessageAvatarExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarImage src="/images/docs/02.webp" alt="Alex" />
            <AvatarFallback>AX</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Can you share the exact error?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>
          <Avatar>
            <AvatarImage src="/images/docs/01.webp" alt="You" />
            <AvatarFallback>YO</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble>
            <BubbleContent>Here&apos;s the error from the logs.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  )
}
