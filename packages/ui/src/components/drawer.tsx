"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { useDirection } from "@sonojs/ui/hooks/use-direction"
import {
  resolveEdgeSide,
  type EdgeSide,
} from "@sonojs/ui/lib/direction"
import { cn } from "@sonojs/ui/lib/utils"

type DrawerRootProps = Omit<
  React.ComponentProps<typeof DrawerPrimitive.Root>,
  "direction"
> & {
  /**
   * Prefer `start` / `end` so the edge flips with writing direction.
   * `left` / `right` stay physical (do not flip in RTL).
   * `top` / `bottom` are unchanged.
   */
  direction?: EdgeSide
}

function Drawer({ direction = "bottom", ...props }: DrawerRootProps) {
  const { dir } = useDirection()
  // Vaul only understands physical left/right — resolve logical edges first
  // so open/close animation originates from the visual edge in both LTR and RTL.
  const resolvedDirection = resolveEdgeSide(direction, dir, "bottom")

  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      // Vaul DialogProps is a fadeFromIndex union; omit+spread loses the discriminant.
      {...(props as React.ComponentProps<typeof DrawerPrimitive.Root>)}
      direction={resolvedDirection}
    />
  )
}

function DrawerTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      className={cn("cursor-pointer", className)}
      {...props}
    />
  )
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return (
    <DrawerPrimitive.Close
      data-slot="drawer-close"
      className={cn("cursor-pointer", className)}
      {...props}
    />
  )
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  // Portal under <body> — set dir so text/logical CSS match DirectionProvider.
  const { dir } = useDirection()

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        dir={dir}
        className={cn(
          // Floating inset panel: full radius + border (not edge-flush).
          // !select-text — Vaul sets [data-vaul-drawer]{user-select:none} on fine pointers.
          "sonojs group/drawer-content fixed z-50 flex h-auto flex-col overflow-hidden rounded-3xl border border-border bg-popover text-popover-foreground shadow-xl !select-text",
          // After resolveEdgeSide, Vaul's data attribute is always physical.
          "data-[vaul-drawer-direction=top]:inset-x-2 data-[vaul-drawer-direction=top]:top-2 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[calc(80vh-0.5rem)]",
          "data-[vaul-drawer-direction=bottom]:inset-x-2 data-[vaul-drawer-direction=bottom]:bottom-2 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[calc(80vh-0.5rem)]",
          "data-[vaul-drawer-direction=right]:inset-y-2 data-[vaul-drawer-direction=right]:right-2 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-2 data-[vaul-drawer-direction=left]:left-2 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        )}
        {...props}
      >
        {/* Bottom handle stays draggable; body is no-drag so text select / clicks don't swipe the panel. */}
        <div className="mx-auto mt-4 hidden h-1.5 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        <div
          data-vaul-no-drag
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {children}
        </div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-start",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("cursor-text font-semibold text-foreground select-text", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(
        "cursor-text text-sm text-muted-foreground select-text",
        className
      )}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
