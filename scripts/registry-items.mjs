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
