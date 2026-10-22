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

export function MessageDefault() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarImage src="/images/docs/01.webp" alt="Oliver" />
            <AvatarFallback>OL</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>How can I help you today?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>It&apos;s 4:55 PM. On a Friday.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  )
}
