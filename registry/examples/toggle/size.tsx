"use client"

import { BoldIcon } from "lucide-react"

import { Toggle } from "@sonojs/ui/components/toggle"

export function ToggleSize() {
  return (
    <div className="flex items-center gap-2">
      <Toggle size="sm" aria-label="Toggle bold small">
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Toggle bold">
        <BoldIcon />
      </Toggle>
      <Toggle size="lg" aria-label="Toggle bold large">
        <BoldIcon />
      </Toggle>
    </div>
  )
}
