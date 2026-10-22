"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { blocksNav, getBlocksCurrentLabel } from "@/lib/blocks-nav"
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

function BlocksSidebarBody({ className }: { className?: string }) {
  const pathname = usePathname()
  const [query, setQuery] = React.useState("")
  const normalized = normalizeNavSearch(query)

  const filtered = blocksNav
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          matchesNavQuery(item.title, normalized) ||
          matchesNavQuery(group.title, normalized)
      ),
    }))
    .filter((group) => group.items.length > 0)

  const showIndex = matchesNavQuery("Blocks", normalized)

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
                      href="/blocks"
                      prefetch={false}
                      data-active={pathname === "/blocks" || undefined}
                      className={cn(
                        SIDEBAR_TOP_LINK_CLASS,
                        sidebarItemStateClass(pathname === "/blocks")
                      )}
                    >
                      <SidebarNavBullet />
                      <SidebarNavLabel label="All blocks" />
                    </Link>
                  </SidebarMenuItem>
                ) : null}
                {filtered.map((group) => (
                  <SidebarMenuItem key={group.title}>
                    <Collapsible
                      defaultOpen
                      className="group/blocks-folder"
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
                        <SidebarNavChevron group="blocks-folder" />
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

export function BlocksSidebar() {
  return (
    <Sidebar className={SIDEBAR_SHELL_CLASS}>
      <BlocksSidebarBody />
    </Sidebar>
  )
}

export function BlocksListIndex() {
  const pathname = usePathname()
  const current = getBlocksCurrentLabel(pathname)

  return (
    <ListIndexNav title="Blocks" current={current}>
      <BlocksSidebarBody />
    </ListIndexNav>
  )
}
