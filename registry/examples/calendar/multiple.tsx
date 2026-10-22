"use client"

import { Calendar } from "@sonojs/ui/components/calendar"
import { Card, CardContent } from "@sonojs/ui/components/card"

export function CalendarMultiple() {
  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar mode="multiple" />
      </CardContent>
    </Card>
  )
}
