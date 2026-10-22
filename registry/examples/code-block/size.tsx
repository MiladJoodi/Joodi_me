import { TerminalIcon } from "lucide-react"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@sonojs/ui/components/code-block"

const output = `$ npx @sonojs/ui@latest add checkbox field label --overwrite
  + components/ui/checkbox.tsx
  + components/ui/field.tsx
  + components/ui/label.tsx
Done.`

export function CodeBlockSize() {
  return (
    <CodeBlock size="sm" className="w-full max-w-lg">
      <CodeBlockHeader>
        <CodeBlockTitle>
          <TerminalIcon />
          Terminal
        </CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent language="bash">{output}</CodeBlockContent>
    </CodeBlock>
  )
}
