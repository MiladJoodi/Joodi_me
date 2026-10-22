"use client"

import { Label } from "@sonojs/ui/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@sonojs/ui/components/radio-group"

export function RadioGroupDisabled() {
  return (
    <RadioGroup defaultValue="option-one" disabled>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option-one" id="rd1" />
        <Label htmlFor="rd1">Option One</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option-two" id="rd2" />
        <Label htmlFor="rd2">Option Two</Label>
      </div>
    </RadioGroup>
  )
}
