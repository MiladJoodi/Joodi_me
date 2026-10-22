"use client"

import { ItalicIcon } from "lucide-react"

import { Toggle } from "@sonojs/ui/components/toggle"

export function ToggleWithText() {
  return (
    <Toggle aria-label="Toggle italic">
      <ItalicIcon data-icon="inline-start" />
      Italic
    </Toggle>
  )
}
