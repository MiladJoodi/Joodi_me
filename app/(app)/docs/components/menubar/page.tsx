import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "menubar-default",
    title: "Basic",
    description: "Persistent File / Edit / View menus with shortcuts.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "menubar-checkbox",
    title: "Checkbox",
    description: "Toggle options with `MenubarCheckboxItem`.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "menubar-radio",
    title: "Radio",
    description: "Pick one value with `MenubarRadioGroup`.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "menubar-submenu",
    title: "Submenu",
    description: "Nest menus with `MenubarSub` and `MenubarSubTrigger`.",
    npmRequires: ["lucide-react"],
  },
  {
    name: "menubar-icons",
    title: "Icons",
    description: "Add Lucide icons beside menu item labels.",
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function Example() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`

const compositionSource = `Menubar
└── MenubarMenu
    ├── MenubarTrigger
    └── MenubarContent
        ├── MenubarGroup
        │   ├── MenubarLabel
        │   ├── MenubarItem
        │   ├── MenubarCheckboxItem
        │   └── MenubarRadioGroup → MenubarRadioItem
        ├── MenubarSeparator
        └── MenubarSub
            ├── MenubarSubTrigger
            └── MenubarSubContent`

export default async function MenubarDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Menubar</h1>
        <p className="leading-relaxed text-muted-foreground">
          A visually persistent menu bar for desktop-style apps. Height{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            h-8
          </code>
          . Supports shortcuts, checkboxes, radios, and nested submenus.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="menubar" />

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
        <ComponentSource title="menubar.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "inset",
              type: "boolean",
              defaultValue: "false",
              description:
                "On `MenubarItem` / `MenubarLabel` / `MenubarSubTrigger` — indent to align with checkbox items.",
            },
            {
              name: "variant",
              type: '"default" | "destructive"',
              defaultValue: '"default"',
              description: "On `MenubarItem` — destructive styling for risky actions.",
            },
            {
              name: "align",
              type: '"start" | "center" | "end"',
              defaultValue: '"start"',
              description: "On `MenubarContent` — popup alignment.",
            },
            {
              name: "className",
              type: "string",
              defaultValue: "—",
              description: "Merge extra Tailwind classes on any part.",
            },
          ]}
        />
      </section>
    </article>
  )
}
