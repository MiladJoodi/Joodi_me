import {
  CodeBlock,
  CodeBlockContent,
} from "@sonojs/ui/components/code-block"

const output = `$ npx @sonojs/ui@latest add button
✔ Checking registry.
✔ Installing dependencies.
✔ Created 1 file:

  + components/ui/button.tsx

Done.`

export function CodeBlockDefault() {
  return (
    <CodeBlock className="w-full max-w-lg">
      <CodeBlockContent language="bash">{output}</CodeBlockContent>
    </CodeBlock>
  )
}
