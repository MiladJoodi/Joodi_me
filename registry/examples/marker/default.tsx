import { CheckIcon, GitBranchIcon, SearchIcon } from "lucide-react"

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@sonojs/ui/components/marker"

export function MarkerDefault() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Marker>
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Switched to a new branch</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <CheckIcon />
        </MarkerIcon>
        <MarkerContent>Syncing completed</MarkerContent>
      </Marker>
    </div>
  )
}
