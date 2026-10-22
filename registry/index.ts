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
      name: "button",
      type: "registry:ui" as const,
      title: "Button",
      description: "Displays a button or a component that looks like a button.",
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
