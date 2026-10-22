import {
  Marker,
  MarkerContent,
} from "@sonojs/ui/components/marker"

export function MarkerSeparatorExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker>
        <MarkerContent>Worked for 42s</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Conversation compacted</MarkerContent>
      </Marker>
    </div>
  )
}
