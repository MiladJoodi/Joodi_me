import { ComponentSource } from "@/components/docs"

import { DirectionTryIt } from "./direction-try-it"

export default function DirectionDocsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <h1 className="text-h1">Direction (RTL / LTR)</h1>
        <p className="text-lg leading-relaxed text-foreground">
          To use SonoJS in a right-to-left layout, set{" "}
          <code className="sono-inline-code">dir=&quot;rtl&quot;</code> on the
          HTML element. That&apos;s it.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          SonoJS components follow the direction automatically. You do not need
          to configure each component. They inherit direction from their parent.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-h3">Set direction once</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Put direction on the root HTML tag. Everything inside inherits it.
        </p>

        <ComponentSource
          title="RTL app"
          lang="html"
          code={`<html dir="rtl">`}
        />
        <ComponentSource
          title="LTR app"
          lang="html"
          code={`<html dir="ltr">`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-h3">RTL section inside an LTR app</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Need one block in the other direction? Wrap it with{" "}
          <code className="sono-inline-code">DirectionProvider</code>.
        </p>
        <ComponentSource
          title="DirectionProvider"
          lang="tsx"
          code={`import { DirectionProvider } from "@/components/direction"

export function RtlSection() {
  return (
    <DirectionProvider dir="rtl">
      <LoginForm />
    </DirectionProvider>
  )
}`}
        />
      </section>

      <DirectionTryIt />

      <section className="space-y-3 border-t border-border/60 pt-8">
        <h2 className="text-h3">For contributors (building components)</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          App developers can skip this section. It is for people who add new
          SonoJS components.
        </p>
        <ul className="list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Use CSS logical properties:{" "}
            <code className="text-foreground">ms</code> /{" "}
            <code className="text-foreground">me</code>,{" "}
            <code className="text-foreground">ps</code> /{" "}
            <code className="text-foreground">pe</code>,{" "}
            <code className="text-foreground">start</code> /{" "}
            <code className="text-foreground">end</code>,{" "}
            <code className="text-foreground">text-start</code>. Avoid physical{" "}
            <code className="text-foreground">ml</code> /{" "}
            <code className="text-foreground">mr</code> /{" "}
            <code className="text-foreground">left</code> /{" "}
            <code className="text-foreground">right</code> for layout.
          </li>
          <li>
            Do not hardcode <code className="text-foreground">dir</code> on
            component roots. Inherit from the parent.
          </li>
          <li>
            For arrows and chevrons along the inline axis, add class{" "}
            <code className="text-foreground">icon-dir</code>.
          </li>
          <li>
            For Sheet and similar edge UI, use{" "}
            <code className="text-foreground">getStartSide(dir)</code> or{" "}
            <code className="text-foreground">getEndSide(dir)</code>.
          </li>
        </ul>
      </section>
    </article>
  )
}
