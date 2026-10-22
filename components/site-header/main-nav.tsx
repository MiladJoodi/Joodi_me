"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { SiteNavItem } from "@/lib/config"
import { cn } from "@/lib/utils"

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: SiteNavItem[]
}) {
  const pathname = usePathname()
  const activeHref = items
    .filter(
      (item) =>
        !item.external &&
        (item.href === "/"
          ? pathname === "/"
          : pathname === item.href || pathname.startsWith(`${item.href}/`))
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <nav className={cn("items-center gap-0", className)} {...props}>
      {items.map((item) => {
        const isActive = !item.external && item.href === activeHref

        return item.external ? (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className={cn(
              "relative inline-flex cursor-pointer items-center px-2.5 py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </a>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative inline-flex cursor-pointer items-center px-2.5 py-1 text-sm font-medium",
              isActive
                ? "text-primary underline decoration-primary decoration-2 underline-offset-8"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
