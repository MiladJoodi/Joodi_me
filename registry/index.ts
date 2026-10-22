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
  BubbleAlignment,
  BubbleDefault,
  BubbleGroupExample,
  BubbleLinkButton,
  BubbleReactionsExample,
  BubbleVariants,
} from "@/registry/examples/bubble"
import {
  ButtonDefault,
  ButtonDestructive,
  ButtonGhost,
  ButtonOutline,
  ButtonSecondary,
  ButtonSizes,
} from "@/registry/examples/button"
import {
  ButtonGroupDefault,
  ButtonGroupDropdown,
  ButtonGroupInput,
  ButtonGroupInputGroup,
  ButtonGroupNested,
  ButtonGroupOrientation,
  ButtonGroupPopover,
  ButtonGroupSelect,
  ButtonGroupSeparatorExample,
  ButtonGroupSize,
  ButtonGroupSplit,
} from "@/registry/examples/button-group"
import {
  CalendarBasic,
  CalendarBookedDates,
  CalendarCaption,
  CalendarCustomDays,
  CalendarDefault,
  CalendarHijri,
  CalendarMultiple,
  CalendarPresets,
  CalendarRange,
  CalendarTime,
  CalendarWeekNumbers,
} from "@/registry/examples/calendar"
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
      name: "bubble",
      type: "registry:ui" as const,
      title: "Bubble",
      description:
        "Displays conversational content in a message bubble with variants, alignment, and reactions.",
    },
    {
      name: "button",
      type: "registry:ui" as const,
      title: "Button",
      description: "Displays a button or a component that looks like a button.",
    },
    {
      name: "button-group",
      type: "registry:ui" as const,
      title: "Button Group",
      description:
        "A container that groups related buttons together with consistent styling.",
    },
    {
      name: "calendar",
      type: "registry:ui" as const,
      title: "Calendar",
      description:
        "A calendar component that allows users to select a date or a range of dates.",
    },
    {
      name: "separator",
      type: "registry:ui" as const,
      title: "Separator",
      description: "Visually or semantically separates content.",
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
      name: "bubble-default",
      type: "registry:example" as const,
      title: "Default",
      component: BubbleDefault,
    },
    {
      name: "bubble-variants",
      type: "registry:example" as const,
      title: "Variants",
      component: BubbleVariants,
    },
    {
      name: "bubble-alignment",
      type: "registry:example" as const,
      title: "Alignment",
      component: BubbleAlignment,
    },
    {
      name: "bubble-group",
      type: "registry:example" as const,
      title: "Group",
      component: BubbleGroupExample,
    },
    {
      name: "bubble-reactions",
      type: "registry:example" as const,
      title: "Reactions",
      component: BubbleReactionsExample,
    },
    {
      name: "bubble-link-button",
      type: "registry:example" as const,
      title: "Link / Button",
      component: BubbleLinkButton,
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
    {
      name: "button-group-default",
      type: "registry:example" as const,
      title: "Default",
      component: ButtonGroupDefault,
    },
    {
      name: "button-group-orientation",
      type: "registry:example" as const,
      title: "Orientation",
      component: ButtonGroupOrientation,
    },
    {
      name: "button-group-size",
      type: "registry:example" as const,
      title: "Size",
      component: ButtonGroupSize,
    },
    {
      name: "button-group-nested",
      type: "registry:example" as const,
      title: "Nested",
      component: ButtonGroupNested,
    },
    {
      name: "button-group-separator",
      type: "registry:example" as const,
      title: "Separator",
      component: ButtonGroupSeparatorExample,
    },
    {
      name: "button-group-split",
      type: "registry:example" as const,
      title: "Split",
      component: ButtonGroupSplit,
    },
    {
      name: "button-group-input",
      type: "registry:example" as const,
      title: "Input",
      component: ButtonGroupInput,
    },
    {
      name: "button-group-input-group",
      type: "registry:example" as const,
      title: "Input Group",
      component: ButtonGroupInputGroup,
    },
    {
      name: "button-group-dropdown",
      type: "registry:example" as const,
      title: "Dropdown",
      component: ButtonGroupDropdown,
    },
    {
      name: "button-group-select",
      type: "registry:example" as const,
      title: "Select",
      component: ButtonGroupSelect,
    },
    {
      name: "button-group-popover",
      type: "registry:example" as const,
      title: "Popover",
      component: ButtonGroupPopover,
    },
    {
      name: "calendar-default",
      type: "registry:example" as const,
      title: "Default",
      component: CalendarDefault,
    },
    {
      name: "calendar-basic",
      type: "registry:example" as const,
      title: "Basic",
      component: CalendarBasic,
    },
    {
      name: "calendar-range",
      type: "registry:example" as const,
      title: "Range",
      component: CalendarRange,
    },
    {
      name: "calendar-caption",
      type: "registry:example" as const,
      title: "Caption",
      component: CalendarCaption,
    },
    {
      name: "calendar-presets",
      type: "registry:example" as const,
      title: "Presets",
      component: CalendarPresets,
    },
    {
      name: "calendar-time",
      type: "registry:example" as const,
      title: "Time",
      component: CalendarTime,
    },
    {
      name: "calendar-booked-dates",
      type: "registry:example" as const,
      title: "Booked",
      component: CalendarBookedDates,
    },
    {
      name: "calendar-custom-days",
      type: "registry:example" as const,
      title: "Custom",
      component: CalendarCustomDays,
    },
    {
      name: "calendar-week-numbers",
      type: "registry:example" as const,
      title: "Week Numbers",
      component: CalendarWeekNumbers,
    },
    {
      name: "calendar-multiple",
      type: "registry:example" as const,
      title: "Multiple",
      component: CalendarMultiple,
    },
    {
      name: "calendar-hijri",
      type: "registry:example" as const,
      title: "Hijri",
      component: CalendarHijri,
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
