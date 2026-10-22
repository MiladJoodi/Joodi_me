"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { chartsNav, getChartsCurrentLabel } from "@/lib/charts-nav"
import { cn } from "@/lib/utils"
import { ListIndexNav } from "@/components/sidebar-nav/list-index-nav"
import {
  matchesNavQuery,
  normalizeNavSearch,
  SidebarNavSearch,
} from "@/components/sidebar-nav/search"
import {
  SIDEBAR_COLLAPSIBLE_CONTENT_CLASS,
  SIDEBAR_EMPTY_CLASS,
  SIDEBAR_GROUP_COUNT_CLASS,
  SIDEBAR_GROUP_TRIGGER_CLASS,
  SIDEBAR_NESTED_ITEM_CLASS,
  SIDEBAR_NESTED_RAIL_CLASS,
  SIDEBAR_SEARCH_INPUT_CLASS,
  SIDEBAR_SEARCH_WRAP_CLASS,
  SIDEBAR_SHELL_CLASS,
  SIDEBAR_TOP_LINK_CLASS,
  SidebarNavBullet,
  SidebarNavChevron,
  SidebarNavLabel,
  sidebarItemStateClass,
} from "@/components/sidebar-nav/ui"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@sonojs/ui/components/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@sonojs/ui/components/sidebar"

function ChartsSidebarBody({ className }: { className?: string }) {
  const pathname = usePathname()
  const [query, setQuery] = React.useState("")
  const normalized = normalizeNavSearch(query)

  const filtered = chartsNav
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          matchesNavQuery(item.title, normalized) ||
          matchesNavQuery(group.title, normalized)
      ),
    }))
    .filter((group) => group.items.length > 0)

  const showIndex = matchesNavQuery("Charts", normalized)

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      <div className={SIDEBAR_SEARCH_WRAP_CLASS}>
        <SidebarNavSearch
          value={query}
          onValueChange={setQuery}
          onClear={() => setQuery("")}
          inputClassName={SIDEBAR_SEARCH_INPUT_CLASS}
        />
      </div>
      <SidebarContent className="no-scrollbar px-0">
        {filtered.length === 0 && !showIndex ? (
          <p className={SIDEBAR_EMPTY_CLASS}>No matches</p>
        ) : (
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              <SidebarMenu>
                {showIndex ? (
                  <SidebarMenuItem>
                    <Link
                      href="/charts"
                      prefetch={false}
                      data-active={pathname === "/charts" || undefined}
                      className={cn(
                        SIDEBAR_TOP_LINK_CLASS,
                        sidebarItemStateClass(pathname === "/charts")
                      )}
                    >
                      <SidebarNavBullet />
                      <SidebarNavLabel label="All charts" />
                    </Link>
                  </SidebarMenuItem>
                ) : null}
                {filtered.map((group) => (
                  <SidebarMenuItem key={group.title}>
                    <Collapsible
                      defaultOpen
                      className="group/charts-folder"
                    >
                      <CollapsibleTrigger
                        className={SIDEBAR_GROUP_TRIGGER_CLASS}
                      >
                        <span className="min-w-0 flex-1 truncate text-start">
                          {group.title}
                        </span>
                        <span className={SIDEBAR_GROUP_COUNT_CLASS}>
                          {group.items.length}
                        </span>
                        <SidebarNavChevron group="charts-folder" />
                      </CollapsibleTrigger>
                      <CollapsibleContent
                        className={SIDEBAR_COLLAPSIBLE_CONTENT_CLASS}
                      >
                        <div className={SIDEBAR_NESTED_RAIL_CLASS}>
                          {group.items.map((item) => {
                            const active = pathname === item.href
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                prefetch={false}
                                data-active={active || undefined}
                                className={cn(
                                  SIDEBAR_NESTED_ITEM_CLASS,
                                  sidebarItemStateClass(active)
                                )}
                              >
                                <SidebarNavBullet featured={item.featured} />
                                <SidebarNavLabel label={item.title} />
                              </Link>
                            )
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </div>
  )
}

export function ChartsSidebar() {
  return (
    <Sidebar className={SIDEBAR_SHELL_CLASS}>
      <ChartsSidebarBody />
    </Sidebar>
  )
}

export function ChartsListIndex() {
  const pathname = usePathname()
  const current = getChartsCurrentLabel(pathname)

  return (
    <ListIndexNav title="Charts" current={current}>
      <ChartsSidebarBody />
    </ListIndexNav>
  )
}
