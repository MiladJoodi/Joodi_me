"use client"

import { Slider } from "@sonojs/ui/components/slider"

export function SliderDisabled() {
  return (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      disabled
      className="w-full max-w-sm"
      aria-label="Disabled volume"
    />
  )
}
