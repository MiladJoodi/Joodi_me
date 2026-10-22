import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
} from "@/components/docs"

const examples = [
  { name: "alert-dialog-default", title: "Default" },
  { name: "alert-dialog-small", title: "Small" },
  { name: "alert-dialog-destructive", title: "Destructive" },
]

const alertDialogSource = `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`

export default function AlertDialogDocsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Alert Dialog</h1>
        <p className="leading-relaxed text-muted-foreground">
          A modal dialog that interrupts the user with important content and
          expects a response. Built on Radix Alert Dialog.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-h3">Preview</h2>
        <ComponentVariantPreview examples={examples} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Installation</h2>
        <ComponentSource
          title="CLI"
          lang="bash"
          code={`npx @winkui/ui@latest add alert-dialog`}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource
          title="alert-dialog.tsx"
          lang="tsx"
          code={alertDialogSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "size",
              type: '"default" | "sm"',
              defaultValue: '"default"',
              description:
                "On AlertDialogContent: default is wider on sm+; sm is compact with a 2-column footer.",
            },
            {
              name: "variant",
              type: "Button variant",
              defaultValue: 'Action: "default" · Cancel: "outline"',
              description:
                "On AlertDialogAction / AlertDialogCancel: forwarded to Button.",
            },
            {
              name: "asChild",
              type: "boolean",
              defaultValue: "false",
              description:
                "On AlertDialogTrigger: merge props into the child (e.g. Button).",
            },
          ]}
        />
      </section>
    </article>
  )
}
