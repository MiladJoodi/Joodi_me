import { Kbd, KbdGroup } from "@sonojs/ui/components/kbd"

export function KbdGroupExample() {
  return (
    <div className="flex flex-col gap-4 text-sm text-muted-foreground">
      <p className="flex flex-wrap items-center gap-1">
        Press{" "}
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>B</Kbd>
        </KbdGroup>{" "}
        to toggle the sidebar.
      </p>
      <p className="flex flex-wrap items-center gap-1">
        Use{" "}
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>{" "}
        to open the command palette.
      </p>
    </div>
  )
}
