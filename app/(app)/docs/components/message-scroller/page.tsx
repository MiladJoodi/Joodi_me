import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "message-scroller-default",
    title: "Basic",
    description:
      "Wrap each row in `MessageScrollerItem`. Mark turn starts with `scrollAnchor`.",
    requires: ["message", "bubble", "button"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "message-scroller-auto-scroll",
    title: "Auto Scroll",
    description:
      "Set `autoScroll` to follow the live edge until the reader scrolls away.",
    requires: ["message", "bubble", "button"],
    npmRequires: ["lucide-react"],
  },
  {
    name: "message-scroller-commands",
    title: "Commands",
    description:
      "Drive the transcript with `useMessageScroller` from outside the list.",
    requires: ["message", "bubble", "button"],
    npmRequires: ["lucide-react"],
  },
]

const usageSource = `import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

export function Example({ messages }) {
  return (
    <div className="flex h-screen flex-col">
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent>
              {messages.map((message) => (
                <MessageScrollerItem
                  key={message.id}
                  messageId={message.id}
                  scrollAnchor={message.role === "user"}
                >
                  {/* Message + Bubble */}
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}`

const compositionSource = `MessageScrollerProvider
└── MessageScroller
    ├── MessageScrollerViewport
    │   └── MessageScrollerContent
    │       └── MessageScrollerItem
    └── MessageScrollerButton`

export default async function MessageScrollerDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Message Scroller</h1>
        <p className="leading-relaxed text-muted-foreground">
          A chat transcript scroller for turn anchoring, follow-output while
          streaming, history prepend without jumps, and jump-to-message
          commands. Put it in a height-constrained parent — it fills available
          space.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="message-scroller" />

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
          title="message-scroller.tsx"
          lang="tsx"
          code={usageSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "autoScroll",
              type: "boolean",
              defaultValue: "false",
              description:
                "On `MessageScrollerProvider` — follow the live edge until the reader scrolls away.",
            },
            {
              name: "defaultScrollPosition",
              type: '"start" | "end" | "last-anchor"',
              defaultValue: '"end"',
              description: "Where a transcript opens on first paint.",
            },
            {
              name: "scrollPreviousItemPeek",
              type: "number",
              defaultValue: "48",
              description: "Pixels of the previous row kept visible above an anchor.",
            },
            {
              name: "scrollAnchor",
              type: "boolean",
              defaultValue: "false",
              description: "On `MessageScrollerItem` — mark the start of a turn.",
            },
            {
              name: "messageId",
              type: "string",
              defaultValue: "—",
              description: "Stable id for jump / visibility tracking.",
            },
            {
              name: "direction",
              type: '"start" | "end"',
              defaultValue: '"end"',
              description: "On `MessageScrollerButton` — which edge to jump to.",
            },
          ]}
        />
      </section>
    </article>
  )
}
