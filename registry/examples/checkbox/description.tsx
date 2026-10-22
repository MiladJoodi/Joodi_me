import { Checkbox } from "@sonojs/ui/components/checkbox"
import { Label } from "@sonojs/ui/components/label"

export function CheckboxDescription() {
  return (
    <div className="flex items-start gap-2">
      <Checkbox id="terms-desc" className="mt-0.5" defaultChecked />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="terms-desc">Accept terms and conditions</Label>
        <p className="text-sm text-muted-foreground">
          By clicking this checkbox, you agree to the terms and conditions.
        </p>
      </div>
    </div>
  )
}
