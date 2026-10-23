"use client"

import * as React from "react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@sonojs/ui/components/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/components/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content.",
  },
  {
    title: "Hover Card",
    href: "/docs/components/hover-card",
    description: "Preview content available behind a link for sighted users.",
  },
  {
    title: "Input",
    href: "/docs/components/input",
    description: "A text field for forms and data entry.",
  },
  {
    title: "Menubar",
    href: "/docs/components/menubar",
    description: "A persistent menu bar for desktop-style apps.",
  },
  {
    title: "Native Select",
    href: "/docs/components/native-select",
    description: "A styled native HTML select for simple forms.",
  },
  {
    title: "Message",
    href: "/docs/components/message",
    description: "Conversation row layout with avatar and footer slots.",
  },
]

export function NavigationMenuDefault() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="relative flex h-full min-h-40 w-full flex-col justify-end overflow-hidden rounded-md no-underline outline-hidden select-none focus:shadow-md"
                    href="/docs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
                      alt="Workspace"
                      className="absolute inset-0 size-full object-cover"
                    />
                    <div className="relative z-10 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white">
                      <div className="mb-1 text-lg font-medium">SonoJS</div>
                      <p className="text-sm leading-tight text-white/80">
                        Beautifully designed components you can copy into your
                        apps.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Reusable components built with accessible primitives and
                Tailwind.
              </ListItem>
              <ListItem href="/docs/direction" title="Direction">
                First-class LTR and RTL support across the system.
              </ListItem>
              <ListItem href="/docs/components/button" title="Button">
                The primary control for actions and forms.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="/docs">Docs</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <a href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
