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
          featured: true,
        },
        {
          title: "Alert",
          href: "/docs/components/alert",
        },
        {
          title: "Alert Dialog",
          href: "/docs/components/alert-dialog",
          featured: true,
        },
        {
          title: "Attachment",
          href: "/docs/components/attachment",
        },
        {
          title: "Avatar",
          href: "/docs/components/avatar",
          featured: true,
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
          title: "Bubble",
          href: "/docs/components/bubble",
        },
        {
          title: "Button",
          href: "/docs/components/button",
          featured: true,
        },
        {
          title: "Button Group",
          href: "/docs/components/button-group",
        },
        {
          title: "Calendar",
          href: "/docs/components/calendar",
          featured: true,
        },
        {
          title: "Card",
          href: "/docs/components/card",
          featured: true,
        },
        {
          title: "Carousel",
          href: "/docs/components/carousel",
        },
        {
          title: "Checkbox",
          href: "/docs/components/checkbox",
          featured: true,
        },
        {
          title: "Code Block",
          href: "/docs/components/code-block",
        },
        {
          title: "Collapsible",
          href: "/docs/components/collapsible",
        },
        {
          title: "Combobox",
          href: "/docs/components/combobox",
          featured: true,
        },
        {
          title: "Command",
          href: "/docs/components/command",
        },
        {
          title: "Context Menu",
          href: "/docs/components/context-menu",
        },
        {
          title: "Data Table",
          href: "/docs/components/data-table",
        },
        {
          title: "Date Picker",
          href: "/docs/components/date-picker",
          featured: true,
        },
        {
          title: "Dialog",
          href: "/docs/components/dialog",
        },
        {
          title: "Drawer",
          href: "/docs/components/drawer",
        },
        {
          title: "Dropdown Menu",
          href: "/docs/components/dropdown-menu",
        },
        {
          title: "Empty",
          href: "/docs/components/empty",
        },
        {
          title: "Field",
          href: "/docs/components/field",
          featured: true,
        },
        {
          title: "Hover Card",
          href: "/docs/components/hover-card",
        },
        {
          title: "Input",
          href: "/docs/components/input",
          featured: true,
        },
        {
          title: "Input Group",
          href: "/docs/components/input-group",
        },
        {
          title: "Input OTP",
          href: "/docs/components/input-otp",
        },
        {
          title: "Item",
          href: "/docs/components/item",
        },
        {
          title: "Kbd",
          href: "/docs/components/kbd",
        },
        {
          title: "Label",
          href: "/docs/components/label",
          featured: true,
        },
        {
          title: "Marker",
          href: "/docs/components/marker",
        },
        {
          title: "Menubar",
          href: "/docs/components/menubar",
        },
        {
          title: "Message",
          href: "/docs/components/message",
        },
        {
          title: "Message Scroller",
          href: "/docs/components/message-scroller",
        },
        {
          title: "Native Select",
          href: "/docs/components/native-select",
        },
        {
          title: "Navigation Menu",
          href: "/docs/components/navigation-menu",
        },
        {
          title: "Pagination",
          href: "/docs/components/pagination",
        },
        {
          title: "Popover",
          href: "/docs/components/popover",
          featured: true,
        },
        {
          title: "Progress",
          href: "/docs/components/progress",
        },
        {
          title: "Radio Group",
          href: "/docs/components/radio-group",
          featured: true,
        },
        {
          title: "Resizable",
          href: "/docs/components/resizable",
        },
        {
          title: "Scroll Area",
          href: "/docs/components/scroll-area",
        },
        {
          title: "Select",
          href: "/docs/components/select",
          featured: true,
        },
        {
          title: "Separator",
          href: "/docs/components/separator",
        },
        {
          title: "Sheet",
          href: "/docs/components/sheet",
          featured: true,
        },
        {
          title: "Skeleton",
          href: "/docs/components/skeleton",
        },
        {
          title: "Slider",
          href: "/docs/components/slider",
        },
        {
          title: "Sonner",
          href: "/docs/components/sonner",
        },
        {
          title: "Spinner",
          href: "/docs/components/spinner",
        },
        {
          title: "Switch",
          href: "/docs/components/switch",
          featured: true,
        },
        {
          title: "Table",
          href: "/docs/components/table",
          featured: true,
        },
        {
          title: "Tabs",
          href: "/docs/components/tabs",
          featured: true,
        },
        {
          title: "Textarea",
          href: "/docs/components/textarea",
        },
        {
          title: "Toggle",
          href: "/docs/components/toggle",
        },
        {
          title: "Toggle Group",
          href: "/docs/components/toggle-group",
        },
        {
          title: "Tooltip",
          href: "/docs/components/tooltip",
        },
        {
          title: "Trace",
          href: "/docs/components/trace",
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
