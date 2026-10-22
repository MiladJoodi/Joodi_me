import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "dropdown-menu-default",
    title: "Basic",
    description: "Open a menu from a button with labels and separators.",
    requires: ["button"],
  },
  {
    name: "dropdown-menu-shortcuts",
    title: "Shortcuts",
    description: "Show keyboard hints with `DropdownMenuShortcut`.",
    requires: ["button"],
  },
  {
    name: "dropdown-menu-submenu",
    title: "Submenu",
    description:
      "Nest items with `DropdownMenuSub` and `DropdownMenuSubTrigger`.",
    requires: ["button"],
  },
  {
    name: "dropdown-menu-checkboxes",
    title: "Checkboxes",
    description: "Toggle options with `DropdownMenuCheckboxItem`.",
    requires: ["button"],
  },
  {
    name: "dropdown-menu-radio",
    title: "Radio",
    description: "Pick one value with `DropdownMenuRadioGroup`.",
    requires: ["button"],
  },
  {
    name: "dropdown-menu-destructive",
    title: "Destructive",
    description: 'Use `variant="destructive"` for irreversible actions.',
    requires: ["button"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`

const compositionSource = `DropdownMenu
├── DropdownMenuTrigger
└── DropdownMenuContent
    ├── DropdownMenuGroup
    │   ├── DropdownMenuLabel
    │   └── DropdownMenuItem
    ├── DropdownMenuSeparator
    └── DropdownMenuSub
        ├── DropdownMenuSubTrigger
        └── DropdownMenuSubContent`

export default async function DropdownMenuDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Dropdown Menu</h1>
        <p className="leading-relaxed text-muted-foreground">
          Displays a menu of actions triggered by a button. Supports shortcuts,
          nested submenus, checkboxes, radio groups, and destructive items.
          Chevron and inset spacing use logical properties for LTR and RTL.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="dropdown-menu" />

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
        <ComponentSource
          title="dropdown-menu.tsx"
          lang="tsx"
          code={usageSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "align",
              type: '"start" | "center" | "end"',
              defaultValue: '"center"',
              description:
                "On DropdownMenuContent — prefer start/end over left/right assumptions.",
            },
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
              description:
                "On DropdownMenuItem — destructive styles for deletes.",
            },
            {
              name: "checked",
              type: "boolean",
              defaultValue: "—",
              description: "On DropdownMenuCheckboxItem — checked state.",
            },
            {
              name: "asChild",
              type: "boolean",
              defaultValue: "false",
              description:
                "On DropdownMenuTrigger — merge props into the child (e.g. Button).",
            },
          ]}
        />
      </section>
    </article>
  )
}
