export type BlocksNavItem = {
  title: string
  href: string
  featured?: boolean
}

export type BlocksNavGroup = {
  title: string
  items: BlocksNavItem[]
}

export const blocksNav: BlocksNavGroup[] = [
  {
    title: "Authentication",
    items: [
      {
        title: "Login",
        href: "/blocks/login-01",
        featured: true,
      },
    ],
  },
]

export function getBlocksCurrentLabel(pathname: string): string | null {
  for (const group of blocksNav) {
    for (const item of group.items) {
      if (item.href === pathname) return item.title
    }
  }
  if (pathname === "/blocks") return "Blocks"
  return null
}
