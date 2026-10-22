import { Spinner } from "@sonojs/ui/components/spinner"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@sonojs/ui/components/marker"

export function MarkerStatus() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Compacting conversation</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Running tests</MarkerContent>
      </Marker>
    </div>
  )
}
