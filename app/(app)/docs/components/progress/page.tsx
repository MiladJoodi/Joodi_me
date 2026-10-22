import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "progress-default",
    title: "Basic",
    description: "Show task completion with a `value` from `0` to `100`.",
  },
  {
    name: "progress-label",
    title: "Label",
    description: "Pair with `Field` and a percentage for accessible status.",
    requires: ["field", "label", "separator"],
  },
  {
    name: "progress-controlled",
    title: "Controlled",
    description: "Drive the bar from local state (slider demo).",
  },
]

const usageSource = `import { Progress } from "@/components/ui/progress"

export function Example() {
  return <Progress value={33} />
}`

const compositionSource = `Progress`

export default async function ProgressDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Progress</h1>
        <p className="leading-relaxed text-muted-foreground">
          Displays an indicator showing the completion progress of a task.
          Fills from the inline start — works in LTR and RTL.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="progress" />

      <section className="space-y-3">
        <h2 className="text-h3">Composition</h2>
        <ComponentSource
          title="structure"
          lang="tsx"
          code={compositionSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="progress.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "value",
              type: "number | null | undefined",
              defaultValue: "—",
              description: "Completion from `0` to `100`. Omit for indeterminate when supported by the primitive.",
            },
            {
              name: "max",
              type: "number",
              defaultValue: "100",
              description: "Maximum value used for the accessible progress range.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: "—",
              description: "Merge extra Tailwind classes on the root track.",
            },
          ]}
        />
      </section>
    </article>
  )
}
