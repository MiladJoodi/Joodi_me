import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "code-block-syntax",
    title: "Syntax Highlighting",
    description:
      'Set `language` on `CodeBlockContent` (e.g. `language="tsx"`) for Dark+ colors.',
  },
  {
    name: "code-block-default",
    title: "Basic",
    description: 'CLI output with `language="bash"`.',
  },
  {
    name: "code-block-header",
    title: "Header",
    description:
      "`CodeBlockHeader` with a title and `CodeBlockCopyButton`.",
  },
  {
    name: "code-block-line-numbers",
    title: "Line Numbers",
    description: 'Combine `language` with `lineNumbers` for numbered source.',
  },
  {
    name: "code-block-wrap",
    title: "Wrap",
    description: "Set `wrap` so long error lines break instead of scrolling.",
  },
  {
    name: "code-block-diff",
    title: "Diff",
    description:
      'Highlight with `useHighlightedCode`, then mark lines `added` / `removed`.',
    requires: ["use-highlighted-code"],
  },
  {
    name: "code-block-size",
    title: "Size",
    description: 'Use `size="sm"` for compact terminal traces.',
  },
  {
    name: "code-block-destructive",
    title: "Destructive",
    description: 'Use `variant="destructive"` for compile errors and failures.',
  },
]

const usageSource = `import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"

export function Example() {
  const code = \`import { Button } from "@/components/ui/button"

export function SaveBar() {
  return <Button>Save changes</Button>
}\`

  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>save-bar.tsx</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="tsx" lineNumbers>
        {code}
      </CodeBlockContent>
    </CodeBlock>
  )
}`

export default async function CodeBlockDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Code Block</h1>
        <p className="leading-relaxed text-muted-foreground">
          Displays code, terminal output and diffs with an optional header,
          line numbers and a copy button. Pass{" "}
          <code className="sono-inline-code">language</code> for Shiki Dark+
          highlighting. Content stays{" "}
          <code className="sono-inline-code">dir=&quot;ltr&quot;</code>.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} showDirection={false} />
      </section>

      <DocsInstallation name="code-block" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="code-block.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "variant",
              type: '"default" | "destructive"',
              defaultValue: '"default"',
              description: "Tone of the block surface.",
            },
            {
              name: "size",
              type: '"default" | "sm"',
              defaultValue: '"default"',
              description: "Density. Small suits tool / trace output.",
            },
            {
              name: "language",
              type: "string",
              defaultValue: "—",
              description:
                "On CodeBlockContent — Shiki id (`tsx`, `json`, `bash`, …).",
            },
            {
              name: "wrap",
              type: "boolean",
              defaultValue: "false",
              description: "On CodeBlockContent — wrap long lines.",
            },
            {
              name: "lineNumbers",
              type: "boolean",
              defaultValue: "false",
              description: "On CodeBlockContent — show a line number gutter.",
            },
            {
              name: "startLine",
              type: "number",
              defaultValue: "1",
              description: "On CodeBlockContent — first line number in the gutter.",
            },
          ]}
        />
      </section>
    </article>
  )
}
