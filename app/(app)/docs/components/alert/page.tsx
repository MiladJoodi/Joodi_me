import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
} from "@/components/docs"

const examples = [
  { name: "alert-default", title: "Default" },
  { name: "alert-destructive", title: "Destructive" },
  { name: "alert-action", title: "Action" },
]

const alertSource = `import { AlertCircleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function Example() {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  )
}`

export default function AlertDocsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Alert</h1>
        <p className="leading-relaxed text-muted-foreground">
          Displays a callout for important messages — success, info, or errors —
          with optional icon, title, description, and action.
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
          code={`npx @winkui/ui@latest add alert`}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="alert.tsx" lang="tsx" code={alertSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "variant",
              type: '"default" | "destructive"',
              defaultValue: '"default"',
              description:
                "Visual style. Destructive uses destructive color for title, icon, and description; border stays neutral.",
            },
          ]}
        />
      </section>
    </article>
  )
}
