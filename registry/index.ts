export type RegistryItem = {
  name: string
  type: "registry:ui" | "registry:block" | "registry:chart" | "registry:example"
  title: string
  description?: string
}

/**
 * Docs catalog metadata only.
 * Example React trees load on demand via `registry/example-loaders.ts`.
 */
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
      name: "chart",
      type: "registry:ui" as const,
      title: "Chart",
      description:
        "Recharts helpers — ChartContainer, tooltip, legend, and theme CSS variables.",
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
    },
  ],
  charts: [
    {
      name: "chart",
      type: "registry:ui" as const,
      title: "Chart",
      description:
        "Recharts helpers — ChartContainer, tooltip, legend, and theme CSS variables.",
    },
    {
      name: "chart-area",
      type: "registry:chart" as const,
      title: "Area chart",
      description: "A simple area chart.",
    },
    {
      name: "simple-bar-chart",
      type: "registry:chart" as const,
      title: "Simple Bar Chart",
      description:
        "Two-series bar chart from Recharts docs (seed 823), SonoJS chrome.",
    },
  ],
}
