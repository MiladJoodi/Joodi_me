import { ExternalLinkIcon, RotateCcwIcon } from "lucide-react"

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@sonojs/ui/components/marker"

export function MarkerLink() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Marker asChild>
        <a href="#">
          <MarkerIcon>
            <ExternalLinkIcon />
          </MarkerIcon>
          <MarkerContent>View the pull request</MarkerContent>
        </a>
      </Marker>
      <Marker asChild>
        <button type="button" className="cursor-pointer">
          <MarkerIcon>
            <RotateCcwIcon />
          </MarkerIcon>
          <MarkerContent>Restore checkpoint</MarkerContent>
        </button>
      </Marker>
    </div>
  )
}
