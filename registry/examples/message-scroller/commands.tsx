"use client"

import * as React from "react"

import { Button } from "@sonojs/ui/components/button"
import { Bubble, BubbleContent } from "@sonojs/ui/components/bubble"
import {
  Message,
  MessageContent,
} from "@sonojs/ui/components/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@sonojs/ui/components/message-scroller"

const messages = [
  { id: "a", role: "user" as const, text: "Where should a saved thread open?" },
  {
    id: "b",
    role: "assistant" as const,
    text: "Prefer the last anchor — usually the latest user turn — not the absolute bottom.",
  },
  { id: "c", role: "user" as const, text: "Can I jump to any message?" },
  {
    id: "d",
    role: "assistant" as const,
    text: "Yes. Call scrollToMessage with a stable messageId from outside the list.",
  },
  { id: "e", role: "user" as const, text: "Show me the end of this demo." },
  {
    id: "f",
    role: "assistant" as const,
    text: "Use scrollToEnd, or the floating jump button when you have scrolled away.",
  },
]

function JumpControls() {
  const { scrollToMessage, scrollToEnd, scrollToStart } = useMessageScroller()

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => scrollToStart()}
      >
        Start
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => scrollToMessage("c")}
      >
        Jump to #c
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => scrollToEnd()}
      >
        End
      </Button>
    </div>
  )
}

export function MessageScrollerCommands() {
  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <div className="flex w-full max-w-md flex-col gap-3">
        <JumpControls />
        <div className="h-72 overflow-hidden rounded-lg border">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent>
                {messages.map((message) => (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === "user"}
                  >
                    <Message align={message.role === "user" ? "end" : "start"}>
                      <MessageContent>
                        <Bubble
                          variant={
                            message.role === "user" ? "default" : "muted"
                          }
                          align={message.role === "user" ? "end" : "start"}
                        >
                          <BubbleContent>{message.text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </div>
      </div>
    </MessageScrollerProvider>
  )
}
