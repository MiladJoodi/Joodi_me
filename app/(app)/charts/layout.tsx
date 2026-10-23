import {
  ChartsListIndex,
  ChartsSidebar,
  SIDEBAR_LAYOUT_MAIN_CLASS,
  SIDEBAR_LAYOUT_PROVIDER_CLASS,
} from "@/components/sidebar-nav"
import { cn } from "@/lib/utils"
import { SidebarProvider } from "@sonojs/ui/components/sidebar"

export default function ChartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col">
      <ChartsListIndex />
      <div className="container-wrapper flex flex-1 flex-col">
        <SidebarProvider className={SIDEBAR_LAYOUT_PROVIDER_CLASS}>
          <ChartsSidebar />
          <div className={cn(SIDEBAR_LAYOUT_MAIN_CLASS, "max-w-none")}>
            {children}
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}
