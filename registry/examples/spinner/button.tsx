import { Button } from "@sonojs/ui/components/button"
import { Spinner } from "@sonojs/ui/components/spinner"

export function SpinnerButton() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button disabled>
        <Spinner data-icon="inline-start" />
        Loading
      </Button>
      <Button variant="outline" disabled>
        Please wait
        <Spinner data-icon="inline-end" />
      </Button>
    </div>
  )
}
