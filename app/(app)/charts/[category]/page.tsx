import Link from "next/link"
import { notFound } from "next/navigation"

import {
  CHART_CATEGORY_META,
  chartViewHref,
  getChartsByCategory,
  isChartCategory,
} from "@/lib/charts-catalog"

export default async function ChartCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  if (!isChartCategory(category)) notFound()

  const meta = CHART_CATEGORY_META[category]
  const entries = getChartsByCategory(category)

  return (
    <article className="w-full max-w-none space-y-8">
      <header className="space-y-2">
        <h1 className="text-h1">{meta.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{meta.description}</p>
      </header>

      <ul className="divide-y divide-border/80 rounded-xl border border-border/80">
        {entries.map((entry) => (
          <li key={entry.id}>
            <Link
              href={chartViewHref(entry.id)}
              className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/40"
            >
              <span className="min-w-0">
                <span className="block font-medium text-foreground">
                  {entry.title}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {entry.id} · {entry.kind}
                  {entry.fullWidth ? " · full width" : ""}
                </span>
              </span>
              <span
                className={
                  entry.status === "ported"
                    ? "shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                    : "shrink-0 text-xs text-muted-foreground"
                }
              >
                {entry.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  )
}
