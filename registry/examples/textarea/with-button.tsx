import { Button } from "@sonojs/ui/components/button"
import { Field } from "@sonojs/ui/components/field"
import { Textarea } from "@sonojs/ui/components/textarea"

export function TextareaWithButton() {
  return (
    <Field className="max-w-md gap-3">
      <Textarea placeholder="Type your message here." />
      <Button type="submit" className="w-fit">
        Send message
      </Button>
    </Field>
  )
}
