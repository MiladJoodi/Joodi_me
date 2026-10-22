/**
 * Source definitions for `npm run registry:build`.
 * UI components: single source = packages/ui (imports rewritten for consumers).
 * Blocks/charts stay under registry/.
 */

/** @typedef {{ path: string, type: string, target?: string }} RegistryFileDef */
/** @typedef {{
 *   name: string,
 *   type: string,
 *   title: string,
 *   description?: string,
 *   dependencies?: string[],
 *   registryDependencies?: string[],
 *   files: RegistryFileDef[]
 * }} RegistryItemDef
 */

/** @type {RegistryItemDef[]} */
export const registryItems = [
  {
    name: "accordion",
    type: "registry:ui",
    title: "Accordion",
    description:
      "A vertically stacked set of interactive headings that reveal content.",
    dependencies: ["radix-ui", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/accordion.tsx",
        type: "registry:ui",
        target: "components/ui/accordion.tsx",
      },
    ],
  },
  {
    name: "alert",
    type: "registry:ui",
    title: "Alert",
    description:
      "Displays a callout for important messages with optional icon and description.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/alert.tsx",
        type: "registry:ui",
        target: "components/ui/alert.tsx",
      },
    ],
  },
  {
    name: "alert-dialog",
    type: "registry:ui",
    title: "Alert Dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
    dependencies: ["radix-ui", "clsx", "tailwind-merge"],
    registryDependencies: ["button"],
    files: [
      {
        path: "packages/ui/src/components/alert-dialog.tsx",
        type: "registry:ui",
        target: "components/ui/alert-dialog.tsx",
      },
      {
        path: "packages/cli/templates/init/lib/direction.ts",
        type: "registry:lib",
        target: "lib/direction.ts",
      },
      {
        path: "packages/cli/templates/init/hooks/use-direction.tsx",
        type: "registry:lib",
        target: "hooks/use-direction.tsx",
      },
    ],
  },
  {
    name: "avatar",
    type: "registry:ui",
    title: "Avatar",
    description:
      "An image element with a fallback for representing the user.",
    dependencies: ["radix-ui", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/avatar.tsx",
        type: "registry:ui",
        target: "components/ui/avatar.tsx",
      },
    ],
  },
  {
    name: "badge",
    type: "registry:ui",
    title: "Badge",
    description:
      "Small status labels for counts, categories, and inline metadata.",
    dependencies: [
      "radix-ui",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "packages/ui/src/components/badge.tsx",
        type: "registry:ui",
        target: "components/ui/badge.tsx",
      },
    ],
  },
  {
    name: "breadcrumb",
    type: "registry:ui",
    title: "Breadcrumb",
    description:
      "Displays the path to the current resource using a hierarchy of links.",
    dependencies: ["radix-ui", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/breadcrumb.tsx",
        type: "registry:ui",
        target: "components/ui/breadcrumb.tsx",
      },
    ],
  },
  {
    name: "bubble",
    type: "registry:ui",
    title: "Bubble",
    description:
      "Displays conversational content in a message bubble with variants, alignment, and reactions.",
    dependencies: [
      "radix-ui",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "packages/ui/src/components/bubble.tsx",
        type: "registry:ui",
        target: "components/ui/bubble.tsx",
      },
    ],
  },
  {
    name: "button",
    type: "registry:ui",
    title: "Button",
    description: "Displays a button or a component that looks like a button.",
    dependencies: [
      "radix-ui",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "packages/ui/src/components/button.tsx",
        type: "registry:ui",
        target: "components/ui/button.tsx",
      },
    ],
  },
  {
    name: "card",
    type: "registry:ui",
    title: "Card",
    description: "Displays a card with header, content, and footer.",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/card.tsx",
        type: "registry:ui",
        target: "components/ui/card.tsx",
      },
    ],
  },
  {
    name: "carousel",
    type: "registry:ui",
    title: "Carousel",
    description: "A carousel with motion and swipe built using Embla.",
    dependencies: [
      "embla-carousel-react",
      "lucide-react",
      "clsx",
      "tailwind-merge",
    ],
    registryDependencies: ["button"],
    files: [
      {
        path: "packages/ui/src/components/carousel.tsx",
        type: "registry:ui",
        target: "components/ui/carousel.tsx",
      },
    ],
  },
  {
    name: "checkbox",
    type: "registry:ui",
    title: "Checkbox",
    description:
      "A control that allows the user to toggle between checked and not checked.",
    dependencies: ["radix-ui", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/checkbox.tsx",
        type: "registry:ui",
        target: "components/ui/checkbox.tsx",
      },
    ],
  },
  {
    name: "collapsible",
    type: "registry:ui",
    title: "Collapsible",
    description:
      "An interactive component which expands and collapses a panel.",
    dependencies: ["radix-ui", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/collapsible.tsx",
        type: "registry:ui",
        target: "components/ui/collapsible.tsx",
      },
    ],
  },
  {
    name: "combobox",
    type: "registry:ui",
    title: "Combobox",
    description: "Autocomplete input with a list of suggestions.",
    dependencies: [
      "@base-ui/react",
      "lucide-react",
      "clsx",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "input-group"],
    files: [
      {
        path: "packages/ui/src/components/combobox.tsx",
        type: "registry:ui",
        target: "components/ui/combobox.tsx",
      },
    ],
  },
  {
    name: "command",
    type: "registry:ui",
    title: "Command",
    description: "Command menu for search and quick actions.",
    dependencies: ["cmdk", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["dialog", "input-group"],
    files: [
      {
        path: "packages/ui/src/components/command.tsx",
        type: "registry:ui",
        target: "components/ui/command.tsx",
      },
    ],
  },
  {
    name: "context-menu",
    type: "registry:ui",
    title: "Context Menu",
    description:
      "Displays a menu of actions or options when the user right-clicks an element.",
    dependencies: ["radix-ui", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/context-menu.tsx",
        type: "registry:ui",
        target: "components/ui/context-menu.tsx",
      },
    ],
  },
  {
    name: "dialog",
    type: "registry:ui",
    title: "Dialog",
    description:
      "A window overlaid on the primary content for critical information or actions.",
    dependencies: ["radix-ui", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["button"],
    files: [
      {
        path: "packages/ui/src/components/dialog.tsx",
        type: "registry:ui",
        target: "components/ui/dialog.tsx",
      },
    ],
  },
  {
    name: "drawer",
    type: "registry:ui",
    title: "Drawer",
    description:
      "A panel that slides in from an edge. Prefer direction start/end for RTL-safe sides.",
    dependencies: ["vaul", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/drawer.tsx",
        type: "registry:ui",
        target: "components/ui/drawer.tsx",
      },
    ],
  },
  {
    name: "dropdown-menu",
    type: "registry:ui",
    title: "Dropdown Menu",
    description:
      "Displays a menu of actions triggered by a button — shortcuts, submenus, checkboxes, and radios.",
    dependencies: ["radix-ui", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/dropdown-menu.tsx",
        type: "registry:ui",
        target: "components/ui/dropdown-menu.tsx",
      },
    ],
  },
  {
    name: "empty",
    type: "registry:ui",
    title: "Empty",
    description: "Use to display an empty state when there is no data yet.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/empty.tsx",
        type: "registry:ui",
        target: "components/ui/empty.tsx",
      },
    ],
  },
  {
    name: "field",
    type: "registry:ui",
    title: "Field",
    description:
      "Combine labels, controls, and help text into accessible form fields.",
    dependencies: [
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    registryDependencies: ["label", "separator"],
    files: [
      {
        path: "packages/ui/src/components/field.tsx",
        type: "registry:ui",
        target: "components/ui/field.tsx",
      },
    ],
  },
  {
    name: "hover-card",
    type: "registry:ui",
    title: "Hover Card",
    description:
      "For sighted users to preview content available behind a link.",
    dependencies: ["radix-ui", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/hover-card.tsx",
        type: "registry:ui",
        target: "components/ui/hover-card.tsx",
      },
    ],
  },
  {
    name: "input",
    type: "registry:ui",
    title: "Input",
    description:
      "Displays a form input field or a component that looks like an input field.",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/input.tsx",
        type: "registry:ui",
        target: "components/ui/input.tsx",
      },
    ],
  },
  {
    name: "textarea",
    type: "registry:ui",
    title: "Textarea",
    description:
      "Displays a form textarea or a component that looks like a textarea.",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/textarea.tsx",
        type: "registry:ui",
        target: "components/ui/textarea.tsx",
      },
    ],
  },
  {
    name: "table",
    type: "registry:ui",
    title: "Table",
    description:
      "A responsive table for displaying tabular data. Pair with TanStack Table for sorting, filtering, and pagination.",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/table.tsx",
        type: "registry:ui",
        target: "components/ui/table.tsx",
      },
    ],
  },
  {
    name: "input-group",
    type: "registry:ui",
    title: "Input Group",
    description:
      "Display additional information or actions to an input or textarea.",
    dependencies: [
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "input", "textarea"],
    files: [
      {
        path: "packages/ui/src/components/input-group.tsx",
        type: "registry:ui",
        target: "components/ui/input-group.tsx",
      },
    ],
  },
  {
    name: "input-otp",
    type: "registry:ui",
    title: "Input OTP",
    description:
      "Accessible one-time password component with copy-paste functionality.",
    dependencies: ["input-otp", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/input-otp.tsx",
        type: "registry:ui",
        target: "components/ui/input-otp.tsx",
      },
    ],
  },
  {
    name: "item",
    type: "registry:ui",
    title: "Item",
    description:
      "A versatile component for displaying content with media, title, description, and actions.",
    dependencies: [
      "class-variance-authority",
      "radix-ui",
      "clsx",
      "tailwind-merge",
    ],
    registryDependencies: ["separator"],
    files: [
      {
        path: "packages/ui/src/components/item.tsx",
        type: "registry:ui",
        target: "components/ui/item.tsx",
      },
    ],
  },
  {
    name: "kbd",
    type: "registry:ui",
    title: "Kbd",
    description: "Used to display textual user input from keyboard.",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/kbd.tsx",
        type: "registry:ui",
        target: "components/ui/kbd.tsx",
      },
    ],
  },
  {
    name: "marker",
    type: "registry:ui",
    title: "Marker",
    description:
      "Displays an inline status, system note, bordered row, or labeled separator in a conversation.",
    dependencies: [
      "class-variance-authority",
      "radix-ui",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "packages/ui/src/components/marker.tsx",
        type: "registry:ui",
        target: "components/ui/marker.tsx",
      },
    ],
  },
  {
    name: "menubar",
    type: "registry:ui",
    title: "Menubar",
    description:
      "A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.",
    dependencies: ["radix-ui", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/menubar.tsx",
        type: "registry:ui",
        target: "components/ui/menubar.tsx",
      },
    ],
  },
  {
    name: "message",
    type: "registry:ui",
    title: "Message",
    description:
      "Displays a message in a conversation, with optional avatar, header, footer, and alignment.",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/message.tsx",
        type: "registry:ui",
        target: "components/ui/message.tsx",
      },
    ],
  },
  {
    name: "message-scroller",
    type: "registry:ui",
    title: "Message Scroller",
    description:
      "A chat scroll container that anchors turns, follows streamed responses, and jumps to any message.",
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["button"],
    files: [
      {
        path: "packages/ui/src/components/message-scroller.tsx",
        type: "registry:ui",
        target: "components/ui/message-scroller.tsx",
      },
    ],
  },
  {
    name: "native-select",
    type: "registry:ui",
    title: "Native Select",
    description:
      "A styled native HTML select element with consistent design system integration.",
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/native-select.tsx",
        type: "registry:ui",
        target: "components/ui/native-select.tsx",
      },
    ],
  },
  {
    name: "navigation-menu",
    type: "registry:ui",
    title: "Navigation Menu",
    description: "A collection of links for navigating websites.",
    dependencies: [
      "radix-ui",
      "class-variance-authority",
      "lucide-react",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "packages/ui/src/components/navigation-menu.tsx",
        type: "registry:ui",
        target: "components/ui/navigation-menu.tsx",
      },
    ],
  },
  {
    name: "pagination",
    type: "registry:ui",
    title: "Pagination",
    description: "Pagination with page navigation, next and previous links.",
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["button"],
    files: [
      {
        path: "packages/ui/src/components/pagination.tsx",
        type: "registry:ui",
        target: "components/ui/pagination.tsx",
      },
    ],
  },
  {
    name: "code-block",
    type: "registry:ui",
    title: "Code Block",
    description:
      "Displays code, terminal output and diffs with an optional header, line numbers and a copy button.",
    dependencies: [
      "class-variance-authority",
      "lucide-react",
      "clsx",
      "tailwind-merge",
      "shiki",
    ],
    registryDependencies: ["button", "use-highlighted-code"],
    files: [
      {
        path: "packages/ui/src/components/code-block.tsx",
        type: "registry:ui",
        target: "components/ui/code-block.tsx",
      },
    ],
  },
  {
    name: "use-highlighted-code",
    type: "registry:hook",
    title: "useHighlightedCode",
    description:
      "Optional Shiki syntax highlighting for Code Block (streaming-friendly).",
    dependencies: ["shiki"],
    files: [
      {
        path: "packages/ui/src/hooks/use-highlighted-code.ts",
        type: "registry:hook",
        target: "hooks/use-highlighted-code.ts",
      },
      {
        path: "packages/ui/src/lib/highlighter.tsx",
        type: "registry:lib",
        target: "lib/highlighter.tsx",
      },
    ],
  },
  {
    name: "label",
    type: "registry:ui",
    title: "Label",
    description: "Renders an accessible label associated with controls.",
    dependencies: ["radix-ui", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/label.tsx",
        type: "registry:ui",
        target: "components/ui/label.tsx",
      },
    ],
  },
  {
    name: "button-group",
    type: "registry:ui",
    title: "Button Group",
    description:
      "A container that groups related buttons together with consistent styling.",
    dependencies: [
      "radix-ui",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    registryDependencies: ["separator"],
    files: [
      {
        path: "packages/ui/src/components/button-group.tsx",
        type: "registry:ui",
        target: "components/ui/button-group.tsx",
      },
    ],
  },
  {
    name: "calendar",
    type: "registry:ui",
    title: "Calendar",
    description:
      "A calendar component that allows users to select a date or a range of dates.",
    dependencies: [
      // v10 changes DayPicker classNames / dropdown DOM — keep on v9 with docs.
      "react-day-picker@^9.14.0",
      "date-fns",
      "lucide-react",
      "clsx",
      "tailwind-merge",
    ],
    // popover: date-picker docs compose Calendar inside Popover — install with calendar
    registryDependencies: ["button", "popover"],
    files: [
      {
        path: "packages/ui/src/components/calendar.tsx",
        type: "registry:ui",
        target: "components/ui/calendar.tsx",
      },
    ],
  },
  {
    name: "popover",
    type: "registry:ui",
    title: "Popover",
    description: "Displays rich content in a portal, triggered by a button.",
    dependencies: ["radix-ui", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/popover.tsx",
        type: "registry:ui",
        target: "components/ui/popover.tsx",
      },
    ],
  },
  {
    name: "progress",
    type: "registry:ui",
    title: "Progress",
    description:
      "Displays an indicator showing the completion progress of a task.",
    dependencies: ["radix-ui", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/progress.tsx",
        type: "registry:ui",
        target: "components/ui/progress.tsx",
      },
    ],
  },
  {
    name: "radio-group",
    type: "registry:ui",
    title: "Radio Group",
    description:
      "A set of checkable buttons where only one can be selected at a time.",
    dependencies: ["radix-ui", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/radio-group.tsx",
        type: "registry:ui",
        target: "components/ui/radio-group.tsx",
      },
    ],
  },
  {
    name: "resizable",
    type: "registry:ui",
    title: "Resizable",
    description:
      "Accessible resizable panel groups and layouts with keyboard support.",
    dependencies: [
      "react-resizable-panels@^4",
      "lucide-react",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "packages/ui/src/components/resizable.tsx",
        type: "registry:ui",
        target: "components/ui/resizable.tsx",
      },
    ],
  },
  {
    name: "scroll-area",
    type: "registry:ui",
    title: "Scroll Area",
    description:
      "Augments native scroll functionality for custom, cross-browser styling.",
    dependencies: ["radix-ui", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/scroll-area.tsx",
        type: "registry:ui",
        target: "components/ui/scroll-area.tsx",
      },
    ],
  },
  {
    name: "select",
    type: "registry:ui",
    title: "Select",
    description:
      "Displays a list of options for the user to pick from—triggered by a button.",
    dependencies: ["radix-ui", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/select.tsx",
        type: "registry:ui",
        target: "components/ui/select.tsx",
      },
    ],
  },
  {
    name: "separator",
    type: "registry:ui",
    title: "Separator",
    description: "Visually or semantically separates content.",
    dependencies: ["radix-ui", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/separator.tsx",
        type: "registry:ui",
        target: "components/ui/separator.tsx",
      },
    ],
  },
  {
    name: "sheet",
    type: "registry:ui",
    title: "Sheet",
    description:
      "A panel that slides in from an edge. Prefer side start/end for RTL-safe edges.",
    dependencies: ["radix-ui", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/sheet.tsx",
        type: "registry:ui",
        target: "components/ui/sheet.tsx",
      },
    ],
  },
  {
    name: "skeleton",
    type: "registry:ui",
    title: "Skeleton",
    description: "Use to show a placeholder while content is loading.",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/skeleton.tsx",
        type: "registry:ui",
        target: "components/ui/skeleton.tsx",
      },
    ],
  },
  {
    name: "slider",
    type: "registry:ui",
    title: "Slider",
    description:
      "An input where the user selects a value from within a given range.",
    dependencies: ["radix-ui", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/slider.tsx",
        type: "registry:ui",
        target: "components/ui/slider.tsx",
      },
    ],
  },
  {
    name: "switch",
    type: "registry:ui",
    title: "Switch",
    description:
      "A control that allows the user to toggle between checked and not checked.",
    dependencies: ["radix-ui", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/switch.tsx",
        type: "registry:ui",
        target: "components/ui/switch.tsx",
      },
    ],
  },
  {
    name: "tabs",
    type: "registry:ui",
    title: "Tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    dependencies: [
      "radix-ui",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "packages/ui/src/components/tabs.tsx",
        type: "registry:ui",
        target: "components/ui/tabs.tsx",
      },
    ],
  },
  {
    name: "sonner",
    type: "registry:ui",
    title: "Toast",
    description: "Brief notifications for success, errors, and background work.",
    dependencies: ["sonner", "next-themes", "lucide-react"],
    files: [
      {
        path: "packages/ui/src/components/sonner.tsx",
        type: "registry:ui",
        target: "components/ui/sonner.tsx",
      },
    ],
  },
  {
    name: "toggle",
    type: "registry:ui",
    title: "Toggle",
    description: "A two-state button that can be either on or off.",
    dependencies: [
      "radix-ui",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "packages/ui/src/components/toggle.tsx",
        type: "registry:ui",
        target: "components/ui/toggle.tsx",
      },
    ],
  },
  {
    name: "toggle-group",
    type: "registry:ui",
    title: "Toggle Group",
    description: "A set of two-state buttons that can be toggled on or off.",
    dependencies: [
      "radix-ui",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    registryDependencies: ["toggle"],
    files: [
      {
        path: "packages/ui/src/components/toggle-group.tsx",
        type: "registry:ui",
        target: "components/ui/toggle-group.tsx",
      },
    ],
  },
  {
    name: "tooltip",
    type: "registry:ui",
    title: "Tooltip",
    description:
      "A popup that displays information related to an element when it receives focus or hover.",
    dependencies: ["radix-ui", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/tooltip.tsx",
        type: "registry:ui",
        target: "components/ui/tooltip.tsx",
      },
    ],
  },
  {
    name: "trace",
    type: "registry:ui",
    title: "Trace",
    description:
      "Rows for agent steps — reasoning, tool calls, sources, and plans.",
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["collapsible"],
    files: [
      {
        path: "packages/ui/src/components/trace.tsx",
        type: "registry:ui",
        target: "components/ui/trace.tsx",
      },
    ],
  },
  {
    name: "attachment",
    type: "registry:ui",
    title: "Attachment",
    description:
      "File and media attachment cards with upload states, sizes, and actions.",
    dependencies: [
      "radix-ui",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    registryDependencies: ["button", "spinner"],
    files: [
      {
        path: "packages/ui/src/components/attachment.tsx",
        type: "registry:ui",
        target: "components/ui/attachment.tsx",
      },
    ],
  },
  {
    name: "spinner",
    type: "registry:ui",
    title: "Spinner",
    description: "A loading spinner.",
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/spinner.tsx",
        type: "registry:ui",
        target: "components/ui/spinner.tsx",
      },
    ],
  },
  {
    name: "login-01",
    type: "registry:block",
    title: "Login",
    description: "A simple email/password login form.",
    registryDependencies: ["button"],
    files: [
      {
        path: "registry/blocks/login-01/page.tsx",
        type: "registry:page",
        target: "app/login/page.tsx",
      },
      {
        path: "registry/blocks/login-01/components/login-form.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "chart-area",
    type: "registry:chart",
    title: "Area chart",
    description: "A simple area chart.",
    dependencies: ["lucide-react", "recharts"],
    files: [
      {
        path: "registry/charts/chart-area/chart-area.tsx",
        type: "registry:component",
      },
    ],
  },
]
