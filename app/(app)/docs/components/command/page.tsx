import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "command-default",
    title: "Inline",
    description: "A command menu rendered inline with a border.",
    requires: ["dialog", "input-group", "input", "button"],
  },
  {
    name: "command-dialog",
    title: "Dialog",
    description: "Open the palette in a `CommandDialog`.",
    requires: ["dialog", "input-group", "input", "button"],
  },
  {
    name: "command-shortcuts",
    title: "Shortcuts",
    description: "Show keyboard hints with `CommandShortcut`.",
    requires: ["dialog", "input-group", "input", "button"],
  },
  {
    name: "command-groups",
    title: "Groups",
    description: "Separate sections with `CommandGroup` and `CommandSeparator`.",
    requires: ["dialog", "input-group", "input", "button"],
  },
]

const usageSource = `import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function Example() {
  return (
    <Command className="rounded-lg border">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>Profile</CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}`

export default async function CommandDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Command</h1>
        <p className="leading-relaxed text-muted-foreground">
          Command menu for search and quick actions. Built with{" "}
          <code className="sono-inline-code">cmdk</code>.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="command" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="command.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "title",
              type: "string",
              defaultValue: '"Command Palette"',
              description: "On CommandDialog — accessible dialog title.",
            },
            {
              name: "description",
              type: "string",
              defaultValue: '"Search for a command to run..."',
              description: "On CommandDialog — accessible dialog description.",
            },
            {
              name: "showCloseButton",
              type: "boolean",
              defaultValue: "false",
              description: "On CommandDialog — show the dialog close control.",
            },
            {
              name: "heading",
              type: "string",
              defaultValue: "—",
              description: "On CommandGroup — section label above items.",
            },
          ]}
        />
      </section>
    </article>
  )
}
