"use client"

import * as React from "react"

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
} from "@sonojs/ui/components/message-scroller"

const seed = [
  { id: "1", role: "assistant" as const, text: "How can I help you today?" },
  {
    id: "2",
    role: "user" as const,
    text: "I'm building a chat UI and scroll keeps jumping when replies stream.",
  },
  {
    id: "3",
    role: "assistant" as const,
    text: "Anchor each user turn near the top, then let the reply grow below it.",
  },
  {
    id: "4",
    role: "user" as const,
    text: "And if someone scrolls up to read earlier messages?",
  },
  {
    id: "5",
    role: "assistant" as const,
    text: "Release follow-output until they jump back to the latest reply.",
  },
]

export function MessageScrollerDefault() {
  const [messages] = React.useState(seed)

  return (
    <div className="h-80 w-full max-w-md overflow-hidden rounded-lg border">
      <MessageScrollerProvider defaultScrollPosition="end">
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
                        variant={message.role === "user" ? "default" : "muted"}
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
      </MessageScrollerProvider>
    </div>
  )
}
