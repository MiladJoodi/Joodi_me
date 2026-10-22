import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "slider-default",
    title: "Basic",
    description: "Pick a value from a continuous range.",
  },
  {
    name: "slider-range",
    title: "Range",
    description: "Pass two values for a dual-thumb range.",
  },
  {
    name: "slider-vertical",
    title: "Vertical",
    description: 'Set `orientation="vertical"` for a tall control.',
  },
  {
    name: "slider-disabled",
    title: "Disabled",
    description: "Use `disabled` to block interaction.",
  },
]

const usageSource = `import { Slider } from "@/components/ui/slider"

export function Example() {
  return <Slider defaultValue={[33]} max={100} step={1} />
}`

const directionSource = `import { Slider } from "@/components/ui/slider"

// Inherits writing direction from DirectionProvider / <html dir>.
// In RTL the track fills from the inline start (right) and arrow keys flip.
<Slider defaultValue={[40]} />

// Optional override:
<Slider dir="rtl" defaultValue={[40]} />`

const compositionSource = `Slider`

export default async function SliderDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Slider</h1>
        <p className="leading-relaxed text-muted-foreground">
          An input where the user selects a value from within a given range.
          Writing direction is passed through to Radix so the axis, range fill,
          and keyboard arrows follow LTR/RTL — toggle direction in the preview.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="slider" />

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
        <ComponentSource title="slider.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Direction</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          SonoJS reads direction via{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            useDirection
          </code>{" "}
          and sets{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            dir
          </code>{" "}
          on the slider root. Min sits on the inline start; max on the inline
          end.
        </p>
        <ComponentSource
          title="direction.tsx"
          lang="tsx"
          code={directionSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "value",
              type: "number[]",
              defaultValue: "—",
              description: "Controlled thumb values (one or more).",
            },
            {
              name: "defaultValue",
              type: "number[]",
              defaultValue: "—",
              description: "Uncontrolled initial values.",
            },
            {
              name: "onValueChange",
              type: "(value: number[]) => void",
              defaultValue: "—",
              description: "Called while a thumb moves.",
            },
            {
              name: "min",
              type: "number",
              defaultValue: "0",
              description: "Minimum value.",
            },
            {
              name: "max",
              type: "number",
              defaultValue: "100",
              description: "Maximum value.",
            },
            {
              name: "step",
              type: "number",
              defaultValue: "1",
              description: "Increment between values.",
            },
            {
              name: "orientation",
              type: '"horizontal" | "vertical"',
              defaultValue: '"horizontal"',
              description: "Slider axis.",
            },
            {
              name: "dir",
              type: '"ltr" | "rtl"',
              defaultValue: "inherited",
              description:
                "Writing direction. Defaults from `useDirection` / `<html dir>`.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disable all thumbs.",
            },
          ]}
        />
      </section>
    </article>
  )
}
