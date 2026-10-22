import { Spinner } from "@sonojs/ui/components/spinner"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@sonojs/ui/components/marker"
import { Message, MessageContent } from "@sonojs/ui/components/message"

export function MessageStatus() {
  return (
    <Message className="max-w-md">
      <MessageContent>
        <Marker role="status">
          <MarkerIcon>
            <Spinner />
          </MarkerIcon>
          <MarkerContent className="shimmer">Checking the logs…</MarkerContent>
        </Marker>
      </MessageContent>
    </Message>
  )
}
