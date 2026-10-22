"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { MainNav } from "@/components/site-header/main-nav"
import { MobileNav } from "@/components/site-header/mobile-nav"
import { ModeSwitcher } from "@/components/site-header/mode-switcher"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import { Separator } from "@sonojs/ui/components/separator"

export function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <header
      data-site-header=""
      data-home-header={isHome ? "" : undefined}
      className={cn(
        "sticky top-0 z-50 w-full transition-transform duration-300 ease-out [[data-header-hidden]_&]:pointer-events-none [[data-header-hidden]_&]:-translate-y-full",
        isHome
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border/70 bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70"
      )}
    >
      <div className="container-wrapper">
        <div className="relative flex h-(--header-height) items-center gap-1 **:data-[slot=separator]:h-4!">
          <MobileNav items={siteConfig.navItems} className="flex lg:hidden" />
          <Link
            href="/"
            prefetch={false}
            className="me-2 flex shrink-0 cursor-pointer items-center rounded-[var(--radius-button)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* Temporary logo test — replace with final brand mark later */}
            <img
              src="/images/logos/01.webp"
              alt={siteConfig.name}
              className="h-7 w-auto"
            />
          </Link>
          <MainNav items={siteConfig.navItems} className="hidden lg:flex" />

          <div className="ms-auto flex shrink-0 items-center gap-0.5">
            <Separator orientation="vertical" className="mx-1 hidden sm:block" />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
