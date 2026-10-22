import { CopyIcon, RefreshCwIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"

import { Button } from "@sonojs/ui/components/button"
import { Bubble, BubbleContent } from "@sonojs/ui/components/bubble"
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@sonojs/ui/components/message"

export function MessageActions() {
  return (
    <Message className="max-w-md">
      <MessageContent>
        <Bubble variant="muted">
          <BubbleContent>
            The install failure is coming from the workspace package.
          </BubbleContent>
        </Bubble>
        <MessageFooter className="gap-1">
          <Button variant="ghost" size="icon-xs" aria-label="Copy">
            <CopyIcon />
          </Button>
          <Button variant="ghost" size="icon-xs" aria-label="Retry">
            <RefreshCwIcon />
          </Button>
          <Button variant="ghost" size="icon-xs" aria-label="Helpful">
            <ThumbsUpIcon />
          </Button>
          <Button variant="ghost" size="icon-xs" aria-label="Not helpful">
            <ThumbsDownIcon />
          </Button>
        </MessageFooter>
      </MessageContent>
    </Message>
  )
}
