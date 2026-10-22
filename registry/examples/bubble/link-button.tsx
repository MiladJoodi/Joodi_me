"use client"

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from "@sonojs/ui/components/bubble"

export function BubbleLinkButton() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-4">
      <Bubble variant="muted">
        <BubbleContent>How can I help you today?</BubbleContent>
      </Bubble>
      <BubbleGroup>
        <Bubble variant="tinted" align="end">
          <BubbleContent asChild>
            <button type="button" className="cursor-pointer">
              I forgot my password
            </button>
          </BubbleContent>
        </Bubble>
        <Bubble variant="tinted" align="end">
          <BubbleContent asChild>
            <button type="button" className="cursor-pointer">
              I need help with my subscription
            </button>
          </BubbleContent>
        </Bubble>
        <Bubble variant="tinted" align="end">
          <BubbleContent asChild>
            <button type="button" className="cursor-pointer">
              Something else. Talk to a human.
            </button>
          </BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
