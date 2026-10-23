"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@sonojs/ui/components/resizable"

const workspace =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
const desk =
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80"

export function ResizableDefault() {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[220px] max-w-md overflow-hidden rounded-lg border"
    >
      <ResizablePanel defaultSize="50%">
        <div className="relative size-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={workspace}
            alt="Workspace"
            className="size-full object-cover brightness-50 dark:brightness-40"
          />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="50%">
        <div className="relative size-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={desk}
            alt="Desk"
            className="size-full object-cover brightness-50 dark:brightness-40"
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
