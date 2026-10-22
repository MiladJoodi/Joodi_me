"use client"

import { toast } from "sonner"

import { Button } from "@sonojs/ui/components/button"

export function ToastDefault() {
  return (
    <Button
      variant="outline"
      onClick={() => toast("Event has been created.")}
    >
      Show toast
    </Button>
  )
}
