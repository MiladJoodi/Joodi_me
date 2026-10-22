"use client"

import * as React from "react"

import { Progress } from "@sonojs/ui/components/progress"
import { Slider } from "@sonojs/ui/components/slider"

export function ProgressControlled() {
  const [value, setValue] = React.useState(40)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={value} />
      <Slider
        value={[value]}
        onValueChange={(next) => setValue(next[0] ?? 0)}
        max={100}
        step={1}
        aria-label="Progress value"
      />
      <p className="text-center text-sm text-muted-foreground tabular-nums">
        {value}%
      </p>
    </div>
  )
}
