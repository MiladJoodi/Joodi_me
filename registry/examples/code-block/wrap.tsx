import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@sonojs/ui/components/code-block"

const output = `Error: Failed to fetch registry item.
GET http://localhost:3000/r/calendar.json returned 404.
Run npm run registry:build, confirm the item exists in public/r, then retry: npx @sonojs/ui@latest add calendar --registry http://localhost:3000/r --overwrite`

export function CodeBlockWrap() {
  return (
    <CodeBlock className="w-full max-w-lg">
      <CodeBlockHeader>
        <CodeBlockTitle>CLI</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={output} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="bash" wrap>
        {output}
      </CodeBlockContent>
    </CodeBlock>
  )
}
