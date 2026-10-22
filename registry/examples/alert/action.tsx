import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@sonojs/ui/components/alert"
import { Button } from "@sonojs/ui/components/button"

export function AlertActionExample() {
  return (
    <Alert className="max-w-md">
      <AlertTitle>Dark mode is now available</AlertTitle>
      <AlertDescription>
        Enable it under your profile settings to get started.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="default">
          Enable
        </Button>
      </AlertAction>
    </Alert>
  )
}
