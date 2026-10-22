import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@sonojs/ui/components/code-block"

const output = `app/page.tsx:3:26 - error TS2307: Cannot find module '@/components/ui/calendar' or its corresponding type declarations.

3 import { Calendar } from "@/components/ui/calendar"
                           ~~~~~~~~~~~~~~~~~~~~~~~~~~

Found 1 error in app/page.tsx:3

Hint: run npx @sonojs/ui@latest add calendar`

export function CodeBlockDestructive() {
  return (
    <CodeBlock variant="destructive" className="w-full max-w-lg">
      <CodeBlockHeader>
        <CodeBlockTitle>TypeScript</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={output} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="typescript">{output}</CodeBlockContent>
    </CodeBlock>
  )
}
