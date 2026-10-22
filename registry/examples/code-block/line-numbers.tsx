import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@sonojs/ui/components/code-block"

const code = `{
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "styles/sonojs.css",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  },
  "registries": {
    "@sonojs": "https://sonojs.com/r/{name}.json"
  }
}`

export function CodeBlockLineNumbers() {
  return (
    <CodeBlock className="w-full max-w-lg">
      <CodeBlockHeader>
        <CodeBlockTitle>components.json</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="json" lineNumbers>
        {code}
      </CodeBlockContent>
    </CodeBlock>
  )
}
