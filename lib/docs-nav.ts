export type DocsNavPage = {
  title: string
  href: string
  featured?: boolean
}

export type DocsNavGroup = {
  title: string
  pages: DocsNavPage[]
}

export const docsNav: {
  top: DocsNavPage[]
  groups: DocsNavGroup[]
} = {
  top: [
    { title: "Introduction", href: "/docs" },
    { title: "Direction (RTL / LTR)", href: "/docs/direction", featured: true },
  ],
  groups: [
    {
      title: "Components",
      pages: [
        {
          title: "Accordion",
          href: "/docs/components/accordion",
        },
        {
          title: "Alert",
          href: "/docs/components/alert",
        },
        {
          title: "Alert Dialog",
          href: "/docs/components/alert-dialog",
        },
        {
          title: "Attachment",
          href: "/docs/components/attachment",
        },
        {
          title: "Avatar",
          href: "/docs/components/avatar",
        },
        {
          title: "Badge",
          href: "/docs/components/badge",
        },
        {
          title: "Breadcrumb",
          href: "/docs/components/breadcrumb",
        },
        {
          title: "Button",
          href: "/docs/components/button",
          featured: true,
        },
      ],
    },
  ],
}

export function getDocsCurrentLabel(pathname: string): string | null {
  for (const page of docsNav.top) {
    if (page.href === pathname) return page.title
  }
  for (const group of docsNav.groups) {
    for (const page of group.pages) {
      if (page.href === pathname) return page.title
    }
  }
  if (pathname.startsWith("/docs/components")) return "Components"
  if (pathname.startsWith("/docs")) return "Docs"
  return null
}
