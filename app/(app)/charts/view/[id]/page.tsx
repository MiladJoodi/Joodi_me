import { notFound } from "next/navigation"

import { ChartDemo, ChartPreview } from "@/components/charts"
import { ComponentSource, DocsInstallation } from "@/components/docs"
import { chartUsageSnippets } from "@/lib/chart-demo-export-name"
import { getChartEntry } from "@/lib/charts-catalog"
import { readChartDemoSource } from "@/lib/read-chart-demo-source"

export default async function ChartViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const entry = getChartEntry(id)
  if (!entry) notFound()

  const source =
    entry.status === "ported" ? await readChartDemoSource(id) : null
  const usage = source ? chartUsageSnippets(id, source) : null

  return (
    <article className="w-full max-w-none space-y-8">
      <header>
        <h1 className="text-h1">{entry.title}</h1>
      </header>

      <section>
        <ChartPreview fullWidth={entry.fullWidth}>
          {entry.status === "ported" ? (
            <ChartDemo id={entry.id} />
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm font-medium text-foreground">Pending</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Skeleton only — ask to port this id. Direction toggle is ready
                for when the English demo lands.
              </p>
            </div>
          )}
        </ChartPreview>
      </section>

      {entry.status === "ported" ? (
        <>
          <DocsInstallation name={entry.id} />

          {usage ? (
            <section className="space-y-3">
              <h2 className="text-h3">Usage</h2>
              <ComponentSource title="import" lang="tsx" code={usage.usageImport} />
              <ComponentSource title="page.tsx" lang="tsx" code={usage.usagePage} />
            </section>
          ) : null}
        </>
      ) : null}
    </article>
  )
}
