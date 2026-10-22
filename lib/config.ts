const PRODUCTION_APP_URL = "https://winkui.example"
const LOCAL_APP_URL = "http://localhost:3000"

function resolveAppUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, "")
  if (process.env.NODE_ENV === "production") return PRODUCTION_APP_URL
  return LOCAL_APP_URL
}

export type SiteNavItem = {
  href: string
  label: string
  external?: boolean
}

export const siteConfig = {
  name: "WinkUI",
  url: resolveAppUrl(),
  description:
    "Accessible React components with calm defaults and first-class RTL/LTR — built to ship in production apps.",
  links: {
    github: "https://github.com/example/winkui",
  },
  navItems: [
    { href: "/docs", label: "Docs" },
    { href: "/docs/components", label: "Components" },
    { href: "/blocks", label: "Blocks" },
    { href: "/charts", label: "Charts" },
  ] satisfies SiteNavItem[],
}
