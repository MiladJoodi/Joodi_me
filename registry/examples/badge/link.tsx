import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@sonojs/ui/components/badge"

export function BadgeLinkExample() {
  return (
    <Badge asChild>
      <a href="#link">
        Open Link <ArrowUpRightIcon data-icon="inline-end" />
      </a>
    </Badge>
  )
}
