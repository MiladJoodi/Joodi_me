import { ArrowUpRightIcon, ChevronRightIcon, FileTextIcon } from "lucide-react"

import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@sonojs/ui/components/trace"

export function TraceLink() {
  return (
    <Trace className="w-full max-w-md">
      <TraceLine>
        <TraceIcon>
          <FileTextIcon />
        </TraceIcon>
        <TraceTitle>Read apps/v4/lib/docs.ts</TraceTitle>
        <TraceIcon>
          <ChevronRightIcon className="icon-dir" />
        </TraceIcon>
      </TraceLine>
      <a
        href="https://docs.astro.build"
        target="_blank"
        rel="noreferrer"
      >
        <TraceLine>
          <TraceTitle>
            Install Astro | docs.astro.build
            <span className="sr-only"> (opens in a new tab)</span>
          </TraceTitle>
          <TraceIcon>
            <ArrowUpRightIcon />
          </TraceIcon>
        </TraceLine>
      </a>
    </Trace>
  )
}
