"use client"

import { Slider } from "@sonojs/ui/components/slider"

export function SliderRange() {
  return (
    <Slider
      defaultValue={[25, 75]}
      max={100}
      step={1}
      className="w-full max-w-sm"
      aria-label="Price range"
    />
  )
}
