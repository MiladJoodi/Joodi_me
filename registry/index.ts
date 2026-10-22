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
  DialogDefault,
  DialogNoClose,
  DialogScrollable,
  DialogShareLink,
  DialogStickyFooter,
} from "@/registry/examples/dialog"
import {
  DrawerDefault,
  DrawerResponsive,
  DrawerScrollable,
  DrawerSides,
} from "@/registry/examples/drawer"
import {
  DropdownMenuCheckboxes,
  DropdownMenuDefault,
  DropdownMenuDestructive,
  DropdownMenuRadio,
  DropdownMenuShortcuts,
  DropdownMenuSubmenu,
} from "@/registry/examples/dropdown-menu"
import {
  EmptyAvatar,
  EmptyBackground,
  EmptyDefault,
  EmptyInputGroup,
  EmptyOutline,
} from "@/registry/examples/empty"
import {
  FieldCheckbox,
  FieldChoiceCard,
  FieldDefault,
  FieldFieldset,
  FieldGroupExample,
  FieldInvalid,
} from "@/registry/examples/field"
import {
  HoverCardDefault,
  HoverCardDelays,
  HoverCardSides,
} from "@/registry/examples/hover-card"
import {
  InputDefault,
  InputDisabled,
  InputField,
  InputFile,
  InputInvalid,
  InputWithButton,
} from "@/registry/examples/input"
import {
  InputGroupBlockStart,
  InputGroupButtonExample,
  InputGroupDefault,
  InputGroupDropdown,
  InputGroupIcon,
  InputGroupKbd,
  InputGroupSpinner,
  InputGroupTextareaExample,
  InputGroupTextExample,
} from "@/registry/examples/input-group"
import {
  InputOTPControlled,
  InputOTPDefault,
  InputOTPDisabled,
  InputOTPFour,
  InputOTPInvalid,
  InputOTPPattern,
} from "@/registry/examples/input-otp"
import {
  ItemAvatar,
  ItemDefault,
  ItemGroupExample,
  ItemHeaderExample,
  ItemIcon,
  ItemImage,
  ItemLink,
  ItemSize,
  ItemVariant,
} from "@/registry/examples/item"
import {
  KbdButton,
  KbdDefault,
  KbdGroupExample,
  KbdInputGroup,
} from "@/registry/examples/kbd"
import {
  LabelCheckbox,
  LabelDefault,
  LabelDisabled,
} from "@/registry/examples/label"
import {
  MarkerBorder,
  MarkerDefault,
  MarkerLink,
  MarkerSeparatorExample,
  MarkerShimmer,
  MarkerStatus,
  MarkerVariant,
} from "@/registry/examples/marker"
import {
  MenubarCheckboxExample,
  MenubarDefault,
  MenubarIcons,
  MenubarRadioExample,
  MenubarSubmenu,
} from "@/registry/examples/menubar"
import {
  MessageActions,
  MessageAttachmentExample,
  MessageAvatarExample,
  MessageDefault,
  MessageGroupExample,
  MessageHeaderExample,
  MessageStatus,
} from "@/registry/examples/message"
import {
  MessageScrollerAutoScroll,
  MessageScrollerCommands,
  MessageScrollerDefault,
} from "@/registry/examples/message-scroller"
import {
  NativeSelectDefault,
  NativeSelectDisabled,
  NativeSelectGroups,
  NativeSelectInvalid,
  NativeSelectSize,
} from "@/registry/examples/native-select"
import {
  NavigationMenuDefault,
  NavigationMenuSimple,
  NavigationMenuViewportFalse,
} from "@/registry/examples/navigation-menu"
import {
  PaginationDefault,
  PaginationIcons,
  PaginationSimple,
} from "@/registry/examples/pagination"
import {
  PopoverAlign,
  PopoverDefault,
  PopoverForm,
} from "@/registry/examples/popover"
import {
  ProgressControlled,
  ProgressDefault,
  ProgressLabel,
} from "@/registry/examples/progress"
import {
  RadioGroupChoiceCard,
  RadioGroupDefault,
  RadioGroupDescription,
  RadioGroupDisabled,
  RadioGroupInvalid,
} from "@/registry/examples/radio-group"
import {
  ResizableDefault,
  ResizableHandleExample,
  ResizableVertical,
} from "@/registry/examples/resizable"
import {
  ScrollAreaDefault,
  ScrollAreaHorizontal,
} from "@/registry/examples/scroll-area"
import {
  SelectDefault,
  SelectDisabled,
  SelectGroups,
  SelectInvalid,
  SelectScrollable,
} from "@/registry/examples/select"
import {
  SeparatorDefault,
  SeparatorList,
  SeparatorVertical,
} from "@/registry/examples/separator"
import {
  SheetDefault,
  SheetNoClose,
  SheetSides,
} from "@/registry/examples/sheet"
import {
  SkeletonCard,
  SkeletonDefault,
  SkeletonText,
} from "@/registry/examples/skeleton"
import {
  SliderDefault,
  SliderDisabled,
  SliderRange,
  SliderVertical,
} from "@/registry/examples/slider"
import {
  SpinnerBadge,
  SpinnerButton,
  SpinnerDefault,
  SpinnerSize,
} from "@/registry/examples/spinner"
import {
  SwitchDefault,
  SwitchDescription,
  SwitchDisabled,
  SwitchSize,
} from "@/registry/examples/switch"
import {
  TableDefault,
  TableFooterExample,
} from "@/registry/examples/table"
import {
  TabsDefault,
  TabsDisabled,
  TabsIcons,
  TabsLine,
  TabsVertical,
} from "@/registry/examples/tabs"
import {
  TextareaDefault,
  TextareaDisabled,
  TextareaField,
  TextareaInvalid,
  TextareaWithButton,
} from "@/registry/examples/textarea"
import {
  SonnerDefault,
  SonnerDescription,
  SonnerPosition,
  SonnerTypes,
} from "@/registry/examples/sonner"
import {
  ToggleDefault,
  ToggleDisabled,
  ToggleOutline,
  ToggleSize,
  ToggleWithText,
} from "@/registry/examples/toggle"
import {
  ToggleGroupDefault,
  ToggleGroupDisabled,
  ToggleGroupOutline,
  ToggleGroupSpacing,
  ToggleGroupVertical,
} from "@/registry/examples/toggle-group"
import {
  TooltipDefault,
  TooltipDisabled,
  TooltipKbd,
  TooltipSide,
} from "@/registry/examples/tooltip"
import {
  TraceCollapsibleExample,
  TraceDefault,
  TraceDescriptionExample,
  TraceGroup,
  TraceLink,
  TraceOpen,
  TraceSources,
  TraceStatus,
} from "@/registry/examples/trace"
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
  CardDefault,
  CardEdgeToEdge,
  CardImage,
  CardImageOverlay,
  CardSmall,
  CardSpacing,
} from "@/registry/examples/card"
import {
  CarouselApiDemo,
  CarouselDefault,
  CarouselOrientation,
  CarouselSize,
  CarouselSpacing,
} from "@/registry/examples/carousel"
import {
  CheckboxDefault,
  CheckboxDescription,
  CheckboxDisabled,
  CheckboxGroup,
  CheckboxInvalid,
} from "@/registry/examples/checkbox"
import {
  CodeBlockDefault,
  CodeBlockDestructive,
  CodeBlockDiff,
  CodeBlockHeaderExample,
  CodeBlockLineNumbers,
  CodeBlockSize,
  CodeBlockSyntax,
  CodeBlockWrap,
} from "@/registry/examples/code-block"
import {
  CollapsibleAdvanced,
  CollapsibleDefault,
  CollapsibleDetails,
  CollapsibleFileTree,
} from "@/registry/examples/collapsible"
import {
  ComboboxClearExample,
  ComboboxDefault,
  ComboboxDisabled,
  ComboboxGroups,
  ComboboxMultiple,
} from "@/registry/examples/combobox"
import {
  CommandDefault,
  CommandDialogExample,
  CommandGroups,
  CommandShortcuts,
} from "@/registry/examples/command"
import {
  ContextMenuCheckboxes,
  ContextMenuDefault,
  ContextMenuDestructive,
  ContextMenuRadio,
  ContextMenuShortcuts,
  ContextMenuSubmenu,
} from "@/registry/examples/context-menu"
import {
  DataTableBasic,
  DataTableFiltering,
  DataTablePagination,
  DataTableSorting,
} from "@/registry/examples/data-table"
import {
  DatePickerCaption,
  DatePickerDefault,
  DatePickerInput,
  DatePickerRange,
  DatePickerTime,
} from "@/registry/examples/date-picker"
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
      name: "card",
      type: "registry:ui" as const,
      title: "Card",
      description: "Displays a card with header, content, and footer.",
    },
    {
      name: "carousel",
      type: "registry:ui" as const,
      title: "Carousel",
      description: "A carousel with motion and swipe built using Embla.",
    },
    {
      name: "checkbox",
      type: "registry:ui" as const,
      title: "Checkbox",
      description:
        "A control that allows the user to toggle between checked and not checked.",
    },
    {
      name: "code-block",
      type: "registry:ui" as const,
      title: "Code Block",
      description:
        "Displays code, terminal output and diffs with an optional header, line numbers and a copy button.",
    },
    {
      name: "collapsible",
      type: "registry:ui" as const,
      title: "Collapsible",
      description:
        "An interactive component which expands and collapses a panel.",
    },
    {
      name: "combobox",
      type: "registry:ui" as const,
      title: "Combobox",
      description: "Autocomplete input with a list of suggestions.",
    },
    {
      name: "command",
      type: "registry:ui" as const,
      title: "Command",
      description: "Command menu for search and quick actions.",
    },
    {
      name: "context-menu",
      type: "registry:ui" as const,
      title: "Context Menu",
      description:
        "Displays a menu of actions or options when the user right-clicks an element.",
    },
    {
      name: "table",
      type: "registry:ui" as const,
      title: "Table",
      description:
        "A responsive table for displaying tabular data. Pair with TanStack Table for sorting, filtering, and pagination.",
    },
    {
      name: "dialog",
      type: "registry:ui" as const,
      title: "Dialog",
      description:
        "A window overlaid on the primary content for critical information or actions.",
    },
    {
      name: "drawer",
      type: "registry:ui" as const,
      title: "Drawer",
      description:
        "A panel that slides in from an edge. Prefer direction start/end for RTL-safe sides.",
    },
    {
      name: "dropdown-menu",
      type: "registry:ui" as const,
      title: "Dropdown Menu",
      description:
        "Displays a menu of actions triggered by a button — shortcuts, submenus, checkboxes, and radios.",
    },
    {
      name: "empty",
      type: "registry:ui" as const,
      title: "Empty",
      description: "Use to display an empty state when there is no data yet.",
    },
    {
      name: "field",
      type: "registry:ui" as const,
      title: "Field",
      description:
        "Combine labels, controls, and help text into accessible form fields.",
    },
    {
      name: "hover-card",
      type: "registry:ui" as const,
      title: "Hover Card",
      description:
        "For sighted users to preview content available behind a link.",
    },
    {
      name: "input",
      type: "registry:ui" as const,
      title: "Input",
      description:
        "Displays a form input field or a component that looks like an input field.",
    },
    {
      name: "input-group",
      type: "registry:ui" as const,
      title: "Input Group",
      description:
        "Display additional information or actions to an input or textarea.",
    },
    {
      name: "input-otp",
      type: "registry:ui" as const,
      title: "Input OTP",
      description:
        "Accessible one-time password component with copy-paste functionality.",
    },
    {
      name: "item",
      type: "registry:ui" as const,
      title: "Item",
      description:
        "A versatile component for displaying content with media, title, description, and actions.",
    },
    {
      name: "kbd",
      type: "registry:ui" as const,
      title: "Kbd",
      description: "Used to display textual user input from keyboard.",
    },
    {
      name: "marker",
      type: "registry:ui" as const,
      title: "Marker",
      description:
        "Displays an inline status, system note, bordered row, or labeled separator in a conversation.",
    },
    {
      name: "menubar",
      type: "registry:ui" as const,
      title: "Menubar",
      description:
        "A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.",
    },
    {
      name: "message",
      type: "registry:ui" as const,
      title: "Message",
      description:
        "Displays a message in a conversation, with optional avatar, header, footer, and alignment.",
    },
    {
      name: "message-scroller",
      type: "registry:ui" as const,
      title: "Message Scroller",
      description:
        "A chat scroll container that anchors turns, follows streamed responses, and jumps to any message.",
    },
    {
      name: "native-select",
      type: "registry:ui" as const,
      title: "Native Select",
      description:
        "A styled native HTML select element with consistent design system integration.",
    },
    {
      name: "navigation-menu",
      type: "registry:ui" as const,
      title: "Navigation Menu",
      description: "A collection of links for navigating websites.",
    },
    {
      name: "pagination",
      type: "registry:ui" as const,
      title: "Pagination",
      description: "Pagination with page navigation, next and previous links.",
    },
    {
      name: "textarea",
      type: "registry:ui" as const,
      title: "Textarea",
      description:
        "Displays a form textarea or a component that looks like a textarea.",
    },
    {
      name: "label",
      type: "registry:ui" as const,
      title: "Label",
      description: "Renders an accessible label associated with controls.",
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
      name: "popover",
      type: "registry:ui" as const,
      title: "Popover",
      description: "Displays rich content in a portal, triggered by a button.",
    },
    {
      name: "progress",
      type: "registry:ui" as const,
      title: "Progress",
      description:
        "Displays an indicator showing the completion progress of a task.",
    },
    {
      name: "radio-group",
      type: "registry:ui" as const,
      title: "Radio Group",
      description:
        "A set of checkable buttons where only one can be selected at a time.",
    },
    {
      name: "resizable",
      type: "registry:ui" as const,
      title: "Resizable",
      description:
        "Accessible resizable panel groups and layouts with keyboard support.",
    },
    {
      name: "scroll-area",
      type: "registry:ui" as const,
      title: "Scroll Area",
      description:
        "Augments native scroll functionality for custom, cross-browser styling.",
    },
    {
      name: "select",
      type: "registry:ui" as const,
      title: "Select",
      description:
        "Displays a list of options for the user to pick from—triggered by a button.",
    },
    {
      name: "separator",
      type: "registry:ui" as const,
      title: "Separator",
      description: "Visually or semantically separates content.",
    },
    {
      name: "sheet",
      type: "registry:ui" as const,
      title: "Sheet",
      description:
        "A panel that slides in from an edge. Prefer side start/end for RTL-safe edges.",
    },
    {
      name: "skeleton",
      type: "registry:ui" as const,
      title: "Skeleton",
      description: "Use to show a placeholder while content is loading.",
    },
    {
      name: "slider",
      type: "registry:ui" as const,
      title: "Slider",
      description:
        "An input where the user selects a value from within a given range.",
    },
    {
      name: "spinner",
      type: "registry:ui" as const,
      title: "Spinner",
      description: "A loading spinner.",
    },
    {
      name: "switch",
      type: "registry:ui" as const,
      title: "Switch",
      description:
        "A control that allows the user to toggle between checked and not checked.",
    },
    {
      name: "tabs",
      type: "registry:ui" as const,
      title: "Tabs",
      description:
        "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
      name: "sonner",
      type: "registry:ui" as const,
      title: "Sonner",
      description:
        "Brief toast notifications for success, errors, and background work.",
    },
    {
      name: "toggle",
      type: "registry:ui" as const,
      title: "Toggle",
      description: "A two-state button that can be either on or off.",
    },
    {
      name: "toggle-group",
      type: "registry:ui" as const,
      title: "Toggle Group",
      description: "A set of two-state buttons that can be toggled on or off.",
    },
    {
      name: "tooltip",
      type: "registry:ui" as const,
      title: "Tooltip",
      description:
        "A popup that displays information related to an element when it receives focus or hover.",
    },
    {
      name: "trace",
      type: "registry:ui" as const,
      title: "Trace",
      description:
        "Rows for agent steps — reasoning, tool calls, sources, and plans.",
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
      name: "dialog-default",
      type: "registry:example" as const,
      title: "Basic",
      component: DialogDefault,
    },
    {
      name: "dialog-share-link",
      type: "registry:example" as const,
      title: "Share Link",
      component: DialogShareLink,
    },
    {
      name: "dialog-no-close",
      type: "registry:example" as const,
      title: "No Close Button",
      component: DialogNoClose,
    },
    {
      name: "dialog-scrollable",
      type: "registry:example" as const,
      title: "Scrollable",
      component: DialogScrollable,
    },
    {
      name: "dialog-sticky-footer",
      type: "registry:example" as const,
      title: "Sticky Footer",
      component: DialogStickyFooter,
    },
    {
      name: "drawer-default",
      type: "registry:example" as const,
      title: "Basic",
      component: DrawerDefault,
    },
    {
      name: "drawer-sides",
      type: "registry:example" as const,
      title: "Sides",
      component: DrawerSides,
    },
    {
      name: "drawer-scrollable",
      type: "registry:example" as const,
      title: "Scrollable",
      component: DrawerScrollable,
    },
    {
      name: "drawer-responsive",
      type: "registry:example" as const,
      title: "With Form",
      component: DrawerResponsive,
    },
    {
      name: "dropdown-menu-default",
      type: "registry:example" as const,
      title: "Basic",
      component: DropdownMenuDefault,
    },
    {
      name: "dropdown-menu-shortcuts",
      type: "registry:example" as const,
      title: "Shortcuts",
      component: DropdownMenuShortcuts,
    },
    {
      name: "dropdown-menu-submenu",
      type: "registry:example" as const,
      title: "Submenu",
      component: DropdownMenuSubmenu,
    },
    {
      name: "dropdown-menu-checkboxes",
      type: "registry:example" as const,
      title: "Checkboxes",
      component: DropdownMenuCheckboxes,
    },
    {
      name: "dropdown-menu-radio",
      type: "registry:example" as const,
      title: "Radio",
      component: DropdownMenuRadio,
    },
    {
      name: "dropdown-menu-destructive",
      type: "registry:example" as const,
      title: "Destructive",
      component: DropdownMenuDestructive,
    },
    {
      name: "empty-default",
      type: "registry:example" as const,
      title: "Basic",
      component: EmptyDefault,
    },
    {
      name: "empty-outline",
      type: "registry:example" as const,
      title: "Outline",
      component: EmptyOutline,
    },
    {
      name: "empty-background",
      type: "registry:example" as const,
      title: "Background",
      component: EmptyBackground,
    },
    {
      name: "empty-avatar",
      type: "registry:example" as const,
      title: "Avatar",
      component: EmptyAvatar,
    },
    {
      name: "empty-input-group",
      type: "registry:example" as const,
      title: "Input Group",
      component: EmptyInputGroup,
    },
    {
      name: "field-default",
      type: "registry:example" as const,
      title: "Basic",
      component: FieldDefault,
    },
    {
      name: "field-invalid",
      type: "registry:example" as const,
      title: "Invalid",
      component: FieldInvalid,
    },
    {
      name: "field-fieldset",
      type: "registry:example" as const,
      title: "Fieldset",
      component: FieldFieldset,
    },
    {
      name: "field-checkbox",
      type: "registry:example" as const,
      title: "Checkbox",
      component: FieldCheckbox,
    },
    {
      name: "field-choice-card",
      type: "registry:example" as const,
      title: "Choice Card",
      component: FieldChoiceCard,
    },
    {
      name: "field-group",
      type: "registry:example" as const,
      title: "Field Group",
      component: FieldGroupExample,
    },
    {
      name: "hover-card-default",
      type: "registry:example" as const,
      title: "Basic",
      component: HoverCardDefault,
    },
    {
      name: "hover-card-sides",
      type: "registry:example" as const,
      title: "Sides",
      component: HoverCardSides,
    },
    {
      name: "hover-card-delays",
      type: "registry:example" as const,
      title: "Delays",
      component: HoverCardDelays,
    },
    {
      name: "input-default",
      type: "registry:example" as const,
      title: "Basic",
      component: InputDefault,
    },
    {
      name: "input-field",
      type: "registry:example" as const,
      title: "Field",
      component: InputField,
    },
    {
      name: "input-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: InputDisabled,
    },
    {
      name: "input-invalid",
      type: "registry:example" as const,
      title: "Invalid",
      component: InputInvalid,
    },
    {
      name: "input-file",
      type: "registry:example" as const,
      title: "File",
      component: InputFile,
    },
    {
      name: "input-with-button",
      type: "registry:example" as const,
      title: "With Button",
      component: InputWithButton,
    },
    {
      name: "input-group-default",
      type: "registry:example" as const,
      title: "Icon",
      component: InputGroupDefault,
    },
    {
      name: "input-group-icon",
      type: "registry:example" as const,
      title: "Addon Sides",
      component: InputGroupIcon,
    },
    {
      name: "input-group-text",
      type: "registry:example" as const,
      title: "Text",
      component: InputGroupTextExample,
    },
    {
      name: "input-group-button",
      type: "registry:example" as const,
      title: "Button",
      component: InputGroupButtonExample,
    },
    {
      name: "input-group-dropdown",
      type: "registry:example" as const,
      title: "Dropdown",
      component: InputGroupDropdown,
    },
    {
      name: "input-group-spinner",
      type: "registry:example" as const,
      title: "Spinner",
      component: InputGroupSpinner,
    },
    {
      name: "input-group-textarea",
      type: "registry:example" as const,
      title: "Textarea",
      component: InputGroupTextareaExample,
    },
    {
      name: "input-group-block-start",
      type: "registry:example" as const,
      title: "Block Start",
      component: InputGroupBlockStart,
    },
    {
      name: "input-group-kbd",
      type: "registry:example" as const,
      title: "Keyboard",
      component: InputGroupKbd,
    },
    {
      name: "input-otp-default",
      type: "registry:example" as const,
      title: "Basic",
      component: InputOTPDefault,
    },
    {
      name: "input-otp-pattern",
      type: "registry:example" as const,
      title: "Pattern",
      component: InputOTPPattern,
    },
    {
      name: "input-otp-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: InputOTPDisabled,
    },
    {
      name: "input-otp-controlled",
      type: "registry:example" as const,
      title: "Controlled",
      component: InputOTPControlled,
    },
    {
      name: "input-otp-invalid",
      type: "registry:example" as const,
      title: "Invalid",
      component: InputOTPInvalid,
    },
    {
      name: "input-otp-four",
      type: "registry:example" as const,
      title: "Four Digits",
      component: InputOTPFour,
    },
    {
      name: "item-default",
      type: "registry:example" as const,
      title: "Basic",
      component: ItemDefault,
    },
    {
      name: "item-variant",
      type: "registry:example" as const,
      title: "Variant",
      component: ItemVariant,
    },
    {
      name: "item-size",
      type: "registry:example" as const,
      title: "Size",
      component: ItemSize,
    },
    {
      name: "item-icon",
      type: "registry:example" as const,
      title: "Icon",
      component: ItemIcon,
    },
    {
      name: "item-avatar",
      type: "registry:example" as const,
      title: "Avatar",
      component: ItemAvatar,
    },
    {
      name: "item-image",
      type: "registry:example" as const,
      title: "Image",
      component: ItemImage,
    },
    {
      name: "item-group",
      type: "registry:example" as const,
      title: "Group",
      component: ItemGroupExample,
    },
    {
      name: "item-header",
      type: "registry:example" as const,
      title: "Header",
      component: ItemHeaderExample,
    },
    {
      name: "item-link",
      type: "registry:example" as const,
      title: "Link",
      component: ItemLink,
    },
    {
      name: "kbd-default",
      type: "registry:example" as const,
      title: "Basic",
      component: KbdDefault,
    },
    {
      name: "kbd-group",
      type: "registry:example" as const,
      title: "Group",
      component: KbdGroupExample,
    },
    {
      name: "kbd-button",
      type: "registry:example" as const,
      title: "Button",
      component: KbdButton,
    },
    {
      name: "kbd-input-group",
      type: "registry:example" as const,
      title: "Input Group",
      component: KbdInputGroup,
    },
    {
      name: "label-default",
      type: "registry:example" as const,
      title: "Basic",
      component: LabelDefault,
    },
    {
      name: "label-checkbox",
      type: "registry:example" as const,
      title: "Checkbox",
      component: LabelCheckbox,
    },
    {
      name: "label-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: LabelDisabled,
    },
    {
      name: "marker-default",
      type: "registry:example" as const,
      title: "Basic",
      component: MarkerDefault,
    },
    {
      name: "marker-variant",
      type: "registry:example" as const,
      title: "Variant",
      component: MarkerVariant,
    },
    {
      name: "marker-status",
      type: "registry:example" as const,
      title: "Status",
      component: MarkerStatus,
    },
    {
      name: "marker-shimmer",
      type: "registry:example" as const,
      title: "Shimmer",
      component: MarkerShimmer,
    },
    {
      name: "marker-separator",
      type: "registry:example" as const,
      title: "Separator",
      component: MarkerSeparatorExample,
    },
    {
      name: "marker-border",
      type: "registry:example" as const,
      title: "Border",
      component: MarkerBorder,
    },
    {
      name: "marker-link",
      type: "registry:example" as const,
      title: "Link",
      component: MarkerLink,
    },
    {
      name: "menubar-default",
      type: "registry:example" as const,
      title: "Basic",
      component: MenubarDefault,
    },
    {
      name: "menubar-checkbox",
      type: "registry:example" as const,
      title: "Checkbox",
      component: MenubarCheckboxExample,
    },
    {
      name: "menubar-radio",
      type: "registry:example" as const,
      title: "Radio",
      component: MenubarRadioExample,
    },
    {
      name: "menubar-submenu",
      type: "registry:example" as const,
      title: "Submenu",
      component: MenubarSubmenu,
    },
    {
      name: "menubar-icons",
      type: "registry:example" as const,
      title: "Icons",
      component: MenubarIcons,
    },
    {
      name: "message-default",
      type: "registry:example" as const,
      title: "Basic",
      component: MessageDefault,
    },
    {
      name: "message-avatar",
      type: "registry:example" as const,
      title: "Avatar",
      component: MessageAvatarExample,
    },
    {
      name: "message-group",
      type: "registry:example" as const,
      title: "Group",
      component: MessageGroupExample,
    },
    {
      name: "message-header",
      type: "registry:example" as const,
      title: "Header & Footer",
      component: MessageHeaderExample,
    },
    {
      name: "message-actions",
      type: "registry:example" as const,
      title: "Actions",
      component: MessageActions,
    },
    {
      name: "message-attachment",
      type: "registry:example" as const,
      title: "Attachment",
      component: MessageAttachmentExample,
    },
    {
      name: "message-status",
      type: "registry:example" as const,
      title: "Status",
      component: MessageStatus,
    },
    {
      name: "message-scroller-default",
      type: "registry:example" as const,
      title: "Basic",
      component: MessageScrollerDefault,
    },
    {
      name: "message-scroller-auto-scroll",
      type: "registry:example" as const,
      title: "Auto Scroll",
      component: MessageScrollerAutoScroll,
    },
    {
      name: "message-scroller-commands",
      type: "registry:example" as const,
      title: "Commands",
      component: MessageScrollerCommands,
    },
    {
      name: "native-select-default",
      type: "registry:example" as const,
      title: "Basic",
      component: NativeSelectDefault,
    },
    {
      name: "native-select-groups",
      type: "registry:example" as const,
      title: "Groups",
      component: NativeSelectGroups,
    },
    {
      name: "native-select-size",
      type: "registry:example" as const,
      title: "Size",
      component: NativeSelectSize,
    },
    {
      name: "native-select-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: NativeSelectDisabled,
    },
    {
      name: "native-select-invalid",
      type: "registry:example" as const,
      title: "Invalid",
      component: NativeSelectInvalid,
    },
    {
      name: "navigation-menu-default",
      type: "registry:example" as const,
      title: "Basic",
      component: NavigationMenuDefault,
    },
    {
      name: "navigation-menu-simple",
      type: "registry:example" as const,
      title: "Link",
      component: NavigationMenuSimple,
    },
    {
      name: "navigation-menu-viewport",
      type: "registry:example" as const,
      title: "No Viewport",
      component: NavigationMenuViewportFalse,
    },
    {
      name: "pagination-default",
      type: "registry:example" as const,
      title: "Basic",
      component: PaginationDefault,
    },
    {
      name: "pagination-simple",
      type: "registry:example" as const,
      title: "Simple",
      component: PaginationSimple,
    },
    {
      name: "pagination-icons",
      type: "registry:example" as const,
      title: "Icons Only",
      component: PaginationIcons,
    },
    {
      name: "popover-default",
      type: "registry:example" as const,
      title: "Basic",
      component: PopoverDefault,
    },
    {
      name: "popover-align",
      type: "registry:example" as const,
      title: "Align",
      component: PopoverAlign,
    },
    {
      name: "popover-form",
      type: "registry:example" as const,
      title: "With Form",
      component: PopoverForm,
    },
    {
      name: "progress-default",
      type: "registry:example" as const,
      title: "Basic",
      component: ProgressDefault,
    },
    {
      name: "progress-label",
      type: "registry:example" as const,
      title: "Label",
      component: ProgressLabel,
    },
    {
      name: "progress-controlled",
      type: "registry:example" as const,
      title: "Controlled",
      component: ProgressControlled,
    },
    {
      name: "radio-group-default",
      type: "registry:example" as const,
      title: "Basic",
      component: RadioGroupDefault,
    },
    {
      name: "radio-group-description",
      type: "registry:example" as const,
      title: "Description",
      component: RadioGroupDescription,
    },
    {
      name: "radio-group-choice-card",
      type: "registry:example" as const,
      title: "Choice Card",
      component: RadioGroupChoiceCard,
    },
    {
      name: "radio-group-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: RadioGroupDisabled,
    },
    {
      name: "radio-group-invalid",
      type: "registry:example" as const,
      title: "Invalid",
      component: RadioGroupInvalid,
    },
    {
      name: "resizable-default",
      type: "registry:example" as const,
      title: "Basic",
      component: ResizableDefault,
    },
    {
      name: "resizable-vertical",
      type: "registry:example" as const,
      title: "Vertical",
      component: ResizableVertical,
    },
    {
      name: "resizable-handle",
      type: "registry:example" as const,
      title: "Handle",
      component: ResizableHandleExample,
    },
    {
      name: "scroll-area-default",
      type: "registry:example" as const,
      title: "Basic",
      component: ScrollAreaDefault,
    },
    {
      name: "scroll-area-horizontal",
      type: "registry:example" as const,
      title: "Horizontal",
      component: ScrollAreaHorizontal,
    },
    {
      name: "select-default",
      type: "registry:example" as const,
      title: "Basic",
      component: SelectDefault,
    },
    {
      name: "select-groups",
      type: "registry:example" as const,
      title: "Groups",
      component: SelectGroups,
    },
    {
      name: "select-scrollable",
      type: "registry:example" as const,
      title: "Scrollable",
      component: SelectScrollable,
    },
    {
      name: "select-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: SelectDisabled,
    },
    {
      name: "select-invalid",
      type: "registry:example" as const,
      title: "Invalid",
      component: SelectInvalid,
    },
    {
      name: "separator-default",
      type: "registry:example" as const,
      title: "Basic",
      component: SeparatorDefault,
    },
    {
      name: "separator-vertical",
      type: "registry:example" as const,
      title: "Vertical",
      component: SeparatorVertical,
    },
    {
      name: "separator-list",
      type: "registry:example" as const,
      title: "List",
      component: SeparatorList,
    },
    {
      name: "sheet-default",
      type: "registry:example" as const,
      title: "Basic",
      component: SheetDefault,
    },
    {
      name: "sheet-sides",
      type: "registry:example" as const,
      title: "Sides",
      component: SheetSides,
    },
    {
      name: "sheet-no-close",
      type: "registry:example" as const,
      title: "No Close Button",
      component: SheetNoClose,
    },
    {
      name: "skeleton-default",
      type: "registry:example" as const,
      title: "Basic",
      component: SkeletonDefault,
    },
    {
      name: "skeleton-card",
      type: "registry:example" as const,
      title: "Card",
      component: SkeletonCard,
    },
    {
      name: "skeleton-text",
      type: "registry:example" as const,
      title: "Text",
      component: SkeletonText,
    },
    {
      name: "slider-default",
      type: "registry:example" as const,
      title: "Basic",
      component: SliderDefault,
    },
    {
      name: "slider-range",
      type: "registry:example" as const,
      title: "Range",
      component: SliderRange,
    },
    {
      name: "slider-vertical",
      type: "registry:example" as const,
      title: "Vertical",
      component: SliderVertical,
    },
    {
      name: "slider-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: SliderDisabled,
    },
    {
      name: "spinner-default",
      type: "registry:example" as const,
      title: "Basic",
      component: SpinnerDefault,
    },
    {
      name: "spinner-size",
      type: "registry:example" as const,
      title: "Size",
      component: SpinnerSize,
    },
    {
      name: "spinner-button",
      type: "registry:example" as const,
      title: "Button",
      component: SpinnerButton,
    },
    {
      name: "spinner-badge",
      type: "registry:example" as const,
      title: "Badge",
      component: SpinnerBadge,
    },
    {
      name: "switch-default",
      type: "registry:example" as const,
      title: "Basic",
      component: SwitchDefault,
    },
    {
      name: "switch-description",
      type: "registry:example" as const,
      title: "Description",
      component: SwitchDescription,
    },
    {
      name: "switch-size",
      type: "registry:example" as const,
      title: "Size",
      component: SwitchSize,
    },
    {
      name: "switch-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: SwitchDisabled,
    },
    {
      name: "table-default",
      type: "registry:example" as const,
      title: "Basic",
      component: TableDefault,
    },
    {
      name: "table-footer",
      type: "registry:example" as const,
      title: "Footer",
      component: TableFooterExample,
    },
    {
      name: "tabs-default",
      type: "registry:example" as const,
      title: "Basic",
      component: TabsDefault,
    },
    {
      name: "tabs-line",
      type: "registry:example" as const,
      title: "Line",
      component: TabsLine,
    },
    {
      name: "tabs-vertical",
      type: "registry:example" as const,
      title: "Vertical",
      component: TabsVertical,
    },
    {
      name: "tabs-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: TabsDisabled,
    },
    {
      name: "tabs-icons",
      type: "registry:example" as const,
      title: "Icons",
      component: TabsIcons,
    },
    {
      name: "textarea-default",
      type: "registry:example" as const,
      title: "Basic",
      component: TextareaDefault,
    },
    {
      name: "textarea-field",
      type: "registry:example" as const,
      title: "Field",
      component: TextareaField,
    },
    {
      name: "textarea-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: TextareaDisabled,
    },
    {
      name: "textarea-invalid",
      type: "registry:example" as const,
      title: "Invalid",
      component: TextareaInvalid,
    },
    {
      name: "textarea-with-button",
      type: "registry:example" as const,
      title: "With Button",
      component: TextareaWithButton,
    },
    {
      name: "sonner-default",
      type: "registry:example" as const,
      title: "Basic",
      component: SonnerDefault,
    },
    {
      name: "sonner-types",
      type: "registry:example" as const,
      title: "Types",
      component: SonnerTypes,
    },
    {
      name: "sonner-description",
      type: "registry:example" as const,
      title: "Description",
      component: SonnerDescription,
    },
    {
      name: "sonner-position",
      type: "registry:example" as const,
      title: "Position",
      component: SonnerPosition,
    },
    {
      name: "toggle-default",
      type: "registry:example" as const,
      title: "Basic",
      component: ToggleDefault,
    },
    {
      name: "toggle-outline",
      type: "registry:example" as const,
      title: "Outline",
      component: ToggleOutline,
    },
    {
      name: "toggle-with-text",
      type: "registry:example" as const,
      title: "With Text",
      component: ToggleWithText,
    },
    {
      name: "toggle-size",
      type: "registry:example" as const,
      title: "Size",
      component: ToggleSize,
    },
    {
      name: "toggle-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: ToggleDisabled,
    },
    {
      name: "toggle-group-default",
      type: "registry:example" as const,
      title: "Basic",
      component: ToggleGroupDefault,
    },
    {
      name: "toggle-group-outline",
      type: "registry:example" as const,
      title: "Outline",
      component: ToggleGroupOutline,
    },
    {
      name: "toggle-group-spacing",
      type: "registry:example" as const,
      title: "Spacing",
      component: ToggleGroupSpacing,
    },
    {
      name: "toggle-group-vertical",
      type: "registry:example" as const,
      title: "Vertical",
      component: ToggleGroupVertical,
    },
    {
      name: "toggle-group-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: ToggleGroupDisabled,
    },
    {
      name: "tooltip-default",
      type: "registry:example" as const,
      title: "Basic",
      component: TooltipDefault,
    },
    {
      name: "tooltip-side",
      type: "registry:example" as const,
      title: "Side",
      component: TooltipSide,
    },
    {
      name: "tooltip-kbd",
      type: "registry:example" as const,
      title: "With Keyboard Shortcut",
      component: TooltipKbd,
    },
    {
      name: "tooltip-disabled",
      type: "registry:example" as const,
      title: "Disabled Button",
      component: TooltipDisabled,
    },
    {
      name: "trace-default",
      type: "registry:example" as const,
      title: "Basic",
      component: TraceDefault,
    },
    {
      name: "trace-status",
      type: "registry:example" as const,
      title: "Status",
      component: TraceStatus,
    },
    {
      name: "trace-description",
      type: "registry:example" as const,
      title: "Description",
      component: TraceDescriptionExample,
    },
    {
      name: "trace-collapsible",
      type: "registry:example" as const,
      title: "Collapsible",
      component: TraceCollapsibleExample,
    },
    {
      name: "trace-open",
      type: "registry:example" as const,
      title: "Open State",
      component: TraceOpen,
    },
    {
      name: "trace-link",
      type: "registry:example" as const,
      title: "Link",
      component: TraceLink,
    },
    {
      name: "trace-group",
      type: "registry:example" as const,
      title: "Group",
      component: TraceGroup,
    },
    {
      name: "trace-sources",
      type: "registry:example" as const,
      title: "Sources",
      component: TraceSources,
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
      name: "card-default",
      type: "registry:example" as const,
      title: "Default",
      component: CardDefault,
    },
    {
      name: "card-small",
      type: "registry:example" as const,
      title: "Small",
      component: CardSmall,
    },
    {
      name: "card-spacing",
      type: "registry:example" as const,
      title: "Spacing",
      component: CardSpacing,
    },
    {
      name: "card-edge-to-edge",
      type: "registry:example" as const,
      title: "Edge to edge",
      component: CardEdgeToEdge,
    },
    {
      name: "card-image",
      type: "registry:example" as const,
      title: "Image",
      component: CardImage,
    },
    {
      name: "card-image-overlay",
      type: "registry:example" as const,
      title: "Image overlay",
      component: CardImageOverlay,
    },
    {
      name: "carousel-default",
      type: "registry:example" as const,
      title: "Default",
      component: CarouselDefault,
    },
    {
      name: "carousel-size",
      type: "registry:example" as const,
      title: "Sizes",
      component: CarouselSize,
    },
    {
      name: "carousel-spacing",
      type: "registry:example" as const,
      title: "Spacing",
      component: CarouselSpacing,
    },
    {
      name: "carousel-orientation",
      type: "registry:example" as const,
      title: "Orientation",
      component: CarouselOrientation,
    },
    {
      name: "carousel-api",
      type: "registry:example" as const,
      title: "API",
      component: CarouselApiDemo,
    },
    {
      name: "checkbox-default",
      type: "registry:example" as const,
      title: "Default",
      component: CheckboxDefault,
    },
    {
      name: "checkbox-description",
      type: "registry:example" as const,
      title: "Description",
      component: CheckboxDescription,
    },
    {
      name: "checkbox-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: CheckboxDisabled,
    },
    {
      name: "checkbox-invalid",
      type: "registry:example" as const,
      title: "Invalid",
      component: CheckboxInvalid,
    },
    {
      name: "checkbox-group",
      type: "registry:example" as const,
      title: "Group",
      component: CheckboxGroup,
    },
    {
      name: "code-block-default",
      type: "registry:example" as const,
      title: "Basic",
      component: CodeBlockDefault,
    },
    {
      name: "code-block-header",
      type: "registry:example" as const,
      title: "Header",
      component: CodeBlockHeaderExample,
    },
    {
      name: "code-block-line-numbers",
      type: "registry:example" as const,
      title: "Line Numbers",
      component: CodeBlockLineNumbers,
    },
    {
      name: "code-block-wrap",
      type: "registry:example" as const,
      title: "Wrap",
      component: CodeBlockWrap,
    },
    {
      name: "code-block-diff",
      type: "registry:example" as const,
      title: "Diff",
      component: CodeBlockDiff,
    },
    {
      name: "code-block-size",
      type: "registry:example" as const,
      title: "Size",
      component: CodeBlockSize,
    },
    {
      name: "code-block-destructive",
      type: "registry:example" as const,
      title: "Destructive",
      component: CodeBlockDestructive,
    },
    {
      name: "code-block-syntax",
      type: "registry:example" as const,
      title: "Syntax Highlighting",
      component: CodeBlockSyntax,
    },
    {
      name: "collapsible-default",
      type: "registry:example" as const,
      title: "Show More",
      component: CollapsibleDefault,
    },
    {
      name: "collapsible-advanced",
      type: "registry:example" as const,
      title: "Advanced Options",
      component: CollapsibleAdvanced,
    },
    {
      name: "collapsible-details",
      type: "registry:example" as const,
      title: "Order Details",
      component: CollapsibleDetails,
    },
    {
      name: "collapsible-file-tree",
      type: "registry:example" as const,
      title: "File Tree",
      component: CollapsibleFileTree,
    },
    {
      name: "combobox-default",
      type: "registry:example" as const,
      title: "Basic",
      component: ComboboxDefault,
    },
    {
      name: "combobox-clear",
      type: "registry:example" as const,
      title: "With Clear",
      component: ComboboxClearExample,
    },
    {
      name: "combobox-groups",
      type: "registry:example" as const,
      title: "Groups",
      component: ComboboxGroups,
    },
    {
      name: "combobox-multiple",
      type: "registry:example" as const,
      title: "Multiple",
      component: ComboboxMultiple,
    },
    {
      name: "combobox-disabled",
      type: "registry:example" as const,
      title: "Disabled",
      component: ComboboxDisabled,
    },
    {
      name: "command-default",
      type: "registry:example" as const,
      title: "Inline",
      component: CommandDefault,
    },
    {
      name: "command-dialog",
      type: "registry:example" as const,
      title: "Dialog",
      component: CommandDialogExample,
    },
    {
      name: "command-shortcuts",
      type: "registry:example" as const,
      title: "Shortcuts",
      component: CommandShortcuts,
    },
    {
      name: "command-groups",
      type: "registry:example" as const,
      title: "Groups",
      component: CommandGroups,
    },
    {
      name: "context-menu-default",
      type: "registry:example" as const,
      title: "Basic",
      component: ContextMenuDefault,
    },
    {
      name: "context-menu-shortcuts",
      type: "registry:example" as const,
      title: "Shortcuts",
      component: ContextMenuShortcuts,
    },
    {
      name: "context-menu-submenu",
      type: "registry:example" as const,
      title: "Submenu",
      component: ContextMenuSubmenu,
    },
    {
      name: "context-menu-checkboxes",
      type: "registry:example" as const,
      title: "Checkboxes",
      component: ContextMenuCheckboxes,
    },
    {
      name: "context-menu-radio",
      type: "registry:example" as const,
      title: "Radio",
      component: ContextMenuRadio,
    },
    {
      name: "context-menu-destructive",
      type: "registry:example" as const,
      title: "Destructive",
      component: ContextMenuDestructive,
    },
    {
      name: "data-table-basic",
      type: "registry:example" as const,
      title: "Basic",
      component: DataTableBasic,
    },
    {
      name: "data-table-sorting",
      type: "registry:example" as const,
      title: "Sorting",
      component: DataTableSorting,
    },
    {
      name: "data-table-pagination",
      type: "registry:example" as const,
      title: "Pagination",
      component: DataTablePagination,
    },
    {
      name: "data-table-filtering",
      type: "registry:example" as const,
      title: "Filtering",
      component: DataTableFiltering,
    },
    {
      name: "date-picker-default",
      type: "registry:example" as const,
      title: "Basic",
      component: DatePickerDefault,
    },
    {
      name: "date-picker-range",
      type: "registry:example" as const,
      title: "Range",
      component: DatePickerRange,
    },
    {
      name: "date-picker-caption",
      type: "registry:example" as const,
      title: "Date of Birth",
      component: DatePickerCaption,
    },
    {
      name: "date-picker-input",
      type: "registry:example" as const,
      title: "Input",
      component: DatePickerInput,
    },
    {
      name: "date-picker-time",
      type: "registry:example" as const,
      title: "Time",
      component: DatePickerTime,
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
