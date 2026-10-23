import Link from "next/link"

import {
  CHART_CATEGORIES,
  CHART_CATEGORY_META,
  chartCategoryHref,
  chartsCatalog,
} from "@/lib/charts-catalog"

export default function ChartsIndexPage() {
  const pending = chartsCatalog.filter((e) => e.status === "pending").length
  const ported = chartsCatalog.filter((e) => e.status === "ported").length

  return (
    <article className="w-full max-w-none space-y-8">
      <header className="space-y-2">
        <h1 className="text-h1">Charts</h1>
        <p className="max-w-2xl text-muted-foreground">
          Chart gallery scaffold — demos land file-by-file from FarsiUI. English
          + LTR by default; use the preview direction toggle for RTL layout.
        </p>
        <p className="text-sm text-muted-foreground">
          {ported} ported · {pending} pending · {chartsCatalog.length} total
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CHART_CATEGORIES.map((category) => {
          const meta = CHART_CATEGORY_META[category]
          const count = chartsCatalog.filter(
            (e) => e.category === category
          ).length
          return (
            <li key={category}>
              <Link
                href={chartCategoryHref(category)}
                className="block cursor-pointer rounded-xl border border-border/80 p-4 transition-colors hover:bg-muted/40"
              >
                <h2 className="text-h4 text-foreground">{meta.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {meta.description}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {count} demos
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
