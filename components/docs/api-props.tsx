import { cn } from "@/lib/utils"

export type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

/** Display unions with middle dots: `"a" · "b"` instead of `"a" | "b"`. */
function formatPropType(type: string) {
  return type.replace(/\s*\|\s*/g, " · ")
}

export function DocsApiProps({
  rows,
  className,
}: {
  rows: PropRow[]
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-code)] border border-border/80",
        className
      )}
    >
      <table className="w-full text-start text-secondary">
        <thead className="bg-muted/40 text-caption text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">Prop</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Default</th>
            <th className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-border/70">
              <td className="px-4 py-3 font-mono text-[length:var(--text-code)] text-primary">
                {row.name}
              </td>
              <td className="px-4 py-3 font-mono text-[length:var(--text-code)] text-muted-foreground">
                {formatPropType(row.type)}
              </td>
              <td className="px-4 py-3 font-mono text-[length:var(--text-code)] text-muted-foreground">
                {row.defaultValue ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
