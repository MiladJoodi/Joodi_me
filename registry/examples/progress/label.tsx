"use client"

import { Field, FieldLabel } from "@sonojs/ui/components/field"
import { Progress } from "@sonojs/ui/components/progress"

export function ProgressLabel() {
  const value = 66

  return (
    <Field className="w-full max-w-sm gap-2">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel>Upload progress</FieldLabel>
        <span className="text-sm text-muted-foreground tabular-nums">
          {value}%
        </span>
      </div>
      <Progress value={value} />
    </Field>
  )
}
