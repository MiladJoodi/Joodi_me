"use client"

import { Label } from "@sonojs/ui/components/label"
import { Switch } from "@sonojs/ui/components/switch"

export function SwitchDisabled() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch id="switch-off-disabled" disabled />
        <Label htmlFor="switch-off-disabled">Disabled off</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="switch-on-disabled" disabled defaultChecked />
        <Label htmlFor="switch-on-disabled">Disabled on</Label>
      </div>
    </div>
  )
}
