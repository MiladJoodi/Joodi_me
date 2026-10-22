<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:sonojs-direction -->
# SonoJS direction (RTL + LTR)

Direction is a **core architecture** requirement for every new registry component, block, chart, and docs chrome.

- Inherit `dir` from the parent / `<html>`. Do not hardcode `dir` on components unless creating an isolated island.
- Use logical properties only (`ms`/`me`, `ps`/`pe`, `start`/`end`, `text-start`).
- Use `DirectionProvider` + `useDirection()` from `@/components/direction` for scoped demos; `getStartSide` / `getEndSide` for edge chrome.
- Directional icons: class `icon-dir`.
- Authoritative rule: `.cursor/rules/sonojs-direction.mdc`
- Human docs: `/docs/direction` · registry checklist: `registry/README.md`
<!-- END:sonojs-direction -->

<!-- BEGIN:sonojs-folder-structure -->
# SonoJS folder structure

Group files **per component / block / chart / example set**. No flat dumps of related siblings.

- Examples: `registry/examples/button/default.tsx` (not `examples/button-default.tsx`)
- Blocks/charts/ui sources: `registry/<kind>/<name>/…`
- Package UI: `packages/ui/src/components/…` (folder when multi-file)
- Site chrome: `components/<feature>/…` when 2+ related files (`docs/`, `direction/`, `site-header/`, `sidebar-nav/`)
- Docs: `app/(app)/docs/components/<name>/page.tsx`
- Authoritative rule: `.cursor/rules/sonojs-folder-structure.mdc`
<!-- END:sonojs-folder-structure -->

<!-- BEGIN:sonojs-ui-consistency -->
# SonoJS UI consistency

Same action → same control. Do not invent one-off copy / toggle / clear buttons.

- Copy: `CopyButton` (`@/components/docs`) — simple icon only
- Code blocks: `ComponentSource` (includes copy)
- Authoritative rule: `.cursor/rules/sonojs-ui-consistency.mdc`
<!-- END:sonojs-ui-consistency -->

<!-- BEGIN:sonojs-docs-examples -->
# SonoJS docs examples

Each variant needs a **title** + **one short description** above the preview player (outside the bordered chrome). Put API tokens in backticks. Do not crowd the demo.

- Authoritative rule: `.cursor/rules/sonojs-docs-examples.mdc`
<!-- END:sonojs-docs-examples -->

<!-- BEGIN:sonojs-docs-featured -->
# SonoJS docs featured

High-traffic / core docs pages get `featured: true` in `lib/docs-nav.ts` (green sidebar bullet). Keep it sparse.

- Authoritative rule: `.cursor/rules/sonojs-docs-featured.mdc`
<!-- END:sonojs-docs-featured -->

<!-- BEGIN:sonojs-registry-parity -->
# SonoJS registry parity

What docs show must be what users install. No stale registry payloads.

- UI source of truth: `packages/ui` → `npm run registry:build` → `public/r/`
- Do not hand-edit duplicate `registry/ui/` copies
- Authoritative rule: `.cursor/rules/sonojs-registry-parity.mdc`
<!-- END:sonojs-registry-parity -->

<!-- BEGIN:sonojs-registry-deps -->
# SonoJS registry dependencies

Declare complete `registryDependencies` + npm `dependencies` in `scripts/registry-items.mjs`. After `add`, CLI installs registry files and runs `npm i` for missing packages (`+` lines). Docs: `<DocsInstallation />` shows `add` plus an “Also needs” bar (same UI as button-group example footers) for nested registry items + npm (including lucide). Examples use `requires` / `npmRequires`.

- Authoritative rule: `.cursor/rules/sonojs-registry-deps.mdc`
<!-- END:sonojs-registry-deps -->

<!-- BEGIN:sonojs-registry-cursor -->
# Registry cursor pointer

Installable UI (`registry/` + `packages/ui`): every clickable control needs `cursor-pointer` (disabled → not-allowed / pointer-events-none).

Authoritative rule: `.cursor/rules/sonojs-registry-cursor.mdc`
<!-- END:sonojs-registry-cursor -->

<!-- BEGIN:sonojs-no-third-party-branding -->
# No third-party UI kit branding

Do not name other component-kit brands in docs, comments, or package copy. Describe tokens and pixels instead. Sole exception: registry `$schema` URLs for JSON format compatibility.

Authoritative rule: `.cursor/rules/sonojs-no-third-party-branding.mdc`
<!-- END:sonojs-no-third-party-branding -->

<!-- BEGIN:design-system-standards -->
# Design System Standards

Project defaults for UI, docs chrome, navigation, forms, code previews, and layouts. Deviate only for accessibility, functionality, or an established component API/variant.

Tokens live in `app/globals.css` (and `styles/vega-tokens.css` for theme surfaces). Prefer shared tokens over hardcoding.

## Typography

- Font: **Geist** (sans) + Geist Mono (code). Do not add extra font families.
- H1: 32px mobile / 40px desktop · H2: 26 / 32 · H3: 22 / 24 · H4: 18 / 20
- Body 16px · Secondary 14px · Caption 12px · Button text 14px / weight 500 · Code 13px
- Body line-height 1.5 · Heading line-height 1.2
- Weights: 400, 500, 600
- Utilities: `text-h1` … `text-h4`, `text-body`, `text-secondary`, `text-caption`

## Component dimensions

Size scale = SonoJS control scale (heights/padding/radius). Do **not** change fonts or brand colors when aligning sizes. Legacy default was `h-9` (36px); current styles use **`h-8` (32px)**.

- Button: xs `h-6` · sm `h-7` · **default `h-8` (32px)** · lg `h-9` · icon `size-8` / `size-6` / `size-7` / `size-9`; `text-sm` / weight 500
- Input / Select trigger: **`h-8`** · `px-2.5` · `rounded-md` · Input also `text-base md:text-sm`
- Checkbox: `size-4` (16px) · `rounded-[4px]`
- Switch default: `h-[1.15rem]` × `w-8` · thumb `size-4`
- Avatar default 32px · Badge: `px-2 py-0.5` · `rounded-full` · `text-xs`
- Toggle: `h-8` / `h-7` / `h-9`
- Icons: inline 14px · default UI 16px · prominent 20px (Lucide)
- Mobile touch targets ≥ 44×44px where practical

## Border radius

Radius scale (`--radius: 0.625rem` / 10px):

- Small / tooltips: ~6px (`--radius-sm` / `--radius-tooltip`)
- Controls (buttons, inputs, selects, sidebar items): ~8px (`rounded-md` / `--radius-control`)
- Surfaces (cards, code, dialogs): 10px (`--radius-lg` / `--radius-surface`)
- Pills / avatars: full round only when appropriate

Fonts (Geist) and brand colors stay SonoJS — only dimensions and radius follow the token scale above.

## Spacing

4px scale: 4, 8, 12, 16, 20, 24, 32, 48, 64 (`--space-*`).

- Form gaps 16px · Card padding 20–24px · Section 48–64px
- Mobile gutters 16px · Content max ~1280px · Desktop sidebar ~240px

## Icons

Prefer existing **Lucide**. Do not add another icon library. Keep size/stroke consistent (default 16px).

## Responsive

Mobile-first. Breakpoints: 640 / 768 / 1024 / 1280. Nav, dialogs, forms, code (horizontal scroll), tables, and previews must stay usable on narrow screens.

## Colors

Use existing CSS variable theme (`--primary`, `--background`, …). Primary light default `#2563EB`. No competing theme systems; no scattered hardcodes.

Accessible contrast and visible focus rings required.

### Primary Button Contrast Rules

- Primary buttons must use a text color that provides sufficient contrast against their background.
- For the default blue primary (`#2563EB` light / `#396EF0` dark), use **white** text (`#FFFFFF`) in **both** light and dark themes.
- Do **not** automatically switch primary button text to black in dark mode. Button text contrast depends on the **button background**, not the surrounding page theme.
- Hover, active, and disabled states must maintain readable contrast.
- If a custom theme uses a light primary color, choose a dark foreground when necessary for contrast.
- Prefer semantic tokens `--primary` and `--primary-foreground` (never hardcode per component).
- Target WCAG AA: ≥ 4.5:1 normal text, ≥ 3:1 large text.

### Code Block Design Standards

Apply to all code blocks, snippets, component source examples, and CLI samples. Shared component: `ComponentSource`. Tokens: `--code-*` in `app/globals.css`.

**Typography**
- Font: Geist Mono (`--font-sono-mono`)
- Size: 14px (mobile + desktop, VS Code default) · Line-height: 1.65 · Weight: 400 · Tab size: 2
- Preserve whitespace; no wrap by default — horizontal scroll
- Line numbers optional and subtle (`--code-line-number`)

**Default dark theme (VS Code Dark+)** — independent of brand primary
- Highlighter: `shiki` theme `dark-plus` via `lib/highlight-code.ts` → `ComponentSource`
- Chrome: Background `#1E1E1E` · Text `#D4D4D4` · Selection `#264F78` · Radius `--radius-code` (NY surface / 10px)
- Token colors come from Dark+ (not brand `--primary`)

**Behavior**
- Same theme in light and dark site modes (dark code surface is OK)
- Copy / labels must not reduce readability; no heavy shadows or gradients
<!-- END:design-system-standards -->
