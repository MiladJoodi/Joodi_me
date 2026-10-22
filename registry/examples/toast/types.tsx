"use client"

import { toast } from "sonner"

import { Button } from "@sonojs/ui/components/button"

export function ToastTypes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="outline" onClick={() => toast("Event created")}>
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Event created")}
      >
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.info("Be at ease")}>
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Event starting soon")}
      >
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.error("Event failed")}>
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const id = toast.loading("Loading…")
          setTimeout(() => {
            toast.success("Done", { id })
          }, 2000)
        }}
      >
        Promise
      </Button>
    </div>
  )
}
