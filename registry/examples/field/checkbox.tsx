import { Checkbox } from "@sonojs/ui/components/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@sonojs/ui/components/field"

export function FieldCheckbox() {
  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend variant="label">Preferences</FieldLegend>
      <FieldDescription>
        Sync Desktop &amp; Documents folders for this Mac.
      </FieldDescription>
      <FieldGroup className="gap-3">
        <Field orientation="horizontal">
          <Checkbox id="sync-desktop" defaultChecked />
          <FieldContent>
            <FieldLabel htmlFor="sync-desktop">
              <FieldTitle>Sync Desktop</FieldTitle>
            </FieldLabel>
            <FieldDescription>
              Files on your Desktop appear on this Mac and iCloud Drive.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="sync-documents" />
          <FieldContent>
            <FieldLabel htmlFor="sync-documents">
              <FieldTitle>Sync Documents</FieldTitle>
            </FieldLabel>
            <FieldDescription>
              Files in Documents appear on this Mac and iCloud Drive.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
