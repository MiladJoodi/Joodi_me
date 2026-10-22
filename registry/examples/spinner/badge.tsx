import { Badge } from "@sonojs/ui/components/badge"
import { Spinner } from "@sonojs/ui/components/spinner"

export function SpinnerBadge() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">
        <Spinner data-icon="inline-start" />
        Syncing
      </Badge>
      <Badge variant="outline">
        Updating
        <Spinner data-icon="inline-end" />
      </Badge>
      <Badge>
        <Spinner data-icon="inline-start" />
        Processing
      </Badge>
    </div>
  )
}
