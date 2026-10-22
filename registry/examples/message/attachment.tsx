import { FileTextIcon } from "lucide-react"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@sonojs/ui/components/attachment"
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

export function MessageAttachmentExample() {
  return (
    <Message className="max-w-md">
      <MessageAvatar>
        <Avatar>
          <AvatarImage src="/images/docs/02.webp" alt="Alex" />
          <AvatarFallback>AX</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <Bubble variant="muted">
          <BubbleContent>Here&apos;s the report from this morning.</BubbleContent>
        </Bubble>
        <Attachment className="max-w-xs">
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>weekly-report.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 248 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </MessageContent>
    </Message>
  )
}
