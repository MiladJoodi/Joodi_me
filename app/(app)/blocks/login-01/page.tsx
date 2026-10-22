import { ComponentSource } from "@/components/docs"
import Login01Page from "@/registry/blocks/login-01/page"

const blockSource = `import LoginForm from "@/registry/blocks/login-01/components/login-form"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}`

export default function BlockLogin01DocsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-h1">Login</h1>
        <p className="text-muted-foreground">
          A simple authentication block — email, password, and social continue.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-h3">Preview</h2>
        <div className="overflow-hidden rounded-xl border border-border/80">
          <Login01Page />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Code</h2>
        <ComponentSource title="login-01/page.tsx" code={blockSource} />
      </section>
    </article>
  )
}
