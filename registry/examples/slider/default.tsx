"use client"

import { Slider } from "@sonojs/ui/components/slider"

export function SliderDefault() {
  return (
    <Slider
      defaultValue={[33]}
      max={100}
      step={1}
      className="w-full max-w-sm"
      aria-label="Volume"
    />
  )
}
