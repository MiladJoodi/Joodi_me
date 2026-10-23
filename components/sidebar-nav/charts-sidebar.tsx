"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  chartsNav,
  getChartsActiveCategoryId,
  getChartsCurrentLabel,
} from "@/lib/charts-nav"
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
  SIDEBAR_ITEM_ACTIVE,
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

const OPEN_GROUPS_KEY = "sonojs-charts-sidebar-open"

function readOpenGroups(): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try {
    const raw = sessionStorage.getItem(OPEN_GROUPS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, boolean>
  } catch {
    return {}
  }
}

function writeOpenGroups(next: Record<string, boolean>) {
  try {
    sessionStorage.setItem(OPEN_GROUPS_KEY, JSON.stringify(next))
  } catch {
    // ignore quota / private mode
  }
}

function ChartsSidebarBody({ className }: { className?: string }) {
  const pathname = usePathname()
  const [query, setQuery] = React.useState("")
  const normalized = normalizeNavSearch(query)
  const activeCategoryId = getChartsActiveCategoryId(pathname)

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    {}
  )
  const [hydrated, setHydrated] = React.useState(false)

  React.useLayoutEffect(() => {
    const saved = readOpenGroups()
    setOpenGroups({
      ...saved,
      ...(activeCategoryId ? { [activeCategoryId]: true } : {}),
    })
    setHydrated(true)
    // Mount restore only; active category kept open via effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount
  }, [])

  React.useEffect(() => {
    if (!activeCategoryId) return
    setOpenGroups((prev) => {
      if (prev[activeCategoryId]) return prev
      const next = { ...prev, [activeCategoryId]: true }
      writeOpenGroups(next)
      return next
    })
  }, [activeCategoryId])

  const filtered = React.useMemo(() => {
    return chartsNav
      .map((group) => {
        const items = group.items.filter(
          (item) =>
            !normalized ||
            matchesNavQuery(item.title, normalized) ||
            matchesNavQuery(item.id, normalized) ||
            matchesNavQuery(group.title, normalized)
        )
        const categoryMatch =
          !normalized || matchesNavQuery(group.title, normalized)

        if (normalized && !categoryMatch && items.length === 0) {
          return null
        }

        return {
          ...group,
          items:
            normalized && categoryMatch && items.length === 0
              ? group.items
              : items,
        }
      })
      .filter((group): group is NonNullable<typeof group> => group != null)
  }, [normalized])

  React.useEffect(() => {
    if (!normalized) return
    setOpenGroups((prev) => {
      const next = { ...prev }
      for (const group of filtered) {
        next[group.id] = true
      }
      writeOpenGroups(next)
      return next
    })
  }, [normalized, filtered])

  const setGroupOpen = React.useCallback((id: string, next: boolean) => {
    setOpenGroups((prev) => {
      const updated = { ...prev, [id]: next }
      writeOpenGroups(updated)
      return updated
    })
  }, [])

  const showIndex = matchesNavQuery("Charts", normalized) || !normalized

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
                {filtered.map((group) => {
                  const categoryActive = group.id === activeCategoryId
                  const open = hydrated
                    ? (openGroups[group.id] ?? Boolean(normalized))
                    : categoryActive

                  return (
                    <SidebarMenuItem key={group.id}>
                      <Collapsible
                        open={open}
                        onOpenChange={(next) => setGroupOpen(group.id, next)}
                        className="group/charts-folder"
                      >
                        <CollapsibleTrigger
                          className={cn(
                            SIDEBAR_GROUP_TRIGGER_CLASS,
                            categoryActive && SIDEBAR_ITEM_ACTIVE
                          )}
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
                            <Link
                              href={group.href}
                              prefetch={false}
                              data-active={
                                pathname === group.href || undefined
                              }
                              className={cn(
                                SIDEBAR_NESTED_ITEM_CLASS,
                                sidebarItemStateClass(pathname === group.href)
                              )}
                            >
                              <SidebarNavBullet />
                              <SidebarNavLabel label="Overview" />
                            </Link>
                            {group.items.map((item) => {
                              const active = pathname === item.href
                              return (
                                <Link
                                  key={item.id}
                                  href={item.href}
                                  prefetch={false}
                                  data-active={active || undefined}
                                  title={item.status === "pending" ? "Pending" : undefined}
                                  className={cn(
                                    SIDEBAR_NESTED_ITEM_CLASS,
                                    sidebarItemStateClass(active),
                                    item.status === "pending" &&
                                      !active &&
                                      "opacity-70"
                                  )}
                                >
                                  <SidebarNavBullet
                                    featured={item.featured}
                                  />
                                  <SidebarNavLabel label={item.title} />
                                </Link>
                              )
                            })}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  )
                })}
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
    <Sidebar collapsible="none" className={SIDEBAR_SHELL_CLASS}>
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
