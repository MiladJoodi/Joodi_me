import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "message-default",
    title: "Basic",
    description:
      "Row layout for avatar and content. Render the surface with `Bubble`.",
    requires: ["avatar", "bubble"],
  },
  {
    name: "message-avatar",
    title: "Avatar",
    description: 'Use `align="end"` to flip the row for the current user.',
    requires: ["avatar", "bubble"],
  },
  {
    name: "message-group",
    title: "Group",
    description:
      "Stack consecutive messages with `MessageGroup`; leave earlier avatars empty for alignment.",
    requires: ["avatar", "bubble"],
  },
  {
    name: "message-header",
    title: "Header & Footer",
    description: "Use `MessageHeader` for names and `MessageFooter` for status.",
    requires: ["avatar", "bubble"],
  },
  {
    name: "message-actions",
    title: "Actions",
    description: "Put icon actions in `MessageFooter` with `aria-label`s.",
    requires: ["button", "bubble"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "message-attachment",
    title: "Attachment",
    description: "Compose file cards under the bubble with `Attachment`.",
    requires: ["attachment", "avatar", "bubble", "button", "spinner"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "message-status",
    title: "Status",
    description:
      'Use `Marker` with `role="status"` for in-progress assistant rows.',
    requires: ["marker", "spinner"],
  },
]

const usageSource = `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message"

export function Example() {
  return (
    <Message>
      <MessageAvatar>
        <Avatar>
          <AvatarImage src="/avatar.png" alt="Oliver" />
          <AvatarFallback>OL</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <Bubble variant="muted">
          <BubbleContent>How can I help you today?</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}`

const compositionSource = `Message
├── MessageAvatar
└── MessageContent
    ├── MessageHeader
    ├── Bubble
    └── MessageFooter

MessageGroup
├── Message
└── Message`

export default async function MessageDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Message</h1>
        <p className="leading-relaxed text-muted-foreground">
          Layout for a single conversation row — avatar, alignment, header, and
          footer around a message surface.           Compose the visible bubble with{" "}
          <a
            href="/docs/components/bubble"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Bubble
          </a>
          . For the transcript scroll container, see{" "}
          <a
            href="/docs/components/message-scroller"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Message Scroller
          </a>
          .
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="message" />

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
        <ComponentSource title="message.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "align",
              type: '"start" | "end"',
              defaultValue: '"start"',
              description: "On `Message` — which side of the thread.",
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
