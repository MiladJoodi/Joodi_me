"use client"

import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react"

import { Button } from "@sonojs/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@sonojs/ui/components/collapsible"

type FileTreeItem =
  | { name: string }
  | { name: string; items: FileTreeItem[]; defaultOpen?: boolean }

const fileTree: FileTreeItem[] = [
  {
    name: "components",
    defaultOpen: true,
    items: [
      {
        name: "ui",
        defaultOpen: true,
        items: [
          { name: "button.tsx" },
          { name: "collapsible.tsx" },
          { name: "input.tsx" },
        ],
      },
      { name: "site-header.tsx" },
    ],
  },
  {
    name: "lib",
    items: [{ name: "utils.ts" }, { name: "direction.ts" }],
  },
  { name: "app.tsx" },
  { name: "package.json" },
]

function TreeItem({ item }: { item: FileTreeItem }) {
  if ("items" in item) {
    return (
      <Collapsible defaultOpen={item.defaultOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="group h-8 w-full justify-start gap-1.5 px-2 font-normal"
          >
            <ChevronRightIcon className="size-3.5 shrink-0 icon-dir text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90 rtl:group-data-[state=open]:-rotate-90" />
            <FolderIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{item.name}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ms-3 flex flex-col gap-0.5 border-s border-border ps-2">
            {item.items.map((child) => (
              <TreeItem key={child.name} item={child} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-full justify-start gap-1.5 px-2 font-normal text-foreground"
    >
      <span className="size-3.5 shrink-0" aria-hidden />
      <FileIcon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate">{item.name}</span>
    </Button>
  )
}

export function CollapsibleFileTree() {
  return (
    <div className="w-full max-w-[16rem] rounded-lg border border-border p-2">
      <p className="mb-1 px-2 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Explorer
      </p>
      <div className="flex flex-col gap-0.5">
        {fileTree.map((item) => (
          <TreeItem key={item.name} item={item} />
        ))}
      </div>
    </div>
  )
}
