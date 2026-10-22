import { ComponentSource } from "@/components/docs"
import { ChartAreaDefault } from "@/registry/charts/chart-area"

const chartSource = `import { ChartAreaDefault } from "@/registry/charts/chart-area"

export default function Page() {
  return <ChartAreaDefault />
}`

export default function ChartAreaPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-h1">Area chart</h1>
        <p className="text-muted-foreground">
          A simple area chart with Vega chart tokens.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-h3">Preview</h2>
        <ChartAreaDefault />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Code</h2>
        <ComponentSource title="chart-area.tsx" code={chartSource} />
      </section>
    </article>
  )
}
