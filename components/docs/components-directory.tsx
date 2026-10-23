import Link from "next/link"

export type ComponentsDirectoryItem = {
  title: string
  href: string
  slug: string
  featured?: boolean
}

export function ComponentsDirectory({
  items,
}: {
  items: ComponentsDirectoryItem[]
}) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="inline-flex h-8 cursor-pointer items-center rounded-md border border-border/80 bg-background px-2.5 text-[13px] font-medium text-foreground outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
