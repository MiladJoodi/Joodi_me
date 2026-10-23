import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "switch-default",
    title: "Basic",
    description: "Toggle a binary setting. Pair with a `Label`.",
    requires: ["label"],
  },
  {
    name: "switch-description",
    title: "Description",
    description: "Add helper copy with `Field` next to the control.",
    requires: ["field", "label", "separator"],
  },
  {
    name: "switch-size",
    title: "Size",
    description: 'Use `size="sm"` for a denser control.',
    requires: ["label"],
  },
  {
    name: "switch-disabled",
    title: "Disabled",
    description: "Pass `disabled` to block interaction.",
    requires: ["label"],
  },
]

const usageSource = `import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}`

const directionSource = `import { Switch } from "@/components/ui/switch"

// Thumb sits on the inline start when off, slides to the inline end when on.
// In RTL that means right → left. Toggle LTR/RTL in the preview to verify.
<Switch defaultChecked />`

const compositionSource = `Switch`

export default async function SwitchDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Switch</h1>
        <p className="leading-relaxed text-muted-foreground">
          A control that toggles between checked and not checked. The thumb
          travels along the inline axis — off at{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            start
          </code>
          , on at{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            end
          </code>{" "}
          — so it flips correctly in RTL.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="switch" />

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
        <ComponentSource title="switch.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Direction</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          SonoJS sets{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            dir
          </code>{" "}
          from{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            useDirection
          </code>{" "}
          and slides the thumb with{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            translate-x
          </code>{" "}
          (flipped in RTL) so it sits tight to the edges and checked moves toward
          the inline end.
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
              name: "checked",
              type: "boolean",
              defaultValue: "—",
              description: "Controlled checked state.",
            },
            {
              name: "defaultChecked",
              type: "boolean",
              defaultValue: "—",
              description: "Uncontrolled initial checked state.",
            },
            {
              name: "onCheckedChange",
              type: "(checked: boolean) => void",
              defaultValue: "—",
              description: "Called when the checked state changes.",
            },
            {
              name: "size",
              type: '"sm" | "default"',
              defaultValue: '"default"',
              description: "Control height/width scale.",
            },
            {
              name: "dir",
              type: '"ltr" | "rtl"',
              defaultValue: "inherited",
              description:
                "Writing direction for thumb travel. Defaults from `useDirection`.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disable the switch.",
            },
          ]}
        />
      </section>
    </article>
  )
}
