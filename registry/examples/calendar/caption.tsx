"use client"

import { Calendar } from "@winkui/ui/components/calendar"

export function CalendarCaption() {
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      className="rounded-lg border"
    />
  )
}
