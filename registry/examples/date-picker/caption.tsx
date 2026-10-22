"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@sonojs/ui/components/button"
import { Calendar } from "@sonojs/ui/components/calendar"
import { Label } from "@sonojs/ui/components/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@sonojs/ui/components/popover"

export function DatePickerCaption() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date>()

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="date-of-birth" className="px-0.5">
        Date of birth
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-of-birth"
            data-empty={!date}
            className="w-48 justify-between font-normal data-[empty=true]:text-muted-foreground"
          >
            {date ? format(date, "PPP") : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(next) => {
              setDate(next)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
