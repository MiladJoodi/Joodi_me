export type ChartsNavItem = {
  title: string
  href: string
  featured?: boolean
}

export type ChartsNavGroup = {
  title: string
  items: ChartsNavItem[]
}

export const chartsNav: ChartsNavGroup[] = [
  {
    title: "Area",
    items: [
      {
        title: "Area chart",
        href: "/charts/area",
        featured: true,
      },
    ],
  },
]

export function getChartsCurrentLabel(pathname: string): string | null {
  for (const group of chartsNav) {
    for (const item of group.items) {
      if (item.href === pathname) return item.title
    }
  }
  if (pathname === "/charts") return "Charts"
  return null
}
