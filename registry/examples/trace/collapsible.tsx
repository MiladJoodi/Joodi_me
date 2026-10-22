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

export function TraceCollapsibleExample() {
  return (
    <Trace className="w-full max-w-md">
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Ran node --version</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock>
            <CodeBlockContent wrap>{`$ node --version
v24.18.0`}</CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
