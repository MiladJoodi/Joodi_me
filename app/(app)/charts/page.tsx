import Link from "next/link"

import { chartsNav } from "@/lib/charts-nav"

export default function ChartsIndexPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-h1">Charts</h1>
      <p className="text-muted-foreground">
        Chart examples using Recharts and calm Vega tokens.
      </p>
      <ul className="space-y-4">
        {chartsNav.map((group) => (
          <li key={group.title} className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              {group.title}
            </h2>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </article>
  )
}
