"use client"

import { toast } from "sonner"

import { Button } from "@sonojs/ui/components/button"

export function ToastDescription() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
        })
      }
    >
      Show toast
    </Button>
  )
}
