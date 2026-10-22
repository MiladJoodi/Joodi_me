import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
  type VariantExample,
} from "@/components/docs"
import { highlightCode } from "@/lib/highlight-code"

const calendarSources: Record<string, string> = {
  "calendar-default": `"use client"

import React from "react"

import { Calendar } from "@/components/ui/calendar"

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
}`,
  "calendar-basic": `"use client"

import { Calendar } from "@/components/ui/calendar"

export function CalendarBasic() {
  return <Calendar mode="single" className="rounded-lg border" />
}`,
  "calendar-range": `"use client"

import React from "react"
import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

export function CalendarRange() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  })

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
        />
      </CardContent>
    </Card>
  )
}`,
  "calendar-caption": `"use client"

import { Calendar } from "@/components/ui/calendar"

export function CalendarCaption() {
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      className="rounded-lg border"
    />
  )
}`,
  "calendar-presets": `"use client"

import React from "react"
import { addDays } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function CalendarPresets() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 12)
  )
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )

  return (
    <Card className="mx-auto w-fit max-w-[300px] gap-0 py-4">
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          fixedWeeks
          className="p-0 [--cell-size:--spacing(9.5)]"
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t">
        {[
          { label: "Today", value: 0 },
          { label: "Tomorrow", value: 1 },
          { label: "In 3 days", value: 3 },
          { label: "In a week", value: 7 },
          { label: "In 2 weeks", value: 14 },
        ].map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              const newDate = addDays(new Date(), preset.value)
              setDate(newDate)
              setCurrentMonth(
                new Date(newDate.getFullYear(), newDate.getMonth(), 1)
              )
            }}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  )
}`,
  "calendar-time": `"use client"

import React from "react"
import { Clock2Icon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function CalendarTime() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12)
  )

  return (
    <Card className="mx-auto w-fit gap-0 py-4">
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
        />
      </CardContent>
      <CardFooter className="border-t bg-card">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-from"
                type="time"
                step="1"
                defaultValue="10:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="time-to">End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-to"
                type="time"
                step="1"
                defaultValue="12:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  )
}`,
  "calendar-booked-dates": `"use client"

import React from "react"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

export function CalendarBookedDates() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 3)
  )
  const bookedDates = Array.from(
    { length: 15 },
    (_, i) => new Date(new Date().getFullYear(), 1, 12 + i)
  )

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          disabled={bookedDates}
          modifiers={{ booked: bookedDates }}
          modifiersClassNames={{
            booked: "[&>button]:line-through opacity-100",
          }}
        />
      </CardContent>
    </Card>
  )
}`,
  "calendar-custom-days": `"use client"

import React from "react"
import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"

import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

export function CalendarCustomDays() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 11, 8),
    to: addDays(new Date(new Date().getFullYear(), 11, 8), 10),
  })

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}
          captionLayout="dropdown"
          className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          formatters={{
            formatMonthDropdown: (date) =>
              date.toLocaleString("default", { month: "long" }),
          }}
          components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const isWeekend =
                day.date.getDay() === 0 || day.date.getDay() === 6
              return (
                <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                  {children}
                  {!modifiers.outside && (
                    <span>{isWeekend ? "$120" : "$100"}</span>
                  )}
                </CalendarDayButton>
              )
            },
          }}
        />
      </CardContent>
    </Card>
  )
}`,
  "calendar-week-numbers": `"use client"

import React from "react"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

export function CalendarWeekNumbers() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 3)
  )

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          showWeekNumber
        />
      </CardContent>
    </Card>
  )
}`,
  "calendar-multiple": `"use client"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

export function CalendarMultiple() {
  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar mode="multiple" />
      </CardContent>
    </Card>
  )
}`,
  "calendar-hijri": `// In calendar.tsx, replace:
//   import { DayPicker } from "react-day-picker"
// with:
//   import { DayPicker } from "react-day-picker/persian"

"use client"

import React from "react"

import { Calendar } from "@/components/ui/calendar"

export function CalendarHijri() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <div dir="rtl">
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
      />
    </div>
  )
}`,
}

const usageSource = `"use client"

import React from "react"

import { Calendar } from "@/components/ui/calendar"

export function Example() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
    />
  )
}`

async function getCalendarExamples(): Promise<VariantExample[]> {
  const base: VariantExample[] = [
    {
      name: "calendar-default",
      title: "Default",
      description: 'Single date selection with `captionLayout="dropdown"`.',
    },
    {
      name: "calendar-basic",
      title: "Basic",
      description: 'A minimal calendar with `mode="single"`.',
    },
    {
      name: "calendar-range",
      title: "Range Calendar",
      description: 'Use `mode="range"` to enable range selection.',
      requires: ["card"],
    },
    {
      name: "calendar-caption",
      title: "Month and Year Selector",
      description:
        'Use `captionLayout="dropdown"` to show month and year dropdowns.',
    },
    {
      name: "calendar-presets",
      title: "Presets",
      description: "Quick-select common ranges beside the calendar.",
      requires: ["card"],
    },
    {
      name: "calendar-time",
      title: "Date and Time",
      description: "Pick a date and pair it with a time field.",
      requires: ["card", "field", "input-group"],
      npmRequires: ["lucide-react"],
    },
    {
      name: "calendar-booked-dates",
      title: "Booked Dates",
      description: "Disable or mark dates that are already booked.",
      requires: ["card"],
    },
    {
      name: "calendar-custom-days",
      title: "Custom Days",
      description: "Customize day cells for special rendering.",
      requires: ["card"],
    },
    {
      name: "calendar-week-numbers",
      title: "Week Numbers",
      description: "Show ISO week numbers alongside the month grid.",
      requires: ["card"],
    },
    {
      name: "calendar-multiple",
      title: "Multiple",
      description: 'Use `mode="multiple"` to select several dates.',
      requires: ["card"],
    },
    {
      name: "calendar-hijri",
      title: "Persian / Hijri",
      description: "Render the calendar with a Persian (Jalali) locale.",
      npmRequires: ["lucide-react"],
    },
  ]

  return Promise.all(
    base.map(async (item) => {
      const code = calendarSources[item.name]
      return {
        ...item,
        code,
        codeHtml: await highlightCode(code),
      }
    })
  )
}

export default async function CalendarDocsPage() {
  const examples = await getCalendarExamples()

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Calendar</h1>
        <p className="leading-relaxed text-muted-foreground">
          A calendar component that allows users to select a date or a range of
          dates. Built on React DayPicker.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="calendar" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="calendar.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "mode",
              type: '"single" | "multiple" | "range"',
              defaultValue: "-",
              description: "Selection mode from React DayPicker.",
            },
            {
              name: "captionLayout",
              type: '"label" | "dropdown" | "dropdown-months" | "dropdown-years"',
              defaultValue: '"label"',
              description: "Month/year caption presentation.",
            },
            {
              name: "buttonVariant",
              type: "Button variant",
              defaultValue: '"ghost"',
              description: "Variant for previous/next nav buttons.",
            },
            {
              name: "showOutsideDays",
              type: "boolean",
              defaultValue: "true",
              description: "Show days from adjacent months.",
            },
          ]}
        />
      </section>
    </article>
  )
}
