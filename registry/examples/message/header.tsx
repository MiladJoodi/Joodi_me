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
  MessageFooter,
  MessageHeader,
} from "@sonojs/ui/components/message"

export function MessageHeaderExample() {
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
          <MessageHeader>Oliver</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>
              Send the report to the team. Ping Alex if you need help.
            </BubbleContent>
          </Bubble>
          <MessageFooter>Delivered</MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>On it — sending now.</BubbleContent>
          </Bubble>
          <MessageFooter>Read</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  )
}
