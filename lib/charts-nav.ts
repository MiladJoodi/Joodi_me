import {
  CHART_CATEGORIES,
  CHART_CATEGORY_META,
  chartCategoryHref,
  chartViewHref,
  chartsCatalog,
  getChartEntry,
  getChartsByCategory,
  type ChartCategory,
} from "@/lib/charts-catalog"

export type ChartsNavItem = {
  id: string
  title: string
  href: string
  featured?: boolean
  status: "pending" | "ported"
}

export type ChartsNavGroup = {
  id: ChartCategory
  title: string
  href: string
  items: ChartsNavItem[]
}

/** One collapsible group per category — demos nested like FarsiUI chart shell. */
export const chartsNav: ChartsNavGroup[] = CHART_CATEGORIES.map((category) => {
  const meta = CHART_CATEGORY_META[category]
  const entries = getChartsByCategory(category)
  return {
    id: category,
    title: meta.title,
    href: chartCategoryHref(category),
    items: entries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      href: chartViewHref(entry.id),
      featured: entry.featured === true,
      status: entry.status,
    })),
  }
})

export function getChartsActiveCategoryId(pathname: string): ChartCategory | null {
  if (pathname.startsWith("/charts/view/")) {
    const id = pathname.slice("/charts/view/".length)
    const entry = getChartEntry(id)
    return (entry?.category as ChartCategory | undefined) ?? null
  }

  for (const category of CHART_CATEGORIES) {
    if (pathname === chartCategoryHref(category)) return category
  }

  return null
}

export function getChartsCurrentLabel(pathname: string): string | null {
  if (pathname === "/charts") return "Charts"

  if (pathname.startsWith("/charts/view/")) {
    const id = pathname.slice("/charts/view/".length)
    return getChartEntry(id)?.title ?? "Chart"
  }

  for (const group of chartsNav) {
    if (group.href === pathname) return group.title
  }

  return null
}

export function getChartsNavStats() {
  const ported = chartsCatalog.filter((e) => e.status === "ported").length
  return { total: chartsCatalog.length, ported }
}
