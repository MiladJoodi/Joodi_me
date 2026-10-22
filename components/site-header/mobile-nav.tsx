"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpenIcon,
  ChartAreaIcon,
  LayoutGridIcon,
  LayoutTemplateIcon,
  MenuIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react"

import type { SiteNavItem } from "@/lib/config"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@winkui/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@winkui/ui/components/popover"

const NAV_ICONS: Record<string, LucideIcon> = {
  "/docs": BookOpenIcon,
  "/docs/components": LayoutGridIcon,
  "/blocks": LayoutTemplateIcon,
  "/charts": ChartAreaIcon,
}

export function MobileNav({
  items,
  className,
}: {
  items: SiteNavItem[]
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const activeHref = React.useMemo(() => {
    return items
      .filter(
        (item) =>
          !item.external &&
          (item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`))
      )
      .sort((a, b) => b.href.length - a.href.length)[0]?.href
  }, [items, pathname])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-8 shrink-0 cursor-pointer hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",
          className
        )}
      >
        {open ? (
          <XIcon className="size-5" aria-hidden />
        ) : (
          <MenuIcon className="size-5" aria-hidden />
        )}
        <span className="sr-only">Toggle menu</span>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        alignOffset={-8}
        sideOffset={8}
        className="no-scrollbar h-(--radix-popover-content-available-height) w-(--radix-popover-content-available-width) overflow-y-auto rounded-none border-none bg-background/95 p-0 shadow-none backdrop-blur-md duration-100"
      >
        <nav className="flex flex-col gap-1 px-4 py-4 text-sm">
          <div className="px-2 pb-1 text-[0.6875rem] font-medium tracking-wide text-muted-foreground">
            Menu
          </div>
          {items.map((item) => {
            const Icon = NAV_ICONS[item.href]
            const isActive = !item.external && item.href === activeHref
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex h-10 cursor-pointer items-center gap-2.5 rounded-md px-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground",
                  isActive && "bg-primary/10 text-primary"
                )}
              >
                {Icon ? (
                  <Icon className="size-4 shrink-0 opacity-70" aria-hidden />
                ) : null}
                {item.label}
              </Link>
            )
          })}
        </nav>
      </PopoverContent>
    </Popover>
  )
}
