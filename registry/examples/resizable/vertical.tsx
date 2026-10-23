"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@sonojs/ui/components/resizable"

const workspace =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
const office =
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"

export function ResizableVertical() {
  return (
    <ResizablePanelGroup
      orientation="vertical"
      className="min-h-[280px] max-w-md overflow-hidden rounded-lg border"
    >
      <ResizablePanel defaultSize="40%">
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
      <ResizablePanel defaultSize="60%">
        <div className="relative size-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={office}
            alt="Office"
            className="size-full object-cover brightness-50 dark:brightness-40"
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
