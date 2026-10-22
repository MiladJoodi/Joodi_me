"use client"

import { toast } from "sonner"

import { Button } from "@sonojs/ui/components/button"

export function SonnerDescription() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Monday, January 3rd at 6:00pm",
        })
      }
    >
      Show Toast
    </Button>
  )
}
