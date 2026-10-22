import { Input } from "@sonojs/ui/components/input"
import { Label } from "@sonojs/ui/components/label"

export function LabelDefault() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  )
}
