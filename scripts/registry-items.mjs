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
    dependencies: ["vaul", "sonner", "clsx", "tailwind-merge"],
    // sonner: docs Basic example uses toast(); ships Toaster for layout.
    registryDependencies: ["sonner"],
    files: [
      {
        path: "packages/ui/src/components/drawer.tsx",
        type: "registry:ui",
        target: "components/ui/drawer.tsx",
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
      {
        path: "packages/ui/src/hooks/use-mobile.ts",
        type: "registry:lib",
        target: "hooks/use-mobile.ts",
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
    dependencies: [
      "radix-ui",
      "lucide-react",
      "clsx",
      "tailwind-merge",
      "tw-animate-css",
    ],
    files: [
      {
        path: "packages/ui/src/components/sheet.tsx",
        type: "registry:ui",
        target: "components/ui/sheet.tsx",
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
    title: "Sonner",
    description: "Brief toast notifications for success, errors, and background work.",
    dependencies: ["sonner", "next-themes", "lucide-react"],
    files: [
      {
        path: "packages/ui/src/components/sonner.tsx",
        type: "registry:ui",
        target: "components/ui/sonner.tsx",
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
    name: "chart",
    type: "registry:ui",
    title: "Chart",
    description:
      "Recharts helpers — ChartContainer, tooltip, legend, and theme CSS variables.",
    dependencies: ["recharts", "clsx", "tailwind-merge"],
    files: [
      {
        path: "packages/ui/src/components/chart.tsx",
        type: "registry:ui",
        target: "components/ui/chart.tsx",
      },
    ],
  },
  {
    name: "chart-area",
    type: "registry:chart",
    title: "Area chart",
    description: "A simple area chart.",
    dependencies: ["lucide-react", "recharts"],
    registryDependencies: ["card"],
    files: [
      {
        path: "registry/charts/area/chart-area.tsx",
        type: "registry:component",
        target: "components/charts/chart-area.tsx",
      },
    ],
  },
  {
    name: "chart-mock-data",
    type: "registry:lib",
    title: "Chart mock data",
    description:
      "Recharts-compatible generateMockData (LCG) for gallery demos.",
    files: [
      {
        path: "registry/charts/_lib/chart-mock-data.ts",
        type: "registry:lib",
        target: "components/charts/_lib/chart-mock-data.ts",
      },
    ],
  },
  {
    name: "chart-styles",
    type: "registry:lib",
    title: "Chart styles",
    description:
      "Locked dual series (navy × orange), bar/line/area stage sizing, neon glow helpers, useChartDir, viewport + reduced-motion hooks.",
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
        "chart-mute": "#52525b",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
        "chart-mute": "#d4d4d8",
      },
    },
    files: [
      {
        path: "registry/charts/_lib/chart-styles.ts",
        type: "registry:lib",
        target: "components/charts/_lib/chart-styles.ts",
      },
      {
        path: "registry/charts/_lib/use-chart-dir.ts",
        type: "registry:lib",
        target: "components/charts/_lib/use-chart-dir.ts",
      },
      {
        path: "registry/charts/_lib/use-narrow-viewport.ts",
        type: "registry:lib",
        target: "components/charts/_lib/use-narrow-viewport.ts",
      },
      {
        path: "registry/charts/_lib/use-prefers-reduced-motion.ts",
        type: "registry:lib",
        target: "components/charts/_lib/use-prefers-reduced-motion.ts",
      },
      {
        path: "registry/charts/_lib/use-market-neon.ts",
        type: "registry:lib",
        target: "components/charts/_lib/use-market-neon.ts",
      },
      {
        path: "registry/charts/_lib/pie-tooltip.tsx",
        type: "registry:lib",
        target: "components/charts/_lib/pie-tooltip.tsx",
      },
      {
        path: "registry/charts/_lib/treemap-tooltip.tsx",
        type: "registry:lib",
        target: "components/charts/_lib/treemap-tooltip.tsx",
      },
    ],
  },
  {
    name: "stock-shared",
    type: "registry:lib",
    title: "Stock shared",
    description:
      "Candlestick, OHLC, Renko shapes, MarketCandle generators, and stock chart helpers (semantic up/down).",
    dependencies: ["recharts"],
    registryDependencies: ["chart-mock-data"],
    files: [
      {
        path: "registry/charts/_lib/stock-shared.tsx",
        type: "registry:lib",
        target: "components/charts/_lib/stock-shared.tsx",
      },
    ],
  },
  {
    name: "heatmap-shared",
    type: "registry:lib",
    title: "Heatmap shared",
    description:
      "Calendar and matrix SVG heatmap helpers — EN/Gregorian, RTL-aware layout.",
    registryDependencies: ["chart-styles"],
    files: [
      {
        path: "registry/charts/_lib/heatmap-shared.tsx",
        type: "registry:lib",
        target: "components/charts/_lib/heatmap-shared.tsx",
      },
    ],
  },
  {
    name: "gauge-shared",
    type: "registry:lib",
    title: "Gauge shared",
    description:
      "react-gauge-chart helpers — fixed stage, soft traffic ramp, English percent labels.",
    // lodash: peer of react-gauge-chart (undeclared) — required for lodash/isEqual
    dependencies: ["react-gauge-chart", "lodash"],
    registryDependencies: ["chart-styles"],
    files: [
      {
        path: "registry/charts/_lib/gauge-shared.tsx",
        type: "registry:lib",
        target: "components/charts/_lib/gauge-shared.tsx",
      },
      {
        path: "registry/charts/_lib/react-gauge-chart.d.ts",
        type: "registry:lib",
        target: "components/charts/_lib/react-gauge-chart.d.ts",
      },
    ],
  },
  {
    name: "hc-gauge-shared",
    type: "registry:lib",
    title: "Hc Gauge shared",
    description:
      "Highcharts gauge / solidgauge helpers — soft dial chrome, English labels, client mount.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["chart-styles"],
    files: [
      {
        path: "registry/charts/_lib/hc-gauge-shared.tsx",
        type: "registry:lib",
        target: "components/charts/_lib/hc-gauge-shared.tsx",
      },
    ],
  },
  {
    name: "simple-bar-chart",
    type: "registry:chart",
    title: "Simple Bar Chart",
    description:
      "Canonical grouped bar — Desktop×Mobile H1 2026, navy×orange, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/simple-bar-chart.tsx",
        type: "registry:component",
        target: "components/charts/simple-bar-chart.tsx",
      },
    ],
  },
  {
    name: "area-chart",
    type: "registry:chart",
    title: "Area Chart",
    description:
      "Dual overlapping monotone areas with neon glow (style-vega) — Desktop×Mobile H1 2026, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/area-chart.tsx",
        type: "registry:component",
        target: "components/charts/area-chart.tsx",
      },
    ],
  },
  {
    name: "stacked-area-chart",
    type: "registry:chart",
    title: "Stacked Area Chart",
    description:
      "Three stacked monotone areas with neon glow (style-vega) — Desktop×Mobile×Tablet, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/stacked-area-chart.tsx",
        type: "registry:component",
        target: "components/charts/stacked-area-chart.tsx",
      },
    ],
  },
  {
    name: "area-chart-range",
    type: "registry:chart",
    title: "Area Chart Range",
    description:
      "Single-series low–high temperature band with neon glow (style-vega) — metric tracks high, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/area-chart-range.tsx",
        type: "registry:component",
        target: "components/charts/area-chart-range.tsx",
      },
    ],
  },
  {
    name: "area-chart-connect-nulls",
    type: "registry:chart",
    title: "Area Chart Connect Nulls",
    description:
      "Single neon area — gap at nulls vs connectNulls bridge, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/area-chart-connect-nulls.tsx",
        type: "registry:component",
        target: "components/charts/area-chart-connect-nulls.tsx",
      },
    ],
  },
  {
    name: "cardinal-area-chart",
    type: "registry:chart",
    title: "Cardinal Area Chart",
    description:
      "Side-by-side monotone vs natural area curves with neon glow (style-vega) — metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/cardinal-area-chart.tsx",
        type: "registry:component",
        target: "components/charts/cardinal-area-chart.tsx",
      },
    ],
  },
  {
    name: "percent-area-chart",
    type: "registry:chart",
    title: "Percent Area Chart",
    description:
      "100% stacked areas with neon glow (style-vega) — Desktop×Mobile×Tablet share scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/percent-area-chart.tsx",
        type: "registry:component",
        target: "components/charts/percent-area-chart.tsx",
      },
    ],
  },
  {
    name: "synchronized-area-chart",
    type: "registry:chart",
    title: "Synchronized Area Chart",
    description:
      "Three syncId area panels with neon glow (style-vega) — Desktop, Mobile + Brush, Total; metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/synchronized-area-chart.tsx",
        type: "registry:component",
        target: "components/charts/synchronized-area-chart.tsx",
      },
    ],
  },
  {
    name: "tiny-area-chart",
    type: "registry:chart",
    title: "Tiny Area Chart",
    description:
      "Compact single-series area sparkline with neon glow (style-vega) — locked header chrome, no axes, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/tiny-area-chart.tsx",
        type: "registry:component",
        target: "components/charts/tiny-area-chart.tsx",
      },
    ],
  },
  {
    name: "area-chart-fill-by-value",
    type: "registry:chart",
    title: "Area Chart Fill By Value",
    description:
      "Single area fill split at y=0 with neon up/down (style-vega) — metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/area-chart-fill-by-value.tsx",
        type: "registry:component",
        target: "components/charts/area-chart-fill-by-value.tsx",
      },
    ],
  },
  {
    name: "area-chart-custom-animation",
    type: "registry:chart",
    title: "Area Chart Custom Animation",
    description:
      "Single neon area with custom 900ms entrance animation — metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/area-chart-custom-animation.tsx",
        type: "registry:component",
        target: "components/charts/area-chart-custom-animation.tsx",
      },
    ],
  },
  {
    name: "range-area-chart-custom-animation",
    type: "registry:chart",
    title: "Range Area Chart Custom Animation",
    description:
      "Neon [low, high] range area with custom 1200ms entrance animation — metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/range-area-chart-custom-animation.tsx",
        type: "registry:component",
        target: "components/charts/range-area-chart-custom-animation.tsx",
      },
    ],
  },
  {
    name: "area-chart-with-custom-events",
    type: "registry:chart",
    title: "Area Chart With Custom Events",
    description:
      "Neon step area with chart-root pointer events via getRelativeCoordinate — live event panel, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "chart-mock-data"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/area-chart-with-custom-events.tsx",
        type: "registry:component",
        target: "components/charts/area-chart-with-custom-events.tsx",
      },
    ],
  },
  {
    name: "prevent-right-click",
    type: "registry:chart",
    title: "Prevent Right Click",
    description:
      "Neon monotone area with onContextMenu preventDefault — metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "chart-mock-data"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/prevent-right-click.tsx",
        type: "registry:component",
        target: "components/charts/prevent-right-click.tsx",
      },
    ],
  },
  {
    name: "area-interactive",
    type: "registry:chart",
    title: "Area Interactive",
    description:
      "Toggle Store/Online period totals with neon glow (style-vega), then scrub a daily monotone area — RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/area-interactive.tsx",
        type: "registry:component",
        target: "components/charts/area-interactive.tsx",
      },
    ],
  },
  {
    name: "area-step",
    type: "registry:chart",
    title: "Area Step",
    description:
      "Single neon step area (type=step) — Store H1 2026, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/area-step.tsx",
        type: "registry:component",
        target: "components/charts/area-step.tsx",
      },
    ],
  },
  {
    name: "area-gradient",
    type: "registry:chart",
    title: "Area Gradient",
    description:
      "Stacked Store×Online natural areas with neon glow gradients (style-vega) — metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/area-gradient.tsx",
        type: "registry:component",
        target: "components/charts/area-gradient.tsx",
      },
    ],
  },
  {
    name: "market-cards",
    type: "registry:chart",
    title: "Market Cards",
    description:
      "Neon SVG area sparkline cards — 30-day up, KWD down, gold flat (style-vega glow); RTL-aware.",
    dependencies: [],
    registryDependencies: ["chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
        "chart-mute": "#52525b",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
        "chart-mute": "#d4d4d8",
      },
    },
    files: [
      {
        path: "registry/charts/area/market-cards.tsx",
        type: "registry:component",
        target: "components/charts/market-cards.tsx",
      },
    ],
  },
  {
    name: "chart-area-default",
    type: "registry:chart",
    title: "Area Default",
    description:
      "Classic single-series natural Store area — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
      },
      dark: {
        "chart-1": "#3b82f6",
      },
    },
    files: [
      {
        path: "registry/charts/area/chart-area-default.tsx",
        type: "registry:component",
        target: "components/charts/chart-area-default.tsx",
      },
    ],
  },
  {
    name: "chart-area-linear",
    type: "registry:chart",
    title: "Area Linear",
    description:
      "Classic single-series linear Store area — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
      },
      dark: {
        "chart-1": "#3b82f6",
      },
    },
    files: [
      {
        path: "registry/charts/area/chart-area-linear.tsx",
        type: "registry:component",
        target: "components/charts/chart-area-linear.tsx",
      },
    ],
  },
  {
    name: "chart-area-step",
    type: "registry:chart",
    title: "Area Step",
    description:
      "Classic single-series step Store area — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
      },
      dark: {
        "chart-1": "#3b82f6",
      },
    },
    files: [
      {
        path: "registry/charts/area/chart-area-step.tsx",
        type: "registry:component",
        target: "components/charts/chart-area-step.tsx",
      },
    ],
  },
  {
    name: "chart-area-legend",
    type: "registry:chart",
    title: "Area Legend",
    description:
      "Classic stacked Desktop×Mobile natural areas with ChartLegend — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/area/chart-area-legend.tsx",
        type: "registry:component",
        target: "components/charts/chart-area-legend.tsx",
      },
    ],
  },
  {
    name: "chart-area-stacked",
    type: "registry:chart",
    title: "Area Stacked",
    description:
      "Classic stacked Desktop×Mobile natural areas — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/area/chart-area-stacked.tsx",
        type: "registry:component",
        target: "components/charts/chart-area-stacked.tsx",
      },
    ],
  },
  {
    name: "chart-area-stacked-expand",
    type: "registry:chart",
    title: "Area Stacked Expand",
    description:
      "Classic 100% stacked Desktop×Mobile natural areas (stackOffset expand) — locked chrome, share scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/area/chart-area-stacked-expand.tsx",
        type: "registry:component",
        target: "components/charts/chart-area-stacked-expand.tsx",
      },
    ],
  },
  {
    name: "chart-area-icons",
    type: "registry:chart",
    title: "Area Icons",
    description:
      "Classic stacked Desktop×Mobile natural areas with ChartLegend Lucide icons — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts", "lucide-react"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/area/chart-area-icons.tsx",
        type: "registry:component",
        target: "components/charts/chart-area-icons.tsx",
      },
    ],
  },
  {
    name: "chart-area-gradient",
    type: "registry:chart",
    title: "Area Gradient",
    description:
      "Classic stacked Store×Online natural areas with neon glow gradients (style-vega) — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/area/chart-area-gradient.tsx",
        type: "registry:component",
        target: "components/charts/chart-area-gradient.tsx",
      },
    ],
  },
  {
    name: "chart-area-axes",
    type: "registry:chart",
    title: "Area Axes",
    description:
      "Classic stacked Store×Online natural areas with sparse Y-axis (tickCount 3) — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/area/chart-area-axes.tsx",
        type: "registry:component",
        target: "components/charts/chart-area-axes.tsx",
      },
    ],
  },
  {
    name: "two-level-pie-chart",
    type: "registry:chart",
    title: "Two Level Pie Chart",
    description:
      "Nested region×channel pies — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/two-level-pie-chart.tsx",
        type: "registry:component",
        target: "components/charts/two-level-pie-chart.tsx",
      },
    ],
  },
  {
    name: "straight-angle-pie-chart",
    type: "registry:chart",
    title: "Straight Angle Pie Chart",
    description:
      "Half-pie (180→0) province share — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/straight-angle-pie-chart.tsx",
        type: "registry:component",
        target: "components/charts/straight-angle-pie-chart.tsx",
      },
    ],
  },
  {
    name: "custom-active-shape-pie-chart",
    type: "registry:chart",
    title: "Custom Active Shape Pie Chart",
    description:
      "Donut with expanded active sector and callout — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
      },
    },
    files: [
      {
        path: "registry/charts/pie/custom-active-shape-pie-chart.tsx",
        type: "registry:component",
        target: "components/charts/custom-active-shape-pie-chart.tsx",
      },
    ],
  },
  {
    name: "pie-chart-with-customized-label",
    type: "registry:chart",
    title: "Pie Chart With Customized Label",
    description:
      "Full pie with mid-slice percent labels — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
      },
    },
    files: [
      {
        path: "registry/charts/pie/pie-chart-with-customized-label.tsx",
        type: "registry:component",
        target: "components/charts/pie-chart-with-customized-label.tsx",
      },
    ],
  },
  {
    name: "pie-chart-with-padding-angle",
    type: "registry:chart",
    title: "Pie Chart With Padding Angle",
    description:
      "Thin rounded donut with slice gaps — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
      },
    },
    files: [
      {
        path: "registry/charts/pie/pie-chart-with-padding-angle.tsx",
        type: "registry:component",
        target: "components/charts/pie-chart-with-padding-angle.tsx",
      },
    ],
  },
  {
    name: "pie-chart-in-grid",
    type: "registry:chart",
    title: "Pie Chart In Grid",
    description:
      "CSS Grid of responsive donuts — layout teaching demo, RTL-aware chrome.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
      },
    },
    files: [
      {
        path: "registry/charts/pie/pie-chart-in-grid.tsx",
        type: "registry:component",
        target: "components/charts/pie-chart-in-grid.tsx",
      },
    ],
  },
  {
    name: "pie-with-gradient",
    type: "registry:chart",
    title: "Pie With Gradient",
    description:
      "Gradient donut with channel cards — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
      },
    },
    files: [
      {
        path: "registry/charts/pie/pie-with-gradient.tsx",
        type: "registry:component",
        target: "components/charts/pie-with-gradient.tsx",
      },
    ],
  },
  {
    name: "pie-donut-text",
    type: "registry:chart",
    title: "Pie Donut Text",
    description:
      "Donut with centered ring-total text — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/pie-donut-text.tsx",
        type: "registry:component",
        target: "components/charts/pie-donut-text.tsx",
      },
    ],
  },
  {
    name: "pie-interactive",
    type: "registry:chart",
    title: "Pie Interactive",
    description:
      "Month Select drives active donut sector — locked chrome, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "select"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/pie-interactive.tsx",
        type: "registry:component",
        target: "components/charts/pie-interactive.tsx",
      },
    ],
  },
  {
    name: "pie-stacked",
    type: "registry:chart",
    title: "Pie Stacked",
    description:
      "Nested Store×Online month rings — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/pie-stacked.tsx",
        type: "registry:component",
        target: "components/charts/pie-stacked.tsx",
      },
    ],
  },
  {
    name: "chart-pie-simple",
    type: "registry:chart",
    title: "Pie Simple",
    description:
      "Classic full pie of province sales share — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/chart-pie-simple.tsx",
        type: "registry:component",
        target: "components/charts/chart-pie-simple.tsx",
      },
    ],
  },
  {
    name: "chart-pie-separator-none",
    type: "registry:chart",
    title: "Pie Separator None",
    description:
      "Full pie with no slice separators — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/chart-pie-separator-none.tsx",
        type: "registry:component",
        target: "components/charts/chart-pie-separator-none.tsx",
      },
    ],
  },
  {
    name: "chart-pie-label",
    type: "registry:chart",
    title: "Pie Label",
    description:
      "Full pie with always-on value labels — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/chart-pie-label.tsx",
        type: "registry:component",
        target: "components/charts/chart-pie-label.tsx",
      },
    ],
  },
  {
    name: "chart-pie-label-custom",
    type: "registry:chart",
    title: "Pie Label Custom",
    description:
      "Full pie with custom value labels (no leader lines) — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/chart-pie-label-custom.tsx",
        type: "registry:component",
        target: "components/charts/chart-pie-label-custom.tsx",
      },
    ],
  },
  {
    name: "chart-pie-label-list",
    type: "registry:chart",
    title: "Pie Label List",
    description:
      "Full pie with on-slice province names via LabelList — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/chart-pie-label-list.tsx",
        type: "registry:component",
        target: "components/charts/chart-pie-label-list.tsx",
      },
    ],
  },
  {
    name: "chart-pie-legend",
    type: "registry:chart",
    title: "Pie Legend",
    description:
      "Full pie with wrapped ChartLegend — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/chart-pie-legend.tsx",
        type: "registry:component",
        target: "components/charts/chart-pie-legend.tsx",
      },
    ],
  },
  {
    name: "chart-pie-donut",
    type: "registry:chart",
    title: "Pie Donut",
    description:
      "Payment-method donut — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/chart-pie-donut.tsx",
        type: "registry:component",
        target: "components/charts/chart-pie-donut.tsx",
      },
    ],
  },
  {
    name: "chart-pie-donut-active",
    type: "registry:chart",
    title: "Pie Donut Active",
    description:
      "Donut with expanded active sector — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/chart-pie-donut-active.tsx",
        type: "registry:component",
        target: "components/charts/chart-pie-donut-active.tsx",
      },
    ],
  },
  {
    name: "chart-pie-donut-text",
    type: "registry:chart",
    title: "Pie Donut Text",
    description:
      "Classic donut with centered ring-total text — locked chrome, slice scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/chart-pie-donut-text.tsx",
        type: "registry:component",
        target: "components/charts/chart-pie-donut-text.tsx",
      },
    ],
  },
  {
    name: "chart-pie-stacked",
    type: "registry:chart",
    title: "Pie Stacked",
    description:
      "Classic nested Store×Online month rings — locked chrome, ring scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/chart-pie-stacked.tsx",
        type: "registry:component",
        target: "components/charts/chart-pie-stacked.tsx",
      },
    ],
  },
  {
    name: "chart-pie-interactive",
    type: "registry:chart",
    title: "Pie Interactive",
    description:
      "Classic month Select drives active donut sector — locked chrome, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "select"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/pie/chart-pie-interactive.tsx",
        type: "registry:component",
        target: "components/charts/chart-pie-interactive.tsx",
      },
    ],
  },
  {
    name: "simple-line-chart",
    type: "registry:chart",
    title: "Simple Line Chart",
    description:
      "Dual monotone lines — Desktop×Mobile H1 2026, navy×orange, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/simple-line-chart.tsx",
        type: "registry:component",
        target: "components/charts/simple-line-chart.tsx",
      },
    ],
  },
  {
    name: "dashed-line-chart",
    type: "registry:chart",
    title: "Dashed Line Chart",
    description:
      "Dual dashed monotone lines — Desktop×Mobile H1 2026, navy×orange, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/dashed-line-chart.tsx",
        type: "registry:component",
        target: "components/charts/dashed-line-chart.tsx",
      },
    ],
  },
  {
    name: "vertical-line-chart",
    type: "registry:chart",
    title: "Vertical Line Chart",
    description:
      "Dual linear lines, layout=vertical — Desktop×Mobile H1 2026, navy×orange, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/vertical-line-chart.tsx",
        type: "registry:component",
        target: "components/charts/vertical-line-chart.tsx",
      },
    ],
  },
  {
    name: "line-chart-connect-nulls",
    type: "registry:chart",
    title: "Line Chart Connect Nulls",
    description:
      "Stacked gap vs connectNulls monotone lines — Desktop H1 2026 with a missing month, navy, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
      },
      dark: {
        "chart-1": "#3b82f6",
      },
    },
    files: [
      {
        path: "registry/charts/line/line-chart-connect-nulls.tsx",
        type: "registry:component",
        target: "components/charts/line-chart-connect-nulls.tsx",
      },
    ],
  },
  {
    name: "line-chart-with-reference-lines",
    type: "registry:chart",
    title: "Line Chart With Reference Lines",
    description:
      "Dual monotone lines with month + value ReferenceLines — Desktop×Mobile H1 2026, navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/line-chart-with-reference-lines.tsx",
        type: "registry:component",
        target: "components/charts/line-chart-with-reference-lines.tsx",
      },
    ],
  },
  {
    name: "customized-label-line-chart",
    type: "registry:chart",
    title: "Customized Label Line Chart",
    description:
      "Dual monotone lines with alternating Desktop point labels and angled X ticks — navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/customized-label-line-chart.tsx",
        type: "registry:component",
        target: "components/charts/customized-label-line-chart.tsx",
      },
    ],
  },
  {
    name: "highlight-and-zoom-line-chart",
    type: "registry:chart",
    title: "Highlight And Zoom Line Chart",
    description:
      "Drag-to-zoom dual-axis Cost×Impressions lines with ReferenceArea highlight — navy×orange, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/highlight-and-zoom-line-chart.tsx",
        type: "registry:component",
        target: "components/charts/highlight-and-zoom-line-chart.tsx",
      },
    ],
  },
  {
    name: "line-chart-axis-interval",
    type: "registry:chart",
    title: "Line Chart Axis Interval",
    description:
      "Stacked Desktop×Mobile lines comparing Recharts axis interval presets — navy×orange, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "chart-mock-data"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/line-chart-axis-interval.tsx",
        type: "registry:component",
        target: "components/charts/line-chart-axis-interval.tsx",
      },
    ],
  },
  {
    name: "biaxial-line-chart",
    type: "registry:chart",
    title: "Biaxial Line Chart",
    description:
      "Dual Y-axis monotone lines — revenue×orders independent scales, navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/biaxial-line-chart.tsx",
        type: "registry:component",
        target: "components/charts/biaxial-line-chart.tsx",
      },
    ],
  },
  {
    name: "line-chart-with-x-axis-padding",
    type: "registry:chart",
    title: "Line Chart With X Axis Padding",
    description:
      "Dual monotone lines with XAxis padding — Desktop×Mobile H1 2026, navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/line-chart-with-x-axis-padding.tsx",
        type: "registry:component",
        target: "components/charts/line-chart-with-x-axis-padding.tsx",
      },
    ],
  },
  {
    name: "customized-dot-line-chart",
    type: "registry:chart",
    title: "Customized Dot Line Chart",
    description:
      "Dual monotone lines with smile/frown Desktop dots by threshold — navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
      },
    },
    files: [
      {
        path: "registry/charts/line/customized-dot-line-chart.tsx",
        type: "registry:component",
        target: "components/charts/customized-dot-line-chart.tsx",
      },
    ],
  },
  {
    name: "synchronized-line-chart",
    type: "registry:chart",
    title: "Synchronized Line Chart",
    description:
      "Three syncId panels — Desktop line, Mobile line + Brush, Total area; navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
      },
    },
    files: [
      {
        path: "registry/charts/line/synchronized-line-chart.tsx",
        type: "registry:component",
        target: "components/charts/synchronized-line-chart.tsx",
      },
    ],
  },
  {
    name: "synchronized-different-data",
    type: "registry:chart",
    title: "Synchronized Different Data",
    description:
      "Two syncId panels with different densities — closestDate syncMethod (±2 days), navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/synchronized-different-data.tsx",
        type: "registry:component",
        target: "components/charts/synchronized-different-data.tsx",
      },
    ],
  },
  {
    name: "line-chart-custom-shape",
    type: "registry:chart",
    title: "Line Chart Custom Shape",
    description:
      "Dual monotone lines with opacity-fade entrance shape — Desktop×Mobile H1 2026, navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/line-chart-custom-shape.tsx",
        type: "registry:component",
        target: "components/charts/line-chart-custom-shape.tsx",
      },
    ],
  },
  {
    name: "line-chart-has-multi-series",
    type: "registry:chart",
    title: "Line Chart Has Multi Series",
    description:
      "Overlapping multi-series lines (each Line owns partial categories) — New York×Chicago×Austin, navy×orange×amber, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
      },
    },
    files: [
      {
        path: "registry/charts/line/line-chart-has-multi-series.tsx",
        type: "registry:component",
        target: "components/charts/line-chart-has-multi-series.tsx",
      },
    ],
  },
  {
    name: "line-chart-negative-values-with-reference-lines",
    type: "registry:chart",
    title: "Line Chart Negative Values With Reference Lines",
    description:
      "Numeric X/Y path crossing the origin with zero ReferenceLines — navy, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
      },
      dark: {
        "chart-1": "#3b82f6",
      },
    },
    files: [
      {
        path: "registry/charts/line/line-chart-negative-values-with-reference-lines.tsx",
        type: "registry:component",
        target:
          "components/charts/line-chart-negative-values-with-reference-lines.tsx",
      },
    ],
  },
  {
    name: "compare-two-lines",
    type: "registry:chart",
    title: "Compare Two Lines",
    description:
      "Hover-compare portfolio vs reinvestment (+ principal) — navy×orange gradients, delta ReferenceLine, metric header, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/compare-two-lines.tsx",
        type: "registry:component",
        target: "components/charts/compare-two-lines.tsx",
      },
    ],
  },
  {
    name: "dynamic-z-index-line-chart",
    type: "registry:chart",
    title: "Dynamic Z Index Line Chart",
    description:
      "Three monotone lines; legend hover dims a series and raises its z-index — navy×orange×amber, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
      },
    },
    files: [
      {
        path: "registry/charts/line/dynamic-z-index-line-chart.tsx",
        type: "registry:component",
        target: "components/charts/dynamic-z-index-line-chart.tsx",
      },
    ],
  },
  {
    name: "tiny-line-chart",
    type: "registry:chart",
    title: "Tiny Line Chart",
    description:
      "Compact single-series sparkline — locked header chrome, no axes, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
      },
      dark: {
        "chart-1": "#3b82f6",
      },
    },
    files: [
      {
        path: "registry/charts/line/tiny-line-chart.tsx",
        type: "registry:component",
        target: "components/charts/tiny-line-chart.tsx",
      },
    ],
  },
  {
    name: "animated-time-series",
    type: "registry:chart",
    title: "Animated Time Series",
    description:
      "Sliding six-month window over a dual-series year — navy×orange, metric scrubber, pauses on scrub / reduced-motion.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/animated-time-series.tsx",
        type: "registry:component",
        target: "components/charts/animated-time-series.tsx",
      },
    ],
  },
  {
    name: "line-interactive",
    type: "registry:chart",
    title: "Line Interactive",
    description:
      "Toggle Store/Online period totals, then scrub a daily monotone line — navy×orange locked chrome, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/line-interactive.tsx",
        type: "registry:component",
        target: "components/charts/line-interactive.tsx",
      },
    ],
  },
  {
    name: "line-step",
    type: "registry:chart",
    title: "Line Step",
    description:
      "Dual step lines (type=step) — Desktop×Mobile H1 2026, navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/line-step.tsx",
        type: "registry:component",
        target: "components/charts/line-step.tsx",
      },
    ],
  },
  {
    name: "line-default",
    type: "registry:chart",
    title: "Line Default",
    description:
      "Classic single-series natural Store line — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
      },
      dark: {
        "chart-1": "#3b82f6",
      },
    },
    files: [
      {
        path: "registry/charts/line/line-default.tsx",
        type: "registry:component",
        target: "components/charts/line-default.tsx",
      },
    ],
  },
  {
    name: "line-dots-colors",
    type: "registry:chart",
    title: "Line Dots Colors",
    description:
      "Natural sales line with per-region colored dots — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/line/line-dots-colors.tsx",
        type: "registry:component",
        target: "components/charts/line-dots-colors.tsx",
      },
    ],
  },
  {
    name: "line-label-custom",
    type: "registry:chart",
    title: "Line Label Custom",
    description:
      "Natural sales line with always-on region tip labels — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/line/line-label-custom.tsx",
        type: "registry:component",
        target: "components/charts/line-label-custom.tsx",
      },
    ],
  },
  {
    name: "line-bar-area-composed-chart",
    type: "registry:chart",
    title: "Line Bar Area Composed Chart",
    description:
      "Composed Area(orders) + Bar(online) + Line(store) — navy×orange×amber, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
      },
    },
    files: [
      {
        path: "registry/charts/composed/line-bar-area-composed-chart.tsx",
        type: "registry:component",
        target: "components/charts/line-bar-area-composed-chart.tsx",
      },
    ],
  },
  {
    name: "same-data-composed-chart",
    type: "registry:chart",
    title: "Same Data Composed Chart",
    description:
      "Composed Bar + trend Line on one sales series — navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/composed/same-data-composed-chart.tsx",
        type: "registry:component",
        target: "components/charts/same-data-composed-chart.tsx",
      },
    ],
  },
  {
    name: "vertical-composed-chart",
    type: "registry:chart",
    title: "Vertical Composed Chart",
    description:
      "Vertical layout sales bars with target line — navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/composed/vertical-composed-chart.tsx",
        type: "registry:component",
        target: "components/charts/vertical-composed-chart.tsx",
      },
    ],
  },
  {
    name: "composed-chart-with-axis-labels",
    type: "registry:chart",
    title: "Composed Chart With Axis Labels",
    description:
      "Dual-axis revenue/cost/margin composed chart with axis labels — navy×orange×amber, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
      },
    },
    files: [
      {
        path: "registry/charts/composed/composed-chart-with-axis-labels.tsx",
        type: "registry:component",
        target: "components/charts/composed-chart-with-axis-labels.tsx",
      },
    ],
  },
  {
    name: "scatter-and-line-of-best-fit",
    type: "registry:chart",
    title: "Scatter And Line Of Best Fit",
    description:
      "Ad spend vs sales scatter with dashed OLS fit — navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/composed/scatter-and-line-of-best-fit.tsx",
        type: "registry:component",
        target: "components/charts/scatter-and-line-of-best-fit.tsx",
      },
    ],
  },
  {
    name: "banded-chart",
    type: "registry:chart",
    title: "Banded Chart",
    description:
      "Confidence band Area + actual sales Line — navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/composed/banded-chart.tsx",
        type: "registry:component",
        target: "components/charts/banded-chart.tsx",
      },
    ],
  },
  {
    name: "target-price-chart",
    type: "registry:chart",
    title: "Target Price Chart",
    description:
      "Share price, consensus range, dashed analyst target — navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/composed/target-price-chart.tsx",
        type: "registry:component",
        target: "components/charts/target-price-chart.tsx",
      },
    ],
  },
  {
    name: "asset-returns",
    type: "registry:chart",
    title: "Asset Returns",
    description:
      "Horizontal asset return % bars with lookback tabs and max/min stats — navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts", "lucide-react"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/stock/asset-returns.tsx",
        type: "registry:component",
        target: "components/charts/asset-returns.tsx",
      },
    ],
  },
  {
    name: "monthly-savings",
    type: "registry:chart",
    title: "Monthly Savings",
    description:
      "Compound monthly balance by savings channel with rounded-top bars — navy×orange, metric scrubber, RTL-aware.",
    dependencies: ["recharts", "lucide-react"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/stock/monthly-savings.tsx",
        type: "registry:component",
        target: "components/charts/monthly-savings.tsx",
      },
    ],
  },
  {
    name: "candlestick",
    type: "registry:chart",
    title: "Candlestick",
    description:
      "OHLC candlesticks with custom wick/body shape — semantic up/down, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/candlestick.tsx",
        type: "registry:component",
        target: "components/charts/candlestick.tsx",
      },
    ],
  },
  {
    name: "candlestick-dashboard",
    type: "registry:chart",
    title: "Candlestick Dashboard",
    description:
      "Symbol KPI card + OHLC candles + volume strip — semantic up/down, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/candlestick-dashboard.tsx",
        type: "registry:component",
        target: "components/charts/candlestick-dashboard.tsx",
      },
    ],
  },
  {
    name: "candlestick-bar",
    type: "registry:chart",
    title: "Candlestick Bar",
    description:
      "Synced OHLC candles + signed change bars with Brush — semantic up/down, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/candlestick-bar.tsx",
        type: "registry:component",
        target: "components/charts/candlestick-bar.tsx",
      },
    ],
  },
  {
    name: "candlestick-category",
    type: "registry:chart",
    title: "Candlestick Category",
    description:
      "Category-axis OHLC candles with dashed news ReferenceLine — semantic up/down, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/candlestick-category.tsx",
        type: "registry:component",
        target: "components/charts/candlestick-category.tsx",
      },
    ],
  },
  {
    name: "candlestick-line",
    type: "registry:chart",
    title: "Candlestick Line",
    description:
      "OHLC candles with SMA overlay line — semantic up/down + orange SMA, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/candlestick-line.tsx",
        type: "registry:component",
        target: "components/charts/candlestick-line.tsx",
      },
    ],
  },
  {
    name: "sparklines",
    type: "registry:chart",
    title: "Sparklines",
    description:
      "KPI area spark cards + watchlist trend/volume minis — navy×orange×amber, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/sparklines.tsx",
        type: "registry:component",
        target: "components/charts/sparklines.tsx",
      },
    ],
  },
  {
    name: "stock-ohlc",
    type: "registry:chart",
    title: "Stock Ohlc",
    description:
      "Classic OHLC bars (H–L stem, open/close ticks) — semantic up/down, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/stock-ohlc.tsx",
        type: "registry:component",
        target: "components/charts/stock-ohlc.tsx",
      },
    ],
  },
  {
    name: "stock-line",
    type: "registry:chart",
    title: "Stock Line",
    description:
      "Close-price area with gradient fill + symbol card — navy stroke, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/stock-line.tsx",
        type: "registry:component",
        target: "components/charts/stock-line.tsx",
      },
    ],
  },
  {
    name: "stock-column",
    type: "registry:chart",
    title: "Stock Column",
    description:
      "Close as columns tinted bullish/bearish per bar — semantic up/down, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/stock-column.tsx",
        type: "registry:component",
        target: "components/charts/stock-column.tsx",
      },
    ],
  },
  {
    name: "stock-with-volume",
    type: "registry:chart",
    title: "Stock With Volume",
    description:
      "Synced OHLC candles + volume strip tinted by direction — semantic up/down, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/stock-with-volume.tsx",
        type: "registry:component",
        target: "components/charts/stock-with-volume.tsx",
      },
    ],
  },
  {
    name: "stock-multi-series",
    type: "registry:chart",
    title: "Stock Multi Series",
    description:
      "Indexed multi-ticker relative returns — navy×orange×amber lines, summary cards, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: [
      "chart",
      "chart-styles",
      "chart-mock-data",
      "stock-shared",
    ],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/stock-multi-series.tsx",
        type: "registry:component",
        target: "components/charts/stock-multi-series.tsx",
      },
    ],
  },
  {
    name: "stock-trendline",
    type: "registry:chart",
    title: "Stock Trendline",
    description:
      "Close price + dashed SMA overlay — navy×orange, symbol card, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/stock-trendline.tsx",
        type: "registry:component",
        target: "components/charts/stock-trendline.tsx",
      },
    ],
  },
  {
    name: "tremor-area-charts",
    type: "registry:chart",
    title: "KPI Area Charts",
    description:
      "KPI mini areas + hero dual series + stacked/share variants — navy×orange×amber, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/tremor-area-charts.tsx",
        type: "registry:component",
        target: "components/charts/tremor-area-charts.tsx",
      },
    ],
  },
  {
    name: "realtime-mountain-chart",
    type: "registry:chart",
    title: "Realtime Mountain Chart",
    description:
      "Live mountain area with pulsing tip + play/pause — semantic up/down stroke, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/realtime-mountain-chart.tsx",
        type: "registry:component",
        target: "components/charts/realtime-mountain-chart.tsx",
      },
    ],
  },
  {
    name: "realtime-candlestick",
    type: "registry:chart",
    title: "Realtime Candlestick",
    description:
      "Live forming OHLC candles + volume strip, sticky Y domain, play/pause — semantic up/down, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/realtime-candlestick.tsx",
        type: "registry:component",
        target: "components/charts/realtime-candlestick.tsx",
      },
    ],
  },
  {
    name: "heikin-ashi",
    type: "registry:chart",
    title: "Heikin Ashi",
    description:
      "Smoothed Heikin Ashi candles via toHeikinAshi — semantic up/down, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/heikin-ashi.tsx",
        type: "registry:component",
        target: "components/charts/heikin-ashi.tsx",
      },
    ],
  },
  {
    name: "renko-chart",
    type: "registry:chart",
    title: "Renko Chart",
    description:
      "Fixed brick-size Renko bricks via toRenko — semantic up/down, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: [
      "chart",
      "chart-styles",
      "chart-mock-data",
      "stock-shared",
    ],
    cssVars: {
      light: {
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/renko-chart.tsx",
        type: "registry:component",
        target: "components/charts/renko-chart.tsx",
      },
    ],
  },
  {
    name: "volume-profile",
    type: "registry:chart",
    title: "Volume Profile",
    description:
      "Horizontal volume-by-price bins with POC highlight — semantic up/down, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/volume-profile.tsx",
        type: "registry:component",
        target: "components/charts/volume-profile.tsx",
      },
    ],
  },
  {
    name: "order-book-depth",
    type: "registry:chart",
    title: "Order Book Depth",
    description:
      "Cumulative bid/ask step areas around mid — semantic up/down, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: [
      "chart",
      "chart-styles",
      "chart-mock-data",
      "stock-shared",
    ],
    cssVars: {
      light: {
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/order-book-depth.tsx",
        type: "registry:component",
        target: "components/charts/order-book-depth.tsx",
      },
    ],
  },
  {
    name: "drawdown-chart",
    type: "registry:chart",
    title: "Drawdown Chart",
    description:
      "Equity line + underwater drawdown area — dual synced panels, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/drawdown-chart.tsx",
        type: "registry:component",
        target: "components/charts/drawdown-chart.tsx",
      },
    ],
  },
  {
    name: "bollinger-bands",
    type: "registry:chart",
    title: "Bollinger Bands",
    description:
      "Close + SMA mid + ±σ band fill — stacked envelope, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: [
      "chart",
      "chart-styles",
      "chart-mock-data",
      "stock-shared",
    ],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#d97706",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/bollinger-bands.tsx",
        type: "registry:component",
        target: "components/charts/bollinger-bands.tsx",
      },
    ],
  },
  {
    name: "candlestick-indicators",
    type: "registry:chart",
    title: "Candlestick Indicators",
    description:
      "OHLC + RSI(14) + MACD(12,26,9) synced panels — metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#d97706",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/candlestick-indicators.tsx",
        type: "registry:component",
        target: "components/charts/candlestick-indicators.tsx",
      },
    ],
  },
  {
    name: "multi-timeframe",
    type: "registry:chart",
    title: "Multi Timeframe",
    description:
      "Daily / weekly / monthly close lines from one series — metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles", "stock-shared"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#d97706",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/stock/multi-timeframe.tsx",
        type: "registry:component",
        target: "components/charts/multi-timeframe.tsx",
      },
    ],
  },
  {
    name: "heatmap-calendar",
    type: "registry:chart",
    title: "Heatmap Calendar",
    description:
      "Year of daily activity — Sunday-start SVG grid, navy intensity, holiday accents, RTL-aware.",
    registryDependencies: ["heatmap-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
      },
      dark: {
        "chart-1": "#3b82f6",
      },
    },
    files: [
      {
        path: "registry/charts/heatmap/heatmap-calendar.tsx",
        type: "registry:component",
        target: "components/charts/heatmap-calendar.tsx",
      },
    ],
  },
  {
    name: "heatmap-calendar-emerald",
    type: "registry:chart",
    title: "Heatmap Calendar Emerald",
    description:
      "Sunday-start calendar heatmap with soft green (`--chart-up`) intensity — RTL-aware.",
    registryDependencies: ["heatmap-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-up": "#0d9488",
      },
      dark: {
        "chart-up": "#2dd4bf",
      },
    },
    files: [
      {
        path: "registry/charts/heatmap/heatmap-calendar-emerald.tsx",
        type: "registry:component",
        target: "components/charts/heatmap-calendar-emerald.tsx",
      },
    ],
  },
  {
    name: "heatmap-matrix",
    type: "registry:chart",
    title: "Heatmap Matrix",
    description:
      "Day × hour SVG intensity grid — navy `--chart-1`, floating tip, RTL-aware.",
    registryDependencies: ["heatmap-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
      },
      dark: {
        "chart-1": "#3b82f6",
      },
    },
    files: [
      {
        path: "registry/charts/heatmap/heatmap-matrix.tsx",
        type: "registry:component",
        target: "components/charts/heatmap-matrix.tsx",
      },
    ],
  },
  {
    name: "heatmap-matrix-values",
    type: "registry:chart",
    title: "Heatmap Matrix Values",
    description:
      "Day × hour SVG grid with in-cell values — soft green `--chart-up`, RTL-aware.",
    registryDependencies: ["heatmap-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-up": "#0d9488",
      },
      dark: {
        "chart-up": "#2dd4bf",
      },
    },
    files: [
      {
        path: "registry/charts/heatmap/heatmap-matrix-values.tsx",
        type: "registry:component",
        target: "components/charts/heatmap-matrix-values.tsx",
      },
    ],
  },
  {
    name: "bundle-size-treemap",
    type: "registry:chart",
    title: "Bundle Size Treemap",
    description:
      "Client JS bundle weight by package group — flat Treemap, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/treemap/bundle-size-treemap.tsx",
        type: "registry:component",
        target: "components/charts/bundle-size-treemap.tsx",
      },
    ],
  },
  {
    name: "simple-treemap",
    type: "registry:chart",
    title: "Simple Treemap",
    description:
      "Flat module-size treemap (classic baseline) — metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/treemap/simple-treemap.tsx",
        type: "registry:component",
        target: "components/charts/simple-treemap.tsx",
      },
    ],
  },
  {
    name: "custom-content-treemap",
    type: "registry:chart",
    title: "Custom Content Treemap",
    description:
      "Custom Treemap content — group fill, rank, and label; leaf strokes; metric scrubber.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/treemap/custom-content-treemap.tsx",
        type: "registry:component",
        target: "components/charts/custom-content-treemap.tsx",
      },
    ],
  },
  {
    name: "nested-treemap",
    type: "registry:chart",
    title: "Nested Treemap",
    description:
      "Nest drill-down treemap with breadcrumb — click groups to zoom; metric scrubber.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/treemap/nested-treemap.tsx",
        type: "registry:component",
        target: "components/charts/nested-treemap.tsx",
      },
    ],
  },
  {
    name: "treemap-with-padding-and-gaps",
    type: "registry:chart",
    title: "Treemap With Padding And Gaps",
    description:
      "Flat treemap teaching nodeInset + nodeGap — same data as Simple, metric scrubber.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/treemap/treemap-with-padding-and-gaps.tsx",
        type: "registry:component",
        target: "components/charts/treemap-with-padding-and-gaps.tsx",
      },
    ],
  },
  {
    name: "treemap-content",
    type: "registry:chart",
    title: "Treemap Content",
    description:
      "Treemap content as a React element (cloneElement) — centered leaf labels, metric scrubber.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/treemap/treemap-content.tsx",
        type: "registry:component",
        target: "components/charts/treemap-content.tsx",
      },
    ],
  },
  {
    name: "gauge-default",
    type: "registry:chart",
    title: "Gauge Default",
    description:
      "Vivid traffic gauge (emerald / amber / rose) — light/dark pairs, English metric header.",
    dependencies: ["react-gauge-chart", "lodash"],
    registryDependencies: ["gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#10B981",
        "chart-2": "#F59E0B",
        "chart-3": "#F43F5E",
      },
      dark: {
        "chart-1": "#34D399",
        "chart-2": "#FBBF24",
        "chart-3": "#FB7185",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/gauge-default.tsx",
        type: "registry:component",
        target: "components/charts/gauge-default.tsx",
      },
    ],
  },
  {
    name: "gauge-levels",
    type: "registry:chart",
    title: "Gauge Levels",
    description:
      "20 soft traffic bands with needle at 86% — fixed stage, English metric header.",
    dependencies: ["react-gauge-chart", "lodash"],
    registryDependencies: ["gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#6cb87a",
        "chart-2": "#d4b45a",
        "chart-3": "#d96b5c",
      },
      dark: {
        "chart-1": "#6cb87a",
        "chart-2": "#d4b45a",
        "chart-3": "#d96b5c",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/gauge-levels.tsx",
        type: "registry:component",
        target: "components/charts/gauge-levels.tsx",
      },
    ],
  },
  {
    name: "gauge-custom-colors",
    type: "registry:chart",
    title: "Gauge Custom Colors",
    description:
      "Rose → sand gauge with thicker arc at 37% — fixed stage, English metric header.",
    dependencies: ["react-gauge-chart", "lodash"],
    registryDependencies: ["gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#d97986",
        "chart-2": "#c4a574",
      },
      dark: {
        "chart-1": "#d97986",
        "chart-2": "#c4a574",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/gauge-custom-colors.tsx",
        type: "registry:component",
        target: "components/charts/gauge-custom-colors.tsx",
      },
    ],
  },
  {
    name: "gauge-corner-radius",
    type: "registry:chart",
    title: "Gauge Corner Radius",
    description:
      "Ten traffic bands with rounded corners and wider gaps — fixed stage, English metric header.",
    dependencies: ["react-gauge-chart", "lodash"],
    registryDependencies: ["gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#6cb87a",
        "chart-2": "#d4b45a",
        "chart-3": "#d96b5c",
      },
      dark: {
        "chart-1": "#6cb87a",
        "chart-2": "#d4b45a",
        "chart-3": "#d96b5c",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/gauge-corner-radius.tsx",
        type: "registry:component",
        target: "components/charts/gauge-corner-radius.tsx",
      },
    ],
  },
  {
    name: "gauge-custom-arcs",
    type: "registry:chart",
    title: "Gauge Custom Arcs",
    description:
      "Uneven traffic arcs (30/50/20) at 37% — fixed stage, English metric header.",
    dependencies: ["react-gauge-chart", "lodash"],
    registryDependencies: ["gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#6cb87a",
        "chart-2": "#d4b45a",
        "chart-3": "#d96b5c",
      },
      dark: {
        "chart-1": "#6cb87a",
        "chart-2": "#d4b45a",
        "chart-3": "#d96b5c",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/gauge-custom-arcs.tsx",
        type: "registry:component",
        target: "components/charts/gauge-custom-arcs.tsx",
      },
    ],
  },
  {
    name: "gauge-no-animation",
    type: "registry:chart",
    title: "Gauge No Animation",
    description:
      "Fifteen traffic bands at 56% with needle animation off — fixed stage, English metric header.",
    dependencies: ["react-gauge-chart", "lodash"],
    registryDependencies: ["gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#6cb87a",
        "chart-2": "#d4b45a",
        "chart-3": "#d96b5c",
      },
      dark: {
        "chart-1": "#6cb87a",
        "chart-2": "#d4b45a",
        "chart-3": "#d96b5c",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/gauge-no-animation.tsx",
        type: "registry:component",
        target: "components/charts/gauge-no-animation.tsx",
      },
    ],
  },
  {
    name: "hc-gauge-default",
    type: "registry:chart",
    title: "Hc Gauge Default",
    description:
      "Highcharts dial with soft traffic plotBands — English metric header.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["hc-gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#6cb87a",
        "chart-2": "#d4b45a",
        "chart-3": "#d96b5c",
      },
      dark: {
        "chart-1": "#6cb87a",
        "chart-2": "#d4b45a",
        "chart-3": "#d96b5c",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/hc-gauge-default.tsx",
        type: "registry:component",
        target: "components/charts/hc-gauge-default.tsx",
      },
    ],
  },
  {
    name: "hc-gauge-rounded-ends",
    type: "registry:chart",
    title: "Hc Gauge Rounded Ends",
    description:
      "Highcharts dial with rounded pane and dial tips — soft blue bands, English metric header.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["hc-gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#9bbfd4",
        "chart-2": "#6ea1c7",
        "chart-3": "#4a7a9a",
      },
      dark: {
        "chart-1": "#9bbfd4",
        "chart-2": "#6ea1c7",
        "chart-3": "#4a7a9a",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/hc-gauge-rounded-ends.tsx",
        type: "registry:component",
        target: "components/charts/hc-gauge-rounded-ends.tsx",
      },
    ],
  },
  {
    name: "hc-gauge-thin-ring",
    type: "registry:chart",
    title: "Hc Gauge Thin Ring",
    description:
      "Highcharts thin outer ring bands — soft violet/slate, English metric header.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["hc-gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#b8a8c8",
        "chart-2": "#8b9dc3",
      },
      dark: {
        "chart-1": "#b8a8c8",
        "chart-2": "#8b9dc3",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/hc-gauge-thin-ring.tsx",
        type: "registry:component",
        target: "components/charts/hc-gauge-thin-ring.tsx",
      },
    ],
  },
  {
    name: "hc-gauge-semicircle",
    type: "registry:chart",
    title: "Hc Gauge Semicircle",
    description:
      "Highcharts half-dial speedometer — soft gold to red bands, English metric header.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["hc-gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#d4b45a",
        "chart-2": "#c88860",
        "chart-3": "#d96b5c",
      },
      dark: {
        "chart-1": "#d4b45a",
        "chart-2": "#c88860",
        "chart-3": "#d96b5c",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/hc-gauge-semicircle.tsx",
        type: "registry:component",
        target: "components/charts/hc-gauge-semicircle.tsx",
      },
    ],
  },
  {
    name: "hc-gauge-custom-pivot",
    type: "registry:chart",
    title: "Hc Gauge Custom Pivot",
    description:
      "Highcharts dial with large hollow pivot — soft teal bands, English metric header.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["hc-gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#7eb8a0",
        "chart-2": "#4a9e88",
      },
      dark: {
        "chart-1": "#7eb8a0",
        "chart-2": "#4a9e88",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/hc-gauge-custom-pivot.tsx",
        type: "registry:component",
        target: "components/charts/hc-gauge-custom-pivot.tsx",
      },
    ],
  },
  {
    name: "hc-gauge-combo",
    type: "registry:chart",
    title: "Hc Gauge Combo",
    description:
      "Highcharts solidgauge + dial on one value — soft teal/blue/violet, English metric header.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["hc-gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#7eb8a0",
        "chart-2": "#6ea1c7",
        "chart-3": "#8b9dc3",
      },
      dark: {
        "chart-1": "#7eb8a0",
        "chart-2": "#6ea1c7",
        "chart-3": "#8b9dc3",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/hc-gauge-combo.tsx",
        type: "registry:component",
        target: "components/charts/hc-gauge-combo.tsx",
      },
    ],
  },
  {
    name: "hc-gauge-fuel",
    type: "registry:chart",
    title: "Hc Gauge Fuel",
    description:
      "Highcharts semicircle fuel solidgauge — soft rose/gold/green stops, English metric header.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["hc-gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#d96b5c",
        "chart-2": "#d4b45a",
        "chart-3": "#6cb87a",
      },
      dark: {
        "chart-1": "#d96b5c",
        "chart-2": "#d4b45a",
        "chart-3": "#6cb87a",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/hc-gauge-fuel.tsx",
        type: "registry:component",
        target: "components/charts/hc-gauge-fuel.tsx",
      },
    ],
  },
  {
    name: "hc-gauge-activity",
    type: "registry:chart",
    title: "Hc Gauge Activity",
    description:
      "Highcharts 360° activity ring — soft pink→rose gradient, English metric header.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["hc-gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#c86b8f",
        "chart-2": "#d97986",
      },
      dark: {
        "chart-1": "#c86b8f",
        "chart-2": "#d97986",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/hc-gauge-activity.tsx",
        type: "registry:component",
        target: "components/charts/hc-gauge-activity.tsx",
      },
    ],
  },
  {
    name: "hc-gauge-kpi",
    type: "registry:chart",
    title: "Hc Gauge Kpi",
    description:
      "Highcharts triple nested KPI rings — Conversion/Engagement/Retention, English metric header.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["hc-gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#5aa8d4",
        "chart-2": "#6b66b8",
        "chart-3": "#5cb88a",
      },
      dark: {
        "chart-1": "#5aa8d4",
        "chart-2": "#6b66b8",
        "chart-3": "#5cb88a",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/hc-gauge-kpi.tsx",
        type: "registry:component",
        target: "components/charts/hc-gauge-kpi.tsx",
      },
    ],
  },
  {
    name: "hc-gauge-rounded-bands",
    type: "registry:chart",
    title: "Hc Gauge Rounded Bands",
    description:
      "Highcharts dial with individually rounded plotBands — soft blue scale, English metric header.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["hc-gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#a8c4d8",
        "chart-2": "#6ea1c7",
        "chart-3": "#8b9dc3",
      },
      dark: {
        "chart-1": "#a8c4d8",
        "chart-2": "#6ea1c7",
        "chart-3": "#8b9dc3",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/hc-gauge-rounded-bands.tsx",
        type: "registry:component",
        target: "components/charts/hc-gauge-rounded-bands.tsx",
      },
    ],
  },
  {
    name: "hc-gauge-threshold",
    type: "registry:chart",
    title: "Hc Gauge Threshold",
    description:
      "Highcharts solidgauge with zero threshold — red below / green above, English metric header.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["hc-gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#d96b5c",
        "chart-2": "#6cb87a",
      },
      dark: {
        "chart-1": "#d96b5c",
        "chart-2": "#6cb87a",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/hc-gauge-threshold.tsx",
        type: "registry:component",
        target: "components/charts/hc-gauge-threshold.tsx",
      },
    ],
  },
  {
    name: "hc-gauge-custom-dial",
    type: "registry:chart",
    title: "Hc Gauge Custom Dial",
    description:
      "Highcharts solidgauge arc with circular dot dial — soft blue accent, English metric header.",
    dependencies: ["highcharts", "highcharts-react-official"],
    registryDependencies: ["hc-gauge-shared", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#5aa8d4",
      },
      dark: {
        "chart-1": "#5aa8d4",
      },
    },
    files: [
      {
        path: "registry/charts/gauge/hc-gauge-custom-dial.tsx",
        type: "registry:component",
        target: "components/charts/hc-gauge-custom-dial.tsx",
      },
    ],
  },
  {
    name: "stacked-bar-chart",
    type: "registry:chart",
    title: "Stacked Bar Chart",
    description:
      "Stacked Desktop+Mobile H1 2026 — navy×orange locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/stacked-bar-chart.tsx",
        type: "registry:component",
        target: "components/charts/stacked-bar-chart.tsx",
      },
    ],
  },
  {
    name: "box-plot",
    type: "registry:chart",
    title: "Box Plot",
    description:
      "IQR box + median + whiskers + outliers by category — navy×orange locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/box-plot.tsx",
        type: "registry:component",
        target: "components/charts/box-plot.tsx",
      },
    ],
  },
  {
    name: "waterfall",
    type: "registry:chart",
    title: "Waterfall",
    description:
      "P&L bridge with floating range bars — increase/decrease/total fills, locked chrome scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
        "chart-down": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
        "chart-down": "#f25f70",
      },
    },
    files: [
      {
        path: "registry/charts/bar/waterfall.tsx",
        type: "registry:component",
        target: "components/charts/waterfall.tsx",
      },
    ],
  },
  {
    name: "mix-bar-chart",
    type: "registry:chart",
    title: "Mix Bar Chart",
    description:
      "Store+Online stacked beside Orders — navy×orange×amber, legend focus/lock, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
      },
    },
    files: [
      {
        path: "registry/charts/bar/mix-bar-chart.tsx",
        type: "registry:component",
        target: "components/charts/mix-bar-chart.tsx",
      },
    ],
  },
  {
    name: "positive-and-negative-bar-chart",
    type: "registry:chart",
    title: "Positive And Negative Bar Chart",
    description:
      "Grouped Online×Store bars that cross zero — signed Y ticks, zero reference line, locked chrome scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
      },
    },
    files: [
      {
        path: "registry/charts/bar/positive-and-negative-bar-chart.tsx",
        type: "registry:component",
        target: "components/charts/positive-and-negative-bar-chart.tsx",
      },
    ],
  },
  {
    name: "bar-chart-with-customized-event",
    type: "registry:chart",
    title: "Bar Chart With Customized Event",
    description:
      "Click a month to drive chips + detail panel — average reference line, locked chrome, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-up": "#16a34a",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-up": "#4ade80",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-chart-with-customized-event.tsx",
        type: "registry:component",
        target: "components/charts/bar-chart-with-customized-event.tsx",
      },
    ],
  },
  {
    name: "bar-chart-has-background",
    type: "registry:chart",
    title: "Bar Chart Has Background",
    description:
      "Grouped Desktop×Mobile with a muted background track on Desktop — locked chrome scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-chart-has-background.tsx",
        type: "registry:component",
        target: "components/charts/bar-chart-has-background.tsx",
      },
    ],
  },
  {
    name: "ranged-stacked-bar-chart",
    type: "registry:chart",
    title: "Ranged Stacked Bar Chart",
    description:
      "Prep/Pack/Ship minute ranges via BarStack — navy×orange×amber, locked chrome scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
      },
    },
    files: [
      {
        path: "registry/charts/bar/ranged-stacked-bar-chart.tsx",
        type: "registry:component",
        target: "components/charts/ranged-stacked-bar-chart.tsx",
      },
    ],
  },
  {
    name: "tiny-bar-chart",
    type: "registry:chart",
    title: "Tiny Bar Chart",
    description:
      "Compact single-series sparkline bars — locked header chrome, no axes, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
      },
      dark: {
        "chart-1": "#3b82f6",
      },
    },
    files: [
      {
        path: "registry/charts/bar/tiny-bar-chart.tsx",
        type: "registry:component",
        target: "components/charts/tiny-bar-chart.tsx",
      },
    ],
  },
  {
    name: "bar-active",
    type: "registry:chart",
    title: "Bar Active",
    description:
      "Per-category fills with a dashed featured bar outline — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-active.tsx",
        type: "registry:component",
        target: "components/charts/bar-active.tsx",
      },
    ],
  },
  {
    name: "population-pyramid",
    type: "registry:chart",
    title: "Population Pyramid",
    description:
      "Horizontal Male×Female by age — navy×orange locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/population-pyramid.tsx",
        type: "registry:component",
        target: "components/charts/population-pyramid.tsx",
      },
    ],
  },
  {
    name: "timeline",
    type: "registry:chart",
    title: "Timeline",
    description:
      "Horizontal ranged cycles per test — semantic outcome colors, locked chrome scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/timeline.tsx",
        type: "registry:component",
        target: "components/charts/timeline.tsx",
      },
    ],
  },
  {
    name: "animated-bar-width",
    type: "registry:chart",
    title: "Animated Bar Width",
    description:
      "Single-series bars that expand on scrub — navy locked chrome, metric header, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/animated-bar-width.tsx",
        type: "registry:component",
        target: "components/charts/animated-bar-width.tsx",
      },
    ],
  },
  {
    name: "animated-bar-time-series",
    type: "registry:chart",
    title: "Animated Bar Time Series",
    description:
      "Sliding window over a longer series — navy locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/animated-bar-time-series.tsx",
        type: "registry:component",
        target: "components/charts/animated-bar-time-series.tsx",
      },
    ],
  },
  {
    name: "custom-shape-bar-chart",
    type: "registry:chart",
    title: "Custom Shape Bar Chart",
    description:
      "Bevelled custom bar paths by category — locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/bar/custom-shape-bar-chart.tsx",
        type: "registry:component",
        target: "components/charts/custom-shape-bar-chart.tsx",
      },
    ],
  },
  {
    name: "brush-bar-chart",
    type: "registry:chart",
    title: "Brush Bar Chart",
    description:
      "Bipolar dual-series with range brush — navy locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/brush-bar-chart.tsx",
        type: "registry:component",
        target: "components/charts/brush-bar-chart.tsx",
      },
    ],
  },
  {
    name: "biaxial-bar-chart",
    type: "registry:chart",
    title: "Biaxial Bar Chart",
    description:
      "Dual Y-axes with independent scales — navy locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/biaxial-bar-chart.tsx",
        type: "registry:component",
        target: "components/charts/biaxial-bar-chart.tsx",
      },
    ],
  },
  {
    name: "bar-chart-with-label-background",
    type: "registry:chart",
    title: "Bar Chart With Label Background",
    description:
      "Stacked bars with inside segment labels — navy locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-chart-with-label-background.tsx",
        type: "registry:component",
        target: "components/charts/bar-chart-with-label-background.tsx",
      },
    ],
  },
  {
    name: "bar-chart-range",
    type: "registry:chart",
    title: "Bar Chart Range",
    description:
      "Ranged [low, high] bars — navy locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-chart-range.tsx",
        type: "registry:component",
        target: "components/charts/bar-chart-range.tsx",
      },
    ],
  },
  {
    name: "stacked-bar-chart-with-horizontal-line",
    type: "registry:chart",
    title: "Stacked Bar Chart With Horizontal Line",
    description:
      "Three-stack sales with dashed target line — locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
      },
    },
    files: [
      {
        path: "registry/charts/bar/stacked-bar-chart-with-horizontal-line.tsx",
        type: "registry:component",
        target: "components/charts/stacked-bar-chart-with-horizontal-line.tsx",
      },
    ],
  },
  {
    name: "bar-default",
    type: "registry:chart",
    title: "Bar Default",
    description:
      "Single-series monthly store bars — navy locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-default.tsx",
        type: "registry:component",
        target: "components/charts/bar-default.tsx",
      },
    ],
  },
  {
    name: "bar-multiple",
    type: "registry:chart",
    title: "Bar Multiple",
    description:
      "Grouped Desktop + Mobile bars — navy×orange locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-multiple.tsx",
        type: "registry:component",
        target: "components/charts/bar-multiple.tsx",
      },
    ],
  },
  {
    name: "bar-stacked",
    type: "registry:chart",
    title: "Bar Stacked",
    description:
      "Stacked Desktop + Mobile bars — navy×orange locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-stacked.tsx",
        type: "registry:component",
        target: "components/charts/bar-stacked.tsx",
      },
    ],
  },
  {
    name: "bar-label",
    type: "registry:chart",
    title: "Bar Label",
    description:
      "Single-series bars with always-on top labels — navy locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-label.tsx",
        type: "registry:component",
        target: "components/charts/bar-label.tsx",
      },
    ],
  },
  {
    name: "bar-label-custom",
    type: "registry:chart",
    title: "Bar Label Custom",
    description:
      "Horizontal Store bars with always-on tip labels — navy locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-label-custom.tsx",
        type: "registry:component",
        target: "components/charts/bar-label-custom.tsx",
      },
    ],
  },
  {
    name: "bar-interactive",
    type: "registry:chart",
    title: "Bar Interactive",
    description:
      "Toggle Store/Online period totals, then scrub daily bars — navy×orange locked chrome, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-interactive.tsx",
        type: "registry:component",
        target: "components/charts/bar-interactive.tsx",
      },
    ],
  },
  {
    name: "bar-horizontal",
    type: "registry:chart",
    title: "Bar Horizontal",
    description:
      "Horizontal single-series bars — navy locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-horizontal.tsx",
        type: "registry:component",
        target: "components/charts/bar-horizontal.tsx",
      },
    ],
  },
  {
    name: "bar-mixed",
    type: "registry:chart",
    title: "Bar Mixed",
    description:
      "Horizontal bars with per-category colors — locked chrome, metric header scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-mixed.tsx",
        type: "registry:component",
        target: "components/charts/bar-mixed.tsx",
      },
    ],
  },
  {
    name: "bar-negative",
    type: "registry:chart",
    title: "Bar Negative",
    description:
      "Single-series signed bars with navy gains / orange losses and a zero line — locked chrome, metric scrubber, RTL-aware.",
    dependencies: ["recharts"],
    registryDependencies: ["chart", "chart-styles"],
    cssVars: {
      light: {
        "chart-1": "#1e3a8a",
        "chart-2": "#ea580c",
        "chart-3": "#f59e0b",
        "chart-4": "#6366f1",
        "chart-5": "#e11d48",
      },
      dark: {
        "chart-1": "#3b82f6",
        "chart-2": "#f97316",
        "chart-3": "#fbbf24",
        "chart-4": "#818cf8",
        "chart-5": "#fb7185",
      },
    },
    files: [
      {
        path: "registry/charts/bar/bar-negative.tsx",
        type: "registry:component",
        target: "components/charts/bar-negative.tsx",
      },
    ],
  },
]
