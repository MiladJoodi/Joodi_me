import { FileTextIcon, GitBranchIcon, SearchIcon } from "lucide-react"

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@sonojs/ui/components/marker"

export function MarkerBorder() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Marker variant="border">
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Switched to release-candidate</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Reviewed 8 related files</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <FileTextIcon />
        </MarkerIcon>
        <MarkerContent>Opened implementation notes</MarkerContent>
      </Marker>
    </div>
  )
}
