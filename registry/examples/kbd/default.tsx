import { Kbd } from "@sonojs/ui/components/kbd"

export function KbdDefault() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Kbd>Ctrl</Kbd>
      <Kbd>⌘</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>↵</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>⌘K</Kbd>
    </div>
  )
}
