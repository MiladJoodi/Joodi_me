"use client"

import { useHighlightedCode } from "@sonojs/ui/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@sonojs/ui/components/code-block"

const value = `function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "size-4 cursor-pointer rounded-[4px] border border-input",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}`

/** Plain lines fed to the highlighter (final file after the change). */
const highlightedSource = `function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "size-4 rounded-[4px] border border-input",
        "size-4 cursor-pointer rounded-[4px] border border-input",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}`

const lineVariants: Array<"default" | "added" | "removed" | undefined> = [
  undefined,
  undefined,
  undefined,
  undefined,
  "removed",
  "added",
  "added",
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
]

export function CodeBlockDiff() {
  const lines = useHighlightedCode(highlightedSource, "tsx")

  return (
    <CodeBlock className="w-full max-w-lg">
      <CodeBlockHeader>
        <CodeBlockTitle>components/ui/checkbox.tsx</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={value} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers>
        {lines.map((line, index) => (
          <CodeBlockLine key={index} variant={lineVariants[index] ?? "default"}>
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}
