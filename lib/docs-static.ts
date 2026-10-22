/**
 * Docs routing should stay statically generated from registry metadata.
 *
 * When introducing a dynamic segment (e.g. `app/(app)/docs/components/[name]/page.tsx`):
 *
 * ```ts
 * import { registry } from "@/registry"
 *
 * export const dynamic = "force-static"
 *
 * export function generateStaticParams() {
 *   return registry.components.map((item) => ({ name: item.name }))
 * }
 * ```
 *
 * Do not set `dynamic = "force-dynamic"` or `revalidate = 0` on normal docs pages.
 * Freshness comes from the next successful production deploy (same artifact as `public/r`).
 */

export {}
