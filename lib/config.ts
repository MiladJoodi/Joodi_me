const PRODUCTION_APP_URL = "https://sonojs.example"
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
  name: "SonoJS",
  url: resolveAppUrl(),
  description:
    "Agent-friendly React components — set up MCP, then ask your agent to build with SonoJS.",
  /** Placeholder until the real npx MCP command ships. Works with any MCP client. */
  mcpInitCommand: "npx @sonojs/ui@latest mcp init",
  links: {
    github: "https://github.com/example/sonojs",
  },
  navItems: [
    { href: "/docs", label: "Docs" },
    { href: "/docs/components", label: "Components" },
    { href: "/blocks", label: "Blocks" },
    { href: "/charts", label: "Charts" },
  ] satisfies SiteNavItem[],
}
