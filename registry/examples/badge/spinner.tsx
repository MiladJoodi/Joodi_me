import { Badge } from "@winkui/ui/components/badge"
import { Spinner } from "@winkui/ui/components/spinner"

export function BadgeSpinnerExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="destructive">
        <Spinner data-icon="inline-start" />
        Deleting
      </Badge>
      <Badge variant="secondary">
        Generating
        <Spinner data-icon="inline-end" />
      </Badge>
    </div>
  )
}
