"use client"

import { Label } from "@sonojs/ui/components/label"
import { Switch } from "@sonojs/ui/components/switch"

export function SwitchSize() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch id="switch-sm" size="sm" defaultChecked />
        <Label htmlFor="switch-sm">Small</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="switch-default" defaultChecked />
        <Label htmlFor="switch-default">Default</Label>
      </div>
    </div>
  )
}
