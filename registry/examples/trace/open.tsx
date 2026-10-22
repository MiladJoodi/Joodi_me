"use client"

import * as React from "react"
import { TerminalIcon } from "lucide-react"

import {
  CodeBlock,
  CodeBlockContent,
} from "@sonojs/ui/components/code-block"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@sonojs/ui/components/trace"

export function TraceOpen() {
  const running = false
  const [open, setOpen] = React.useState<boolean>()

  return (
    <Trace className="w-full max-w-md">
      <TraceCollapsible
        open={open ?? true}
        onOpenChange={setOpen}
      >
        <TraceCollapsibleTrigger>
          <TraceLine status={running ? "running" : undefined}>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Ran pnpm --version</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock>
            <CodeBlockContent wrap>{`$ pnpm --version
10.18.0`}</CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
