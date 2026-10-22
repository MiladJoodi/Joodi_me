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
} from "@sonojs/ui/components/message-scroller"

export function MessageScrollerAutoScroll() {
  const [text, setText] = React.useState("")
  const [streaming, setStreaming] = React.useState(false)

  const script =
    "Streaming pins the viewport to the live edge while you stay there. Scroll up and follow-output releases until you jump back."

  function startStream() {
    if (streaming) return
    setText("")
    setStreaming(true)
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setText(script.slice(0, i))
      if (i >= script.length) {
        window.clearInterval(id)
        setStreaming(false)
      }
    }, 28)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="h-72 overflow-hidden rounded-lg border">
        <MessageScrollerProvider autoScroll defaultScrollPosition="end">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent>
                <MessageScrollerItem messageId="prompt" scrollAnchor>
                  <Message align="end">
                    <MessageContent>
                      <Bubble align="end">
                        <BubbleContent>
                          Summarize how auto-scroll should behave.
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
                <MessageScrollerItem messageId="reply">
                  <Message align="start">
                    <MessageContent>
                      <Bubble variant="muted" align="start">
                        <BubbleContent>
                          {text || (streaming ? "…" : "Press Stream to begin.")}
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={startStream}
        disabled={streaming}
      >
        {streaming ? "Streaming…" : "Stream"}
      </Button>
    </div>
  )
}
