"use client"

import { BoldIcon } from "lucide-react"

import { Toggle } from "@sonojs/ui/components/toggle"

export function ToggleDefault() {
  return (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  )
}
