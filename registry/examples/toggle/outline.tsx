"use client"

import { ItalicIcon } from "lucide-react"

import { Toggle } from "@sonojs/ui/components/toggle"

export function ToggleOutline() {
  return (
    <Toggle variant="outline" aria-label="Toggle italic">
      <ItalicIcon />
    </Toggle>
  )
}
