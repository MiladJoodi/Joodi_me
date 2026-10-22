import { Button } from "@sonojs/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@sonojs/ui/components/field"
import { Input } from "@sonojs/ui/components/input"

export function FieldGroupExample() {
  return (
    <form className="w-full max-w-sm">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" placeholder="Evil Rabbit" autoComplete="name" />
        </Field>
        <Field>
          <FieldLabel htmlFor="email-group">Email</FieldLabel>
          <Input
            id="email-group"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            dir="ltr"
            className="text-left"
          />
          <FieldDescription>
            We&apos;ll use this to contact you about your account.
          </FieldDescription>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button type="button" variant="outline" className="w-full">
            Continue with Google
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
