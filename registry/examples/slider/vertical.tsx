"use client"

import { Slider } from "@sonojs/ui/components/slider"

export function SliderVertical() {
  return (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      orientation="vertical"
      className="mx-auto"
      aria-label="Brightness"
    />
  )
}
