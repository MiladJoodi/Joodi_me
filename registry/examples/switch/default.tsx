"use client"

import { Label } from "@sonojs/ui/components/label"
import { Switch } from "@sonojs/ui/components/switch"

export function SwitchDefault() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="airplane-mode" defaultChecked />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
