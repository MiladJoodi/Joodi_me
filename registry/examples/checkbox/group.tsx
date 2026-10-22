"use client"

import * as React from "react"

import { Checkbox } from "@sonojs/ui/components/checkbox"
import { Label } from "@sonojs/ui/components/label"

const items = [
  { id: "recents", label: "Recents" },
  { id: "home", label: "Home" },
  { id: "applications", label: "Applications" },
  { id: "desktop", label: "Desktop" },
  { id: "downloads", label: "Downloads" },
  { id: "documents", label: "Documents" },
] as const

export function CheckboxGroup() {
  const [selected, setSelected] = React.useState<string[]>(["recents", "home"])

  return (
    <div className="grid w-full max-w-sm gap-3">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">
          Show these items on the desktop
        </p>
        <p className="text-sm text-muted-foreground">
          Select the items you want to show on the desktop.
        </p>
      </div>
      <div className="grid gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <Checkbox
              id={`desktop-${item.id}`}
              checked={selected.includes(item.id)}
              onCheckedChange={(checked) => {
                setSelected((prev) =>
                  checked
                    ? [...prev, item.id]
                    : prev.filter((value) => value !== item.id)
                )
              }}
            />
            <Label htmlFor={`desktop-${item.id}`} className="font-normal">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
