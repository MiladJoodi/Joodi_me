"use client"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@sonojs/ui/components/field"
import { Switch } from "@sonojs/ui/components/switch"

export function SwitchDescription() {
  return (
    <Field orientation="horizontal" className="w-full max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor="share-focus">Share focus</FieldLabel>
        <FieldDescription>
          Focus is shared across devices, and turns off when you leave the app.
        </FieldDescription>
      </FieldContent>
      <Switch id="share-focus" defaultChecked />
    </Field>
  )
}
