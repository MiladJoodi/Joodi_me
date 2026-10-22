"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@sonojs/ui/components/button"
import { Calendar } from "@sonojs/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@sonojs/ui/components/popover"

export function DatePickerRange() {
  const [range, setRange] = React.useState<DateRange>()

  const label =
    range?.from && range.to
      ? `${format(range.from, "LLL dd, y")} – ${format(range.to, "LLL dd, y")}`
      : range?.from
        ? format(range.from, "LLL dd, y")
        : "Pick a date range"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!range?.from}
          className="w-72 justify-start text-start font-normal data-[empty=true]:text-muted-foreground"
        >
          <CalendarIcon />
          <span>{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          defaultMonth={range?.from}
        />
      </PopoverContent>
    </Popover>
  )
}
