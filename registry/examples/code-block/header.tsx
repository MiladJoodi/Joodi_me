import { TerminalIcon } from "lucide-react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@sonojs/ui/components/code-block"

const output = `$ npm run registry:build

> sonojs@0.1.0 registry:build
> node scripts/build-registry.mjs

Wrote 52 files to public/r (version 0.1.0+26ae8fb3b213)`

export function CodeBlockHeaderExample() {
  return (
    <CodeBlock className="w-full max-w-lg">
      <CodeBlockHeader>
        <CodeBlockTitle>
          <TerminalIcon />
          Terminal
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={output} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="bash">{output}</CodeBlockContent>
    </CodeBlock>
  )
}
