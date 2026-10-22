"use client"

import {
  Field,
  FieldError,
  FieldLabel,
} from "@sonojs/ui/components/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@sonojs/ui/components/input-otp"

export function InputOTPInvalid() {
  return (
    <Field data-invalid className="max-w-xs">
      <FieldLabel htmlFor="otp-invalid">Verification code</FieldLabel>
      <InputOTP id="otp-invalid" maxLength={6} aria-invalid>
        <InputOTPGroup>
          <InputOTPSlot index={0} aria-invalid />
          <InputOTPSlot index={1} aria-invalid />
          <InputOTPSlot index={2} aria-invalid />
          <InputOTPSlot index={3} aria-invalid />
          <InputOTPSlot index={4} aria-invalid />
          <InputOTPSlot index={5} aria-invalid />
        </InputOTPGroup>
      </InputOTP>
      <FieldError>Invalid code. Please try again.</FieldError>
    </Field>
  )
}
