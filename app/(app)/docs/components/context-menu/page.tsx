import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "context-menu-default",
    title: "Basic",
    description: "Right-click the area to open a simple menu.",
  },
  {
    name: "context-menu-shortcuts",
    title: "Shortcuts",
    description: "Show keyboard hints with `ContextMenuShortcut`.",
  },
  {
    name: "context-menu-submenu",
    title: "Submenu",
    description: "Nest items with `ContextMenuSub` and `ContextMenuSubTrigger`.",
  },
  {
    name: "context-menu-checkboxes",
    title: "Checkboxes",
    description: "Toggle options with `ContextMenuCheckboxItem`.",
  },
  {
    name: "context-menu-radio",
    title: "Radio",
    description: "Pick one value with `ContextMenuRadioGroup`.",
  },
  {
    name: "context-menu-destructive",
    title: "Destructive",
    description: 'Use `variant="destructive"` for irreversible actions.',
  },
]

const usageSource = `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>Right click</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}`

export default async function ContextMenuDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Context Menu</h1>
        <p className="leading-relaxed text-muted-foreground">
          Displays a menu of actions or options that appears when the user
          right-clicks an element.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="context-menu" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource
          title="context-menu.tsx"
          lang="tsx"
          code={usageSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "inset",
              type: "boolean",
              defaultValue: "—",
              description:
                "On Item / SubTrigger / Label / Checkbox / Radio — indent to align with icons.",
            },
            {
              name: "variant",
              type: '"default" | "destructive"',
              defaultValue: '"default"',
              description: "On ContextMenuItem — destructive styles for deletes.",
            },
            {
              name: "checked",
              type: "boolean",
              defaultValue: "—",
              description: "On ContextMenuCheckboxItem — checked state.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables the menu item.",
            },
          ]}
        />
      </section>
    </article>
  )
}
