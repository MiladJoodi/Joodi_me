"use client"

import * as React from "react"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@sonojs/ui/components/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@sonojs/ui/components/input-otp"

export function InputOTPControlled() {
  const [value, setValue] = React.useState("")

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="otp-controlled">One-time password</FieldLabel>
      <InputOTP
        id="otp-controlled"
        maxLength={6}
        value={value}
        onChange={setValue}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <FieldDescription>
        {value === "" ? "Enter your one-time password." : `You entered: ${value}`}
      </FieldDescription>
    </Field>
  )
}
