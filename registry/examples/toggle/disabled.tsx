"use client"

import { UnderlineIcon } from "lucide-react"

import { Toggle } from "@sonojs/ui/components/toggle"

export function ToggleDisabled() {
  return (
    <Toggle aria-label="Toggle underline" disabled>
      <UnderlineIcon />
    </Toggle>
  )
}
