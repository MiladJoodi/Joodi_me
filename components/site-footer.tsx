import { siteConfig } from "@/lib/config"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="container-wrapper px-4 text-center text-sm text-muted-foreground sm:px-6">
        {siteConfig.name} — component library docs
      </div>
    </footer>
  )
}
