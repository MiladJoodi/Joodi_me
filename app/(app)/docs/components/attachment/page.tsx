import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "attachment-default",
    title: "Default",
    description: "File card with media, title, description, and actions.",
  },
  {
    name: "attachment-states",
    title: "States",
    description: "Uploading, error, and complete states for attachments.",
  },
  {
    name: "attachment-sizes",
    title: "Sizes",
    description: "Compact and larger attachment layouts.",
  },
  {
    name: "attachment-group",
    title: "Group",
    description: "Stack multiple attachments in one list.",
  },
]

const attachmentSource = `import { FileCodeIcon, XIcon } from "lucide-react"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"

export function Example() {
  return (
    <Attachment className="w-full max-w-sm">
      <AttachmentMedia>
        <FileCodeIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
        <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}`

export default async function AttachmentDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Attachment</h1>
        <p className="leading-relaxed text-muted-foreground">
          File and media attachment cards — sizes, upload states, image media,
          and action buttons.
        </p>
      </header>

      <section className="space-y-3">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="attachment" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource
          title="attachment.tsx"
          lang="tsx"
          code={attachmentSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "state",
              type: '"idle" | "uploading" | "processing" | "error" | "done"',
              defaultValue: '"done"',
              description: "Upload / processing visual state on Attachment.",
            },
            {
              name: "size",
              type: '"default" | "sm" | "xs"',
              defaultValue: '"default"',
              description: "Control density and padding.",
            },
            {
              name: "orientation",
              type: '"horizontal" | "vertical"',
              defaultValue: '"horizontal"',
              description: "Layout direction (vertical suits image thumbnails).",
            },
            {
              name: "variant",
              type: '"icon" | "image"',
              defaultValue: '"icon"',
              description: "On AttachmentMedia — icon tile or image fill.",
            },
          ]}
        />
      </section>
    </article>
  )
}
