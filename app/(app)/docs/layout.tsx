import { DocsListIndex, DocsSidebar } from "@/components/sidebar-nav"
import { SidebarProvider } from "@winkui/ui/components/sidebar"

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
          className="min-h-min flex-1 items-start px-0 [--top-spacing:var(--space-4)] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--top-spacing:var(--space-4)]"
        >
          <DocsSidebar />
          <div className="h-full w-full min-w-0 py-6 md:px-2 md:py-8">
            {children}
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}
