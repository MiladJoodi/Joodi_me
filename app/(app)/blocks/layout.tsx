import {
  BlocksListIndex,
  BlocksSidebar,
  SIDEBAR_LAYOUT_MAIN_CLASS,
  SIDEBAR_LAYOUT_PROVIDER_CLASS,
} from "@/components/sidebar-nav"
import { SidebarProvider } from "@sonojs/ui/components/sidebar"

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col">
      <BlocksListIndex />
      <div className="container-wrapper flex flex-1 flex-col">
        <SidebarProvider className={SIDEBAR_LAYOUT_PROVIDER_CLASS}>
          <BlocksSidebar />
          <div className={SIDEBAR_LAYOUT_MAIN_CLASS}>{children}</div>
        </SidebarProvider>
      </div>
    </div>
  )
}
