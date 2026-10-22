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

export function FieldChoiceCard() {
  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend>Compute environment</FieldLegend>
      <FieldDescription>
        Select the compute environment for your cluster.
      </FieldDescription>
      <FieldGroup className="gap-3">
        <FieldLabel htmlFor="kubernetes">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Kubernetes</FieldTitle>
              <FieldDescription>
                Run GPU workloads on a K8s cluster.
              </FieldDescription>
            </FieldContent>
            <Checkbox id="kubernetes" defaultChecked />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="vm">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Virtual Machine</FieldTitle>
              <FieldDescription>
                Access a VM cluster to run GPU workloads.
              </FieldDescription>
            </FieldContent>
            <Checkbox id="vm" />
          </Field>
        </FieldLabel>
      </FieldGroup>
    </FieldSet>
  )
}
