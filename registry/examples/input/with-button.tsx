import { Button } from "@sonojs/ui/components/button"
import { Field } from "@sonojs/ui/components/field"
import { Input } from "@sonojs/ui/components/input"

export function InputWithButton() {
  return (
    <Field orientation="horizontal" className="max-w-sm">
      <Input type="email" placeholder="Email" autoComplete="email" />
      <Button type="submit">Subscribe</Button>
    </Field>
  )
}
