import { Separator } from "@sonojs/ui/components/separator"

export function SeparatorList() {
  return (
    <div className="w-full max-w-xs">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Item 1</h4>
        <p className="text-sm text-muted-foreground">Value 1</p>
      </div>
      <Separator className="my-4" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Item 2</h4>
        <p className="text-sm text-muted-foreground">Value 2</p>
      </div>
      <Separator className="my-4" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Item 3</h4>
        <p className="text-sm text-muted-foreground">Value 3</p>
      </div>
    </div>
  )
}
