"use client"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@sonojs/ui/components/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@sonojs/ui/components/input-otp"

export function InputOTPDisabled() {
  return (
    <Field data-disabled className="max-w-xs">
      <FieldLabel htmlFor="otp-disabled">Verification code</FieldLabel>
      <InputOTP id="otp-disabled" maxLength={6} disabled>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  )
}
