import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "dialog-default",
    title: "Basic",
    description:
      "Open a modal with `DialogTrigger`, title, description, and footer actions.",
    requires: ["button"],
  },
  {
    name: "dialog-form",
    title: "Form",
    description: "Place labeled inputs between the header and footer.",
    requires: ["button", "input", "label"],
  },
  {
    name: "dialog-custom-close",
    title: "Custom Close",
    description:
      "Hide the corner X with `showCloseButton={false}` and use `DialogClose`.",
    requires: ["button", "input", "label"],
  },
  {
    name: "dialog-scrollable",
    title: "Scrollable",
    description:
      "Wrap long copy in a `max-h-* overflow-y-auto` region under the header.",
    requires: ["button"],
  },
  {
    name: "dialog-sticky-footer",
    title: "Sticky Footer",
    description:
      "Use a column flex layout so the footer stays visible while the body scrolls.",
    requires: ["button"],
  },
]

const usageSource = `import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`

const compositionSource = `Dialog
├── DialogTrigger
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    └── DialogFooter`

export default async function DialogDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Dialog</h1>
        <p className="leading-relaxed text-muted-foreground">
          A window overlaid on the primary content for focused tasks. Supports
          forms, custom close controls, scrollable bodies, and sticky footers.
          For irreversible confirmations, prefer{" "}
          <a
            href="/docs/components/alert-dialog"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Alert Dialog
          </a>
          .
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="dialog" />

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
        <ComponentSource title="dialog.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "showCloseButton",
              type: "boolean",
              defaultValue: "true",
              description:
                "On DialogContent — corner X control. On DialogFooter — optional outline Close before children.",
            },
            {
              name: "size",
              type: '"default" | "sm"',
              defaultValue: '"default"',
              description:
                "On DialogContent — default ~32rem max width; sm ~24rem with tighter padding.",
            },
            {
              name: "asChild",
              type: "boolean",
              defaultValue: "false",
              description:
                "On DialogTrigger / DialogClose — merge props into the child (e.g. Button).",
            },
            {
              name: "open / onOpenChange",
              type: "boolean / (open: boolean) => void",
              defaultValue: "—",
              description: "On Dialog — controlled open state.",
            },
          ]}
        />
      </section>
    </article>
  )
}
