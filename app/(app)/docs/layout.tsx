import {
  DocsListIndex,
  DocsSidebar,
  SIDEBAR_LAYOUT_MAIN_CLASS,
  SIDEBAR_LAYOUT_PROVIDER_CLASS,
} from "@/components/sidebar-nav"
import { cn } from "@/lib/utils"
import { SidebarProvider } from "@sonojs/ui/components/sidebar"

/** Docs depend on registry metadata + static MDX/TSX — bake at build; refresh on deploy. */
export const dynamic = "force-static"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col">
      <DocsListIndex />
      <div className="container-wrapper flex flex-1 flex-col">
        <SidebarProvider
          className={cn(
            SIDEBAR_LAYOUT_PROVIDER_CLASS,
            "[--top-spacing:var(--space-4)] lg:[--top-spacing:var(--space-4)]"
          )}
        >
          <DocsSidebar />
          <div className={SIDEBAR_LAYOUT_MAIN_CLASS}>{children}</div>
        </SidebarProvider>
      </div>
    </div>
  )
}
