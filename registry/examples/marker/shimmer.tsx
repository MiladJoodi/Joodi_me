import { Spinner } from "@sonojs/ui/components/spinner"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@sonojs/ui/components/marker"

export function MarkerShimmer() {
  return (
    <Marker role="status" className="max-w-md">
      <MarkerIcon>
        <Spinner />
      </MarkerIcon>
      <MarkerContent className="shimmer">Thinking…</MarkerContent>
    </Marker>
  )
}
