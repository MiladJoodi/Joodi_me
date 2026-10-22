import type { ComponentType } from "react"

import { ChartAreaDefault } from "@/registry/charts/chart-area"
import {
  AccordionDefault,
  AccordionDisabled,
  AccordionMultiple,
} from "@/registry/examples/accordion"
import {
  AlertActionExample,
  AlertDefault,
  AlertDestructive,
} from "@/registry/examples/alert"
import {
  AlertDialogDefault,
  AlertDialogDestructive,
  AlertDialogSmall,
} from "@/registry/examples/alert-dialog"
import {
  AttachmentDefault,
  AttachmentGroupExample,
  AttachmentSizes,
  AttachmentStates,
} from "@/registry/examples/attachment"
import {
  AvatarBadgeExample,
  AvatarBasic,
  AvatarDefault,
  AvatarGroupExample,
  AvatarSizes,
} from "@/registry/examples/avatar"
import {
  BadgeColorsExample,
  BadgeDefault,
  BadgeIconExample,
  BadgeLinkExample,
  BadgeSpinnerExample,
  BadgeVariants,
} from "@/registry/examples/badge"
import {
  BreadcrumbBasic,
  BreadcrumbDefault,
  BreadcrumbDropdownExample,
  BreadcrumbEllipsisExample,
  BreadcrumbLinkExample,
  BreadcrumbSeparatorExample,
} from "@/registry/examples/breadcrumb"
import {
  ButtonDefault,
  ButtonDestructive,
  ButtonGhost,
  ButtonOutline,
  ButtonSecondary,
  ButtonSizes,
} from "@/registry/examples/button"
import LoginForm from "@/registry/blocks/login-01/components/login-form"

export type RegistryItem = {
  name: string
  type: "registry:ui" | "registry:block" | "registry:chart" | "registry:example"
  title: string
  description?: string
  component?: ComponentType
}

export const registry = {
  components: [
    {
      name: "accordion",
      type: "registry:ui" as const,
      title: "Accordion",
      description:
        "A vertically stacked set of interactive headings that reveal content.",
    },
    {
      name: "alert",
      type: "registry:ui" as const,
      title: "Alert",
      description:
        "Displays a callout for important messages with optional icon and description.",
    },
    {
      name: "alert-dialog",
      type: "registry:ui" as const,
      title: "Alert Dialog",
      description:
        "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
      name: "attachment",
      type: "registry:ui" as const,
      title: "Attachment",
      description:
        "File and media attachment cards with upload states, sizes, and actions.",
    },
    {
      name: "avatar",
      type: "registry:ui" as const,
      title: "Avatar",
      description:
        "An image element with a fallback for representing the user.",
    },
    {
      name: "badge",
      type: "registry:ui" as const,
      title: "Badge",
      description:
        "Small status labels for counts, categories, and inline metadata.",
    },
    {
      name: "breadcrumb",
      type: "registry:ui" as const,
      title: "Breadcrumb",
      description:
        "Displays the path to the current resource using a hierarchy of links.",
    },
    {
      name: "button",
      type: "registry:ui" as const,
      title: "Button",
      description: "Displays a button or a component that looks like a button.",
    },
    {
      name: "spinner",
      type: "registry:ui" as const,
      title: "Spinner",
      description: "A loading spinner.",
    },
  ],
  blocks: [
    {
      name: "login-01",
      type: "registry:block" as const,
      title: "Login",
      description: "A simple email/password login form.",
      component: LoginForm,
    },
  ],
  charts: [
    {
      name: "chart-area",
      type: "registry:chart" as const,
      title: "Area chart",
      description: "A simple area chart.",
      component: ChartAreaDefault,
    },
  ],
  examples: [
    {
      name: "accordion-default",
      type: "registry:example" as const,
      title: "Default",
      component: AccordionDefault,
    },
    {
      name: "accordion-multiple",
      type: "registry:example" as const,
      title: "Multiple",
      component: AccordionMultiple,
    },
    {
      name: "accordion-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: AccordionDisabled,
    },
    {
      name: "alert-default",
      type: "registry:example" as const,
      title: "Default",
      component: AlertDefault,
    },
    {
      name: "alert-destructive",
      type: "registry:example" as const,
      title: "Destructive",
      component: AlertDestructive,
    },
    {
      name: "alert-action",
      type: "registry:example" as const,
      title: "Action",
      component: AlertActionExample,
    },
    {
      name: "alert-dialog-default",
      type: "registry:example" as const,
      title: "Default",
      component: AlertDialogDefault,
    },
    {
      name: "alert-dialog-small",
      type: "registry:example" as const,
      title: "Small",
      component: AlertDialogSmall,
    },
    {
      name: "alert-dialog-destructive",
      type: "registry:example" as const,
      title: "Destructive",
      component: AlertDialogDestructive,
    },
    {
      name: "attachment-default",
      type: "registry:example" as const,
      title: "Default",
      component: AttachmentDefault,
    },
    {
      name: "attachment-states",
      type: "registry:example" as const,
      title: "States",
      component: AttachmentStates,
    },
    {
      name: "attachment-sizes",
      type: "registry:example" as const,
      title: "Sizes",
      component: AttachmentSizes,
    },
    {
      name: "attachment-group",
      type: "registry:example" as const,
      title: "Group",
      component: AttachmentGroupExample,
    },
    {
      name: "avatar-default",
      type: "registry:example" as const,
      title: "Default",
      component: AvatarDefault,
    },
    {
      name: "avatar-basic",
      type: "registry:example" as const,
      title: "Basic",
      component: AvatarBasic,
    },
    {
      name: "avatar-sizes",
      type: "registry:example" as const,
      title: "Sizes",
      component: AvatarSizes,
    },
    {
      name: "avatar-badge",
      type: "registry:example" as const,
      title: "Badge",
      component: AvatarBadgeExample,
    },
    {
      name: "avatar-group",
      type: "registry:example" as const,
      title: "Group",
      component: AvatarGroupExample,
    },
    {
      name: "badge-default",
      type: "registry:example" as const,
      title: "Default",
      component: BadgeDefault,
    },
    {
      name: "badge-variants",
      type: "registry:example" as const,
      title: "Variants",
      component: BadgeVariants,
    },
    {
      name: "badge-icon",
      type: "registry:example" as const,
      title: "Icon",
      component: BadgeIconExample,
    },
    {
      name: "badge-spinner",
      type: "registry:example" as const,
      title: "Spinner",
      component: BadgeSpinnerExample,
    },
    {
      name: "badge-link",
      type: "registry:example" as const,
      title: "Link",
      component: BadgeLinkExample,
    },
    {
      name: "badge-colors",
      type: "registry:example" as const,
      title: "Colors",
      component: BadgeColorsExample,
    },
    {
      name: "breadcrumb-default",
      type: "registry:example" as const,
      title: "Default",
      component: BreadcrumbDefault,
    },
    {
      name: "breadcrumb-basic",
      type: "registry:example" as const,
      title: "Basic",
      component: BreadcrumbBasic,
    },
    {
      name: "breadcrumb-separator",
      type: "registry:example" as const,
      title: "Separator",
      component: BreadcrumbSeparatorExample,
    },
    {
      name: "breadcrumb-dropdown",
      type: "registry:example" as const,
      title: "Dropdown",
      component: BreadcrumbDropdownExample,
    },
    {
      name: "breadcrumb-ellipsis",
      type: "registry:example" as const,
      title: "Collapsed",
      component: BreadcrumbEllipsisExample,
    },
    {
      name: "breadcrumb-link",
      type: "registry:example" as const,
      title: "Link",
      component: BreadcrumbLinkExample,
    },
    {
      name: "button-default",
      type: "registry:example" as const,
      title: "Default",
      component: ButtonDefault,
    },
    {
      name: "button-outline",
      type: "registry:example" as const,
      title: "Outline",
      component: ButtonOutline,
    },
    {
      name: "button-secondary",
      type: "registry:example" as const,
      title: "Secondary",
      component: ButtonSecondary,
    },
    {
      name: "button-ghost",
      type: "registry:example" as const,
      title: "Ghost",
      component: ButtonGhost,
    },
    {
      name: "button-destructive",
      type: "registry:example" as const,
      title: "Destructive",
      component: ButtonDestructive,
    },
    {
      name: "button-sizes",
      type: "registry:example" as const,
      title: "Sizes",
      component: ButtonSizes,
    },
  ],
}

export function getRegistryExample(name: string) {
  return registry.examples.find((item) => item.name === name)
}

export function getRegistryBlock(name: string) {
  return registry.blocks.find((item) => item.name === name)
}

export function getRegistryChart(name: string) {
  return registry.charts.find((item) => item.name === name)
}

export function getRegistryComponent(name: string) {
  return registry.components.find((item) => item.name === name)
}
