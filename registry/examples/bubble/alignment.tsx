import { Bubble, BubbleContent } from "@winkui/ui/components/bubble"

export function BubbleAlignment() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-4">
      <Bubble variant="muted">
        <BubbleContent>
          This bubble is aligned to the start. This is the default alignment.
        </BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>
          This bubble is aligned to the end. Use this for user messages.
        </BubbleContent>
      </Bubble>
    </div>
  )
}
