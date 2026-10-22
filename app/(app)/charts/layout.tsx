import { ChartsListIndex, ChartsSidebar } from "@/components/sidebar-nav"
import { SidebarProvider } from "@winkui/ui/components/sidebar"

export default function ChartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col">
      <ChartsListIndex />
      <div className="container-wrapper flex flex-1 flex-col">
        <SidebarProvider className="min-h-min flex-1 items-start px-0 lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]">
          <ChartsSidebar />
          <div className="h-full w-full min-w-0 py-6 md:px-2 md:py-8">
            {children}
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}
