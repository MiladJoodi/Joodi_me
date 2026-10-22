import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@sonojs/ui/components/code-block"

const code = `import { Button } from "@/components/ui/button"

export function SaveBar() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Save changes</Button>
    </div>
  )
}`

export function CodeBlockSyntax() {
  return (
    <CodeBlock className="w-full max-w-lg">
      <CodeBlockHeader>
        <CodeBlockTitle>components/save-bar.tsx</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="tsx" lineNumbers>
        {code}
      </CodeBlockContent>
    </CodeBlock>
  )
}
