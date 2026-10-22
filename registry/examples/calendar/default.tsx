"use client"

import React from "react"

import { Calendar } from "@sonojs/ui/components/calendar"

export function CalendarDefault() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
      captionLayout="dropdown"
    />
  )
}
