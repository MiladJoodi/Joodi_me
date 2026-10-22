import {
  ComponentSource,
  ComponentVariantPreview,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "date-picker-default",
    title: "Basic",
    description:
      "Compose `Popover` + `Calendar` with `mode=\"single\"` to pick one date.",
    requires: ["popover", "button"],
    npmRequires: ["date-fns", "lucide-react"],
  },
  {
    name: "date-picker-range",
    title: "Range",
    description:
      'Use `mode="range"` and `numberOfMonths={2}` for a from–to selection.',
    requires: ["popover", "button"],
    npmRequires: ["date-fns", "lucide-react", "react-day-picker"],
  },
  {
    name: "date-picker-caption",
    title: "Date of Birth",
    description:
      'Set `captionLayout="dropdown"` for quick month and year jumps.',
    requires: ["popover", "button", "label"],
    npmRequires: ["date-fns", "lucide-react"],
  },
  {
    name: "date-picker-input",
    title: "Input",
    description:
      "Pair an `Input` with a calendar popover so users can type or pick.",
    requires: ["popover", "input"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "date-picker-time",
    title: "Time",
    description: "Add a `type=\"time\"` input next to the date trigger.",
    requires: ["popover", "button", "input", "label"],
    npmRequires: ["date-fns", "lucide-react"],
  },
]

const usageSource = `"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-56 justify-start text-start font-normal data-[empty=true]:text-muted-foreground"
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
}`

export default async function DatePickerDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Date Picker</h1>
        <p className="leading-relaxed text-muted-foreground">
          A date picker built by composing{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            Popover
          </code>{" "}
          and{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            Calendar
          </code>
          . There is no separate Date Picker root — install both pieces and
          wire them together.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="calendar" />

      <section className="space-y-3">
        <h2 className="text-h3">Popover</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Date pickers also need the popover overlay:
        </p>
        <ComponentSource
          title="CLI"
          lang="bash"
          code="npx @sonojs/ui@latest add popover"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Composition</h2>
        <ComponentSource
          title="structure"
          lang="tsx"
          code={`Popover
├── PopoverTrigger
└── PopoverContent
    └── Calendar`}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource
          title="date-picker.tsx"
          lang="tsx"
          code={usageSource}
        />
      </section>
    </article>
  )
}
